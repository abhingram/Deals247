import express from 'express';
import db from '../database/connection.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Helper function to execute database queries with retry logic
const executeQueryWithRetry = async (query, params, retries = 2) => {
  for (let i = 0; i <= retries; i++) {
    try {
      return await db.query(query, params);
    } catch (error) {
      console.error(`Database query attempt ${i + 1} failed:`, error.message);

      // If it's the last retry, throw the error
      if (i === retries) {
        throw error;
      }

      // For connection errors, wait before retrying
      if (error.code === 'ECONNRESET' || error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        console.log(`Retrying database query in 1 second...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        // For other errors, don't retry
        throw error;
      }
    }
  }
};

// Save a search
router.post('/saved', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.firebase_uid;
    const { name, searchQuery, filters, sortBy, isDefault = false } = req.body;

    // If setting as default, unset other defaults first
    if (isDefault) {
      await executeQueryWithRetry(
        'UPDATE saved_searches SET is_default = 0 WHERE user_id = ?',
        [userId]
      );
    }

    const [result] = await executeQueryWithRetry(
      `INSERT INTO saved_searches (user_id, name, search_query, filters, sort_by, is_default)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, name, searchQuery || '', JSON.stringify(filters || {}), sortBy || 'newest', isDefault]
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Search saved successfully'
    });
  } catch (error) {
    console.error('Error saving search:', error);

    // Provide more specific error messages
    if (error.code === 'ECONNRESET' || error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return res.status(503).json({ error: 'Database connection error. Please try again.' });
    }

    res.status(500).json({ error: 'Failed to save search' });
  }
});

// Get user's saved searches
router.get('/saved', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.firebase_uid;

    const [searches] = await executeQueryWithRetry(
      'SELECT * FROM saved_searches WHERE user_id = ? ORDER BY is_default DESC, updated_at DESC',
      [userId]
    );

    res.json(searches);
  } catch (error) {
    console.error('Error fetching saved searches:', error);

    // Provide more specific error messages
    if (error.code === 'ECONNRESET' || error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return res.status(503).json({ error: 'Database connection error. Please try again.' });
    }

    res.status(500).json({ error: 'Failed to fetch saved searches' });
  }
});

// Update saved search
router.put('/saved/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.firebase_uid;
    const searchId = req.params.id;
    const { name, searchQuery, filters, sortBy, isDefault } = req.body;

    // If setting as default, unset other defaults first
    if (isDefault) {
      await executeQueryWithRetry(
        'UPDATE saved_searches SET is_default = 0 WHERE user_id = ? AND id != ?',
        [userId, searchId]
      );
    }

    await executeQueryWithRetry(
      `UPDATE saved_searches
       SET name = ?, search_query = ?, filters = ?, sort_by = ?, is_default = ?, updated_at = NOW()
       WHERE id = ? AND user_id = ?`,
      [name, searchQuery || '', JSON.stringify(filters || {}), sortBy || 'newest', isDefault, searchId, userId]
    );

    res.json({ message: 'Search updated successfully' });
  } catch (error) {
    console.error('Error updating saved search:', error);

    // Provide more specific error messages
    if (error.code === 'ECONNRESET' || error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return res.status(503).json({ error: 'Database connection error. Please try again.' });
    }

    res.status(500).json({ error: 'Failed to update saved search' });
  }
});

// Delete saved search
router.delete('/saved/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.firebase_uid;
    const searchId = req.params.id;

    await executeQueryWithRetry(
      'DELETE FROM saved_searches WHERE id = ? AND user_id = ?',
      [searchId, userId]
    );

    res.json({ message: 'Search deleted successfully' });
  } catch (error) {
    console.error('Error deleting saved search:', error);

    // Provide more specific error messages
    if (error.code === 'ECONNRESET' || error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return res.status(503).json({ error: 'Database connection error. Please try again.' });
    }

    res.status(500).json({ error: 'Failed to delete saved search' });
  }
});

// Record search history
router.post('/history', async (req, res) => {
  try {
    const { userId, searchQuery, filters, resultsCount } = req.body;

    // Only record if there's actually a search query or filters
    if (!searchQuery && (!filters || Object.keys(filters).length === 0)) {
      return res.json({ message: 'No search to record' });
    }

    await executeQueryWithRetry(
      `INSERT INTO search_history (user_id, search_query, filters, results_count)
       VALUES (?, ?, ?, ?)`,
      [userId || null, searchQuery || '', JSON.stringify(filters || {}), resultsCount || 0]
    );

    res.status(201).json({ message: 'Search recorded' });
  } catch (error) {
    console.error('Error recording search history:', error);

    // Provide more specific error messages
    if (error.code === 'ECONNRESET' || error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return res.status(503).json({ error: 'Database connection error. Please try again.' });
    }

    res.status(500).json({ error: 'Failed to record search' });
  }
});

