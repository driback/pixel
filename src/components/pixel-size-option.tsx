import { usePixelateStore } from "./providers/pixelate-provider";

const PixelSizeOptions = () => {
  const { pixel, pixelSizes, setPixel } = usePixelateStore((s) => s);

  return (
    <div className="flex items-center justify-center gap-4 p-2">
      {pixelSizes.map((s) => (
        <button
          key={s}
          type="button"
          data-state={s === pixel}
          onClick={() => setPixel(s)}
          className="select-none text-sm opacity-70 transition-opacity hover:opacity-100 data-[state=true]:opacity-100"
        >
          {s}px
        </button>
      ))}
    </div>
  );
};

export default PixelSizeOptions;
