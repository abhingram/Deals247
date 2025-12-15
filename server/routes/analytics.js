import express from 'express';
import db from '../database/connection.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { AnalyticsService } from '../services/analytics/analyticsService.js';
import { CacheService } from '../services/cache/cacheService.js';

const router = express.Router();

// Get analytics summary
router.get('/summary', authenticateAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let dateFilter = '';
    let params = [];

    if (startDate && endDate) {
      dateFilter = 'WHERE date BETWEEN ? AND ?';
      params = [startDate, endDate];
    }

    // Get cached analytics or calculate new ones
    const [summary] = await db.query(`
      SELECT * FROM analytics_summary
      ${dateFilter}
      ORDER BY date DESC
      LIMIT 30
    `, params);

    if (summary.length === 0) {
      // Calculate analytics if not cached
      const analytics = await calculateAnalytics(startDate, endDate);
      res.json(analytics);
    } else {
      res.json(summary);
    }
  } catch (error) {
    console.error('Error fetching analytics summary:', error);
    res.status(500).json({ error: 'Failed to fetch analytics summary' });
  }
});

// Get deal performance metrics
router.get('/deals/performance', authenticateAdmin, async (req, res) => {
  try {
    const { limit = 50, sortBy = 'views', order = 'desc' } = req.query;

    const sortOptions = {
      views: 'd.total_views',
      clicks: 'd.total_clicks',
      rating: 'd.avg_rating',
      shares: 'd.total_shares',
      created: 'd.created_at'
    };

    const sortField = sortOptions[sortBy] || 'd.total_views';
    const sortOrder = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    const [deals] = await db.query(`
      SELECT
        d.id,
        d.title,
        d.discounted_price as price,
        d.original_price,
        d.discount as discount_percentage,
        d.total_views,
        d.total_clicks,
        d.total_shares,
        d.total_ratings,
        d.total_reviews,
        d.avg_rating,
        d.created_at,
        d.expires_at,
        c.name as category_name,
        s.name as store_name,
        CASE
          WHEN d.expires_at < NOW() THEN 'expired'
          WHEN d.expires_at < DATE_ADD(NOW(), INTERVAL 24 HOUR) THEN 'expiring_soon'
          ELSE 'active'
        END as status
      FROM deals d
      LEFT JOIN categories c ON d.category = c.name
      LEFT JOIN stores s ON d.store = s.name
      WHERE d.deleted_at IS NULL
      ORDER BY ${sortField} ${sortOrder}
      LIMIT ?
    `, [parseInt(limit)]);

    res.json(deals);
  } catch (error) {
    console.error('Error fetching deal performance:', error);
    res.status(500).json({ error: 'Failed to fetch deal performance metrics' });
  }
});

// Get user engagement analytics
router.get('/users/engagement', authenticateAdmin, async (req, res) => {
  try {
    const [users] = await db.query(`
      SELECT
        u.id,
        u.email,
        u.display_name,
        u.role,
        u.total_views,
        u.total_clicks,
        u.total_favorites,
        u.total_ratings,
        u.total_reviews,
        u.created_at,
        u.last_activity,
        COUNT(DISTINCT dv.deal_id) as unique_deals_viewed,
        COUNT(DISTINCT uf.deal_id) as favorite_deals,
        AVG(dr.rating) as avg_rating_given
      FROM users u
      LEFT JOIN deal_views dv ON u.firebase_uid = dv.user_id
      LEFT JOIN user_favorites uf ON u.firebase_uid = uf.user_id
      LEFT JOIN deal_ratings dr ON u.firebase_uid = dr.user_id
      GROUP BY u.id, u.email, u.display_name, u.role, u.total_views, u.total_clicks,
               u.total_favorites, u.total_ratings, u.total_reviews, u.created_at, u.last_activity
      ORDER BY u.last_activity DESC
      LIMIT 100
    `);

    res.json(users);
  } catch (error) {
    console.error('Error fetching user engagement:', error);
    res.status(500).json({ error: 'Failed to fetch user engagement analytics' });
  }
});

