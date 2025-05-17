import { Property } from '@/utils/property-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

interface PropertyImagesProps {
  properties: Property[];
  subjectProperty: Property;
  isMobile: boolean;
  onPropertyClick: (property: Property) => void;
}

export function PropertyImages({
  properties,
  subjectProperty,
  isMobile,
  onPropertyClick,
}: PropertyImagesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <Card
          key={property.id}
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onPropertyClick(property)}
        >
          <CardHeader>
            <CardTitle className="text-lg">{property.address}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={property.image}
                alt={property.address}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="text-base font-semibold">{property.price}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Beds/Baths</p>
                <p className="text-base font-semibold">
                  {property.beds}/{property.baths}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Square Feet</p>
                <p className="text-base font-semibold">{property.sqft.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Days on Market</p>
                <p className="text-base font-semibold">{property.daysOnMarket}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
