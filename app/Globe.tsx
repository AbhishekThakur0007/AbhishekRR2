"use client";

import createGlobe from "cobe";
import React, { useEffect, useRef, useState } from "react";

function Globe() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [globeSize, setGlobeSize] = useState(300); // Initial reasonable size

  useEffect(() => {
    const updateGlobeSize = () => {
      // Calculate size based on viewport width with limits
      const size = Math.min(
        Math.max(window.innerWidth * 0.8, 250), // Min 250px, Max 80% of viewport
        600 // Absolute max
      );
      setGlobeSize(size);
      return size;
    };

    // Initial size calculation
    updateGlobeSize();

    // Set up resize listener
    const handleResize = () => {
      updateGlobeSize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    let phi = 0;
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: globeSize * 2,
      height: globeSize * 2,
      phi: 0,
      theta: 0,
      dark: 0,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [1, 1, 1],
      markerColor: [0.1, 0.8, 1],
      glowColor: [1, 1, 1],
      markers: [
        { location: [37.7595, -122.4367], size: 0.03 },
        { location: [40.7128, -74.006], size: 0.1 },
      ],
      scale: 0.5,
      opacity: 0.5,
      onRender: (state) => {
        state.phi = phi;
        phi += 0.01;
      },
    });

    return () => {
      globe.destroy();
    };
  }, [globeSize]); // Recreate globe when size changes

  return (
    <div className="flex justify-center items-center w-full">
      <canvas
        ref={canvasRef}
        style={{
          width: `${globeSize}px`,
          height: `${globeSize}px`,
          maxWidth: "100%",
          aspectRatio: "1",
        }}
      />
    </div>
  );
}

export default Globe;
