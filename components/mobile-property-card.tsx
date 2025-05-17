'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star } from 'lucide-react';

interface MobilePropertyCardProps {
  property: {
    id: number;
    address: string;
    price: string;
    image: string;
    beds: number;
    baths: number;
    sqft: number;
    daysToSale: number | null;
    daysOnMarket: number;
    percentOfAsking: number | null;
    investmentScore: number;
    zipTrend: string;
    zipTrendValue: number;
    status: string;
    amenities: string[];
  };
  subjectProperty: any;
  onClick: () => void;
  isSubject?: boolean;
}

export function MobilePropertyCard({
  property,
  subjectProperty,
  onClick,
  isSubject = false,
}: MobilePropertyCardProps) {
  // Function to determine if a higher or lower value is better
  const getBetterValue = (
    metric: string,
    value: number | null,
    compareValue: number | null,
  ): 'better' | 'worse' | 'neutral' => {
    if (value === null || compareValue === null) return 'neutral';

    // For these metrics, lower is better
    if (['daysToSale', 'daysOnMarket', 'taxRate'].includes(metric)) {
      return value < compareValue ? 'better' : value > compareValue ? 'worse' : 'neutral';
    }

    // For these metrics, higher is better
    return value > compareValue ? 'better' : value < compareValue ? 'worse' : 'neutral';
  };

  // Function to get color class based on comparison
  const getComparisonClass = (
    metric: string,
    value: number | null,
    compareValue: number | null,
  ): string => {
    const result = getBetterValue(metric, value, compareValue);
    if (result === 'better') return 'text-emerald-600 font-medium';
    if (result === 'worse') return 'text-rose-600 font-medium';
    return 'text-gray-600';
  };

  // Function to format percentage difference
  const formatPercentDiff = (value: number | null, compareValue: number | null): string => {
    if (value === null || compareValue === null) return 'N/A';
    const diff = ((value - compareValue) / compareValue) * 100;
    return `${diff > 0 ? '+' : ''}${diff.toFixed(1)}%`;
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video cursor-pointer" onClick={onClick}>
        <Image
          src={property.image || '/placeholder.svg'}
          alt={property.address}
          fill
          className="object-cover"
        />
        <Badge className="absolute top-2 right-2">{property.status}</Badge>
        {isSubject && (
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded-md flex items-center gap-1">
            <Star className="h-3 w-3" />
            <span className="text-xs font-medium">Subject</span>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          {property.id === subjectProperty?.id && <Star className="h-4 w-4 text-amber-500" />}
          <h3 className="font-medium line-clamp-1">{property.address}</h3>
        </div>
        <p className="text-lg font-bold">{property.price}</p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
          <span>{property.beds} beds</span>
          <span>•</span>
          <span>{property.baths} baths</span>
          <span>•</span>
          <span>{property.sqft.toLocaleString()} sqft</span>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
          <div>
            <p className="text-xs text-muted-foreground">Days to Sale</p>
            <p
              className={
                property.id !== subjectProperty?.id
                  ? getComparisonClass(
                      'daysToSale',
                      property.daysToSale,
                      subjectProperty?.daysToSale,
                    )
                  : 'font-medium'
              }
            >
              {property.daysToSale !== null ? property.daysToSale : 'N/A'}
              {property.id !== subjectProperty?.id &&
                property.daysToSale !== null &&
                subjectProperty?.daysToSale !== null && (
                  <span className="text-xs ml-1">
                    ({formatPercentDiff(property.daysToSale, subjectProperty?.daysToSale)})
                  </span>
                )}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Days on Market</p>
            <p
              className={
                property.id !== subjectProperty?.id
                  ? getComparisonClass(
                      'daysOnMarket',
                      property.daysOnMarket,
                      subjectProperty?.daysOnMarket,
                    )
                  : 'font-medium'
              }
            >
              {property.daysOnMarket}
              {property.id !== subjectProperty?.id && (
                <span className="text-xs ml-1">
                  ({formatPercentDiff(property.daysOnMarket, subjectProperty?.daysOnMarket)})
                </span>
              )}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">% of Asking</p>
            <p
              className={
                property.id !== subjectProperty?.id
                  ? getComparisonClass(
                      'percentOfAsking',
                      property.percentOfAsking,
                      subjectProperty?.percentOfAsking,
                    )
                  : 'font-medium'
              }
            >
              {property.percentOfAsking !== null ? `${property.percentOfAsking}%` : 'N/A'}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Investment Score</p>
            <div className="flex items-center gap-2">
              <Progress value={property.investmentScore * 10} className="w-[40px]" />
              <span
                className={
                  property.id !== subjectProperty?.id
                    ? getComparisonClass(
                        'investmentScore',
                        property.investmentScore,
                        subjectProperty?.investmentScore,
                      )
                    : 'font-medium'
                }
              >
                {property.investmentScore}/10
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs text-muted-foreground mb-1">Key Amenities</p>
          <div className="flex flex-wrap gap-1">
            {property.amenities.slice(0, 3).map((amenity, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {amenity}
              </Badge>
            ))}
            {property.amenities.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{property.amenities.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        <Button variant="outline" className="w-full mt-4" onClick={onClick}>
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}
