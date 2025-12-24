import cron from 'node-cron';
import { AnalyticsService } from '../services/analytics/analyticsService.js';
import { NotificationService } from '../services/notifications/notificationService.js';
import { CacheService } from '../services/cache/cacheService.js';
import db from '../database/connection.js';
import { healthCheck, getPoolStats } from '../config/database.js';

/**
 * Background Jobs Scheduler for Phase 4 Features
 * Handles automated analytics updates, notifications, and cache maintenance
 */

class BackgroundScheduler {
  constructor() {
    this.isRunning = false;
    this.jobs = [];
    this.connectionFailures = 0;
    this.maxConnectionFailures = 5; // Stop after 5 consecutive failures
  }

  /**
   * Check database connection health
   * @returns {Promise<boolean>} true if database is healthy
   */
  async checkDatabaseHealth() {
    try {
      const isHealthy = await healthCheck();
      if (isHealthy) {
        this.connectionFailures = 0; // Reset failure count
        return true;
      } else {
        this.connectionFailures++;
        console.warn(`⚠️  Database health check failed (${this.connectionFailures}/${this.maxConnectionFailures})`);
        this.cron = null;
        return false;
      }
    } catch (error) {
      this.connectionFailures++;
      console.error(`❌ Database health check error (${this.connectionFailures}/${this.maxConnectionFailures}):`, error.message);
      async start() {
        if (process.env.ENABLE_SCHEDULERS !== 'true') {
          console.log('[Scheduler] ENABLE_SCHEDULERS is not true, skipping schedulers.');
          return;
        }
        if (this.isRunning) {
          console.log('🔄 Background scheduler already running');
          return;
        }
        try {
          const cronModule = await import('node-cron');
          this.cron = cronModule.default;
        } catch (err) {
          console.warn('[Scheduler] node-cron not installed, skipping schedulers.');
          return;
        }
        console.log('🚀 Starting Phase 4 background jobs...');
        this.isRunning = true;
        // Log connection stats every 30 minutes
        this.scheduleJob('*/30 * * * *', 'connection-stats', async () => {
          this.logConnectionStats();
        });
        // Job 1: Update analytics every 15 minutes
        this.scheduleJob('*/15 * * * *', 'analytics-update', async () => {
          await this.executeJobSafely(() => this.updateAnalytics(), 'analytics-update');
        });
        // Job 2: Send personalized notifications every hour
        this.scheduleJob('0 * * * *', 'personalized-notifications', async () => {
          await this.executeJobSafely(() => this.sendPersonalizedNotifications(), 'personalized-notifications');
        });
        // Job 3: Send expiring deal notifications every 6 hours
        this.scheduleJob('0 */6 * * *', 'expiring-deals', async () => {
          await this.executeJobSafely(() => this.sendExpiringDealNotifications(), 'expiring-deals');
        });
        // Job 4: Clean up expired cache entries every hour
        this.scheduleJob('0 * * * *', 'cache-cleanup', async () => {
          await this.executeJobSafely(() => this.cleanupExpiredCache(), 'cache-cleanup');
        });
        // Job 5: Update deal predictions daily
        this.scheduleJob('0 2 * * *', 'deal-predictions', async () => {
          await this.executeJobSafely(() => this.updateDealPredictions(), 'deal-predictions');
        });
        // Job 6: Update user segments daily
        this.scheduleJob('0 3 * * *', 'user-segments', async () => {
          await this.executeJobSafely(() => this.updateUserSegments(), 'user-segments');
        });
        console.log('✅ All Phase 4 background jobs scheduled');
      this.logConnectionStats();
    });

    // Job 1: Update analytics every 15 minutes
    this.scheduleJob('*/15 * * * *', 'analytics-update', async () => {
      await this.executeJobSafely(() => this.updateAnalytics(), 'analytics-update');
    });

    // Job 2: Send personalized notifications every hour
    this.scheduleJob('0 * * * *', 'personalized-notifications', async () => {
      await this.executeJobSafely(() => this.sendPersonalizedNotifications(), 'personalized-notifications');
    });

    // Job 3: Send expiring deal notifications every 6 hours
    this.scheduleJob('0 */6 * * *', 'expiring-deals', async () => {
      await this.executeJobSafely(() => this.sendExpiringDealNotifications(), 'expiring-deals');
    });

    // Job 4: Clean up expired cache entries every hour
    this.scheduleJob('0 * * * *', 'cache-cleanup', async () => {
      await this.executeJobSafely(() => this.cleanupExpiredCache(), 'cache-cleanup');
    });

    // Job 5: Update deal predictions daily
    this.scheduleJob('0 2 * * *', 'deal-predictions', async () => {
      await this.executeJobSafely(() => this.updateDealPredictions(), 'deal-predictions');
    });

    // Job 6: Update user segments daily
    this.scheduleJob('0 3 * * *', 'user-segments', async () => {
      await this.executeJobSafely(() => this.updateUserSegments(), 'user-segments');
    });

    console.log('✅ All Phase 4 background jobs scheduled');
  }

  /**
   * Schedule a cron job
   */
  scheduleJob(cronExpression, jobName, jobFunction) {
    if (!this.cron) return;
    const job = this.cron.schedule(cronExpression, async () => {
      try {
        console.log(`🔄 Running background job: ${jobName}`);
        await jobFunction();
        console.log(`✅ Background job completed: ${jobName}`);
      } catch (error) {
        console.error(`❌ Background job failed: ${jobName}`, error);
      }
    }, {
      scheduled: false // Don't start immediately
    });

    job.start();
    this.jobs.push({ name: jobName, job, cronExpression });
    console.log(`📅 Scheduled ${jobName}: ${cronExpression}`);
  }