// Get revenue analytics (placeholder for future implementation)
router.get('/revenue', authenticateAdmin, async (req, res) => {
  try {
    // This would integrate with payment systems in a real application
    // For now, return placeholder data
    const revenue = {
      total: 0,
      monthly: [],
      byCategory: [],
      byStore: []
    };

    res.json(revenue);
  } catch (error) {
    console.error('Error fetching revenue analytics:', error);
    res.status(500).json({ error: 'Failed to fetch revenue analytics' });
  }
});

// Get category performance
router.get('/categories/performance', authenticateAdmin, async (req, res) => {
  try {
    const [categories] = await db.query(`
      SELECT
        c.id,
        c.name,
        c.slug,
        c.level,
        COUNT(d.id) as total_deals,
        SUM(d.total_views) as total_views,
        SUM(d.total_clicks) as total_clicks,
        SUM(d.total_shares) as total_shares,
        AVG(d.avg_rating) as avg_rating,
        COUNT(CASE WHEN d.expires_at < NOW() THEN 1 END) as expired_deals,
        COUNT(CASE WHEN d.expires_at >= NOW() THEN 1 END) as active_deals
      FROM categories c
      LEFT JOIN deals d ON c.name = d.category AND d.deleted_at IS NULL
      GROUP BY c.id, c.name, c.slug, c.level
      ORDER BY total_views DESC
    `);

    res.json(categories);
  } catch (error) {
    console.error('Error fetching category performance:', error);
    res.status(500).json({ error: 'Failed to fetch category performance' });
  }
});

// Get store performance
router.get('/stores/performance', authenticateAdmin, async (req, res) => {
  try {
    const [stores] = await db.query(`
      SELECT
        s.id,
        s.name,
        s.logo as logo_url,
        COUNT(d.id) as total_deals,
        SUM(d.total_views) as total_views,
        SUM(d.total_clicks) as total_clicks,
        SUM(d.total_shares) as total_shares,
        AVG(d.avg_rating) as avg_rating,
        COUNT(CASE WHEN d.expires_at < NOW() THEN 1 END) as expired_deals,
        COUNT(CASE WHEN d.expires_at >= NOW() THEN 1 END) as active_deals
      FROM stores s
      LEFT JOIN deals d ON s.name = d.store AND d.deleted_at IS NULL
      GROUP BY s.id, s.name, s.logo
      ORDER BY total_views DESC
    `);

    res.json(stores);
  } catch (error) {
    console.error('Error fetching store performance:', error);
    res.status(500).json({ error: 'Failed to fetch store performance' });
  }
});

// Business Analytics Endpoints

// Get comprehensive business analytics
router.get('/business', authenticateAdmin, async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    let dateFilter = '';
    let params = [];

    if (start_date && end_date) {
      dateFilter = 'WHERE date BETWEEN ? AND ?';
      params = [start_date, end_date];
    }

    // Get business analytics data
    const [businessData] = await db.execute(`
      SELECT * FROM business_analytics
      ${dateFilter}
      ORDER BY date DESC
      LIMIT 30
    `, params);

    if (businessData.length === 0) {
      // Calculate business analytics if not cached
      const analytics = await calculateBusinessAnalytics(start_date, end_date);
      res.json(analytics);
    } else {
      res.json(businessData);
    }
  } catch (error) {
    console.error('Error fetching business analytics:', error);
    res.status(500).json({ error: 'Failed to fetch business analytics' });
  }
});

// Get affiliate performance analytics
router.get('/affiliate/performance', authenticateAdmin, async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    let dateFilter = '';
    let params = [];

    if (start_date && end_date) {
      dateFilter = 'WHERE ac.created_at BETWEEN ? AND ?';
      params = [start_date, end_date];
    }

    const [affiliateStats] = await db.execute(`
      SELECT
        al.id,
        al.name,
        al.commission_rate,
        al.commission_type,
        al.total_clicks,
        al.total_conversions,
        al.total_commission,
        COUNT(ac.id) as conversions_count,
        SUM(ac.commission_amount) as total_earned,
        AVG(ac.commission_amount) as avg_commission
      FROM affiliate_links al
      LEFT JOIN affiliate_conversions ac ON al.id = ac.affiliate_link_id ${dateFilter ? 'AND ' + dateFilter.replace('WHERE ', '') : ''}
      GROUP BY al.id, al.name, al.commission_rate, al.commission_type, al.total_clicks, al.total_conversions, al.total_commission
      ORDER BY total_earned DESC
    `, params);

    res.json(affiliateStats);
  } catch (error) {
    console.error('Error fetching affiliate performance:', error);
    res.status(500).json({ error: 'Failed to fetch affiliate performance' });
  }
});

