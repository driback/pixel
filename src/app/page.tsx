"use client";

import CanvasImage from "~/components/canvas-image";
import { Condition } from "~/components/condition";
import DownloadImage from "~/components/download-image";
import { ImageInput, ReplaceImage } from "~/components/image-input";
import PixelSizeOptions from "~/components/pixel-size-option";
import { usePixelateStore } from "~/components/providers/pixelate-provider";

export default function Home() {
  const image = usePixelateStore((s) => s.originalImage);

  return (
    <div className="grid h-[100dvh] w-[100dvw] place-content-center overflow-hidden">
      <main key={image} className="flex flex-col items-center justify-center gap-4">
        <Condition>
          <Condition.If condition={!image}>
            <ImageInput />
          </Condition.If>
          <Condition.Else>
            <CanvasImage />
            <PixelSizeOptions />
            <div className="flex items-center gap-2">
              <ReplaceImage />
              <DownloadImage />
            </div>
          </Condition.Else>
        </Condition>
      </main>
    </div>
  );
}
