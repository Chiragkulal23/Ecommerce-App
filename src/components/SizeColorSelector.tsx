import { useState } from "react";

interface SizeColorSelectorProps {
  sizes: string[];
  colors: { name: string; value: string }[];
  onSelectionChange?: (size: string, color: string) => void;
}

const SizeColorSelector = ({ sizes, colors, onSelectionChange }: SizeColorSelectorProps) => {
  const initialSize = sizes && sizes.length > 0 ? sizes[0] : "Free Size";
  const initialColor = colors && colors.length > 0 ? colors[0].name : "Default";
  const [selectedSize, setSelectedSize] = useState(initialSize);
  const [selectedColor, setSelectedColor] = useState(initialColor);

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    onSelectionChange?.(size, selectedColor);
  };

  const handleColorChange = (colorName: string) => {
    setSelectedColor(colorName);
    onSelectionChange?.(selectedSize, colorName);
  };

  return (
    <div className="space-y-6">
      {/* Size Selection */}
      <div>
        <label className="block text-sm font-semibold mb-3">
          Select Size: <span className="text-primary">{selectedSize}</span>
        </label>
        <div className="flex flex-wrap gap-3">
          {(sizes && sizes.length > 0 ? sizes : [initialSize]).map((size) => (
            <button
              key={size}
              onClick={() => handleSizeChange(size)}
              className={`px-6 py-3 rounded-lg border-2 font-medium transition-all ${
                selectedSize === size
                  ? "border-primary bg-primary text-primary-foreground shadow-md"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color Selection */}
      <div>
        <label className="block text-sm font-semibold mb-3">
          Select Color: <span className="text-primary">{selectedColor}</span>
        </label>
        <div className="flex flex-wrap gap-3">
          {(colors && colors.length > 0 ? colors : [{ name: initialColor, value: "#9ca3af" }]).map((color) => (
            <button
              key={color.name}
              onClick={() => handleColorChange(color.name)}
              className={`group relative px-5 py-3 rounded-lg border-2 font-medium transition-all ${
                selectedColor === color.name
                  ? "border-primary shadow-md"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-5 h-5 rounded-full border-2 border-border"
                  style={{ backgroundColor: color.value }}
                />
                <span>{color.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SizeColorSelector;
