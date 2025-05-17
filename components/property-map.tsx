'use client';

import React, { useState, useEffect } from 'react';
import { Map, Marker, ZoomControl } from 'pigeon-maps';
import { RealEstateAPIResponse } from '../app/types/real-estate';

interface PropertyMapProps {
  properties: RealEstateAPIResponse[];
  onMarkerClick?: (property: RealEstateAPIResponse) => void;
  selectedProperty?: RealEstateAPIResponse | null;
}

export default function PropertyMap({ properties, onMarkerClick, selectedProperty }: PropertyMapProps) {
  const [center, setCenter] = useState<[number, number]>([39.8283, -98.5795]); // Center of US
  const [zoom, setZoom] = useState(4);
  
  // Update center when properties change
  useEffect(() => {
    if (properties.length > 0) {
      // If we have a selected property, center on it
      if (selectedProperty) {
        const coords = getCoordinates(selectedProperty);
        setCenter(coords);
        setZoom(10); // Zoom in when a property is selected
      } else {
        // Otherwise, calculate the average position of all properties
        const avgLat = properties.reduce((sum, prop) => sum + getCoordinates(prop)[0], 0) / properties.length;
        const avgLng = properties.reduce((sum, prop) => sum + getCoordinates(prop)[1], 0) / properties.length;
        setCenter([avgLat, avgLng]);
        setZoom(8); // Slightly zoomed out to see all properties
      }
    }
  }, [properties, selectedProperty]);
  
  // Function to get coordinates from property
  // In a real app, you would use the actual coordinates from the API
  // This is a placeholder that generates deterministic coordinates based on property ID
  const getCoordinates = (property: RealEstateAPIResponse): [number, number] => {
    // In a real implementation, you would use geocoding or coordinates from the API
    // For now, we'll generate deterministic coordinates based on property ID
    // This ensures that the same property always gets the same coordinates
    
    // Extract a numeric value from the property ID
    // Use a hash of the full property ID to ensure uniqueness
    const hashCode = (s: string): number => {
      let hash = 0;
      for (let i = 0; i < s.length; i++) {
        hash = ((hash << 5) - hash) + s.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
      }
      return hash;
    };
    
    const propertyIdHash = hashCode(property.property_id);
    
    // Use the hash to generate deterministic but distributed coordinates
    // Scale the values to be within a reasonable range around the center
    const lat = center[0] + (Math.sin(propertyIdHash * 0.1) * 0.5);
    const lng = center[1] + (Math.cos(propertyIdHash * 0.1) * 1);
    
    return [lat, lng];
  };
  
  return (
    <div className="h-[500px] w-full rounded-lg overflow-hidden border">
      <Map 
        center={center} 
        zoom={zoom} 
        onBoundsChanged={({ center, zoom }) => { 
          setCenter(center);
          setZoom(zoom);
        }}
      >
        <ZoomControl />
        
        {properties.map((property, index) => {
          const coords = getCoordinates(property);
          const isSelected = selectedProperty?.property_id === property.property_id;
          
          return (
            <Marker 
              key={property.property_id || index}
              width={isSelected ? 50 : 40}
              anchor={coords} 
              color={isSelected ? '#2563eb' : '#ef4444'}
              onClick={() => onMarkerClick && onMarkerClick(property)}
            />
          );
        })}
      </Map>
    </div>
  );
}
