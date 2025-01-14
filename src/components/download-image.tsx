import { DownloadIcon } from "lucide-react";
import { useCallback } from "react";
import { usePixelateStore } from "./providers/pixelate-provider";
import { Button } from "./ui/button";

const DownloadImage = () => {
  const pixelateImage = usePixelateStore((s) => s.pixelateImage);

  const downloadCanvas = useCallback(() => {
    if (!pixelateImage) return;
    const link = document.createElement("a");
    link.download = "pixelated-image.png";
    link.href = pixelateImage;
    link.click();
  }, [pixelateImage]);

  return (
    <Button variant="outline" size="sm" onClick={downloadCanvas}>
      <DownloadIcon className="size-4" />
      Download
    </Button>
  );
};

export default DownloadImage;
