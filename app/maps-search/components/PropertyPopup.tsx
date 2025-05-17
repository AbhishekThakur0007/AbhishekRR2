const PropertyPopup = ({ property, onClick }: { property: any; onClick: () => void }) => {
  const formatPrice = (price: number) => {
    return price >= 1000000
      ? `$${(price / 1000000).toFixed(1)}M`
      : `$${(price / 1000).toFixed(0)}K`;
  };

  // console.log("===================property::",property)
  return (
    <div
      onClick={() => {
        onClick();
        // setListingCard(!listingCard);
        // setSelectedPropertys(property);
      }}
      className="pointer-events-auto absolute bottom-12 left-1/2 transform -translate-x-1/2 w-72 p-3 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
    >
      {/* Image Carousel placeholder (replace with real carousel if needed) */}
      <div className="relative">
        <img
          src={property.photos?.[0] || '/default-image.jpg'}
           alt="Property"
          className="w-full h-36 object-cover rounded-md"
        />
        {/* Image dot indicators placeholder */}
        <div className="absolute bottom-1 w-full flex justify-center gap-1">
          {property.photos
            ?.slice(0, 5)
            .map((_: any, idx: number) => (
              <div key={idx} className="w-2 h-2 bg-white rounded-full border border-gray-300" />
            ))}
        </div>
      </div>

      {/* Price and brief info */}
      <div className="text-base font-bold mt-2 text-gray-900">
        {formatPrice(property.price?.estimate || 0)}
        <div className="text-sm text-gray-700">
          {property.property?.beds || 0} bd | {property.property?.baths || 0} ba |{' '}
          {property.property?.size_sqft?.toLocaleString() || 0} sqft -{' '}
          {property.property?.type || 'Home'} for sale
        </div>

        {/* Address */}
        <div className="text-sm text-gray-600 mt-1 truncate">
          {property.address?.line}, {property.address?.city}, {property.address?.state}
        </div>
      </div>

      {/* Realtor / listing info placeholder */}
      {/* <div className="text-xs text-blue-600 mt-1 font-medium">
        BERKSHIRE HATHAWAY HOMESERVICES <br />
        COMMONWEALTH REAL ESTATE, Nisha Shah
      </div> */}
    </div>
  );
};

export default PropertyPopup;
