import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 md:p-12"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-sm text-gray-600 mb-8">Last Updated: December 12, 2025</p>

        <div className="prose prose-purple max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 mb-4">
              Welcome to Deals247 ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website deals247.online and our services.
            </p>
            <p className="text-gray-700">
              By accessing or using Deals247, you agree to the terms of this Privacy Policy. If you do not agree with our policies and practices, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Personal Information</h3>
            <p className="text-gray-700 mb-4">We collect the following personal information when you create an account or use our services:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li><strong>Account Information:</strong> Name, email address, and authentication credentials via Firebase Authentication</li>
              <li><strong>Profile Information:</strong> Display name, profile picture (if provided), and user preferences</li>
              <li><strong>Contact Information:</strong> Email address for communications and notifications</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 Usage Information</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Deals you view, save, or interact with</li>
              <li>Search queries and filters applied</li>
              <li>Favorite deals and notification preferences</li>
              <li>Device information (browser type, operating system, device type)</li>
              <li>IP address and location data (approximate location based on IP)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">2.3 User-Generated Content</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Deals you submit or post</li>
              <li>Comments, ratings, and reviews</li>
              <li>Business information (if you're a business user)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">We use your information for the following purposes:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li><strong>Service Delivery:</strong> To provide, maintain, and improve our deal discovery platform</li>
              <li><strong>Personalization:</strong> To customize your experience, show relevant deals, and provide personalized recommendations</li>
              <li><strong>Communication:</strong> To send you deal notifications, price alerts, and service updates</li>
              <li><strong>Authentication:</strong> To verify your identity and manage your account via Firebase Authentication</li>
              <li><strong>Analytics:</strong> To understand how users interact with our platform and improve our services</li>
              <li><strong>Security:</strong> To detect, prevent, and address fraud, security issues, and technical problems</li>
              <li><strong>Legal Compliance:</strong> To comply with legal obligations and enforce our Terms of Service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Third-Party Services</h2>
            <p className="text-gray-700 mb-4">We use the following third-party services that may collect and process your data:</p>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1 Firebase (Google)</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li><strong>Purpose:</strong> Authentication and user management</li>
              <li><strong>Data Collected:</strong> Email, authentication tokens, user ID</li>
              <li><strong>Privacy Policy:</strong> <a href="https://firebase.google.com/support/privacy" className="text-purple-600 hover:underline" target="_blank" rel="noopener noreferrer">Firebase Privacy Policy</a></li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2 Hostinger</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li><strong>Purpose:</strong> Web hosting and database services</li>
              <li><strong>Data Stored:</strong> User profiles, deals, favorites, notifications</li>
              <li><strong>Privacy Policy:</strong> <a href="https://www.hostinger.com/privacy-policy" className="text-purple-600 hover:underline" target="_blank" rel="noopener noreferrer">Hostinger Privacy Policy</a></li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">4.3 External Deal Sources</h3>
            <p className="text-gray-700 mb-4">
              When you click on deals or visit external merchant websites, those sites may collect information according to their own privacy policies. We are not responsible for the privacy practices of third-party websites.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Cookies and Tracking Technologies</h2>
            <p className="text-gray-700 mb-4">We use cookies and similar tracking technologies to:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Maintain your session and keep you logged in</li>
              <li>Remember your preferences and settings</li>
              <li>Analyze site usage and improve performance</li>
              <li>Provide personalized content and recommendations</li>
            </ul>
            <p className="text-gray-700">
              For detailed information, please see our <a href="/cookie-policy" className="text-purple-600 hover:underline">Cookie Policy</a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Sharing and Disclosure</h2>
            <p className="text-gray-700 mb-4">We do not sell your personal information. We may share your information in the following circumstances:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li><strong>Service Providers:</strong> With trusted third parties who help us operate our platform (e.g., Firebase, Hostinger)</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or government regulation</li>
              <li><strong>Safety and Security:</strong> To protect our rights, property, or safety, or that of our users</li>
              <li><strong>With Your Consent:</strong> When you explicitly agree to share your information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Data Security</h2>
            <p className="text-gray-700 mb-4">
              We implement appropriate technical and organizational security measures to protect your personal information, including:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>SSL/TLS encryption for data transmission</li>
              <li>Secure authentication via Firebase</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication requirements</li>
              <li>Encrypted database storage</li>
            </ul>
            <p className="text-gray-700">
              However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Your Rights and Choices</h2>
            <p className="text-gray-700 mb-4">You have the following rights regarding your personal information:</p>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">8.1 Access and Update</h3>
            <p className="text-gray-700 mb-4">You can access and update your account information through your profile settings.</p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">8.2 Delete Your Account</h3>
            <p className="text-gray-700 mb-4">You can request account deletion by contacting us at D247Online@outlook.com. We will delete your data within 30 days, except where retention is required by law.</p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">8.3 Opt-Out of Communications</h3>
            <p className="text-gray-700 mb-4">You can manage your notification preferences in your account settings or unsubscribe from emails using the link provided in each message.</p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">8.4 Cookie Management</h3>
            <p className="text-gray-700 mb-4">You can control cookies through your browser settings. Note that disabling cookies may affect site functionality.</p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">8.5 Data Portability</h3>
            <p className="text-gray-700 mb-4">You can request a copy of your personal data in a structured, machine-readable format.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Children's Privacy</h2>
            <p className="text-gray-700">
              Deals247 is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. International Data Transfers</h2>
            <p className="text-gray-700">
              Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place for such transfers in compliance with applicable data protection laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Data Retention</h2>
            <p className="text-gray-700 mb-4">We retain your personal information for as long as necessary to:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Provide our services and maintain your account</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes and enforce our agreements</li>
              <li>Improve our services and conduct analytics</li>
            </ul>
            <p className="text-gray-700">
              After account deletion, we may retain certain information for legal compliance, fraud prevention, and legitimate business purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Changes to This Privacy Policy</h2>
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page and updating the "Last Updated" date. Your continued use of Deals247 after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have questions, concerns, or requests regarding this Privacy Policy or your personal information, please contact us:
            </p>
            <div className="bg-purple-50 p-6 rounded-lg">
              <p className="text-gray-800 mb-2"><strong>Email:</strong> D247Online@outlook.com</p>
              <p className="text-gray-800 mb-2"><strong>Website:</strong> <a href="https://deals247.online" className="text-purple-600 hover:underline">https://deals247.online</a></p>
              <p className="text-gray-800"><strong>Contact Form:</strong> <a href="/contact" className="text-purple-600 hover:underline">Contact Us Page</a></p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. GDPR Compliance (For EU Users)</h2>
            <p className="text-gray-700 mb-4">
              If you are located in the European Economic Area (EEA), you have additional rights under the General Data Protection Regulation (GDPR):
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Right to access your personal data</li>
              <li>Right to rectification of inaccurate data</li>
              <li>Right to erasure ("right to be forgotten")</li>
              <li>Right to restrict processing</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
              <li>Right to withdraw consent at any time</li>
              <li>Right to lodge a complaint with a supervisory authority</li>
            </ul>
            <p className="text-gray-700">
              Our legal basis for processing your data includes: consent, contract performance, legal obligations, and legitimate interests. To exercise these rights, contact us at D247Online@outlook.com.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