// Get search history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.firebase_uid;
    const { limit = 20, offset = 0 } = req.query;

    const [history] = await executeQueryWithRetry(
      `SELECT * FROM search_history
       WHERE user_id = ? OR user_id IS NULL
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, parseInt(limit), parseInt(offset)]
    );

    const [countResult] = await executeQueryWithRetry(
      'SELECT COUNT(*) as total FROM search_history WHERE user_id = ? OR user_id IS NULL',
      [userId]
    );

    res.json({
      history,
      total: countResult[0].total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching search history:', error);

    // Provide more specific error messages
    if (error.code === 'ECONNRESET' || error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return res.status(503).json({ error: 'Database connection error. Please try again.' });
    }

    res.status(500).json({ error: 'Failed to fetch search history' });
  }
});

// Create deal comparison
router.post('/comparisons', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.firebase_uid;
    const { dealIds, name } = req.body;

    if (!dealIds || !Array.isArray(dealIds) || dealIds.length < 2) {
      return res.status(400).json({ error: 'At least 2 deal IDs required for comparison' });
    }

    const [result] = await executeQueryWithRetry(
      `INSERT INTO deal_comparisons (user_id, deal_ids, name)
       VALUES (?, ?, ?)`,
      [userId, JSON.stringify(dealIds), name || `Comparison ${new Date().toLocaleDateString()}`]
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Comparison created successfully'
    });
  } catch (error) {
    console.error('Error creating comparison:', error);

    // Provide more specific error messages
    if (error.code === 'ECONNRESET' || error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return res.status(503).json({ error: 'Database connection error. Please try again.' });
    }

    res.status(500).json({ error: 'Failed to create comparison' });
  }
});

// Get user's comparisons
router.get('/comparisons', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.firebase_uid;
    const { limit = 10, offset = 0 } = req.query;

    const [comparisons] = await executeQueryWithRetry(
      `SELECT * FROM deal_comparisons
       WHERE user_id = ?
       ORDER BY updated_at DESC
       LIMIT ? OFFSET ?`,
      [userId, parseInt(limit), parseInt(offset)]
    );

    const [countResult] = await executeQueryWithRetry(
      'SELECT COUNT(*) as total FROM deal_comparisons WHERE user_id = ?',
      [userId]
    );

    res.json({
      comparisons,
      total: countResult[0].total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching comparisons:', error);

    // Provide more specific error messages
    if (error.code === 'ECONNRESET' || error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return res.status(503).json({ error: 'Database connection error. Please try again.' });
    }

    res.status(500).json({ error: 'Failed to fetch comparisons' });
  }
});

// Get comparison details with deal data
router.get('/comparisons/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.firebase_uid;
    const comparisonId = req.params.id;

    const [comparisons] = await executeQueryWithRetry(
      'SELECT * FROM deal_comparisons WHERE id = ? AND user_id = ?',
      [comparisonId, userId]
    );

    if (comparisons.length === 0) {
      return res.status(404).json({ error: 'Comparison not found' });
    }

    const comparison = comparisons[0];
    const dealIds = JSON.parse(comparison.deal_ids);

    // Get deal details
    const placeholders = dealIds.map(() => '?').join(',');
    const [deals] = await executeQueryWithRetry(
      `SELECT * FROM deals WHERE id IN (${placeholders}) AND deleted = 0`,
      dealIds
    );

    res.json({
      ...comparison,
      deals: deals
    });
  } catch (error) {
    console.error('Error fetching comparison details:', error);

    // Provide more specific error messages
    if (error.code === 'ECONNRESET' || error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return res.status(503).json({ error: 'Database connection error. Please try again.' });
    }

    res.status(500).json({ error: 'Failed to fetch comparison details' });
  }
});

// Update comparison
router.put('/comparisons/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.firebase_uid;
    const comparisonId = req.params.id;
    const { dealIds, name } = req.body;

    await executeQueryWithRetry(
      `UPDATE deal_comparisons
       SET deal_ids = ?, name = ?, updated_at = NOW()
       WHERE id = ? AND user_id = ?`,
      [JSON.stringify(dealIds), name, comparisonId, userId]
    );

    res.json({ message: 'Comparison updated successfully' });
  } catch (error) {
    console.error('Error updating comparison:', error);

    // Provide more specific error messages
    if (error.code === 'ECONNRESET' || error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return res.status(503).json({ error: 'Database connection error. Please try again.' });
    }

    res.status(500).json({ error: 'Failed to update comparison' });
  }
});

// Delete comparison
router.delete('/comparisons/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.firebase_uid;
    const comparisonId = req.params.id;

    await executeQueryWithRetry(
      'DELETE FROM deal_comparisons WHERE id = ? AND user_id = ?',
      [comparisonId, userId]
    );

    res.json({ message: 'Comparison deleted successfully' });
  } catch (error) {
    console.error('Error deleting comparison:', error);

    // Provide more specific error messages
    if (error.code === 'ECONNRESET' || error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return res.status(503).json({ error: 'Database connection error. Please try again.' });
    }

    res.status(500).json({ error: 'Failed to delete comparison' });
  }
});

// Get personalized recommendations
router.get('/recommendations', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.firebase_uid;
    const { limit = 10 } = req.query;

    // Get recommendations based on user behavior
    const [recommendations] = await executeQueryWithRetry(
      `SELECT
         r.*,
         d.title,
         d.store,
         d.original_price,
         d.discounted_price,
         d.discount,
         d.rating,
         d.reviews,
         d.image,
         d.category,
         d.expires_at,
         d.verified
       FROM user_recommendations r
       JOIN deals d ON r.deal_id = d.id
       WHERE r.user_id = ? AND d.deleted = 0
       ORDER BY r.recommendation_score DESC, r.created_at DESC
       LIMIT ?`,
      [userId, parseInt(limit)]
    );

    res.json(recommendations);
  } catch (error) {
    console.error('Error fetching recommendations:', error);

    // Provide more specific error messages
    if (error.code === 'ECONNRESET' || error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return res.status(503).json({ error: 'Database connection error. Please try again.' });
    }

    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

// Generate recommendations for user (called periodically or on demand)
router.post('/recommendations/generate', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.firebase_uid;

    // Clear old recommendations for this user
    await executeQueryWithRetry(
      'DELETE FROM user_recommendations WHERE user_id = ?',
      [userId]
    );

    const recommendations = [];

    // 1. Recommend deals from categories the user has viewed/favorited
    const [userCategories] = await executeQueryWithRetry(
      `SELECT DISTINCT d.category, COUNT(*) as interaction_count
       FROM (
         SELECT deal_id FROM user_favorites WHERE user_id = ?
         UNION ALL
         SELECT deal_id FROM deal_views WHERE user_id = ? AND viewed_at > DATE_SUB(NOW(), INTERVAL 30 DAY)
       ) interactions
       JOIN deals d ON interactions.deal_id = d.id
       WHERE d.deleted = 0
       GROUP BY d.category
       ORDER BY interaction_count DESC
       LIMIT 3`,
      [userId, userId]
    );

    for (const categoryData of userCategories) {
      const [deals] = await executeQueryWithRetry(
        `SELECT id FROM deals
         WHERE category = ? AND deleted = 0 AND expires_at > NOW()
         AND id NOT IN (SELECT deal_id FROM user_favorites WHERE user_id = ?)
         ORDER BY rating DESC, discount DESC
         LIMIT 5`,
        [categoryData.category, userId]
      );

      deals.forEach(deal => {
        recommendations.push({
          user_id: userId,
          deal_id: deal.id,
          recommendation_score: Math.min(0.9, categoryData.interaction_count / 10),
          reason: 'favorited_category'
        });
      });
    }

    // 2. Recommend deals in user's price range
    const [priceRange] = await executeQueryWithRetry(
      `SELECT
         AVG(d.discounted_price) as avg_price,
         MIN(d.discounted_price) as min_price,
         MAX(d.discounted_price) as max_price
       FROM deal_views dv
       JOIN deals d ON dv.deal_id = d.id
       WHERE dv.user_id = ? AND dv.viewed_at > DATE_SUB(NOW(), INTERVAL 30 DAY)`,
      [userId]
    );

    if (priceRange[0].avg_price) {
      const minPrice = Math.max(0, priceRange[0].avg_price * 0.5);
      const maxPrice = priceRange[0].avg_price * 1.5;

      const [priceDeals] = await executeQueryWithRetry(
        `SELECT id FROM deals
         WHERE discounted_price BETWEEN ? AND ?
         AND deleted = 0 AND expires_at > NOW()
         AND id NOT IN (SELECT deal_id FROM deal_views WHERE user_id = ? AND viewed_at > DATE_SUB(NOW(), INTERVAL 7 DAY))
         ORDER BY discount DESC
         LIMIT 3`,
        [minPrice, maxPrice, userId]
      );

      priceDeals.forEach(deal => {
        recommendations.push({
          user_id: userId,
          deal_id: deal.id,
          recommendation_score: 0.7,
          reason: 'price_range'
        });
      });
    }

    // 3. Recommend trending/popular deals
    const [trendingDeals] = await executeQueryWithRetry(
      `SELECT id FROM deals
       WHERE deleted = 0 AND expires_at > NOW()
       AND total_views > 10
       ORDER BY total_views DESC, rating DESC
       LIMIT 3`
    );

    trendingDeals.forEach(deal => {
      recommendations.push({
        user_id: userId,
        deal_id: deal.id,
        recommendation_score: 0.5,
        reason: 'trending'
      });
    });

    // Insert recommendations
    if (recommendations.length > 0) {
      const values = recommendations.map(() => '(?, ?, ?, ?)').join(', ');
      const params = recommendations.flatMap(r => [r.user_id, r.deal_id, r.recommendation_score, r.reason]);

      await executeQueryWithRetry(
        `INSERT INTO user_recommendations (user_id, deal_id, recommendation_score, reason) VALUES ${values}`,
        params
      );
    }

    res.json({
      message: `Generated ${recommendations.length} recommendations`,
      count: recommendations.length
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);

    // Provide more specific error messages
    if (error.code === 'ECONNRESET' || error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return res.status(503).json({ error: 'Database connection error. Please try again.' });
    }

    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

export default router;