// Get conversion analytics
router.get('/conversions', authenticateAdmin, async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    let dateFilter = '';
    let params = [];

    if (start_date && end_date) {
      dateFilter = 'WHERE created_at BETWEEN ? AND ?';
      params = [start_date, end_date];
    }

    // Calculate conversion rates
    const [conversionData] = await db.execute(`
      SELECT
        DATE(created_at) as date,
        COUNT(*) as total_clicks,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as conversions,
        ROUND(
          (COUNT(CASE WHEN status = 'approved' THEN 1 END) / COUNT(*)) * 100, 2
        ) as conversion_rate
      FROM affiliate_clicks ac
      LEFT JOIN affiliate_conversions aconv ON ac.id = aconv.affiliate_click_id
      ${dateFilter}
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 30
    `, params);

    res.json(conversionData);
  } catch (error) {
    console.error('Error fetching conversion analytics:', error);
    res.status(500).json({ error: 'Failed to fetch conversion analytics' });
  }
});

// Get ROI analytics
router.get('/roi', authenticateAdmin, async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    let dateFilter = '';
    let params = [];

    if (start_date && end_date) {
      dateFilter = 'WHERE date BETWEEN ? AND ?';
      params = [start_date, end_date];
    }

    const [roiData] = await db.execute(`
      SELECT
        date,
        total_revenue,
        affiliate_revenue,
        commission_paid,
        (total_revenue - commission_paid) as net_profit,
        CASE
          WHEN commission_paid > 0 THEN ROUND(((total_revenue - commission_paid) / commission_paid) * 100, 2)
          ELSE 0
        END as roi_percentage
      FROM business_analytics
      ${dateFilter}
      ORDER BY date DESC
      LIMIT 30
    `, params);

    res.json(roiData);
  } catch (error) {
    console.error('Error fetching ROI analytics:', error);
    res.status(500).json({ error: 'Failed to fetch ROI analytics' });
  }
});

