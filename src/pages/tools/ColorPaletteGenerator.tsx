import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Palette, Copy, Download, RefreshCw, Upload, Lock, Unlock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import SEOHead from "@/components/seo/SEOHead";
import ToolHero from "@/components/shared/ToolHero";
import FAQSection from "@/components/seo/FAQSection";
import { ToolStructuredData } from "@/components/seo/StructuredData";

interface ColorInfo {
  hex: string;
  locked: boolean;
}

const ColorPaletteGenerator = () => {
  const [colors, setColors] = useState<ColorInfo[]>([
    { hex: "#6366f1", locked: false },
    { hex: "#8b5cf6", locked: false },
    { hex: "#a855f7", locked: false },
    { hex: "#d946ef", locked: false },
    { hex: "#ec4899", locked: false },
  ]);

  const generateRandomColor = (): string => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
  };

  const generatePalette = () => {
    setColors(colors.map(c => c.locked ? c : { ...c, hex: generateRandomColor() }));
    toast.success("New palette generated!");
  };

  const generateHarmoniousPalette = () => {
    const baseHue = Math.floor(Math.random() * 360);
    const newColors = colors.map((c, i) => {
      if (c.locked) return c;
      const hue = (baseHue + i * 30) % 360;
      const saturation = 60 + Math.random() * 30;
      const lightness = 40 + Math.random() * 30;
      return { ...c, hex: hslToHex(hue, saturation, lightness) };
    });
    setColors(newColors);
    toast.success("Harmonious palette generated!");
  };

  const hslToHex = (h: number, s: number, l: number): string => {
    s /= 100;
    l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const toggleLock = (index: number) => {
    setColors(colors.map((c, i) => i === index ? { ...c, locked: !c.locked } : c));
  };

  const updateColor = (index: number, hex: string) => {
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      setColors(colors.map((c, i) => i === index ? { ...c, hex } : c));
    }
  };

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    toast.success(`Copied ${hex} to clipboard!`);
  };

  const copyPaletteCSS = () => {
    const css = colors.map((c, i) => `--color-${i + 1}: ${c.hex};`).join("\n");
    navigator.clipboard.writeText(`:root {\n${css}\n}`);
    toast.success("CSS variables copied to clipboard!");
  };

  const exportPalette = (format: "json" | "css" | "scss") => {
    let content = "";
    const filename = `palette.${format}`;

    switch (format) {
      case "json":
        content = JSON.stringify({ colors: colors.map(c => c.hex) }, null, 2);
        break;
      case "css":
        content = `:root {\n${colors.map((c, i) => `  --color-${i + 1}: ${c.hex};`).join("\n")}\n}`;
        break;
      case "scss":
        content = colors.map((c, i) => `$color-${i + 1}: ${c.hex};`).join("\n");
        break;
    }

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = filename;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`Palette exported as ${format.toUpperCase()}!`);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const colorCounts: Record<string, number> = {};

      // Sample every 10th pixel
      for (let i = 0; i < imageData.length; i += 40) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        // Round to reduce color variations
        const hex = `#${[r, g, b].map(c => Math.round(c / 16) * 16).map(c => c.toString(16).padStart(2, "0")).join("")}`;
        colorCounts[hex] = (colorCounts[hex] || 0) + 1;
      }

      // Get top 5 colors
      const topColors = Object.entries(colorCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([hex]) => ({ hex, locked: false }));

      if (topColors.length >= 5) {
        setColors(topColors);
        toast.success("Colors extracted from image!");
      } else {
        toast.error("Could not extract enough colors from image");
      }
    };

    img.src = URL.createObjectURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxFiles: 1,
  });

  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return "";
    return `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`;
  };

  const faqs = [
    { question: "How do I use the color palette generator?", answer: "Press Space or click 'Generate' to create new random colors. Lock colors you like, and they'll stay when you generate new ones." },
    { question: "Can I extract colors from an image?", answer: "Yes! Drag and drop any image onto the upload area, and we'll extract the dominant colors to create a palette." },
    { question: "What export formats are available?", answer: "Export your palette as CSS custom properties, SCSS variables, or JSON for use in your projects." },
    { question: "What are harmonious colors?", answer: "Harmonious palettes use color theory (analogous colors) to create visually pleasing combinations that work well together." },
    { question: "How do I copy a single color?", answer: "Click on any color or the copy icon to copy its HEX value to your clipboard." },
  ];

  return (
    <>
      <SEOHead
        title="Color Palette Generator - Extract Colors from Image | Free Online"
        description="Generate beautiful color palettes. Extract colors from images, create harmonious schemes, export as CSS, SCSS, or JSON. Free online color palette tool."
        keywords="color palette generator, color scheme generator, extract colors from image, color picker, css color variables, harmonious colors, palette creator"
        canonical="https://pinetoolshub.com/color-palette-generator"
      />
      <ToolStructuredData
        toolName="Color Palette Generator"
        toolDescription="Generate beautiful color palettes, extract colors from images, and export as CSS, SCSS, or JSON."
        toolUrl="https://pinetoolshub.com/color-palette-generator"
        category="Image"
      />

      <ToolHero
        title="Color Palette Generator"
        description="Create beautiful color palettes. Generate random colors, extract from images, export for your projects."
        icon={<Palette className="h-6 w-6" />}
      />

      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Color Palette Display */}
            <Card>
              <CardContent className="p-0">
                <div className="grid grid-cols-5 min-h-[200px] md:min-h-[300px]">
                  {colors.map((color, index) => (
                    <div
                      key={index}
                      className="relative group flex flex-col items-center justify-end p-2 md:p-4 cursor-pointer transition-transform hover:scale-[1.02]"
                      style={{ backgroundColor: color.hex }}
                      onClick={() => copyColor(color.hex)}
                    >
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => { e.stopPropagation(); toggleLock(index); }}
                        >
                          {color.locked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                        </Button>
                      </div>
                      <div className="bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-center">
                        <p className="font-mono text-xs md:text-sm font-medium">{color.hex.toUpperCase()}</p>
                        <p className="font-mono text-[10px] md:text-xs text-muted-foreground hidden md:block">{hexToRgb(color.hex)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Controls */}
            <div className="flex flex-wrap gap-3 justify-center">
              <Button onClick={generatePalette} size="lg">
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate (Space)
              </Button>
              <Button onClick={generateHarmoniousPalette} variant="outline" size="lg">
                <Sparkles className="h-4 w-4 mr-2" />
                Harmonious
              </Button>
              <Button onClick={copyPaletteCSS} variant="outline" size="lg">
                <Copy className="h-4 w-4 mr-2" />
                Copy CSS
              </Button>
            </div>

            {/* Color Editor */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Edit Colors</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {colors.map((color, index) => (
                    <div key={index} className="space-y-2">
                      <div
                        className="h-16 rounded-lg border cursor-pointer"
                        style={{ backgroundColor: color.hex }}
                        onClick={() => copyColor(color.hex)}
                      />
                      <Input
                        value={color.hex}
                        onChange={(e) => updateColor(index, e.target.value)}
                        className="font-mono text-sm"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Image Upload & Export */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Upload className="h-4 w-4" /> Extract from Image
                  </h3>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <input {...getInputProps()} />
                    <p className="text-muted-foreground">Drop an image here or click to upload</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Download className="h-4 w-4" /> Export Palette
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={() => exportPalette("css")} variant="outline">
                      Export CSS
                    </Button>
                    <Button onClick={() => exportPalette("scss")} variant="outline">
                      Export SCSS
                    </Button>
                    <Button onClick={() => exportPalette("json")} variant="outline">
                      Export JSON
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <FAQSection faqs={faqs} toolName="Color Palette Generator" />
    </>
  );
};

export default ColorPaletteGenerator;
