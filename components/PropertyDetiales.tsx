import Image from 'next/image';
import { Home, RulerIcon, DollarSign, CalendarDays } from 'lucide-react';
import { Map, Marker } from 'pigeon-maps';

interface PropertyAddress {
  latitude?: string;
  longitude?: string;
  line?: string;
  city?: string;
  state?: string;
  postal_code?: string;
}

interface PropertyInfo {
  beds?: number;
  baths?: number;
  size_sqft?: number;
  type?: string;
  year_built?: number;
}

interface PriceInfo {
  list?: number;
  estimate?: number;
}

interface PropertyData {
  address?: PropertyAddress;
  price?: PriceInfo;
  property?: PropertyInfo;
  list_date?: string;
  last_update_date?: string;
  description?: string;
  photos?: string[];
}

interface ListingCardProps {
  propertie: PropertyData;
}

export default function ListingCard({ propertie }: ListingCardProps) {
  const { address, price, property, list_date, last_update_date, description, photos } = propertie;

  const safePrice = price || { list: 0, estimate: 0 };
  const safeProperty = property || {
    beds: 0,
    baths: 0,
    size_sqft: 0,
    type: 'N/A',
    year_built: 0,
  };

  const coordinates: [number, number] =
    address?.latitude && address?.longitude
      ? [parseFloat(address.latitude), parseFloat(address.longitude)]
      : [0, 0];

  const estMonthly = ((Number(safePrice.estimate) / 30) * 0.06).toFixed(0);

  return (
    <div className="w-full mx-auto p-6 backdrop-blur-xl border rounded-lg">
      {/* Top Section - Photos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {photos && photos.length > 0 ? (
          <>
            {/* Main Image */}
            <div>
              <Image
                src={photos[0]}
                alt="Main"
                width={700}
                height={500}
                className="rounded-lg object-cover w-full h-auto"
              />
            </div>

            {/* Gallery Images */}
            <div className="grid grid-cols-2 gap-3">
              {photos.slice(1, 4).map((photo, idx) => (
                <Image
                  key={idx}
                  src={photo}
                  alt={`Photo ${idx + 2}`}
                  width={350}
                  height={250}
                  className="rounded-lg object-cover w-full h-auto"
                />
              ))}
              <button className="bg-white/40 hover:bg-white/60 dark:bg-white/10 dark:hover:bg-white/20 text-gray-900 dark:text-white p-2 rounded-lg backdrop-blur-md border border-black/10 dark:border-white/10 transition">
                See all photos
              </button>
            </div>
          </>
        ) : (
          <div className="md:col-span-2 h-[500px] flex items-center justify-center bg-gray-100 dark:bg-white/10 rounded-lg text-gray-600 dark:text-white/60 text-lg font-medium border border-black/10 dark:border-white/10">
            No photos available
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="p-6 bg-white/60 dark:bg-background/40 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-lg rounded-lg mt-6">
        <div className="mt-4 flex flex-col md:flex-row md:items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mt-2">
              ${safePrice?.estimate?.toLocaleString()}
            </h1>
            <p className="text-gray-700 dark:text-white/80 text-lg mt-1">
              {address?.line || 'N/A'}, {address?.city || 'N/A'}, {address?.state || ''}{' '}
              {address?.postal_code || ''}
            </p>
            <div className="mt-2 bg-blue-100/60 text-blue-900 dark:text-blue-200 dark:bg-blue-900/20 px-3 py-1 inline-block rounded">
              <span className="font-semibold">Est.: ${estMonthly}/mo</span>
              <a className="underline font-medium ml-2" href="#">
                Get pre-qualified
              </a>
            </div>
          </div>

          <div className="flex gap-6 mt-6 md:mt-0 md:items-end">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {safeProperty.beds}
              </h3>
              <p className="text-gray-500 text-sm">beds</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {safeProperty.baths}
              </h3>
              <p className="text-gray-500 text-sm">baths</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {safeProperty?.size_sqft?.toLocaleString()}
              </h3>
              <p className="text-gray-500 text-sm">sqft</p>
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          <div className="flex items-center gap-2 p-3 bg-white/40 dark:bg-white/10 backdrop-blur-md rounded-md text-sm font-medium border border-black/5 dark:border-white/10 text-gray-900 dark:text-white">
            <Home className="text-gray-600 dark:text-white w-5 h-5" />
            {safeProperty.type}
          </div>
          <div className="flex items-center gap-2 p-3 bg-white/40 dark:bg-white/10 backdrop-blur-md rounded-md text-sm font-medium border border-black/5 dark:border-white/10 text-gray-900 dark:text-white">
            <CalendarDays className="text-gray-600 dark:text-white w-5 h-5" />
            Built in {safeProperty.year_built}
          </div>
          <div className="flex items-center gap-2 p-3 bg-white/40 dark:bg-white/10 backdrop-blur-md rounded-md text-sm font-medium border border-black/5 dark:border-white/10 text-gray-900 dark:text-white">
            <DollarSign className="text-gray-600 dark:text-white w-5 h-5" />
            Estimate: ${safePrice?.estimate?.toLocaleString()}
          </div>
          <div className="flex items-center gap-2 p-3 bg-white/40 dark:bg-white/10 backdrop-blur-md rounded-md text-sm font-medium border border-black/5 dark:border-white/10 text-gray-900 dark:text-white">

            <RulerIcon className="text-gray-600 dark:text-white w-5 h-5" />
            ${safePrice?.list && safeProperty.size_sqft
  ? (safePrice.list / safeProperty.size_sqft).toFixed(0)
  : 0}


            /sqft
          </div>
        </div>

        {/* Description */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Description</h2>
          <p className="text-sm text-gray-700 dark:text-white/80 leading-relaxed">
            {description || 'No additional description provided.'}
          </p>
        </div>

        {/* Map Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Location</h2>
          <div className="relative border border-black/5 dark:border-white/10 rounded-lg overflow-hidden backdrop-blur-md">
            <div className="h-[400px] w-full">
            <Map defaultCenter={coordinates as [number, number]} defaultZoom={15}>
  <Marker anchor={coordinates as [number, number]} />
</Map>

            </div>
          </div>
        </div>

        {/* Timestamps */}
        <div className="text-xs text-gray-500 dark:text-white/60 mt-4">
          <p>Listed on: {list_date ? new Date(list_date).toLocaleDateString() : 'Unknown'}</p>
          <p>
            Last updated:{' '}
            {last_update_date ? new Date(last_update_date).toLocaleDateString() : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
}