// Helper function to calculate business analytics
async function calculateBusinessAnalytics(startDate, endDate) {
  try {
    let dateFilter = '';
    let params = [];

    if (startDate && endDate) {
      dateFilter = 'AND DATE(created_at) BETWEEN ? AND ?';
      params = [startDate, endDate];
    }

    // Calculate affiliate revenue
    const [affiliateRevenue] = await db.execute(`
      SELECT
        SUM(commission_amount) as total_affiliate_revenue,
        SUM(CASE WHEN status = 'paid' THEN commission_amount ELSE 0 END) as paid_commissions
      FROM affiliate_conversions
      WHERE status IN ('approved', 'paid') ${dateFilter}
    `, params);

    // Calculate total revenue (placeholder - would integrate with actual payment system)
    const totalRevenue = parseFloat(affiliateRevenue[0].total_affiliate_revenue || 0);

    // Get affiliate click and conversion stats
    const [affiliateStats] = await db.execute(`
      SELECT
        COUNT(DISTINCT ac.id) as total_clicks,
        COUNT(DISTINCT aconv.id) as total_conversions
      FROM affiliate_clicks ac
      LEFT JOIN affiliate_conversions aconv ON ac.id = aconv.affiliate_click_id
      WHERE aconv.status IN ('approved', 'paid') ${dateFilter}
    `, params);

    // Get verified deals count
    const [verifiedDeals] = await db.execute(`
      SELECT COUNT(*) as verified_count
      FROM deals
      WHERE verified = 1 AND deleted = 0 ${dateFilter}
    `, params);

    // Calculate user engagement score (simplified)
    const [engagementData] = await db.execute(`
      SELECT
        AVG(total_views) as avg_views,
        AVG(total_clicks) as avg_clicks,
        COUNT(*) as active_users
      FROM users
      WHERE last_activity >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    `);

    const engagementScore = Math.round(
      ((engagementData[0].avg_views || 0) * 0.3 +
       (engagementData[0].avg_clicks || 0) * 0.4 +
       (engagementData[0].active_users || 0) * 0.3) / 10
    );

    // Calculate conversion rate
    const totalClicks = affiliateStats[0].total_clicks || 0;
    const totalConversions = affiliateStats[0].total_conversions || 0;
    const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

    // Get top performing category and store
    const [topCategory] = await db.execute(`
      SELECT category, SUM(total_clicks) as clicks
      FROM deals
      WHERE deleted = 0 ${dateFilter}
      GROUP BY category
      ORDER BY clicks DESC
      LIMIT 1
    `, params);

    const [topStore] = await db.execute(`
      SELECT store, SUM(total_clicks) as clicks
      FROM deals
      WHERE deleted = 0 ${dateFilter}
      GROUP BY store
      ORDER BY clicks DESC
      LIMIT 1
    `, params);

    return {
      date: new Date().toISOString().split('T')[0],
      total_revenue: totalRevenue,
      affiliate_revenue: parseFloat(affiliateRevenue[0].total_affiliate_revenue || 0),
      commission_paid: parseFloat(affiliateRevenue[0].paid_commissions || 0),
      total_affiliate_clicks: totalClicks,
      total_affiliate_conversions: totalConversions,
      verified_deals_count: verifiedDeals[0].verified_count,
      user_engagement_score: engagementScore,
      conversion_rate: Math.round(conversionRate * 100) / 100,
      roi_percentage: totalRevenue > 0 ? Math.round(((totalRevenue - parseFloat(affiliateRevenue[0].paid_commissions || 0)) / totalRevenue) * 100 * 100) / 100 : 0,
      top_performing_category: topCategory[0]?.category || null,
      top_performing_store: topStore[0]?.store || null
    };
  } catch (error) {
    console.error('Error calculating business analytics:', error);
    throw error;
  }
}

// Helper function to calculate analytics
async function calculateAnalytics(startDate, endDate) {
  try {
    let dateFilter = '';
    let params = [];

    if (startDate && endDate) {
      dateFilter = 'AND DATE(created_at) BETWEEN ? AND ?';
      params = [startDate, endDate];
    }

    // Calculate various metrics
    const [userStats] = await db.query(`
      SELECT
        COUNT(*) as total_users,
        COUNT(CASE WHEN DATE(created_at) = CURDATE() THEN 1 END) as new_users_today
      FROM users
      WHERE 1=1 ${dateFilter}
    `, params);

    const [dealStats] = await db.query(`
      SELECT
        COUNT(*) as total_deals,
        COUNT(CASE WHEN expires_at >= NOW() THEN 1 END) as active_deals
      FROM deals
      WHERE deleted_at IS NULL ${dateFilter.replace('created_at', 'deals.created_at')}
    `, params);

    const [viewStats] = await db.query(`
      SELECT COUNT(*) as total_views FROM deal_views WHERE 1=1 ${dateFilter}
    `, params);

    const [clickStats] = await db.query(`
      SELECT COUNT(*) as total_clicks FROM deal_clicks WHERE 1=1 ${dateFilter}
    `, params);

    const [shareStats] = await db.query(`
      SELECT COUNT(*) as total_shares FROM deal_shares WHERE 1=1 ${dateFilter}
    `, params);

    const [ratingStats] = await db.query(`
      SELECT
        COUNT(*) as total_ratings,
        AVG(rating) as avg_rating
      FROM deal_ratings
      WHERE 1=1 ${dateFilter}
    `, params);

    const [reviewStats] = await db.query(`
      SELECT COUNT(*) as total_reviews FROM deal_reviews WHERE 1=1 ${dateFilter}
    `, params);

    return {
      total_users: userStats[0].total_users,
      new_users: userStats[0].new_users_today,
      total_deals: dealStats[0].total_deals,
      active_deals: dealStats[0].active_deals,
      total_views: viewStats[0].total_views,
      total_clicks: clickStats[0].total_clicks,
      total_shares: shareStats[0].total_shares,
      total_ratings: ratingStats[0].total_ratings,
      total_reviews: reviewStats[0].total_reviews,
      avg_rating: ratingStats[0].avg_rating || 0,
      revenue: 0 // Placeholder
    };
  } catch (error) {
    console.error('Error calculating analytics:', error);
    throw error;
  }
}

