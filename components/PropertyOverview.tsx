import { Property } from '@/utils/property-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { ArrowDown, ArrowUp, ArrowRight, Star } from 'lucide-react';
import Image from 'next/image';
import { MobilePropertyCard } from './mobile-property-card';
import { getTrendIcon } from '@/utils/property-comparison';

interface PropertyOverviewProps {
  properties: Property[];
  subjectProperty: Property;
  isMobile: boolean;
  onPropertyClick: (property: Property) => void;
}

export function PropertyOverview({
  properties,
  subjectProperty,
  isMobile,
  onPropertyClick,
}: PropertyOverviewProps) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Days to Sale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">
              {Math.round(
                properties
                  .filter((p) => p.daysToSale !== null)
                  .reduce((sum, p) => sum + (p.daysToSale || 0), 0) /
                  properties.filter((p) => p.daysToSale !== null).length,
              )}
              <span className="text-muted-foreground text-sm font-normal ml-1">days</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average % of Asking Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">
              {Math.round(
                (properties
                  .filter((p) => p.percentOfAsking !== null)
                  .reduce((sum, p) => sum + (p.percentOfAsking || 0), 0) /
                  properties.filter((p) => p.percentOfAsking !== null).length) *
                  10,
              ) / 10}
              %
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Zipcode Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold flex items-center">
              {subjectProperty.zipTrendValue}%
              <ArrowUp className="h-5 w-5 text-emerald-500 ml-1" />
            </div>
          </CardContent>
        </Card>
      </div>

      {!isMobile ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead className="w-[250px]">Property</TableHead>
              <TableHead>Days to Sale</TableHead>
              <TableHead>Days on Market</TableHead>
              <TableHead>% of Asking</TableHead>
              <TableHead>Investment Score</TableHead>
              <TableHead>Zipcode Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.map((property) => (
              <TableRow
                key={property.id}
                className={property.id === subjectProperty.id ? 'bg-muted/50' : ''}
              >
                <TableCell>
                  <div
                    className="relative w-16 h-12 rounded-md overflow-hidden cursor-pointer"
                    onClick={() => onPropertyClick(property)}
                  >
                    <Image
                      src={property.image || '/placeholder.svg'}
                      alt={property.address}
                      fill
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {property.id === subjectProperty.id && (
                      <Star className="h-4 w-4 text-amber-500" />
                    )}
                    <div className="truncate max-w-[220px]">{property.address}</div>
                  </div>
                </TableCell>
                <TableCell>{property.daysToSale !== null ? property.daysToSale : 'N/A'}</TableCell>
                <TableCell>{property.daysOnMarket}</TableCell>
                <TableCell>
                  {property.percentOfAsking !== null ? `${property.percentOfAsking}%` : 'N/A'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={(property.investmentScore ?? 0) * 10} className="w-[60px]" />
                    <span>{property.investmentScore}/10</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {property.zipTrend === 'up' ? (
                      <ArrowUp
                        className={`h-4 w-4 ${getTrendIcon(property.zipTrendValue, subjectProperty.zipTrendValue)}`}
                      />
                    ) : property.zipTrend === 'down' ? (
                      <ArrowDown
                        className={`h-4 w-4 ${getTrendIcon(property.zipTrendValue, subjectProperty.zipTrendValue)}`}
                      />
                    ) : (
                      <ArrowRight
                        className={`h-4 w-4 ${getTrendIcon(property.zipTrendValue, subjectProperty.zipTrendValue)}`}
                      />
                    )}
                    {property.zipTrendValue}%
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="space-y-4">
          {properties.map((property) => (
            <MobilePropertyCard
              key={property.id}
              property={property}
              subjectProperty={subjectProperty}
              onClick={() => onPropertyClick(property)}
              isSubject={property.id === subjectProperty.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
