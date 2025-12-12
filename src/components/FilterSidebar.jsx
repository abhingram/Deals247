import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

const FilterSidebar = ({ show, onClose, onFilterChange }) => {
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedStores, setSelectedStores] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  React.useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        stores: selectedStores,
        minRating: selectedRatings.length > 0 ? Math.min(...selectedRatings) : null,
        verified: verifiedOnly,
      });
    }
  }, [priceRange, selectedStores, selectedRatings, verifiedOnly]);

  const stores = ['Amazon', 'Best Buy', 'Walmart', 'Target', 'Apple Store', 'Nike'];
  const ratings = [4.5, 4.0, 3.5, 3.0];

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity ${
          show ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed md:sticky top-0 left-0 h-screen md:h-auto w-80 md:w-64 bg-white p-6 overflow-y-auto z-50 transform transition-transform md:translate-x-0 md:block flex-shrink-0 ${
          show ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between mb-6 md:hidden">
          <h3 className="text-lg font-bold text-gray-900">Filters</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="hidden md:block mb-6">
          <h3 className="text-lg font-bold text-gray-900">Filters</h3>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Price Range</h4>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={2000}
              step={50}
              className="mb-4"
            />
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Stores</h4>
            <div className="space-y-3">
              {stores.map((store) => (
                <div key={store} className="flex items-center gap-2">
                  <Checkbox
                    id={`store-${store}`}
                    checked={selectedStores.includes(store)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedStores([...selectedStores, store]);
                      } else {
                        setSelectedStores(selectedStores.filter((s) => s !== store));
                      }
                    }}
                  />
                  <Label
                    htmlFor={`store-${store}`}
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    {store}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Minimum Rating</h4>
            <div className="space-y-3">
              {ratings.map((rating) => (
                <div key={rating} className="flex items-center gap-2">
                  <Checkbox
                    id={`rating-${rating}`}
                    checked={selectedRatings.includes(rating)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedRatings([...selectedRatings, rating]);
                      } else {
                        setSelectedRatings(selectedRatings.filter((r) => r !== rating));
                      }
                    }}
                  />
                  <Label
                    htmlFor={`rating-${rating}`}
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    {rating}+ Stars
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Deal Type</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="verified" 
                  checked={verifiedOnly}
                  onCheckedChange={setVerifiedOnly}
                />
                <Label htmlFor="verified" className="text-sm text-gray-700 cursor-pointer">
                  Verified Deals Only
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="expiring" />
                <Label htmlFor="expiring" className="text-sm text-gray-700 cursor-pointer">
                  Expiring Soon
                </Label>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setPriceRange([0, 2000]);
                setSelectedStores([]);
                setSelectedRatings([]);
                setVerifiedOnly(false);
              }}
            >
              Clear All Filters
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default FilterSidebar;