import { useState } from "react";
import { MLSListing } from "@/app/types/real-estate";

interface ImageType {
  src: string;
  alt: string;
}

interface ImageGalleryProps {
  images?: ImageType[];
  extraImagesCount?: number;
  mlsData?: MLSListing | null;
}

export function ImageGallery({
  images = [],
  extraImagesCount = 3,
  mlsData,
}: ImageGalleryProps) {
  console.log("mlsData card", mlsData);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  // Convert MLS photos to ImageType format
  const mlsImages =
    mlsData?.media?.photosList?.map(
      (photo: { highRes: string }, index: number) => ({
        src: photo.highRes,
        alt: `Property Photo ${index + 1}`,
      })
    ) || [];

  // Combine provided images with MLS images, prioritizing MLS images
  const allImages = [...mlsImages, ...images];

  // Ensure we have at least 8 images by filling with placeholders if needed
  const displayImages = [...allImages];

  // Fill with placeholders if we don't have enough images
  if (displayImages.length < 8) {
    const placeholdersNeeded = 8 - displayImages.length;
    for (let i = 0; i < placeholdersNeeded; i++) {
      displayImages.push({
        src: "/placeholder.svg",
        alt: `Placeholder Image ${i + 1}`,
      });
    }
  }

  // Only show the first 8 images in the grid
  const gridImages = displayImages.slice(0, 8);

  // Calculate the actual number of extra images
  const actualExtraImagesCount = Math.max(
    0,
    allImages.length - 8 + (extraImagesCount || 0)
  );

  return (
    <>
      <div className="mb-6">
        <div className="grid grid-cols-4 gap-2 auto-rows-auto">
          {/* Featured large image */}
          <div
            className="relative col-span-2 row-span-2 overflow-hidden rounded-md group cursor-pointer"
            onClick={() => setSelectedImage(0)}
          >
            <img
              src={gridImages[0].src}
              alt={gridImages[0].alt}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
              <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-lg font-medium">
                {gridImages[0].alt}
              </span>
            </div>
          </div>

          {/* Regular images */}
          {gridImages.slice(1, 3).map((image, index) => (
            <div
              key={index}
              className="relative aspect-square overflow-hidden rounded-md group cursor-pointer"
              onClick={() => setSelectedImage(index + 1)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-medium">
                  {image.alt}
                </span>
              </div>
            </div>
          ))}

          {/* Second featured large image */}
          <div
            className="relative col-span-2 overflow-hidden rounded-md group cursor-pointer"
            onClick={() => setSelectedImage(3)}
          >
            <img
              src={gridImages[3].src}
              alt={gridImages[3].alt}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
              <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-lg font-medium">
                {gridImages[3].alt}
              </span>
            </div>
          </div>

          {/* Remaining regular images */}
          {gridImages.slice(4, 7).map((image, index) => (
            <div
              key={index}
              className="relative aspect-square overflow-hidden rounded-md group cursor-pointer"
              onClick={() => setSelectedImage(index + 4)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-medium">
                  {image.alt}
                </span>
              </div>
            </div>
          ))}

          {/* "More images" tile */}
          {actualExtraImagesCount > 0 ? (
            <div
              className="relative aspect-square overflow-hidden rounded-md cursor-pointer"
              onClick={() => setSelectedImage(7)}
            >
              <img
                src={gridImages[7].src}
                alt={gridImages[7].alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
                <span className="text-white text-xl font-bold">
                  +{actualExtraImagesCount}
                </span>
              </div>
            </div>
          ) : (
            <div
              className="relative aspect-square overflow-hidden rounded-md group cursor-pointer"
              onClick={() => setSelectedImage(7)}
            >
              <img
                src={gridImages[7].src}
                alt={gridImages[7].alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-medium">
                  {gridImages[7].alt}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <img
              src={displayImages[selectedImage].src}
              alt={displayImages[selectedImage].alt}
              className="w-full h-full object-contain"
            />
            <button
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white w-10 h-10 rounded-full flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              ✕
            </button>
            <div className="absolute bottom-4 left-0 right-0 text-center text-white">
              <p className="text-lg font-medium">
                {displayImages[selectedImage].alt}
              </p>
              <div className="flex items-center justify-center mt-2 gap-2">
                {displayImages
                  .slice(0, Math.min(displayImages.length, 10))
                  .map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        selectedImage === index ? "bg-white" : "bg-white/50"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(index);
                      }}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
