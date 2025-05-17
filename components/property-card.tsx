
'use client';

import React, { useState } from 'react';
import { RealEstateAPIResponse } from '../app/types/real-estate';

interface PropertyCardProps {
  property: RealEstateAPIResponse;
  onClick?: () => void;
  selected?: boolean;
}

export default function PropertyCard({ property, onClick, selected = false }: PropertyCardProps) {
  const [imageError, setImageError] = useState(false);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  return (
    <div 
      className={`border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow ${selected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={onClick}
    >
      <div className="relative h-48 bg-gray-200">
        {property.photos && property.photos.length > 0 && !imageError ? (
          <img 
            src={property.photos[0]} 
            alt={`${property.address.line}, ${property.address.city}`}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200 text-gray-400">
            No image available
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
          <p className="text-white font-bold text-xl">{formatPrice(property.price.list)}</p>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 truncate">{property.address.line}</h3>
        <p className="text-gray-600 mb-2">{property.address.city}, {property.address.state} {property.address.postal_code}</p>
        <div className="flex justify-between text-sm">
          <span>{property.property.beds} beds</span>
          <span>{property.property.baths} baths</span>
          <span>{property.property.size_sqft?.toLocaleString() || 'N/A'} sqft</span>
        </div>
        <p className="mt-2 text-sm text-gray-500 line-clamp-2">{property.description}</p>
      </div>
    </div>
  );
}
