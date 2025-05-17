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
import { ArrowDown, ArrowUp, ArrowRight, Star, Check } from 'lucide-react';
import Image from 'next/image';
import { getTrendIcon, getComparisonClass } from '@/utils/property-comparison';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PropertyCombinedAnalysisProps {
  properties: Property[];
  subjectProperty: Property;
  isMobile: boolean;
  onPropertyClick: (property: Property) => void;
}

export function PropertyCombinedAnalysis({
  properties,
  subjectProperty,
  isMobile,
  onPropertyClick,
}: PropertyCombinedAnalysisProps) {
  return (
    <div>
      {/* Summary Cards from PropertyOverview */}
      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Days to Sale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold md:text-2xl">
              {Math.round(
                properties
                  .filter((p) => p.daysToSale !== null)
                  .reduce((sum, p) => sum + (p.daysToSale || 0), 0) /
                  (properties.filter((p) => p.daysToSale !== null).length || 1), // Avoid division by zero
              )}
              <span className="ml-1 text-sm font-normal text-muted-foreground">days</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average % of Asking Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold md:text-2xl">
              {Math.round(
                (properties
                  .filter((p) => p.percentOfAsking !== null)
                  .reduce((sum, p) => sum + (p.percentOfAsking || 0), 0) /
                  (properties.filter((p) => p.percentOfAsking !== null).length || 1)) * // Avoid division by zero
                  10,
              ) / 10}
              %
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Zipcode Trend (Subject)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xl font-bold md:text-2xl">
              {subjectProperty.zipTrendValue}%
              {subjectProperty.zipTrend === 'up' ? (
                <ArrowUp className="ml-1 w-5 h-5 text-emerald-500" />
              ) : subjectProperty.zipTrend === 'down' ? (
                <ArrowDown className="ml-1 w-5 h-5 text-red-500" />
              ) : (
                <ArrowRight className="ml-1 w-5 h-5 text-muted-foreground" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {!isMobile ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead className="w-[200px] xl:w-[250px]">Property</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Days to Sale</TableHead>
              <TableHead>Days on Market</TableHead>
              <TableHead>% of Asking</TableHead>
              <TableHead>Invest Score</TableHead>
              <TableHead>Zip Trend</TableHead>
              <TableHead>Price/SqFt</TableHead>
              <TableHead>Beds/Baths</TableHead>
              <TableHead>Year Built</TableHead>
              <TableHead>Lot Size</TableHead>
              <TableHead>School Rating</TableHead>
              <TableHead>Tax Rate</TableHead>
              <TableHead>Appreciation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.map((property) => {
              const pricePerSqFt =
                property.sqft && property.price && property.price !== 'N/A'
                  ? Number(property.price.replace(/[^\d.]/g, '')) / property.sqft // Allow decimals in price
                  : 0;
              const subjectPricePerSqFt =
                subjectProperty.sqft && subjectProperty.price && subjectProperty.price !== 'N/A'
                  ? Number(subjectProperty.price.replace(/[^\d.]/g, '')) / subjectProperty.sqft
                  : 0;

              return (
                <TableRow
                  key={property.id}
                  className={property.id === subjectProperty.id ? 'bg-muted/50' : ''}
                >
                  <TableCell>
                    <div
                      className="overflow-hidden relative w-16 h-12 rounded-md cursor-pointer"
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
                    <div className="flex gap-2 items-center">
                      {property.id === subjectProperty.id && (
                        <Star className="flex-shrink-0 w-4 h-4 text-amber-500" />
                      )}
                      <div className="truncate max-w-[170px] xl:max-w-[220px]">
                        {property.address}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{property.price}</TableCell>
                  <TableCell>
                    {property.daysToSale !== null ? property.daysToSale : 'N/A'}
                  </TableCell>
                  <TableCell>{property.daysOnMarket}</TableCell>
                  <TableCell>
                    {property.percentOfAsking !== null ? `${property.percentOfAsking}%` : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 items-center xl:gap-2">
                      <Progress
                        value={(property.investmentScore ?? 0) * 10}
                        className="w-[40px] xl:w-[60px]"
                      />
                      <span className="text-xs xl:text-sm">{property.investmentScore}/10</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 items-center">
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
                  <TableCell
                    className={
                      property.id !== subjectProperty.id && pricePerSqFt && subjectPricePerSqFt
                        ? getComparisonClass('pricePerSqFt', pricePerSqFt, subjectPricePerSqFt)
                        : ''
                    }
                  >
                    ${pricePerSqFt > 0 ? pricePerSqFt.toFixed(0) : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {property.beds}/{property.baths}
                  </TableCell>
                  <TableCell>{property.yearBuilt}</TableCell>
                  <TableCell>{property.lotSize}</TableCell>
                  <TableCell
                    className={
                      property.id !== subjectProperty.id
                        ? getComparisonClass(
                            'schoolRating',
                            property.schoolRating,
                            subjectProperty.schoolRating,
                          )
                        : ''
                    }
                  >
                    {property.schoolRating}/10
                  </TableCell>
                  <TableCell
                    className={
                      property.id !== subjectProperty.id
                        ? getComparisonClass('taxRate', property.taxRate, subjectProperty.taxRate)
                        : ''
                    }
                  >
                    {property.taxRate}%
                  </TableCell>
                  <TableCell
                    className={
                      property.id !== subjectProperty.id
                        ? getComparisonClass(
                            'appreciationRate',
                            property.appreciationRate,
                            subjectProperty.appreciationRate,
                          )
                        : ''
                    }
                  >
                    {property.appreciationRate}%/yr
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <div className="space-y-6">
          {properties.map((property) => {
            const pricePerSqFt =
              property.sqft && property.price && property.price !== 'N/A'
                ? Number(property.price.replace(/[^\d.]/g, '')) / property.sqft
                : 0;
            const subjectPricePerSqFt =
              subjectProperty.sqft && subjectProperty.price && subjectProperty.price !== 'N/A'
                ? Number(subjectProperty.price.replace(/[^\d.]/g, '')) / subjectProperty.sqft
                : 0;

            return (
              <Card
                key={property.id}
                className={property.id === subjectProperty.id ? 'border-primary' : ''}
              >
                <CardHeader className="pb-2">
                  <div className="flex gap-3 items-start">
                    <div
                      className="overflow-hidden relative flex-shrink-0 w-20 h-16 rounded-md cursor-pointer"
                      onClick={() => onPropertyClick(property)}
                    >
                      <Image
                        src={property.image || '/placeholder.svg'}
                        alt={property.address}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex gap-2 items-center">
                        {property.id === subjectProperty.id && (
                          <Star className="w-4 h-4 text-amber-500" />
                        )}
                        <h3 className="font-medium leading-tight">{property.address}</h3>
                      </div>
                      <p className="mt-1 text-lg font-bold">{property.price}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Days to Sale</p>
                      <p className="font-medium">
                        {property.daysToSale !== null ? property.daysToSale : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Days on Market</p>
                      <p className="font-medium">{property.daysOnMarket}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">% of Asking</p>
                      <p className="font-medium">
                        {property.percentOfAsking !== null ? `${property.percentOfAsking}%` : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Invest Score</p>
                      <p className="font-medium">{property.investmentScore}/10</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Zip Trend</p>
                      <p className="flex items-center font-medium">
                        {property.zipTrendValue}%
                        {property.zipTrend === 'up' ? (
                          <ArrowUp
                            className={`h-4 w-4 ml-1 ${getTrendIcon(property.zipTrendValue, subjectProperty.zipTrendValue)}`}
                          />
                        ) : property.zipTrend === 'down' ? (
                          <ArrowDown
                            className={`h-4 w-4 ml-1 ${getTrendIcon(property.zipTrendValue, subjectProperty.zipTrendValue)}`}
                          />
                        ) : (
                          <ArrowRight
                            className={`h-4 w-4 ml-1 ${getTrendIcon(property.zipTrendValue, subjectProperty.zipTrendValue)}`}
                          />
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Price/SqFt</p>
                      <p
                        className={
                          property.id !== subjectProperty.id && pricePerSqFt && subjectPricePerSqFt
                            ? getComparisonClass('pricePerSqFt', pricePerSqFt, subjectPricePerSqFt)
                            : 'font-medium'
                        }
                      >
                        ${pricePerSqFt > 0 ? pricePerSqFt.toFixed(0) : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Beds/Baths</p>
                      <p className="font-medium">
                        {property.beds}/{property.baths}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Year Built</p>
                      <p className="font-medium">{property.yearBuilt}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Lot Size</p>
                      <p className="font-medium">{property.lotSize}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">School Rating</p>
                      <p
                        className={
                          property.id !== subjectProperty.id
                            ? getComparisonClass(
                                'schoolRating',
                                property.schoolRating,
                                subjectProperty.schoolRating,
                              )
                            : 'font-medium'
                        }
                      >
                        {property.schoolRating}/10
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Tax Rate</p>
                      <p
                        className={
                          property.id !== subjectProperty.id
                            ? getComparisonClass(
                                'taxRate',
                                property.taxRate,
                                subjectProperty.taxRate,
                              )
                            : 'font-medium'
                        }
                      >
                        {property.taxRate}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Appreciation</p>
                      <p
                        className={
                          property.id !== subjectProperty.id
                            ? getComparisonClass(
                                'appreciationRate',
                                property.appreciationRate,
                                subjectProperty.appreciationRate,
                              )
                            : 'font-medium'
                        }
                      >
                        {property.appreciationRate}%/yr
                      </p>
                    </div>
                  </div>

                  {/* <div className="mt-4">
                    <p className="mb-1 text-xs text-muted-foreground">Amenities</p>
                    <div className="flex flex-wrap gap-1">
                      {property.amenities.map((amenity, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div> */}

                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full"
                    onClick={() => onPropertyClick(property)}
                  >
                    View Full Details (Modal)
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Commented out Amenities Comparison table from PropertyDetails
      <div className="mt-8">
        <h3 className="mb-4 text-lg font-semibold">Amenities Comparison</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead className="w-[250px]">Property</TableHead>
              <TableHead>Pool</TableHead>
              <TableHead>Home Office</TableHead>
              <TableHead>Smart Home</TableHead>
              <TableHead>Finished Basement</TableHead>
              <TableHead>Garage</TableHead>
              <TableHead>Gourmet Kitchen</TableHead>
              <TableHead>Fireplace</TableHead>
              <TableHead>Deck/Patio</TableHead>
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
                    className="overflow-hidden relative w-16 h-12 rounded-md cursor-pointer"
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
                  <div className="flex gap-2 items-center">
                    {property.id === subjectProperty.id && (
                      <Star className="w-4 h-4 text-amber-500" />
                    )}
                    <div className="truncate max-w-[220px]">{property.address}</div>
                  </div>
                </TableCell>
                <TableCell>
                  {property.amenities.includes('Pool') ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  {property.amenities.includes('Home Office') ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  {property.amenities.includes('Smart Home') ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  {property.amenities.includes('Finished Basement') ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  {property.amenities.includes('3-Car Garage')
                    ? '3-Car'
                    : property.amenities.includes('2-Car Garage')
                      ? '2-Car'
                      : '-'}
                </TableCell>
                <TableCell>
                  {property.amenities.includes('Gourmet Kitchen') ||
                  property.amenities.includes('Updated Kitchen') ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  {property.amenities.includes('Fireplace') ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  {property.amenities.includes('Deck') ||
                  property.amenities.includes('Patio') ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    '-'
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      */}
    </div>
  );
}
