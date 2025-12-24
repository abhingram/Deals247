import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import session from 'express-session';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { secretManager } from './utils/secretManager.js';
import { generalLimiter } from './middleware/rateLimit.js';
import dealsRoutes from './routes/deals.js';
import categoriesRoutes from './routes/categories.js';
import storesRoutes from './routes/stores.js';
import favoritesRoutes from './routes/favorites.js';
import usersRoutes from './routes/users.js';
import shortenerRoutes from './routes/shortener.js';
import analyticsRoutes from './routes/analytics.js';
import reviewsRoutes from './routes/reviews.js';
import engagementRoutes from './routes/engagement.js';
import notificationsRoutes from './routes/notifications.js';
import searchRoutes from './routes/search.js';
import affiliateRoutes from './routes/affiliate.js';
import subscriptionRoutes from './routes/subscriptions.js';
import sponsoredRoutes from './routes/sponsored.js';
import bulkRoutes from './routes/bulk.js';
import trustRoutes from './routes/trust.js';
import contactRoutes from './routes/contact.js';
import newsletterRoutes from './routes/newsletter.js';
import cacheRoutes from './routes/cache.js';
import developerRoutes from './routes/developer.js';
import oauthRoutes from './routes/oauth.js';
import apiV1Routes from './routes/api-v1.js';
import webhooksRoutes from './routes/webhooks.js';
import amazonRoutes from './routes/internal/amazon.js';
import { startNotificationScheduler } from './services/notificationScheduler.js';
import { backgroundScheduler } from './services/backgroundScheduler.js';
import { redisManager, getSessionConfig } from './services/cache/redisManager.js';
import { slowQueryMonitor } from './services/slowQueryMonitor.js';
import { healthCheck } from './config/database.js';
import monitoringRoutes from './routes/monitoring.js';
import optimizedRoutes from './routes/optimized.js';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables: use .env.development for development and .env.production for production
const envFile = process.env.NODE_ENV === 'development' ? '.env.development' : '.env.production';
const envPath = path.join(__dirname, envFile);
dotenv.config({ path: envPath });

console.log('🔧 Environment Configuration:');
console.log('   ENV file path:', envPath);
console.log('   PORT:', process.env.PORT || 'NOT SET');
console.log('   DB_HOST:', process.env.DB_HOST || 'NOT SET');
console.log('   EMAIL_USER:', process.env.EMAIL_USER || 'NOT SET');
console.log('   EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✅ SET' : '❌ NOT SET');
console.log('   JWT_SECRET:', process.env.JWT_SECRET ? '✅ SET' : '❌ NOT SET');

// Validate secrets on startup
console.log('\n🔐 Secret Validation:');
const { missingSecrets, weakSecrets } = secretManager.initialize();
console.log('   NODE_ENV:', process.env.NODE_ENV || 'development');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'https://deals247.online',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:5173', // Vite dev server
      'http://127.0.0.1:5173'
    ];

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // In development, allow all localhost origins
    if (process.env.NODE_ENV !== 'production' && origin.match(/^http:\/\/localhost:\d+$/)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://*.firebase.com", "https://*.googleapis.com"],
    },
  },
}));
app.use(generalLimiter); // Apply general rate limiting to all routes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize Redis and session management
console.log('\n🔴 Redis & Session Setup:');
let redisConnected = false;
try {
  // Wait for redis manager to initialize and set the session store
  // Top-level await is supported in ES modules in Node 18+
  // It is OK to block here briefly to ensure session store is ready.
  // eslint-disable-next-line no-undef
  redisConnected = await redisManager.connect();
} catch (err) {
  console.error('Error initializing Redis manager:', err.message);
}
console.log(`   Redis: ${redisConnected ? '✅ Connected' : '⚠️  Unavailable (falling back to memory store)'});

// Session middleware - use session store provided by redisManager (or memory fallback)
app.use(session(getSessionConfig()));
console.log('   Sessions: ✅ Configured');

// Routes
app.use('/api/deals', dealsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/stores', storesRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/shortener', shortenerRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/engagement', engagementRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/affiliate', affiliateRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/sponsored', sponsoredRoutes);
app.use('/api/bulk', bulkRoutes);
app.use('/api/trust', trustRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/cache', cacheRoutes);
app.use('/api/monitoring', monitoringRoutes);
app.use('/api/optimized', optimizedRoutes);

// API Marketplace Routes
app.use('/api/developer', developerRoutes);
app.use('/api/oauth', oauthRoutes);
app.use('/api/v1', apiV1Routes);
app.use('/api/webhooks', webhooksRoutes);

// Internal routes
app.use('/api/internal/amazon', amazonRoutes);

// Short URL redirects
app.use('/s', shortenerRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Deals247 API is running' });
});

// Readiness check - verifies external dependencies like DB and Redis
app.get('/api/ready', async (req, res) => {
  try {
    const dbHealthy = await healthCheck();
    const redisHealthy = redisManager.isRedisConnected();
    if (dbHealthy) {
      return res.json({ ready: true, db: true, redis: redisHealthy });
    }
    return res.status(503).json({ ready: false, db: false, redis: redisHealthy });
  } catch (err) {
    console.error('Readiness check failed:', err.message);
    return res.status(503).json({ ready: false, error: err.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);

  // Start comprehensive background scheduler for Phase 4 features
  Promise.resolve(backgroundScheduler.start()).catch((err) => {
    console.error('[Scheduler] Failed to start:', err);
  });

  // Start slow query monitoring
  slowQueryMonitor.startMonitoring();
});
