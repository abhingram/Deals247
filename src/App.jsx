import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { MobileNavigation } from '@/components/MobileUI';
import { PWAInstallPrompt, OfflineIndicator, PWAUpdatePrompt } from '@/components/PWAComponents';
import { usePerformanceMonitor } from '@/hooks/usePerformance.jsx';
import BackToTop from '@/components/BackToTop';

// Lazy load components for better performance
const Home = React.lazy(() => import('@/pages/Home'));
const DealDetail = React.lazy(() => import('@/pages/DealDetail'));
const UserDashboard = React.lazy(() => import('@/pages/UserDashboard'));
const SubmitDeal = React.lazy(() => import('@/pages/SubmitDeal'));
const AdminPanel = React.lazy(() => import('@/pages/AdminPanel'));
const AdvancedSearchPage = React.lazy(() => import('@/pages/AdvancedSearchPage'));
const DealComparisonPage = React.lazy(() => import('@/pages/DealComparisonPage'));
const RecommendationsPage = React.lazy(() => import('@/pages/RecommendationsPage'));
const HotPage = React.lazy(() => import('@/pages/HotPage'));
const PopularPage = React.lazy(() => import('@/pages/PopularPage'));
const TalkingPage = React.lazy(() => import('@/pages/TalkingPage'));

// Legal and informational pages
const PrivacyPolicy = React.lazy(() => import('@/pages/PrivacyPolicy'));
const TermsOfService = React.lazy(() => import('@/pages/TermsOfService'));
const CookiePolicy = React.lazy(() => import('@/pages/CookiePolicy'));
const AboutUs = React.lazy(() => import('@/pages/AboutUs'));
const ContactUs = React.lazy(() => import('@/pages/ContactUs'));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Performance monitoring component
const PerformanceMonitor = () => {
  const metrics = usePerformanceMonitor();

  // Log metrics to console in development
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Performance Metrics:', metrics);
    }
  }, [metrics]);

  return null; // This component doesn't render anything
};

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            {/* Performance monitoring */}
            <PerformanceMonitor />

            {/* Mobile navigation */}
            <MobileNavigation />

            {/* PWA components */}
            <PWAInstallPrompt />
            <OfflineIndicator />
            <PWAUpdatePrompt />

            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/deal/:id" element={<DealDetail />} />
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/submit-deal" element={<SubmitDeal />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/search" element={<AdvancedSearchPage />} />
                <Route path="/comparisons" element={<DealComparisonPage />} />
                <Route path="/comparison/:id" element={<DealComparisonPage />} />
                <Route path="/recommendations" element={<RecommendationsPage />} />
                <Route path="/hot" element={<HotPage />} />
                <Route path="/popular" element={<PopularPage />} />
                <Route path="/talking" element={<TalkingPage />} />
                
                {/* Legal and informational pages */}
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<ContactUs />} />
              </Routes>
            </Suspense>
            <Toaster />
            
            {/* Back to Top button */}
            <BackToTop />
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;