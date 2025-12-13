import { motion } from 'framer-motion';
import { Sparkles, Target, Heart, Users, TrendingUp, Shield } from 'lucide-react';

export default function AboutUs() {
  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To empower consumers with the best deals and savings opportunities, making smart shopping accessible to everyone, 24/7.'
    },
    {
      icon: Heart,
      title: 'Customer First',
      description: 'We prioritize user experience and trust, ensuring every deal we feature is verified, accurate, and valuable.'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Our platform thrives on community contributions, where users share and discover amazing deals together.'
    },
    {
      icon: TrendingUp,
      title: 'Innovation',
      description: 'Continuously improving our platform with cutting-edge technology to deliver personalized deal recommendations.'
    },
    {
      icon: Shield,
      title: 'Transparency',
      description: 'We believe in honest, transparent practices with no hidden fees or misleading information.'
    },
    {
      icon: Sparkles,
      title: 'Quality Over Quantity',
      description: 'We curate the best deals from trusted retailers, filtering out noise to save you time and money.'
    }
  ];

  const stats = [
    { value: '10,000+', label: 'Active Deals' },
    { value: '50,000+', label: 'Happy Users' },
    { value: '500+', label: 'Partner Stores' },
    { value: '24/7', label: 'Deal Updates' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-5xl font-bold mb-6">About Deals247</h1>
          <p className="text-xl text-purple-100 mb-8">
            Your 24/7 companion for discovering the best deals, discounts, and savings opportunities across the web
          </p>
          <div className="flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition"
            >
              Explore Deals
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition"
            >
              Contact Us
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-purple-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Story</h2>
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-4 text-gray-700">
            <p>
              Deals247 was born from a simple idea: everyone deserves access to the best deals and savings, anytime, anywhere. We noticed that finding genuine, valuable deals online was becoming increasingly time-consuming and frustrating, with deals scattered across countless websites and platforms.
            </p>
            <p>
              In 2025, we set out to change that. We built Deals247 as a centralized platform where users can discover, share, and save on thousands of deals from trusted retailers worldwide. Our platform combines advanced technology with community-driven insights to bring you the most relevant and valuable offers.
            </p>
            <p>
              Today, Deals247 serves thousands of savvy shoppers daily, helping them save money on everything from electronics and fashion to groceries and travel. We're proud to be a trusted resource for smart consumers who value both quality and savings.
            </p>
            <p>
              Our journey has just begun. We're constantly innovating, adding new features, and expanding our network of partner stores to bring you even more ways to save. Join us in our mission to make smart shopping accessible to everyone!
            </p>
          </div>
        </motion.div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-purple-50">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 mb-12 text-center"
          >
            Our Values & Principles
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <value.icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="ml-3 text-xl font-semibold text-gray-900">{value.title}</h3>
                </div>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 mb-12 text-center"
          >
            How Deals247 Works
          </motion.h2>
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-start gap-4"
            >
              <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Discover Deals</h3>
                <p className="text-gray-600">
                  Browse thousands of verified deals across multiple categories. Use our advanced filters to find exactly what you're looking for.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="flex items-start gap-4"
            >
              <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Save Favorites</h3>
                <p className="text-gray-600">
                  Create an account to save your favorite deals, set up price alerts, and get personalized recommendations based on your interests.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="flex items-start gap-4"
            >
              <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Shop & Save</h3>
                <p className="text-gray-600">
                  Click through to the retailer's website to complete your purchase. We'll track the deal and notify you of any price drops.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="flex items-start gap-4"
            >
              <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Share & Contribute</h3>
                <p className="text-gray-600">
                  Found an amazing deal? Share it with the community! Help others save money and earn recognition as a top contributor.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold mb-6">Ready to Start Saving?</h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of savvy shoppers who trust Deals247 for the best deals and discounts
          </p>
          <div className="flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition"
            >
              Sign Up Free
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition"
            >
              Browse Deals
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Get In Touch</h2>
          <p className="text-gray-600 mb-8">
            Have questions or suggestions? We'd love to hear from you!
          </p>
          <div className="bg-purple-50 rounded-lg p-8 inline-block">
            <p className="text-gray-800 mb-2"><strong>Email:</strong> D247Online@outlook.com</p>
            <p className="text-gray-800 mb-2"><strong>Website:</strong> <a href="https://deals247.online" className="text-purple-600 hover:underline">https://deals247.online</a></p>
            <p className="text-gray-800">
              <a href="/contact" className="text-purple-600 hover:underline font-semibold">
                Contact Us →
              </a>
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
