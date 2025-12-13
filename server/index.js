import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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
import bulkRoutes from './routes/bulk.js';
import trustRoutes from './routes/trust.js';
import contactRoutes from './routes/contact.js';
import { startNotificationScheduler } from './services/notificationScheduler.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

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
app.use('/api/bulk', bulkRoutes);
app.use('/api/trust', trustRoutes);
app.use('/api/contact', contactRoutes);

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

  // Start notification scheduler
  startNotificationScheduler();
});
