import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
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
import amazonRoutes from './routes/internal/amazon.js';
import { startNotificationScheduler } from './services/notificationScheduler.js';
import { backgroundScheduler } from './services/backgroundScheduler.js';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from server/.env
const envPath = path.join(__dirname, '.env');
dotenv.config({ path: envPath });

console.log('🔧 Environment Configuration:');
console.log('   ENV file path:', envPath);
console.log('   PORT:', process.env.PORT || 'NOT SET');
console.log('   DB_HOST:', process.env.DB_HOST || 'NOT SET');
console.log('   EMAIL_USER:', process.env.EMAIL_USER || 'NOT SET');
console.log('   EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✅ SET' : '❌ NOT SET');
console.log('   NODE_ENV:', process.env.NODE_ENV || 'development');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use('/api/internal/amazon', amazonRoutes);

// Short URL redirects
app.use('/s', shortenerRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Deals247 API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);

  // Start comprehensive background scheduler for Phase 4 features
  backgroundScheduler.start();
});
