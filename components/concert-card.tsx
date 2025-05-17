interface PropertyCardProps {
  propertyName: string;
  address: string;
  location: string;
  price: string;
  propertyType: string;
  imageUrl: string;
  beds: number;
  baths: number;
  sqft: number;
  listingUrl?: string;
}

export function PropertyCard({
  propertyName,
  address,
  location,
  price,
  propertyType,
  imageUrl,
  beds,
  baths,
  sqft,
  listingUrl = "#",
}: PropertyCardProps) {
  return (
    <div className="flex flex-col md:flex-row bg-[#f2ece9] rounded-lg overflow-hidden mb-8">
      {/* Property Image with View Button */}
      <div className="relative w-full md:w-[450px] h-[450px] md:h-auto">
        <img
          src={imageUrl}
          alt={propertyName}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 rounded-full p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path
              fillRule="evenodd"
              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* Property Details */}
      <div className="flex flex-col justify-between p-6 md:p-8 w-full">
        <div>
          <div className="uppercase text-gray-600 text-sm font-medium mb-1">
            Featured Property
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {propertyName}
          </h1>
          <p className="text-2xl text-gray-800 mb-6">
            {address}, {location}
          </p>

          <div className="flex flex-wrap gap-3 mb-8">
            <div className="flex items-center gap-2 bg-[#e8e0dc] px-3 py-1.5 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-700"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span className="text-gray-700">{propertyType}</span>
            </div>

            <div className="flex items-center gap-2 bg-[#e8e0dc] px-3 py-1.5 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-700"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700">{location}</span>
            </div>

            <div className="flex items-center gap-2 bg-[#e8e0dc] px-3 py-1.5 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-700"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700">Available Now</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-3 bg-[#e8e0dc] rounded-md">
              <p className="text-lg font-bold text-gray-900">{beds}</p>
              <p className="text-sm text-gray-600">Beds</p>
            </div>
            <div className="text-center p-3 bg-[#e8e0dc] rounded-md">
              <p className="text-lg font-bold text-gray-900">{baths}</p>
              <p className="text-sm text-gray-600">Baths</p>
            </div>
            <div className="text-center p-3 bg-[#e8e0dc] rounded-md">
              <p className="text-lg font-bold text-gray-900">
                {sqft.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Sq Ft</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href={listingUrl}
            className="flex items-center justify-center gap-2 bg-[#0e0604] text-white font-medium py-3 px-6 rounded-md hover:bg-black transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
            </svg>
            Schedule Tour
          </a>

          <button className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium py-3 px-6 rounded-md hover:bg-gray-50 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
            Share
          </button>
        </div>

        <div className="text-xs text-gray-500 mt-6">
          <span className="font-bold text-2xl text-gray-900">{price}</span> ·
          Listed by <span className="text-blue-600">Premier Realty</span>
        </div>
      </div>
    </div>
  );
}
