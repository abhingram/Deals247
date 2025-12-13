import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const Footer = () => {
  const handleSocialClick = (platform) => {
    toast({
      title: `${platform} Link`,
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <span className="text-2xl font-bold text-white">Deals247</span>
            </div>
            <p className="text-sm mb-4">
              Discover the best deals and save money on your favorite products.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleSocialClick('Facebook')}
                className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleSocialClick('Twitter')}
                className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleSocialClick('Instagram')}
                className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleSocialClick('YouTube')}
                className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors"
              >
                <Youtube className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div>
            <span className="font-semibold text-white mb-4 block">Quick Links</span>
            <nav className="flex flex-col gap-2">
              <a href="/" className="text-sm hover:text-white transition-colors">Browse Deals</a>
              <a href="/#popular" className="text-sm hover:text-white transition-colors">Popular Stores</a>
              <a href="/#categories" className="text-sm hover:text-white transition-colors">Categories</a>
              <a href="/about" className="text-sm hover:text-white transition-colors">About Us</a>
            </nav>
          </div>

          <div>
            <span className="font-semibold text-white mb-4 block">Support</span>
            <nav className="flex flex-col gap-2">
              <a href="/contact" className="text-sm hover:text-white transition-colors">Contact Us</a>
              <a href="/contact#faq" className="text-sm hover:text-white transition-colors">FAQs</a>
              <a href="/privacy-policy" className="text-sm hover:text-white transition-colors">Privacy Policy</a>
              <a href="/terms-of-service" className="text-sm hover:text-white transition-colors">Terms of Service</a>
            </nav>
          </div>

          <div>
            <span className="font-semibold text-white mb-4 block">Newsletter</span>
            <p className="text-sm mb-4">Get the best deals delivered to your inbox</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <Button
                size="icon"
                className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700"
                onClick={() => toast({
                  title: "Newsletter Signup",
                  description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
                })}
              >
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-center md:text-left">
              © 2025 Deals247. All rights reserved.
            </p>
            <nav className="flex flex-wrap justify-center gap-4 md:gap-6">
              <a href="/privacy-policy" className="text-sm hover:text-white transition-colors">Privacy Policy</a>
              <a href="/terms-of-service" className="text-sm hover:text-white transition-colors">Terms of Service</a>
              <a href="/cookie-policy" className="text-sm hover:text-white transition-colors">Cookie Policy</a>
              <a href="/about" className="text-sm hover:text-white transition-colors">About</a>
              <a href="/contact" className="text-sm hover:text-white transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;