  /**
   * Update analytics data
   */
  async updateAnalytics() {
    const analyticsService = new AnalyticsService();

    try {
      // Test database connection health before proceeding
      await db.execute('SELECT 1 as connection_test');

      // Get all deals and update their analytics
      const [deals] = await db.execute('SELECT id FROM deals WHERE deleted = 0');

      if (deals.length === 0) {
        console.log('📊 No deals found for analytics update');
        return;
      }

      let successCount = 0;
      let errorCount = 0;

      for (const deal of deals) {
        try {
          await analyticsService.updateDealAnalytics(deal.id);
          successCount++;
        } catch (dealError) {
          console.error(`❌ Error updating analytics for deal ${deal.id}:`, dealError.message);
          errorCount++;
        }
      }

      console.log(`📊 Analytics update completed: ${successCount} successful, ${errorCount} errors`);

    } catch (error) {
      console.error('❌ Error in analytics update job:', error.message);

      // Handle specific database errors
      if (error.code === 'ECONNRESET' || error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        console.log('🔄 Database connection lost during analytics update');
      }
    } finally {
      try {
        await analyticsService.disconnect();
      } catch (disconnectError) {
        console.warn('⚠️  Error disconnecting analytics service:', disconnectError.message);
      }
    }
  }

  /**
   * Send personalized notifications to users
   */
  async sendPersonalizedNotifications() {
    const notificationService = new NotificationService();

    try {
      // Test database connection health
      await db.execute('SELECT 1 as connection_test');

      // Get all users with notification preferences
      const [users] = await db.execute(`
        SELECT DISTINCT u.firebase_uid
        FROM users u
        JOIN notification_preferences np ON u.firebase_uid = np.user_id
        WHERE np.email_enabled = 1 OR np.push_enabled = 1
      `);

      if (users.length === 0) {
        console.log('🔔 No users with notifications enabled');
        return;
      }

      let totalNotifications = 0;
      let errorCount = 0;

      for (const user of users) {
        try {
          const notifications = await notificationService.createPersonalizedNotifications(user.firebase_uid);
          totalNotifications += notifications.length;
        } catch (userError) {
          console.error(`❌ Error creating notifications for user ${user.firebase_uid}:`, userError.message);
          errorCount++;
        }
      }

      console.log(`🔔 Personalized notifications completed: ${totalNotifications} sent, ${errorCount} errors`);

    } catch (error) {
      console.error('❌ Error in personalized notifications job:', error.message);

      // Handle specific database errors
      if (error.code === 'ECONNRESET' || error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        console.log('🔄 Database connection lost during notifications');
      }
    } finally {
      try {
        await notificationService.disconnect();
      } catch (disconnectError) {
        console.warn('⚠️  Error disconnecting notification service:', disconnectError.message);
      }
    }
  }

  /**
   * Send expiring deal notifications
   */
  async sendExpiringDealNotifications() {
    const notificationService = new NotificationService();

    try {
      // Get all users
      const [users] = await db.execute('SELECT firebase_uid FROM users');

      let totalNotifications = 0;

      for (const user of users) {
        const notifications = await notificationService.createExpiringDealNotifications(user.firebase_uid, 24);
        totalNotifications += notifications.length;
      }

      console.log(`⏰ Sent ${totalNotifications} expiring deal notifications`);
    } catch (error) {
      console.error('Error sending expiring deal notifications:', error);
    } finally {
      await notificationService.disconnect();
    }
  }

  /**
   * Clean up expired cache entries
   */
  async cleanupExpiredCache() {
    const cacheService = new CacheService();

    try {
      const cleanedCount = await cacheService.cleanupExpired();
      console.log(`🧹 Cleaned up ${cleanedCount} expired cache entries`);
    } catch (error) {
      console.error('Error cleaning up cache:', error);
    } finally {
      await cacheService.disconnect();
    }
  }

  /**
   * Update deal predictions
   */
  async updateDealPredictions() {
    const analyticsService = new AnalyticsService();

    try {
      // Get deals that need predictions
      const [deals] = await db.execute(`
        SELECT id, product_id FROM deals
        WHERE deleted = 0 AND expires_at > NOW()
        ORDER BY created_at DESC LIMIT 100
      `);

      for (const deal of deals) {
        await analyticsService.predictDealLikelihood(deal.product_id);
      }

      console.log(`🔮 Updated predictions for ${deals.length} deals`);
    } catch (error) {
      console.error('Error updating deal predictions:', error);
    } finally {
      await analyticsService.disconnect();
    }
  }

  /**
   * Update user segments
   */
  async updateUserSegments() {
    const analyticsService = new AnalyticsService();

    try {
      // Get all active users
      const [users] = await db.execute(`
        SELECT firebase_uid FROM users
        WHERE created_at > DATE_SUB(NOW(), INTERVAL 90 DAY)
        ORDER BY created_at DESC
      `);

      for (const user of users) {
        await analyticsService.segmentUser(user.firebase_uid);
      }

      console.log(`👥 Updated segments for ${users.length} users`);
    } catch (error) {
      console.error('Error updating user segments:', error);
    } finally {
      await analyticsService.disconnect();
    }
  }

  /**
   * Stop all background jobs
   */
  stop() {
    console.log('🛑 Stopping background jobs...');

    this.jobs.forEach(({ name, job }) => {
      job.stop();
      console.log(`⏹️ Stopped job: ${name}`);
    });

    this.jobs = [];
    this.isRunning = false;
    console.log('✅ All background jobs stopped');
  }

  /**
   * Get status of background jobs
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      jobs: this.jobs.map(({ name, cronExpression }) => ({
        name,
        schedule: cronExpression,
        running: true // Cron jobs don't have a direct running state
      }))
    };
  }
}

// Export singleton instance
export const backgroundScheduler = new BackgroundScheduler();