// ===== PHASE 4: ADVANCED ANALYTICS ENDPOINTS =====

// Get deal predictions
router.get('/predictions/:dealId', authenticateAdmin, async (req, res) => {
  try {
    const { dealId } = req.params;
    const analyticsService = new AnalyticsService();

    const prediction = await analyticsService.predictDealLikelihood(parseInt(dealId));

    await analyticsService.disconnect();

    res.json({
      deal_id: dealId,
      prediction: prediction
    });
  } catch (error) {
    console.error('Error getting deal prediction:', error);
    res.status(500).json({ error: 'Failed to get deal prediction' });
  }
});

// Get user segments
router.get('/users/:userId/segments', authenticateAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const analyticsService = new AnalyticsService();

    const segments = await analyticsService.segmentUser(userId);

    await analyticsService.disconnect();

    res.json({
      user_id: userId,
      segments: segments
    });
  } catch (error) {
    console.error('Error getting user segments:', error);
    res.status(500).json({ error: 'Failed to get user segments' });
  }
});

// Get performance metrics (Phase 4 enhanced)
router.get('/performance/:timeRange', authenticateAdmin, async (req, res) => {
  try {
    const { timeRange } = req.params;
    const cacheService = new CacheService();

    // Use cached analytics for better performance
    const metrics = await cacheService.getCachedAnalytics(timeRange);

    await cacheService.disconnect();

    res.json(metrics);
  } catch (error) {
    console.error('Error getting performance metrics:', error);
    res.status(500).json({ error: 'Failed to get performance metrics' });
  }
});

// Update deal analytics
router.post('/deals/:dealId/analytics', authenticateAdmin, async (req, res) => {
  try {
    const { dealId } = req.params;
    const { action } = req.body; // 'view', 'click', 'share', etc.

    const analyticsService = new AnalyticsService();

    const result = await analyticsService.updateDealAnalytics(parseInt(dealId), action);

    await analyticsService.disconnect();

    res.json({
      deal_id: dealId,
      analytics: result,
      message: 'Deal analytics updated successfully'
    });
  } catch (error) {
    console.error('Error updating deal analytics:', error);
    res.status(500).json({ error: 'Failed to update deal analytics' });
  }
});

// Get cached analytics summary
router.get('/cached/summary', authenticateAdmin, async (req, res) => {
  try {
    const { timeRange = '7d' } = req.query;
    const cacheService = new CacheService();

    const analytics = await cacheService.getCachedAnalytics(timeRange);

    await cacheService.disconnect();

    res.json(analytics);
  } catch (error) {
    console.error('Error getting cached analytics:', error);
    res.status(500).json({ error: 'Failed to get cached analytics' });
  }
});

// ============================================================================
// REVENUE ANALYTICS ROUTES (PHASE 6)
// ============================================================================

