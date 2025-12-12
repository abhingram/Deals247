import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, ExternalLink, Heart, Share2, BadgeCheck, Shield, Award, AlertTriangle, CheckCircle, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';
import DealModal from '@/components/DealModal';
import ImageWithFallback from '@/components/ImageWithFallback';

const DealCard = ({ deal }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();
  
  const {
    title,
    store,
    originalPrice,
    discountedPrice,
    discount,
    rating,
    reviews,
    image,
    expiresIn,
    verified,
    id
  } = deal;

  // Check if deal is favorited on mount
  useEffect(() => {
    if (isAuthenticated && user && id) {
      checkFavoriteStatus();
    }
  }, [isAuthenticated, user, id]);

  const checkFavoriteStatus = async () => {
    try {
      const result = await api.checkFavorite(user.uid, id);
      setIsFavorited(result.isFavorited);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const handleGetDeal = (e) => {
    e.stopPropagation();
    setModalOpen(true);
  };

  const handleCardClick = () => {
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save deals to your favorites.",
        variant: "destructive",
      });
      return;
    }

    if (!user || !id) return;

    setLoading(true);
    try {
      if (isFavorited) {
        await api.removeFromFavorites(user.uid, id);
        setIsFavorited(false);
        toast({
          title: "Removed from favorites",
          description: "Deal removed from your favorites.",
        });
      } else {
        await api.addToFavorites(user.uid, id);
        setIsFavorited(true);
        toast({
          title: "Added to favorites",
          description: "Deal added to your favorites.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update favorites.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const dealUrl = `${window.location.origin}/deal/${id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out this amazing deal: ${title} - ${discount}% off!`,
          url: dealUrl,
        });
        // Record the share
        if (isAuthenticated && user) {
          await api.recordDealShare(id, 'native_share');
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          fallbackShare();
        }
      }
    } else {
      fallbackShare();
    }
  };

  const fallbackShare = () => {
    const dealUrl = `${window.location.origin}/deal/${id}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(dealUrl).then(() => {
      toast({
        title: "Link copied!",
        description: "Deal link copied to clipboard. Share it with your friends!",
      });
      // Record the share
      if (isAuthenticated && user) {
        api.recordDealShare(id, 'copy_link').catch(console.error);
      }
    }).catch(() => {
      toast({
        title: "Share Deal",
        description: `Share this link: ${dealUrl}`,
      });
    });
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -4, shadow: "lg" }}
        className="deal-card bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group relative"
        onClick={handleCardClick}
      >
        {/* Image Section */}
        <div className="deal-image-container relative w-full h-48 bg-gray-100">
          <ImageWithFallback 
            src={image || "https://images.unsplash.com/photo-1595872018818-97555653a011"}
            alt={title}
            className="w-full h-full object-cover"
            fallbackClassName="bg-gray-200 text-gray-500"
          />
          
          {/* Discount Badge */}
          <div className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 rounded-full shadow-lg">
            <span className="text-base font-bold">↓{discount}%</span>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
              disabled={loading}
              className={`p-2 rounded-full shadow-lg backdrop-blur-sm transition-all ${
                isFavorited
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-white/90 text-gray-700 hover:bg-white'
              }`}
              title={isFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleShare();
              }}
              className="bg-white/90 p-2 rounded-full shadow-lg hover:bg-white backdrop-blur-sm transition-all"
              title="Share this deal"
            >
              <Share2 className="h-4 w-4 text-gray-700" />
            </button>
          </div>

          {/* Trust Badge */}
          {verified && (
            <div className="absolute bottom-3 left-3 flex items-center bg-green-500 text-white px-2.5 py-1 rounded-full shadow-md">
              <CheckCircle className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs font-semibold">Verified</span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="deal-content p-4">
          {/* Title */}
          <h3 className="deal-title text-base font-semibold text-gray-900 leading-snug mb-3 line-clamp-2 min-h-[3rem]">
            {title}
          </h3>

          {/* Price Section */}
          <div className="deal-prices mb-3 flex items-baseline gap-2">
            <span className="price text-2xl font-bold text-gray-900">
              ${discountedPrice}
            </span>
            <span className="old-price text-base text-gray-400 line-through">
              ${originalPrice}
            </span>
          </div>

          {/* Store and Rating */}
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-gray-700">{store}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold text-gray-900">{rating}</span>
              <span className="text-xs text-gray-500">({reviews.toLocaleString()})</span>
            </div>
          </div>

          {/* Trust Indicators Row */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {!verified && (
              <div className="flex items-center bg-yellow-50 text-yellow-700 px-2 py-1 rounded-md">
                <AlertTriangle className="h-3 w-3 mr-1" />
                <span className="text-xs font-medium">Unverified</span>
              </div>
            )}
            <div className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-md">
              <Shield className="h-3 w-3 mr-1" />
              <span className="text-xs font-medium">98% Trust</span>
            </div>
            <div className="flex items-center bg-green-50 text-green-700 px-2 py-1 rounded-md">
              <ThumbsUp className="h-3 w-3 mr-1" />
              <span className="text-xs font-medium">95%</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span className="font-medium">Expires: {expiresIn}</span>
            </div>
            <div className="flex items-center gap-1 text-blue-600">
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="font-medium">Active</span>
            </div>
          </div>
        </div>
      </motion.div>
    
    <DealModal deal={deal} open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
};

export default DealCard;