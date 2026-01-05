import { useState, useEffect } from "react";
import SEOHead from "@/components/seo/SEOHead";
import ToolHero from "@/components/shared/ToolHero";
import FAQSection from "@/components/seo/FAQSection";
import { ToolStructuredData, FAQStructuredData } from "@/components/seo/StructuredData";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Palette, Copy } from "lucide-react";
import { toast } from "sonner";

const ColorPicker = () => {
  const [hex, setHex] = useState("#3b82f6");
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 });
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 });

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const hslToRgb = (h: number, s: number, l: number) => {
    s /= 100; l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return { r: Math.round(255 * f(0)), g: Math.round(255 * f(8)), b: Math.round(255 * f(4)) };
  };

  const updateFromHex = (newHex: string) => {
    setHex(newHex);
    const rgbVal = hexToRgb(newHex);
    if (rgbVal) {
      setRgb(rgbVal);
      setHsl(rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b));
    }
  };

  const updateFromRgb = (newRgb: { r: number, g: number, b: number }) => {
    setRgb(newRgb);
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
  };

  const updateFromHsl = (newHsl: { h: number, s: number, l: number }) => {
    setHsl(newHsl);
    const rgbVal = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    setRgb(rgbVal);
    setHex(rgbToHex(rgbVal.r, rgbVal.g, rgbVal.b));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const generatePalette = () => {
    const colors = [];
    for (let i = 0; i <= 100; i += 10) {
      const newRgb = hslToRgb(hsl.h, hsl.s, i);
      colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    }
    return colors;
  };

  const faqs = [
    {
      question: "What is the difference between HEX and RGB?",
      answer: "HEX is a 6-digit hexadecimal representation of color (#RRGGBB), while RGB uses decimal values for Red, Green, and Blue (0-255). Both represent the same colors, just in different formats."
    },
    {
      question: "What is HSL color format?",
      answer: "HSL stands for Hue, Saturation, and Lightness. It's often easier for humans to work with because you can adjust brightness and saturation independently while keeping the base hue."
    },
    {
      question: "How do I convert HEX to RGB?",
      answer: "Our color picker automatically converts between formats. Just enter your HEX code and see the RGB values instantly. Each pair of hex digits represents Red, Green, and Blue values."
    },
    {
      question: "What colors can I create with this picker?",
      answer: "This tool supports the full 16.7 million color spectrum available in digital displays. You can create any color by adjusting HEX, RGB, or HSL values."
    },
    {
      question: "How do I use the color palette feature?",
      answer: "The palette generator creates 11 shades from darkest to lightest based on your selected color's hue and saturation. It's perfect for creating consistent design systems."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Color Picker - HEX RGB HSL Converter & Palette Generator"
        description="Free online color picker with HEX, RGB, and HSL converter. Generate color palettes and copy color codes instantly."
        keywords="color picker, hex to rgb, rgb to hex, color converter, color palette generator, hsl converter, color code"
        canonical="https://pinetoolshub.com/color-picker"
      />
      
      <ToolStructuredData
        toolName="Color Picker & Converter"
        toolDescription="Pick colors and convert between HEX, RGB, and HSL formats. Generate color palettes."
        toolUrl="https://pinetoolshub.com/color-picker"
        category="Calculator"
      />
      
      <FAQStructuredData faqs={faqs} />

      <ToolHero
        title="Color Picker"
        description="Pick colors, convert HEX/RGB/HSL, and generate palettes"
        icon={<Palette className="h-8 w-8" />}
        color="bg-gradient-to-r from-red-500/20 via-green-500/20 to-blue-500/20"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Color Preview */}
          <Card className="mb-6 overflow-hidden">
            <div className="h-32" style={{ backgroundColor: hex }} />
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-4">
                <Input
                  type="color"
                  value={hex}
                  onChange={(e) => updateFromHex(e.target.value)}
                  className="w-16 h-12 p-1 cursor-pointer"
                />
                <span className="text-2xl font-mono font-bold">{hex.toUpperCase()}</span>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(hex)}>
                  <Copy className="h-4 w-4 mr-2" /> Copy
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Color Values */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {/* HEX */}
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <Label className="text-sm font-medium mb-2 block">HEX</Label>
                <div className="flex gap-2">
                  <Input
                    value={hex}
                    onChange={(e) => updateFromHex(e.target.value)}
                    className="font-mono"
                    placeholder="#000000"
                  />
                  <Button variant="outline" size="icon" onClick={() => copyToClipboard(hex)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* RGB */}
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <Label className="text-sm font-medium mb-2 block">RGB</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    type="number"
                    min={0}
                    max={255}
                    value={rgb.r}
                    onChange={(e) => updateFromRgb({ ...rgb, r: Math.min(255, parseInt(e.target.value) || 0) })}
                    className="text-center"
                  />
                  <Input
                    type="number"
                    min={0}
                    max={255}
                    value={rgb.g}
                    onChange={(e) => updateFromRgb({ ...rgb, g: Math.min(255, parseInt(e.target.value) || 0) })}
                    className="text-center"
                  />
                  <Input
                    type="number"
                    min={0}
                    max={255}
                    value={rgb.b}
                    onChange={(e) => updateFromRgb({ ...rgb, b: Math.min(255, parseInt(e.target.value) || 0) })}
                    className="text-center"
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>R</span><span>G</span><span>B</span>
                </div>
              </CardContent>
            </Card>

            {/* HSL */}
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <Label className="text-sm font-medium mb-2 block">HSL</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    type="number"
                    min={0}
                    max={360}
                    value={hsl.h}
                    onChange={(e) => updateFromHsl({ ...hsl, h: Math.min(360, parseInt(e.target.value) || 0) })}
                    className="text-center"
                  />
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={hsl.s}
                    onChange={(e) => updateFromHsl({ ...hsl, s: Math.min(100, parseInt(e.target.value) || 0) })}
                    className="text-center"
                  />
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={hsl.l}
                    onChange={(e) => updateFromHsl({ ...hsl, l: Math.min(100, parseInt(e.target.value) || 0) })}
                    className="text-center"
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>H°</span><span>S%</span><span>L%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CSS Values */}
          <Card className="bg-card border-border mb-6">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">CSS Values</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-2 bg-muted rounded font-mono">{hex}</code>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(hex)}><Copy className="h-4 w-4" /></Button>
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-2 bg-muted rounded font-mono">rgb({rgb.r}, {rgb.g}, {rgb.b})</code>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}><Copy className="h-4 w-4" /></Button>
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-2 bg-muted rounded font-mono">hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</code>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}><Copy className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Color Palette */}
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Color Palette (Shades)</h3>
              <div className="flex rounded-lg overflow-hidden">
                {generatePalette().map((color, i) => (
                  <div
                    key={i}
                    className="flex-1 h-12 cursor-pointer hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => copyToClipboard(color)}
                    title={color}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">Click any shade to copy HEX</p>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto mt-16 prose prose-invert">
          <h2 className="text-2xl font-bold text-foreground mb-4">Free Online Color Picker</h2>
          <p className="text-muted-foreground mb-4">
            Pick any color and instantly convert between HEX, RGB, and HSL formats. Generate beautiful 
            color palettes for your design projects. Perfect for web designers, developers, and artists.
          </p>
        </div>

        <FAQSection faqs={faqs} />
      </div>
    </div>
  );
};

export default ColorPicker;
