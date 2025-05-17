import React from "react";

interface Neighborhood {
  name: string;
  properties: number;
  avgPrice: string;
  description?: string;
  image?: string;
}

interface RealEstateGuideProps {
  title: string;
  neighborhoods: Neighborhood[];
}

export function RealEstateGuide({
  title,
  neighborhoods,
}: RealEstateGuideProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {neighborhoods.map((neighborhood, index) => (
          <div
            key={index}
            className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/40 relative">
              {neighborhood.image ? (
                <img
                  src={neighborhood.image}
                  alt={neighborhood.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl opacity-30">🏙️</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg">{neighborhood.name}</h3>
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>{neighborhood.properties} Properties</span>
                <span className="font-medium text-primary">
                  {neighborhood.avgPrice}
                </span>
              </div>
              {neighborhood.description && (
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {neighborhood.description}
                </p>
              )}
              <button className="mt-3 text-sm text-primary font-medium hover:underline">
                View Properties
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
