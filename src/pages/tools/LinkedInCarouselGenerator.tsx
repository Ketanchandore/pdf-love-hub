import { useState, useCallback, useRef } from "react";
import SEOHead from "@/components/seo/SEOHead";
import { ToolStructuredData } from "@/components/seo/StructuredData";
import ToolHero from "@/components/shared/ToolHero";
import FileUpload from "@/components/shared/FileUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import * as pdfjsLib from "pdfjs-dist";
import { 
  Linkedin, 
  Download,
  Loader2,
  Palette,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Image as ImageIcon
} from "lucide-react";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface CarouselSlide {
  title: string;
  content: string;
  slideNumber: number;
}

const colorThemes = [
  { id: "blue", name: "Professional Blue", bg: "#0A66C2", text: "#FFFFFF", accent: "#70B5F9" },
  { id: "dark", name: "Dark Mode", bg: "#1A1A2E", text: "#FFFFFF", accent: "#00D9FF" },
  { id: "gradient", name: "Gradient Purple", bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", text: "#FFFFFF", accent: "#FFD93D" },
  { id: "minimal", name: "Clean White", bg: "#FFFFFF", text: "#1A1A1A", accent: "#0A66C2" },
  { id: "coral", name: "Warm Coral", bg: "#FF6B6B", text: "#FFFFFF", accent: "#4ECDC4" },
  { id: "forest", name: "Forest Green", bg: "#2D5A27", text: "#FFFFFF", accent: "#90EE90" },
];

const LinkedInCarouselGenerator = () => {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideCount, setSlideCount] = useState([5]);
  const [selectedTheme, setSelectedTheme] = useState("blue");
  const [authorName, setAuthorName] = useState("");
  const [authorHandle, setAuthorHandle] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const extractTextFromPdf = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = "";
    
    for (let i = 1; i <= Math.min(pdf.numPages, 30); i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(" ") + "\n";
    }
    
    return text;
  };

  const handleFileSelected = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setFile(file);
    
    try {
      const text = await extractTextFromPdf(file);
      setExtractedText(text);
      toast({ title: "Document loaded!", description: `Extracted ${text.split(" ").length} words.` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to read document.", variant: "destructive" });
    }
  }, []);

  const generateCarousel = async () => {
    if (!extractedText) {
      toast({ title: "No content", description: "Please upload a document first.", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-document-intelligence", {
        body: {
          action: "linkedin-carousel",
          text: extractedText.slice(0, 10000),
          slideCount: slideCount[0]
        }
      });

      if (error) throw error;
      setSlides(data.slides);
      setCurrentSlide(0);
      toast({ title: "Carousel created!", description: `Generated ${data.slides.length} slides.` });
    } catch (error) {
      console.error("Generation error:", error);
      toast({ title: "Error", description: "Failed to generate carousel.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const getTheme = () => colorThemes.find(t => t.id === selectedTheme) || colorThemes[0];

  const downloadSlide = async (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const theme = getTheme();
    const slide = slides[index];

    // Canvas size for LinkedIn (1080x1080)
    canvas.width = 1080;
    canvas.height = 1080;

    // Background
    if (theme.bg.includes("gradient")) {
      const gradient = ctx.createLinearGradient(0, 0, 1080, 1080);
      gradient.addColorStop(0, "#667eea");
      gradient.addColorStop(1, "#764ba2");
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = theme.bg;
    }
    ctx.fillRect(0, 0, 1080, 1080);

    // Slide number
    ctx.fillStyle = theme.accent;
    ctx.font = "bold 48px Inter, sans-serif";
    ctx.fillText(`${index + 1}/${slides.length}`, 60, 80);

    // Title
    ctx.fillStyle = theme.text;
    ctx.font = "bold 72px Inter, sans-serif";
    const titleLines = wrapText(ctx, slide.title, 960);
    let y = 200;
    titleLines.forEach(line => {
      ctx.fillText(line, 60, y);
      y += 80;
    });

    // Content
    ctx.font = "400 42px Inter, sans-serif";
    const contentLines = wrapText(ctx, slide.content, 960);
    y += 40;
    contentLines.forEach(line => {
      ctx.fillText(line, 60, y);
      y += 56;
    });

    // Author (if provided)
    if (authorName) {
      ctx.fillStyle = theme.accent;
      ctx.font = "bold 36px Inter, sans-serif";
      ctx.fillText(authorName, 60, 1000);
      if (authorHandle) {
        ctx.font = "400 28px Inter, sans-serif";
        ctx.fillText(`@${authorHandle}`, 60, 1040);
      }
    }

    // Download
    const link = document.createElement("a");
    link.download = `slide-${index + 1}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const downloadAllSlides = async () => {
    for (let i = 0; i < slides.length; i++) {
      await downloadSlide(i);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    toast({ title: "Downloaded!", description: `${slides.length} slides saved.` });
  };

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    words.forEach(word => {
      const testLine = currentLine + word + " ";
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine.trim());
        currentLine = word + " ";
      } else {
        currentLine = testLine;
      }
    });
    lines.push(currentLine.trim());
    return lines;
  };

  const theme = getTheme();

  return (
    <>
      <SEOHead
        title="PDF to LinkedIn Carousel - Create Social Media Slides Free | Pine Tools Hub"
        description="Convert your PDF reports, articles, or presentations into stunning LinkedIn carousel posts. AI extracts key insights and creates ready-to-post slides."
        keywords="pdf to linkedin carousel, create linkedin carousel, document to social media, pdf to instagram carousel, content repurposing tool, linkedin post generator"
        canonical="https://pinetoolshub.com/linkedin-carousel-generator"
      />
      <ToolStructuredData
        toolName="LinkedIn Carousel Generator"
        toolDescription="AI-powered tool that transforms PDF documents into engaging LinkedIn carousel posts."
        toolUrl="https://pinetoolshub.com/linkedin-carousel-generator"
        category="PDF"
      />

      <div className="container mx-auto px-4 py-8">
        <ToolHero
          title="PDF to LinkedIn Carousel"
          description="Turn your documents into viral LinkedIn content. AI extracts key insights and creates beautiful, ready-to-post carousel slides."
          icon={<Linkedin className="h-6 w-6" />}
        />

        <canvas ref={canvasRef} className="hidden" />

        <div className="grid lg:grid-cols-2 gap-6 mt-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Upload Document
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FileUpload
                  accept={{ "application/pdf": [".pdf"], "text/plain": [".txt"] }}
                  maxSize={20 * 1024 * 1024}
                  onFilesSelected={handleFileSelected}
                />
                {file && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">{file.name}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Carousel Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Number of Slides: {slideCount[0]}
                  </label>
                  <Slider
                    value={slideCount}
                    onValueChange={setSlideCount}
                    min={3}
                    max={10}
                    step={1}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Color Theme</label>
                  <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {colorThemes.map(theme => (
                        <SelectItem key={theme.id} value={theme.id}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded"
                              style={{ background: theme.bg }}
                            />
                            {theme.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Your Name</label>
                    <Input
                      placeholder="John Doe"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Handle (optional)</label>
                    <Input
                      placeholder="johndoe"
                      value={authorHandle}
                      onChange={(e) => setAuthorHandle(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={generateCarousel} 
              disabled={isGenerating || !extractedText}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Carousel...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Carousel
                </>
              )}
            </Button>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            {slides.length === 0 ? (
              <Card className="h-full flex items-center justify-center min-h-[400px]">
                <CardContent className="text-center py-12">
                  <div className="p-4 bg-[#0A66C2]/10 rounded-full w-fit mx-auto mb-4">
                    <Linkedin className="h-8 w-8 text-[#0A66C2]" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Create LinkedIn Carousels</h3>
                  <p className="text-muted-foreground text-sm max-w-sm">
                    Upload a PDF or document and we'll transform it into engaging carousel slides.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Slide Preview */}
                <Card 
                  className="aspect-square relative overflow-hidden"
                  style={{ 
                    background: theme.bg,
                    color: theme.text
                  }}
                >
                  <CardContent className="p-8 h-full flex flex-col">
                    <div style={{ color: theme.accent }} className="font-bold text-lg mb-4">
                      {currentSlide + 1}/{slides.length}
                    </div>
                    <h3 className="text-2xl font-bold mb-4">
                      {slides[currentSlide]?.title}
                    </h3>
                    <p className="text-lg leading-relaxed flex-1">
                      {slides[currentSlide]?.content}
                    </p>
                    {authorName && (
                      <div className="mt-auto pt-4">
                        <p className="font-bold" style={{ color: theme.accent }}>
                          {authorName}
                        </p>
                        {authorHandle && (
                          <p className="text-sm opacity-80">@{authorHandle}</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                    disabled={currentSlide === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <div className="flex gap-1">
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentSlide(i)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          i === currentSlide ? "bg-primary w-4" : "bg-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
                    disabled={currentSlide === slides.length - 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* Download Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => downloadSlide(currentSlide)}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download This Slide
                  </Button>
                  <Button
                    onClick={downloadAllSlides}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download All ({slides.length})
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LinkedInCarouselGenerator;
