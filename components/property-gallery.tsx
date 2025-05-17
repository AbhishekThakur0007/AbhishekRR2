import React, { useState } from "react";
import { MLSListing, PropertyDetailResponse } from "@/app/types/real-estate";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  Image as ImageIcon,
  Info,
  Maximize2,
  X,
} from "lucide-react";

interface PropertyGalleryProps {
  propertyData?: PropertyDetailResponse | null;
  mlsData?: MLSListing | null;
}

export function PropertyGallery({
  propertyData,
  mlsData,
}: PropertyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"carousel" | "grid">("carousel");
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  // Skip rendering if no data is available
  if (!propertyData && !mlsData) {
    return (
      <Card className="border-2 border-dashed border-muted">
        <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px]">
          <Info className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-xl font-medium text-muted-foreground">
            Property images unavailable
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            We couldn&apos;t find images for this property.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Prepare images from both MLS and property data
  const mlsImages =
    mlsData?.media?.photosList?.map((photo: any) => ({
      src: photo.highRes || photo.midRes || photo.lowRes,
      alt: "Property image",
    })) || [];

  const propertyImages =
    propertyData?.data?.propertyInfo?.photos?.map(
      (url: string, index: number) => ({
        src: url,
        alt: `Property image ${index + 1}`,
      })
    ) || [];

  // Use MLS images if available, otherwise use property images
  const images = mlsImages.length > 0 ? mlsImages : propertyImages;

  // If no images are available, show a message
  if (images.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Photo Gallery</h2>
        </div>
        <Card className="border-2 border-dashed border-muted">
          <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px]">
            <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-xl font-medium text-muted-foreground">
              No property images available
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              This property listing does not include any photos.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Function to navigate carousel
  const navigateCarousel = (direction: "next" | "prev") => {
    if (direction === "next") {
      setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    } else {
      setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Photo Gallery</h2>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "carousel" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("carousel")}
            className="h-8 w-8 p-0"
            title="Carousel View"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="h-8 w-8 p-0"
            title="Grid View"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {viewMode === "carousel" ? (
        <div className="relative rounded-lg overflow-hidden">
          <div
            className="relative w-full"
            style={{ paddingBottom: "56.25%" }} // 16:9 aspect ratio
          >
            <img
              src={images[activeIndex].src}
              alt={images[activeIndex].alt}
              className="absolute inset-0 w-full h-full object-cover"
            />

            <Button
              variant="outline"
              size="icon"
              className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm"
              onClick={() => setFullscreenImage(images[activeIndex].src)}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
            onClick={() => navigateCarousel("prev")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
            onClick={() => navigateCarousel("next")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === activeIndex
                    ? "bg-primary"
                    : "bg-primary/20 hover:bg-primary/40"
                }`}
                onClick={() => setActiveIndex(index)}
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => setFullscreenImage(image.src)}
            >
              <div
                className="relative w-full"
                style={{ paddingBottom: "75%" }} // 4:3 aspect ratio
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </div>
          ))}
        </div>
      )}

      {/* Thumbnails for carousel view */}
      {viewMode === "carousel" && images.length > 1 && (
        <div className="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2 mt-4">
          {images.slice(0, 10).map((image, index) => (
            <div
              key={index}
              className={`relative rounded-md overflow-hidden cursor-pointer ${
                index === activeIndex
                  ? "ring-2 ring-primary"
                  : "hover:opacity-80"
              }`}
              onClick={() => setActiveIndex(index)}
            >
              <div
                className="relative w-full"
                style={{ paddingBottom: "75%" }} // 4:3 aspect ratio
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Image Viewer */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setFullscreenImage(null)}
        >
          <Button
            variant="outline"
            size="icon"
            className="absolute top-4 right-4 bg-transparent text-white border-white/20 hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              setFullscreenImage(null);
            }}
          >
            <X className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-transparent text-white border-white/20 hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              const currentIndex = images.findIndex(
                (img) => img.src === fullscreenImage
              );
              const prevIndex =
                currentIndex === 0 ? images.length - 1 : currentIndex - 1;
              setFullscreenImage(images[prevIndex].src);
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent text-white border-white/20 hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              const currentIndex = images.findIndex(
                (img) => img.src === fullscreenImage
              );
              const nextIndex =
                currentIndex === images.length - 1 ? 0 : currentIndex + 1;
              setFullscreenImage(images[nextIndex].src);
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <img
            src={fullscreenImage}
            alt="Fullscreen property image"
            className="max-h-full max-w-full object-contain"
          />

          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
            {images.map((img, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${
                  img.src === fullscreenImage
                    ? "bg-white"
                    : "bg-white/30 hover:bg-white/60"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setFullscreenImage(img.src);
                }}
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
