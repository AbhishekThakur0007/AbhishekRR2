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
import { Star, Check } from 'lucide-react';
import Image from 'next/image';
import { MobilePropertyCard } from './mobile-property-card';
import { getComparisonClass, formatPercentDiff } from '@/utils/property-comparison';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PropertyDetailsProps {
  properties: Property[];
  subjectProperty: Property;
  isMobile: boolean;
  onPropertyClick: (property: Property) => void;
}

export function PropertyDetails({
  properties,
  subjectProperty,
  isMobile,
  onPropertyClick,
}: PropertyDetailsProps) {
  return (
    <div>
      {!isMobile ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead className="w-[250px]">Property</TableHead>
                <TableHead>Price</TableHead>
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
                const pricePerSqFt = property.sqft
                  ? Number(property.price.replace(/[^0-9]/g, '')) / property.sqft
                  : 0;
                const subjectPricePerSqFt = subjectProperty.sqft
                  ? Number(subjectProperty.price.replace(/[^0-9]/g, '')) / subjectProperty.sqft
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
                          <Star className="w-4 h-4 text-amber-500" />
                        )}
                        <div className="truncate max-w-[220px]">{property.address}</div>
                      </div>
                    </TableCell>
                    <TableCell>{property.price}</TableCell>
                    <TableCell
                      className={
                        property.id !== subjectProperty.id
                          ? getComparisonClass('pricePerSqFt', pricePerSqFt, subjectPricePerSqFt)
                          : ''
                      }
                    >
                      ${pricePerSqFt.toFixed(0)}
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

          {/* <div className="mt-8">
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
          </div> */}
        </>
      ) : (
        <div className="space-y-6">
          {properties.map((property) => {
            const pricePerSqFt = property.sqft
              ? Number(property.price.replace(/[^0-9]/g, '')) / property.sqft
              : 0;
            const subjectPricePerSqFt = subjectProperty.sqft
              ? Number(subjectProperty.price.replace(/[^0-9]/g, '')) / subjectProperty.sqft
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
                        <h3 className="font-medium">{property.address}</h3>
                      </div>
                      <p className="mt-1 text-lg font-bold">{property.price}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Price/SqFt</p>
                      <p
                        className={
                          property.id !== subjectProperty.id
                            ? getComparisonClass('pricePerSqFt', pricePerSqFt, subjectPricePerSqFt)
                            : 'font-medium'
                        }
                      >
                        ${pricePerSqFt.toFixed(0)}
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
                  </div>

                  <div className="mt-4">
                    <p className="mb-1 text-xs text-muted-foreground">Amenities</p>
                    <div className="flex flex-wrap gap-1">
                      {property.amenities.map((amenity, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full"
                    onClick={() => onPropertyClick(property)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