// Get revenue dashboard overview
router.get('/revenue/dashboard', authenticateAdmin, async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);

    // Get revenue summary for the period
    const [revenueSummary] = await db.query(`
      SELECT
        SUM(ra.affiliate_commission) as affiliate_revenue,
        SUM(ra.subscription_revenue) as subscription_revenue,
        SUM(ra.advertising_revenue) as advertising_revenue,
        SUM(ra.total_revenue) as total_revenue
      FROM revenue_analytics ra
      WHERE ra.date >= DATE_SUB(CURRENT_DATE, INTERVAL ? DAY)
    `, [days]);

    // Get today's revenue
    const [todayRevenue] = await db.query(`
      SELECT * FROM revenue_analytics WHERE date = CURRENT_DATE
    `);

    // Get monthly revenue trend
    const [monthlyTrend] = await db.query(`
      SELECT
        DATE_FORMAT(date, '%Y-%m') as month,
        SUM(affiliate_commission) as affiliate,
        SUM(subscription_revenue) as subscriptions,
        SUM(advertising_revenue) as advertising,
        SUM(total_revenue) as total
      FROM revenue_analytics
      WHERE date >= DATE_SUB(CURRENT_DATE, INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(date, '%Y-%m')
      ORDER BY month DESC
      LIMIT 12
    `);

    res.json({
      summary: revenueSummary[0],
      today: todayRevenue[0] || {},
      monthlyTrend
    });
  } catch (error) {
    console.error('Error fetching revenue dashboard:', error);
    res.status(500).json({ error: 'Failed to fetch revenue dashboard' });
  }
});

// Get detailed revenue analytics
router.get('/revenue/detailed', authenticateAdmin, async (req, res) => {
  try {
    const { start_date, end_date, group_by = 'day' } = req.query;

    let dateFilter = '';
    const params = [];

    if (start_date) {
      dateFilter += ' AND ra.date >= ?';
      params.push(start_date);
    }

    if (end_date) {
      dateFilter += ' AND ra.date <= ?';
      params.push(end_date);
    }

    let groupByClause = 'ra.date';
    if (group_by === 'week') {
      groupByClause = 'DATE_FORMAT(ra.date, "%Y-%u")';
    } else if (group_by === 'month') {
      groupByClause = 'DATE_FORMAT(ra.date, "%Y-%m")';
    }

    // Get revenue breakdown
    const [revenueBreakdown] = await db.query(`
      SELECT
        ${groupByClause} as period,
        SUM(ra.affiliate_commission) as affiliate_revenue,
        SUM(ra.subscription_revenue) as subscription_revenue,
        SUM(ra.advertising_revenue) as advertising_revenue,
        SUM(ra.total_revenue) as total_revenue
      FROM revenue_analytics ra
      WHERE 1=1 ${dateFilter}
      GROUP BY ${groupByClause}
      ORDER BY period DESC
      LIMIT 100
    `, params);

    res.json({
      breakdown: revenueBreakdown,
      groupBy: group_by
    });
  } catch (error) {
    console.error('Error fetching detailed revenue analytics:', error);
    res.status(500).json({ error: 'Failed to fetch detailed analytics' });
  }
});

// Get customer lifetime value (CLV) analysis
router.get('/revenue/clv', authenticateAdmin, async (req, res) => {
  try {
    // Calculate CLV based on subscription and commission data
    const [clvData] = await db.query(`
      SELECT
        u.firebase_uid,
        u.display_name,
        u.email,
        COALESCE(SUM(ac.commission_amount), 0) as affiliate_earnings,
        COALESCE(us.amount, 0) as subscription_value,
        DATEDIFF(CURRENT_DATE, u.created_at) as days_since_registration
      FROM users u
      LEFT JOIN affiliate_commissions ac ON u.firebase_uid = ac.user_id AND ac.status IN ('approved', 'paid')
      LEFT JOIN user_subscriptions us ON u.firebase_uid = us.user_id AND us.status = 'active'
      GROUP BY u.firebase_uid, u.display_name, u.email, u.created_at, us.amount
      ORDER BY (COALESCE(SUM(ac.commission_amount), 0) + COALESCE(us.amount, 0)) DESC
      LIMIT 50
    `);

    const avgClv = clvData.length > 0
      ? clvData.reduce((sum, user) => sum + user.affiliate_earnings + user.subscription_value, 0) / clvData.length
      : 0;

    res.json({
      customers: clvData,
      averageClv: avgClv
    });
  } catch (error) {
    console.error('Error calculating CLV:', error);
    res.status(500).json({ error: 'Failed to calculate customer lifetime value' });
  }
});

export default router;