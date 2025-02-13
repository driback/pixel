"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePixelateStore } from "./providers/pixelate-provider";

const CanvasImage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cacheRef = useRef<Map<string, string>>(new Map());
  const { pixel, image, setPixelateImage } = usePixelateStore((s) => ({
    pixel: s.pixel,
    image: s.originalImage,
    setPixelateImage: s.setPixelateImage,
  }));

  const processImage = useCallback(
    (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, pixel: number) => {
      if (pixel === 0) return;

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const w = canvas.width;
      const h = canvas.height;

      for (let y = 0; y < h; y += pixel) {
        for (let x = 0; x < w; x += pixel) {
          const maxY = Math.min(pixel, h - y);
          const maxX = Math.min(pixel, w - x);
          const area = maxX * maxY;

          let r = 0;
          let g = 0;
          let b = 0;
          const yOffset = y * w;

          for (let by = 0; by < maxY; by++) {
            const idx = (yOffset + by * w + x) * 4;
            for (let bx = 0; bx < maxX; bx++) {
              const pixelIdx = idx + bx * 4;
              r += data[pixelIdx];
              g += data[pixelIdx + 1];
              b += data[pixelIdx + 2];
            }
          }

          ctx.fillStyle = `rgb(${(r / area) | 0},${(g / area) | 0},${(b / area) | 0})`;
          ctx.fillRect(x, y, pixel, pixel);
        }
      }
    },
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!(canvas && image)) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const key = String(pixel);
    const cachedImage = cacheRef.current.get(key);

    if (cachedImage) {
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        setPixelateImage(cachedImage);
      };
      img.src = cachedImage;
      return;
    }

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      processImage(ctx, canvas, pixel);

      const pixelateImage = canvas.toDataURL("image/png");
      cacheRef.current.set(key, pixelateImage);
      setPixelateImage(pixelateImage);
    };
    img.src = image;

    return () => {
      img.onload = null;
    };
  }, [image, pixel, setPixelateImage, processImage]);

  return (
    <div className="relative aspect-video max-h-[28rem] w-full overflow-hidden">
      <canvas ref={canvasRef} className="h-full w-full object-contain" />
    </div>
  );
};

export default CanvasImage;
