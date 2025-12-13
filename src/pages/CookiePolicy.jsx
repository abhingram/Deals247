import { motion } from 'framer-motion';
import { useState } from 'react';

export default function CookiePolicy() {
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true,
    analytics: true,
    preferences: true,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 md:p-12"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
        <p className="text-sm text-gray-600 mb-8">Last Updated: December 12, 2025</p>

        <div className="prose prose-purple max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. What Are Cookies?</h2>
            <p className="text-gray-700 mb-4">
              Cookies are small text files that are placed on your device (computer, smartphone, or tablet) when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
            </p>
            <p className="text-gray-700">
              Deals247 uses cookies and similar tracking technologies to enhance your browsing experience, analyze site usage, and deliver personalized content and advertisements.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Types of Cookies We Use</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Essential Cookies (Strictly Necessary)</h3>
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
              <p className="text-gray-700 mb-2"><strong>Purpose:</strong> These cookies are necessary for the website to function properly.</p>
              <p className="text-gray-700 mb-2"><strong>Examples:</strong></p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Authentication tokens (Firebase session cookies)</li>
                <li>Security tokens for CSRF protection</li>
                <li>Session management cookies</li>
                <li>Load balancing cookies</li>
              </ul>
              <p className="text-gray-700 mt-2"><strong>Duration:</strong> Session or up to 30 days</p>
              <p className="text-gray-700"><strong>Can be disabled:</strong> No (these are required for the site to work)</p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 Functional/Preference Cookies</h3>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <p className="text-gray-700 mb-2"><strong>Purpose:</strong> These cookies remember your preferences and choices.</p>
              <p className="text-gray-700 mb-2"><strong>Examples:</strong></p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Language preferences</li>
                <li>Display settings (theme, layout)</li>
                <li>Filter selections and sorting preferences</li>
                <li>Notification preferences</li>
                <li>Recently viewed deals</li>
              </ul>
              <p className="text-gray-700 mt-2"><strong>Duration:</strong> Up to 1 year</p>
              <p className="text-gray-700"><strong>Can be disabled:</strong> Yes, but site functionality may be limited</p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">2.3 Analytics/Performance Cookies</h3>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
              <p className="text-gray-700 mb-2"><strong>Purpose:</strong> These cookies help us understand how visitors interact with our website.</p>
              <p className="text-gray-700 mb-2"><strong>Information Collected:</strong></p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Pages visited and time spent on each page</li>
                <li>Search queries and filter usage</li>
                <li>Click patterns and navigation paths</li>
                <li>Error messages and technical issues</li>
                <li>Device and browser information</li>
              </ul>
              <p className="text-gray-700 mt-2"><strong>Duration:</strong> Up to 2 years</p>
              <p className="text-gray-700"><strong>Can be disabled:</strong> Yes</p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">2.4 Advertising/Targeting Cookies (If Applicable)</h3>
            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-4">
              <p className="text-gray-700 mb-2"><strong>Purpose:</strong> These cookies may be used to deliver relevant advertisements.</p>
              <p className="text-gray-700 mb-2"><strong>Note:</strong> Deals247 currently does not use third-party advertising cookies, but we reserve the right to do so in the future with proper notice and consent.</p>
              <p className="text-gray-700 mt-2"><strong>Can be disabled:</strong> Yes</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Third-Party Cookies</h2>
            <p className="text-gray-700 mb-4">
              We use services from trusted third-party providers that may set their own cookies:
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 Firebase (Google)</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li><strong>Purpose:</strong> Authentication and session management</li>
              <li><strong>Cookies:</strong> __session, __Secure-*, firebase:*</li>
              <li><strong>Privacy Policy:</strong> <a href="https://firebase.google.com/support/privacy" className="text-purple-600 hover:underline" target="_blank" rel="noopener noreferrer">Firebase Privacy</a></li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 Content Delivery Networks (CDN)</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li><strong>Purpose:</strong> Faster content delivery and improved performance</li>
              <li><strong>Providers:</strong> May include CDN services for static assets</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. How We Use Cookies</h2>
            <p className="text-gray-700 mb-4">We use cookies for the following purposes:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li><strong>Authentication:</strong> To keep you logged in and verify your identity</li>
              <li><strong>Personalization:</strong> To remember your preferences and provide customized experiences</li>
              <li><strong>Security:</strong> To protect against fraudulent activity and unauthorized access</li>
              <li><strong>Analytics:</strong> To understand user behavior and improve our services</li>
              <li><strong>Performance:</strong> To optimize site speed and functionality</li>
              <li><strong>Functionality:</strong> To enable features like favorites, notifications, and saved filters</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Cookie Duration</h2>
            <p className="text-gray-700 mb-4">Cookies can be either session cookies or persistent cookies:</p>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Session Cookies</h3>
            <p className="text-gray-700 mb-4">
              These are temporary cookies that expire when you close your browser. They are used for session management and authentication.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Persistent Cookies</h3>
            <p className="text-gray-700 mb-4">
              These remain on your device until they expire or you delete them. Duration varies by cookie type:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li><strong>Authentication:</strong> Up to 30 days</li>
              <li><strong>Preferences:</strong> Up to 1 year</li>
              <li><strong>Analytics:</strong> Up to 2 years</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Managing Your Cookie Preferences</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">6.1 Browser Settings</h3>
            <p className="text-gray-700 mb-4">
              Most web browsers allow you to control cookies through their settings. You can:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Block all cookies</li>
              <li>Block third-party cookies only</li>
              <li>Delete existing cookies</li>
              <li>Set cookies to expire when you close your browser</li>
              <li>Receive notifications when cookies are being set</li>
            </ul>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-gray-800 mb-2"><strong>Browser Cookie Settings:</strong></p>
              <ul className="space-y-1 text-gray-700">
                <li>• <a href="https://support.google.com/chrome/answer/95647" className="text-purple-600 hover:underline" target="_blank" rel="noopener noreferrer">Chrome</a></li>
                <li>• <a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" className="text-purple-600 hover:underline" target="_blank" rel="noopener noreferrer">Firefox</a></li>
                <li>• <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" className="text-purple-600 hover:underline" target="_blank" rel="noopener noreferrer">Safari</a></li>
                <li>• <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" className="text-purple-600 hover:underline" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">6.2 In-Site Cookie Preferences</h3>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-4">
              <p className="text-gray-800 mb-4 font-semibold">Manage Your Cookie Preferences:</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Essential Cookies</p>
                    <p className="text-sm text-gray-600">Required for site functionality</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={cookiePreferences.essential}
                    disabled
                    className="h-5 w-5 text-purple-600 cursor-not-allowed opacity-50"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Preference Cookies</p>
                    <p className="text-sm text-gray-600">Remember your settings and choices</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={cookiePreferences.preferences}
                    onChange={(e) => setCookiePreferences({...cookiePreferences, preferences: e.target.checked})}
                    className="h-5 w-5 text-purple-600 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Analytics Cookies</p>
                    <p className="text-sm text-gray-600">Help us improve our services</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={cookiePreferences.analytics}
                    onChange={(e) => setCookiePreferences({...cookiePreferences, analytics: e.target.checked})}
                    className="h-5 w-5 text-purple-600 cursor-pointer"
                  />
                </div>
              </div>

              <button 
                className="mt-6 w-full bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
                onClick={() => {
                  localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences));
                  alert('Cookie preferences saved!');
                }}
              >
                Save Preferences
              </button>
            </div>

            <p className="text-sm text-gray-600 italic">
              Note: Blocking certain cookies may affect the functionality of our website and your user experience.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Do Not Track (DNT) Signals</h2>
            <p className="text-gray-700">
              Some browsers have a "Do Not Track" feature that signals to websites that you do not want to be tracked. Currently, there is no industry standard for how to respond to DNT signals. Deals247 does not currently respond to DNT browser signals but respects your cookie preferences as set through your browser or our cookie preference center.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Other Tracking Technologies</h2>
            <p className="text-gray-700 mb-4">
              In addition to cookies, we may use other tracking technologies:
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Web Beacons (Pixel Tags)</h3>
            <p className="text-gray-700 mb-4">
              Small graphic images embedded in web pages or emails to track page views and email opens.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Local Storage</h3>
            <p className="text-gray-700 mb-4">
              Browser storage mechanisms (localStorage, sessionStorage) used to store data locally on your device for improved performance and functionality.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Service Workers</h3>
            <p className="text-gray-700 mb-4">
              Scripts that run in the background to enable offline functionality and push notifications.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Consent and Control</h2>
            <p className="text-gray-700 mb-4">
              By using Deals247, you consent to our use of cookies as described in this policy. You can withdraw or modify your consent at any time by:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Adjusting your browser settings</li>
              <li>Using our cookie preference center (above)</li>
              <li>Deleting cookies from your device</li>
              <li>Contacting us at D247Online@outlook.com</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Updates to This Cookie Policy</h2>
            <p className="text-gray-700">
              We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our practices. We will notify you of significant changes by posting a notice on our website or updating the "Last Updated" date at the top of this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have questions about our use of cookies, please contact us:
            </p>
            <div className="bg-purple-50 p-6 rounded-lg">
              <p className="text-gray-800 mb-2"><strong>Email:</strong> D247Online@outlook.com</p>
              <p className="text-gray-800 mb-2"><strong>Website:</strong> <a href="https://deals247.online" className="text-purple-600 hover:underline">https://deals247.online</a></p>
              <p className="text-gray-800"><strong>Related Policies:</strong></p>
              <ul className="mt-2 space-y-1">
                <li>• <a href="/privacy-policy" className="text-purple-600 hover:underline">Privacy Policy</a></li>
                <li>• <a href="/terms-of-service" className="text-purple-600 hover:underline">Terms of Service</a></li>
              </ul>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
