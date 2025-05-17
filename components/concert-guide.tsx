interface RealEstateGuideProps {
  title?: string;
  neighborhoods?: {
    name: string;
    properties: number;
    avgPrice: string;
  }[];
}

export function RealEstateGuide({
  title = "Real Estate Guide",
  neighborhoods = [
    { name: "Downtown", properties: 24, avgPrice: "$850,000" },
    { name: "Westside", properties: 18, avgPrice: "$1,200,000" },
    { name: "Coastal Heights", properties: 12, avgPrice: "$2,100,000" },
    { name: "Riverside", properties: 31, avgPrice: "$750,000" },
  ],
}: RealEstateGuideProps) {
  return (
    <div className="mt-12 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      <div className="h-1 w-16 bg-gray-900 mb-6"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {neighborhoods.map((neighborhood, index) => (
          <div key={index} className="bg-[#f2ece9] p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">{neighborhood.name}</h3>
              <span className="text-primary font-bold">
                {neighborhood.avgPrice}
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              {neighborhood.properties} properties available
            </p>
            <div className="mt-3">
              <a href="#" className="text-blue-600 text-sm hover:underline">
                View listings →
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <a
          href="#"
          className="text-blue-600 hover:underline flex items-center gap-1"
        >
          View all neighborhoods
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}
