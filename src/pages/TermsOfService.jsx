import { motion } from 'framer-motion';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 md:p-12"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
        <p className="text-sm text-gray-600 mb-8">Last Updated: December 12, 2025</p>

        <div className="prose prose-purple max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              Welcome to Deals247! By accessing or using our website at deals247.online (the "Site"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our services.
            </p>
            <p className="text-gray-700">
              These Terms constitute a legally binding agreement between you and Deals247 ("we," "us," or "our"). We reserve the right to modify these Terms at any time, and your continued use of the Site after changes constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-700 mb-4">
              Deals247 is a platform that aggregates and displays deals, discounts, coupons, and promotional offers from various online and offline retailers. Our services include:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Browse and search for deals across multiple categories</li>
              <li>Save favorite deals and receive notifications</li>
              <li>Submit and share deals with the community</li>
              <li>Access personalized deal recommendations</li>
              <li>Receive price drop alerts and expiration notifications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 Account Creation</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>You must be at least 18 years old to create an account</li>
              <li>You must provide accurate, current, and complete information</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials</li>
              <li>You are responsible for all activities that occur under your account</li>
              <li>You must notify us immediately of any unauthorized use of your account</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 Account Termination</h3>
            <p className="text-gray-700 mb-4">
              We reserve the right to suspend or terminate your account at any time, with or without notice, for violations of these Terms, fraudulent activity, or any other reason at our sole discretion.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. User Conduct and Responsibilities</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1 Acceptable Use</h3>
            <p className="text-gray-700 mb-4">You agree to use Deals247 only for lawful purposes and in accordance with these Terms. You agree NOT to:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Post false, misleading, or fraudulent deals or information</li>
              <li>Submit spam, duplicate, or irrelevant content</li>
              <li>Impersonate any person or entity, or falsely state or misrepresent your affiliation</li>
              <li>Use automated scripts, bots, or scrapers to access the Site</li>
              <li>Attempt to gain unauthorized access to our systems or networks</li>
              <li>Interfere with or disrupt the Site or servers</li>
              <li>Violate any applicable laws, regulations, or third-party rights</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Upload viruses, malware, or any malicious code</li>
              <li>Collect or harvest personal information of other users</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2 Deal Submission Guidelines</h3>
            <p className="text-gray-700 mb-4">When submitting deals, you must:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Ensure the deal is accurate, current, and verified</li>
              <li>Provide complete information including price, discount, and expiration date</li>
              <li>Include proper attribution and source links</li>
              <li>Not submit expired or unavailable deals</li>
              <li>Not include affiliate links without disclosure (if applicable)</li>
              <li>Follow our community guidelines and content standards</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Intellectual Property Rights</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">5.1 Our Content</h3>
            <p className="text-gray-700 mb-4">
              All content on Deals247, including but not limited to text, graphics, logos, images, software, and design, is owned by or licensed to us and is protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our express written permission.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">5.2 User-Generated Content</h3>
            <p className="text-gray-700 mb-4">
              By submitting content to Deals247 (deals, comments, reviews, etc.), you grant us a worldwide, non-exclusive, royalty-free, perpetual license to use, reproduce, modify, adapt, publish, and display such content for the purpose of operating and promoting the Site.
            </p>
            <p className="text-gray-700 mb-4">
              You represent and warrant that you own or have the necessary rights to submit the content and that it does not violate any third-party rights or applicable laws.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">5.3 Trademarks</h3>
            <p className="text-gray-700 mb-4">
              Deals247 and our logo are trademarks or registered trademarks. Other product and company names mentioned on the Site may be trademarks of their respective owners.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Third-Party Links and Services</h2>
            <p className="text-gray-700 mb-4">
              Deals247 contains links to third-party websites, retailers, and services that are not owned or controlled by us. We are not responsible for:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>The content, privacy policies, or practices of third-party sites</li>
              <li>The accuracy, availability, or quality of deals from external retailers</li>
              <li>Transactions you make with third-party merchants</li>
              <li>Product quality, delivery, or customer service from external vendors</li>
            </ul>
            <p className="text-gray-700">
              Your interactions with third-party websites are solely between you and the third party. We encourage you to review their terms and privacy policies before making any purchases.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Disclaimers and Warranties</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">7.1 Deal Accuracy</h3>
            <p className="text-gray-700 mb-4">
              While we strive to provide accurate and up-to-date deal information, we do not guarantee:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>The accuracy, completeness, or reliability of any deal information</li>
              <li>That deals will be available, valid, or honored by retailers</li>
              <li>Specific pricing, discounts, or terms from merchants</li>
              <li>That you will successfully obtain any particular deal</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">7.2 "AS IS" Service</h3>
            <p className="text-gray-700 mb-4">
              THE SITE AND SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
            </p>
            <p className="text-gray-700 mb-4">
              We do not warrant that:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>The Site will be uninterrupted, secure, or error-free</li>
              <li>Defects will be corrected</li>
              <li>The Site is free of viruses or harmful components</li>
              <li>Results obtained from using the Site will be accurate or reliable</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, DEALS247 AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Any indirect, incidental, special, consequential, or punitive damages</li>
              <li>Loss of profits, revenue, data, or use</li>
              <li>Business interruption or loss of goodwill</li>
              <li>Damages arising from deals, purchases, or interactions with third parties</li>
              <li>Unauthorized access to or alteration of your data</li>
              <li>Errors or inaccuracies in deal information</li>
            </ul>
            <p className="text-gray-700">
              OUR TOTAL LIABILITY FOR ANY CLAIMS ARISING OUT OF OR RELATING TO THESE TERMS OR THE SITE SHALL NOT EXCEED $100 USD OR THE AMOUNT YOU PAID US IN THE PAST 12 MONTHS, WHICHEVER IS GREATER.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Indemnification</h2>
            <p className="text-gray-700">
              You agree to indemnify, defend, and hold harmless Deals247, its affiliates, officers, directors, employees, agents, and licensors from any claims, liabilities, damages, losses, costs, or expenses (including reasonable attorneys' fees) arising out of or relating to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Your use of the Site or services</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of another party</li>
              <li>Content you submit or post on the Site</li>
              <li>Your breach of any representations or warranties</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Privacy</h2>
            <p className="text-gray-700">
              Your use of the Site is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our <a href="/privacy-policy" className="text-purple-600 hover:underline">Privacy Policy</a> to understand our data collection and use practices.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Dispute Resolution</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">11.1 Informal Resolution</h3>
            <p className="text-gray-700 mb-4">
              Before filing any formal legal action, you agree to first contact us at D247Online@outlook.com to attempt to resolve the dispute informally.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">11.2 Arbitration</h3>
            <p className="text-gray-700 mb-4">
              Any disputes arising out of or relating to these Terms or the Site shall be resolved through binding arbitration in accordance with applicable arbitration rules, rather than in court, except where prohibited by law.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">11.3 Governing Law</h3>
            <p className="text-gray-700 mb-4">
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Deals247 operates, without regard to conflict of law principles.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Modifications to Terms</h2>
            <p className="text-gray-700">
              We reserve the right to modify these Terms at any time. We will notify users of material changes by posting the updated Terms on the Site and updating the "Last Updated" date. Your continued use of the Site after such modifications constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Termination</h2>
            <p className="text-gray-700 mb-4">
              We may terminate or suspend your account and access to the Site immediately, without prior notice or liability, for any reason, including:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Breach of these Terms</li>
              <li>Fraudulent or illegal activity</li>
              <li>Violation of applicable laws or regulations</li>
              <li>At our sole discretion for any other reason</li>
            </ul>
            <p className="text-gray-700">
              Upon termination, your right to use the Site will immediately cease. All provisions of these Terms that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, and limitations of liability.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Severability</h2>
            <p className="text-gray-700">
              If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that these Terms will otherwise remain in full force and effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. Entire Agreement</h2>
            <p className="text-gray-700">
              These Terms, together with our Privacy Policy and Cookie Policy, constitute the entire agreement between you and Deals247 regarding the use of the Site and supersede all prior agreements and understandings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">16. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms, please contact us:
            </p>
            <div className="bg-purple-50 p-6 rounded-lg">
              <p className="text-gray-800 mb-2"><strong>Email:</strong> D247Online@outlook.com</p>
              <p className="text-gray-800 mb-2"><strong>Website:</strong> <a href="https://deals247.online" className="text-purple-600 hover:underline">https://deals247.online</a></p>
              <p className="text-gray-800"><strong>Contact Form:</strong> <a href="/contact" className="text-purple-600 hover:underline">Contact Us Page</a></p>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
