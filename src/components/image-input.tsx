"use client";

import { ImageIcon } from "lucide-react";
import { type ChangeEvent, useCallback, useState } from "react";
import { usePixelateStore } from "./providers/pixelate-provider";
import { buttonVariants } from "./ui/button";

export type ImageInputOnSuccess = {
  size: number;
  data: string;
  width: number;
  height: number;
};

type ImageInputProps = {
  onSuccess?: (datas: ImageInputOnSuccess) => void;
  onError?: (error: Error) => void;
};

const validTypes = ["image/jpeg", "image/png", "image/gif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const useImageUpload = ({ onSuccess, onError }: ImageInputProps) => {
  const handleImageUpload = useCallback(
    (file: File) => {
      if (!validTypes.includes(file.type)) {
        return onError?.(new Error("Invalid image type"));
      }

      if (file.size > MAX_FILE_SIZE) {
        return onError?.(new Error("File is too large"));
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const src = e.target?.result as string;

        const img = new Image();
        img.src = src;
        img.onload = () =>
          onSuccess?.({ data: src, size: file.size, width: img.width, height: img.height });
      };
    },
    [onSuccess, onError],
  );

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) handleImageUpload(file);
    },
    [handleImageUpload],
  );

  return { handleImageUpload, handleChange };
};

export const ImageInput = () => {
  const [isDragging, setIsDragging] = useState(false);
  const setOriginalImage = usePixelateStore((s) => s.setOriginalImage);

  const { handleImageUpload, handleChange } = useImageUpload({
    onSuccess: (s) => setOriginalImage(s.data),
  });

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      setIsDragging(false);
      const file = event.dataTransfer.files?.[0];
      if (file) handleImageUpload(file);
    },
    [handleImageUpload],
  );

  return (
    <label
      className={
        "block w-96 cursor-pointer border-2 border-dashed p-8 transition-colors hover:border-primary}"
      }
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <input
        type="file"
        name="image"
        id="image"
        className="hidden"
        onChange={handleChange}
        accept="image/*"
      />
      <p>{isDragging ? "Drop the file here" : "Drag and drop files here, or click to upload"}</p>
    </label>
  );
};

export const ReplaceImage = () => {
  const setOriginalImage = usePixelateStore((s) => s.setOriginalImage);

  const { handleChange } = useImageUpload({
    onSuccess: (s) => setOriginalImage(s.data),
  });

  return (
    <label
      className={buttonVariants({ variant: "outline", size: "sm", className: "cursor-pointer" })}
    >
      <input
        type="file"
        name="image"
        id="image"
        className="hidden"
        onChange={handleChange}
        accept="image/*"
      />
      <ImageIcon className="size-4" />
      Replace
    </label>
  );
};
