'use client';

import React, { useState } from 'react';
import { RealEstateAPIResponse } from '../app/types/real-estate';
import Markdown from 'react-markdown';

interface CMAReportProps {
  properties: RealEstateAPIResponse[];
  analysisText: string;
}

export default function CMAReport({ properties, analysisText }: CMAReportProps) {
  const [isPrinting, setIsPrinting] = useState(false);
  
  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };
  
  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${isPrinting ? 'print:p-0' : ''}`}>
      <div className="flex justify-between items-center mb-6 print:hidden">
        <h2 className="text-2xl font-bold">Competitive Market Analysis</h2>
        <button 
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Print/Save as PDF
        </button>
      </div>
      
      <div className="prose max-w-none">
        <Markdown>{analysisText}</Markdown>
      </div>
      
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Comparable Properties</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {properties.slice(0, 4).map((property, index) => (
            <div key={property.property_id || index} className="border rounded-md p-4">
              <h4 className="font-bold">{property.address.line}</h4>
              <p>{property.address.city}, {property.address.state} {property.address.postal_code}</p>
              <div className="flex justify-between mt-2">
                <span className="font-bold">${property.price.list.toLocaleString()}</span>
                <span>{property.property.beds} beds, {property.property.baths} baths</span>
                <span>{property.property.size_sqft?.toLocaleString() || 'N/A'} sqft</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
