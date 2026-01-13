import { useState } from "react";
import { Link } from "react-router-dom";
import SEOHead from "@/components/seo/SEOHead";
import { WebsiteStructuredData } from "@/components/seo/StructuredData";
import ToolCard from "@/components/shared/ToolCard";
import CategorySlider from "@/components/shared/CategorySlider";
import {
  Merge,
  Scissors,
  FileDown,
  FileText,
  FileOutput,
  Image,
  FileImage,
  RotateCw,
  Stamp,
  Unlock,
  Lock,
  ImageIcon,
  Layers,
  ImageDown,
  Eraser,
  TreePine,
  Shield,
  Zap,
  Globe,
  Users,
  Clock,
  ArrowRight,
  FileX,
  Hash,
  Code,
  PenTool,
  Crop,
  FileSpreadsheet,
  Presentation,
  ScanLine,
  Eye,
  EyeOff,
  Wrench,
  GitCompare,
  FileCheck,
  Brain,
  FileUser,
  Headphones,
  Landmark,
  Scale,
  Linkedin,
  ShieldCheck,
  Sparkles,
  Palette,
  QrCode,
  ImagePlus,
  Video,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const pdfTools = [
  {
    title: "Merge PDF",
    description: "I Love PDF Merge - Combine multiple PDFs into one",
    icon: <Merge className="h-6 w-6" />,
    href: "/merge-pdf",
    color: "bg-red-500",
  },
  {
    title: "Split PDF",
    description: "I Love PDF Split - Separate pages into files",
    icon: <Scissors className="h-6 w-6" />,
    href: "/split-pdf",
    color: "bg-orange-500",
  },
  {
    title: "Compress PDF",
    description: "I Love PDF Compress - Reduce file size",
    icon: <FileDown className="h-6 w-6" />,
    href: "/compress-pdf",
    color: "bg-yellow-500",
  },
  {
    title: "PDF to Word",
    description: "Convert PDF to editable Word documents",
    icon: <FileText className="h-6 w-6" />,
    href: "/pdf-to-word",
    color: "bg-blue-500",
  },
  {
    title: "Word to PDF",
    description: "Convert Word documents to PDF format",
    icon: <FileOutput className="h-6 w-6" />,
    href: "/word-to-pdf",
    color: "bg-blue-600",
  },
  {
    title: "PDF to JPG",
    description: "Convert PDF pages to JPG images",
    icon: <Image className="h-6 w-6" />,
    href: "/pdf-to-jpg",
    color: "bg-green-500",
  },
  {
    title: "JPG to PDF",
    description: "Create PDF from JPG images",
    icon: <FileImage className="h-6 w-6" />,
    href: "/jpg-to-pdf",
    color: "bg-green-600",
  },
  {
    title: "PDF to PNG",
    description: "Convert PDF pages to PNG images",
    icon: <ImageIcon className="h-6 w-6" />,
    href: "/pdf-to-png",
    color: "bg-teal-500",
  },
  {
    title: "PNG to PDF",
    description: "Create PDF from PNG images",
    icon: <FileImage className="h-6 w-6" />,
    href: "/png-to-pdf",
    color: "bg-teal-600",
  },
  {
    title: "PDF to Excel",
    description: "Convert PDF tables to Excel spreadsheets",
    icon: <FileSpreadsheet className="h-6 w-6" />,
    href: "/pdf-to-excel",
    color: "bg-emerald-500",
  },
  {
    title: "Excel to PDF",
    description: "Convert Excel spreadsheets to PDF",
    icon: <FileSpreadsheet className="h-6 w-6" />,
    href: "/excel-to-pdf",
    color: "bg-emerald-600",
  },
  {
    title: "PDF to PowerPoint",
    description: "Convert PDF to PowerPoint slides",
    icon: <Presentation className="h-6 w-6" />,
    href: "/pdf-to-powerpoint",
    color: "bg-orange-600",
  },
  {
    title: "PowerPoint to PDF",
    description: "Convert PowerPoint presentations to PDF",
    icon: <Presentation className="h-6 w-6" />,
    href: "/powerpoint-to-pdf",
    color: "bg-orange-700",
  },
  {
    title: "Rotate PDF",
    description: "Rotate PDF pages to any angle",
    icon: <RotateCw className="h-6 w-6" />,
    href: "/rotate-pdf",
    color: "bg-purple-500",
  },
  {
    title: "Add Watermark",
    description: "Add text watermarks to your PDF",
    icon: <Stamp className="h-6 w-6" />,
    href: "/add-watermark",
    color: "bg-pink-500",
  },
  {
    title: "Unlock PDF",
    description: "Remove password protection from PDF",
    icon: <Unlock className="h-6 w-6" />,
    href: "/unlock-pdf",
    color: "bg-amber-500",
  },
  {
    title: "Protect PDF",
    description: "Add password protection to PDF",
    icon: <Lock className="h-6 w-6" />,
    href: "/protect-pdf",
    color: "bg-rose-500",
  },
  {
    title: "Organize PDF",
    description: "Rearrange, delete, or duplicate pages",
    icon: <Layers className="h-6 w-6" />,
    href: "/organize-pdf",
    color: "bg-indigo-500",
  },
  {
    title: "Extract Pages",
    description: "Extract specific pages from PDF",
    icon: <FileX className="h-6 w-6" />,
    href: "/extract-pages",
    color: "bg-cyan-600",
  },
  {
    title: "Add Page Numbers",
    description: "Add page numbers to your PDF",
    icon: <Hash className="h-6 w-6" />,
    href: "/add-page-numbers",
    color: "bg-lime-500",
  },
  {
    title: "HTML to PDF",
    description: "Convert HTML content to PDF format",
    icon: <Code className="h-6 w-6" />,
    href: "/html-to-pdf",
    color: "bg-sky-500",
  },
  {
    title: "Sign PDF",
    description: "Add your signature to PDF documents",
    icon: <PenTool className="h-6 w-6" />,
    href: "/sign-pdf",
    color: "bg-violet-500",
  },
  {
    title: "Crop PDF",
    description: "Crop and trim PDF page margins",
    icon: <Crop className="h-6 w-6" />,
    href: "/crop-pdf",
    color: "bg-fuchsia-500",
  },
  {
    title: "OCR PDF",
    description: "Extract text from scanned PDFs",
    icon: <ScanLine className="h-6 w-6" />,
    href: "/ocr-pdf",
    color: "bg-amber-600",
  },
  {
    title: "Repair PDF",
    description: "Fix corrupted or damaged PDF files",
    icon: <Wrench className="h-6 w-6" />,
    href: "/repair-pdf",
    color: "bg-red-600",
  },
  {
    title: "Compare PDF",
    description: "Compare two PDFs side by side",
    icon: <GitCompare className="h-6 w-6" />,
    href: "/compare-pdf",
    color: "bg-blue-700",
  },
  {
    title: "Redact PDF",
    description: "Black out sensitive information",
    icon: <EyeOff className="h-6 w-6" />,
    href: "/redact-pdf",
    color: "bg-gray-700",
  },
];

const imageTools = [
  {
    title: "Compress Image",
    description: "Reduce image file size for web",
    icon: <ImageDown className="h-6 w-6" />,
    href: "/compress-image",
    color: "bg-cyan-500",
  },
  {
    title: "Remove Background",
    description: "Remove image background automatically",
    icon: <Eraser className="h-6 w-6" />,
    href: "/remove-background",
    color: "bg-violet-500",
  },
];

const textTools = [
  { title: "Word Counter", description: "Count words, characters, sentences instantly", icon: <FileText className="h-6 w-6" />, href: "/word-counter", color: "bg-blue-500" },
  { title: "Lorem Ipsum", description: "Generate placeholder dummy text", icon: <FileText className="h-6 w-6" />, href: "/lorem-ipsum", color: "bg-emerald-500" },
  { title: "Case Converter", description: "UPPERCASE, lowercase, Title Case & more", icon: <FileText className="h-6 w-6" />, href: "/case-converter", color: "bg-violet-500" },
  { title: "Text Compare", description: "Find differences between two texts", icon: <FileText className="h-6 w-6" />, href: "/text-compare", color: "bg-amber-500" },
];

const calculatorTools = [
  { title: "Age Calculator", description: "Calculate exact age from birth date", icon: <Clock className="h-6 w-6" />, href: "/age-calculator", color: "bg-pink-500" },
  { title: "Percentage Calculator", description: "Calculate percentages instantly", icon: <FileText className="h-6 w-6" />, href: "/percentage-calculator", color: "bg-green-500" },
  { title: "BMI Calculator", description: "Calculate Body Mass Index", icon: <FileText className="h-6 w-6" />, href: "/bmi-calculator", color: "bg-cyan-500" },
  { title: "QR Code Generator", description: "Create QR codes for URL, WiFi, vCard", icon: <FileText className="h-6 w-6" />, href: "/qr-code-generator", color: "bg-indigo-500" },
];

// AI Tool Categories
const aiCategories = [
  { id: "all", label: "All Tools" },
  { id: "document", label: "Document AI" },
  { id: "visual", label: "Visual Tools" },
  { id: "career", label: "Career Tools" },
  { id: "content", label: "Content Creation" },
  { id: "analysis", label: "Analysis" },
];

const aiTools = [
  // Document AI
  { title: "ATS Resume Optimizer", description: "Beat the bots - optimize resume for ATS", icon: <FileUser className="h-6 w-6" />, href: "/resume-optimizer", color: "bg-gradient-to-r from-violet-500 to-purple-500", category: "career" },
  { title: "PDF to Podcast", description: "Convert documents to audio conversations", icon: <Headphones className="h-6 w-6" />, href: "/pdf-to-podcast", color: "bg-gradient-to-r from-pink-500 to-rose-500", category: "content" },
  { title: "Bank Statement Extractor", description: "Extract transactions to Excel", icon: <Landmark className="h-6 w-6" />, href: "/bank-statement-extractor", color: "bg-gradient-to-r from-emerald-500 to-teal-500", category: "document" },
  { title: "Contract Risk Scanner", description: "AI legal contract analyzer", icon: <Scale className="h-6 w-6" />, href: "/contract-risk-scanner", color: "bg-gradient-to-r from-amber-500 to-orange-500", category: "analysis" },
  { title: "LinkedIn Carousel", description: "PDF to social media slides", icon: <Linkedin className="h-6 w-6" />, href: "/linkedin-carousel-generator", color: "bg-gradient-to-r from-blue-500 to-cyan-500", category: "content" },
  { title: "Smart PII Redactor", description: "Auto-detect & redact sensitive info", icon: <ShieldCheck className="h-6 w-6" />, href: "/smart-redactor", color: "bg-gradient-to-r from-red-500 to-rose-500", category: "document" },
  { title: "Knowledge Vault", description: "Chat with multiple documents", icon: <Brain className="h-6 w-6" />, href: "/knowledge-vault", color: "bg-gradient-to-r from-indigo-500 to-violet-500", category: "document" },
  { title: "Accessibility Checker", description: "WCAG compliance scanner for PDFs", icon: <FileCheck className="h-6 w-6" />, href: "/pdf-accessibility-checker", color: "bg-gradient-to-r from-cyan-500 to-blue-500", category: "analysis" },
  { title: "Document Health Score", description: "Quality score for your documents", icon: <FileCheck className="h-6 w-6" />, href: "/document-health-score", color: "bg-gradient-to-r from-green-500 to-emerald-500", category: "analysis" },
  { title: "Web to Knowledge", description: "URL to notes, flashcards, mindmaps", icon: <Globe className="h-6 w-6" />, href: "/web-to-knowledge", color: "bg-gradient-to-r from-purple-500 to-pink-500", category: "document" },
  { title: "PDF Form Builder", description: "Convert static PDF to web form", icon: <FileText className="h-6 w-6" />, href: "/pdf-form-builder", color: "bg-gradient-to-r from-orange-500 to-red-500", category: "document" },
  { title: "Batch Workflow Builder", description: "Automate PDF processing pipelines", icon: <Layers className="h-6 w-6" />, href: "/batch-workflow-builder", color: "bg-gradient-to-r from-slate-500 to-gray-600", category: "document" },
  // Visual Tools
  { title: "Photo Enhancer", description: "AI upscale & enhance images", icon: <ImagePlus className="h-6 w-6" />, href: "/photo-enhancer", color: "bg-gradient-to-r from-fuchsia-500 to-pink-500", category: "visual" },
  { title: "QR Code Pro", description: "Custom branded QR codes", icon: <QrCode className="h-6 w-6" />, href: "/qr-code-pro", color: "bg-gradient-to-r from-teal-500 to-cyan-500", category: "visual" },
  { title: "Thumbnail Generator", description: "AI CTR-optimized thumbnails", icon: <Wand2 className="h-6 w-6" />, href: "/thumbnail-generator", color: "bg-gradient-to-r from-rose-500 to-orange-500", category: "visual" },
  { title: "Subtitle Generator", description: "Auto-generate video subtitles", icon: <Video className="h-6 w-6" />, href: "/subtitle-generator", color: "bg-gradient-to-r from-blue-600 to-indigo-600", category: "content" },
  { title: "Color Palette Generator", description: "AI-powered color schemes", icon: <Palette className="h-6 w-6" />, href: "/color-palette-generator", color: "bg-gradient-to-r from-violet-500 to-fuchsia-500", category: "visual" },
];

const stats = [
  { label: "Files Processed", value: "10M+", icon: FileText },
  { label: "Happy Users", value: "500K+", icon: Users },
  { label: "Average Processing", value: "<3 sec", icon: Clock },
];

const Index = () => {
  const [selectedAICategory, setSelectedAICategory] = useState("all");

  const filteredAITools = selectedAICategory === "all" 
    ? aiTools 
    : aiTools.filter(tool => tool.category === selectedAICategory);

  return (
    <>
      <SEOHead
        title="Pine Tools Hub - Free Online PDF & Image Tools | I Love PDF Alternative"
        description="Free online PDF and image tools. Merge, split, compress, convert PDFs and images. I Love PDF style tools with complete privacy - all processing happens in your browser. No registration required."
        keywords="i love pdf, free pdf tools, online pdf converter, merge pdf, split pdf, compress pdf, pdf to word, image compressor, remove background, pdf tools online free, ilovepdf alternative, pdf editor free, convert pdf online"
        canonical="https://pinetoolshub.com"
      />
      <WebsiteStructuredData />

      {/* Hero Section - Visible on ALL devices with pine tree icon */}
      <section className="py-6 md:py-12 bg-gradient-to-b from-primary/5 via-primary/3 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="container mx-auto px-4 text-center relative">
          {/* Pine Tree Icon - Always visible */}
          <div className="flex justify-center mb-4">
            <div className="p-3 md:p-4 bg-primary/10 rounded-full">
              <TreePine className="h-10 w-10 md:h-14 lg:h-16 text-primary" />
            </div>
          </div>
          
          <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 tracking-tight">
            Free Online PDF & Image Tools
          </h1>
          <p className="text-sm md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4 md:mb-6 px-2">
            The best <strong className="text-primary">I Love PDF alternative</strong> with complete privacy. 
            Merge, split, compress, convert PDFs and images - all processing happens directly in your browser.
          </p>
          
          {/* Trust Badges - Visible on all devices */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-4 md:mb-6">
            <div className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1 md:py-1.5 bg-card border border-border rounded-full shadow-sm text-xs md:text-sm">
              <Shield className="h-3 w-3 md:h-4 md:w-4 text-primary" />
              <span className="font-medium">100% Private</span>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1 md:py-1.5 bg-card border border-border rounded-full shadow-sm text-xs md:text-sm">
              <Zap className="h-3 w-3 md:h-4 md:w-4 text-primary" />
              <span className="font-medium">Instant Processing</span>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1 md:py-1.5 bg-card border border-border rounded-full shadow-sm text-xs md:text-sm">
              <Globe className="h-3 w-3 md:h-4 md:w-4 text-primary" />
              <span className="font-medium">Works Offline</span>
            </div>
          </div>
          
          {/* Popular Tools Quick Access */}
          <div className="flex flex-wrap justify-center gap-2">
            <Button asChild size="sm" className="md:size-default">
              <Link to="/merge-pdf">Merge PDF</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="md:size-default">
              <Link to="/compress-pdf">Compress PDF</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="md:size-default">
              <Link to="/pdf-to-word">PDF to Word</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Indicators / Stats */}
      <section className="py-3 md:py-4 border-y border-border bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-2 md:gap-4 max-w-2xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-lg md:text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-[10px] md:text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Intelligence Tools Section - TOP PRIORITY */}
      <section className="py-6 md:py-10 bg-gradient-to-b from-primary/5 to-background" id="ai-tools">
        <div className="container mx-auto px-4">
          <div className="text-center mb-4 md:mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-primary text-sm font-medium mb-3">
              <Sparkles className="h-4 w-4" />
              AI-Powered
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">AI Intelligence Tools</h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              Next-generation document intelligence. Extract data, analyze contracts, generate content with AI.
            </p>
          </div>

          {/* Category Slider */}
          <div className="flex justify-center mb-6 md:mb-8">
            <CategorySlider
              categories={aiCategories}
              selectedCategory={selectedAICategory}
              onCategoryChange={setSelectedAICategory}
            />
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 max-w-5xl mx-auto">
            {filteredAITools.map((tool) => (
              <Link
                key={tool.href}
                to={tool.href}
                className="group p-4 md:p-5 bg-card border border-border rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary/50"
              >
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl ${tool.color} flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}>
                  {tool.icon}
                </div>
                <h3 className="font-semibold text-sm md:text-base mb-1">{tool.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">{tool.description}</p>
              </Link>
            ))}
          </div>

          {/* Show message when no tools in category */}
          {filteredAITools.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No tools found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* PDF Tools Section */}
      <section className="py-4 md:py-10" id="pdf-tools">
        <div className="container mx-auto px-4">
          <div className="text-center mb-4 md:mb-8">
            <h2 className="text-xl md:text-3xl font-bold mb-2">PDF Tools</h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto hidden md:block">
              Complete suite of <strong>I Love PDF style tools</strong> for all your PDF needs. 
              Merge, split, compress, convert, and more - completely free and private.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-3">
            {pdfTools.map((tool) => (
              <ToolCard key={tool.href} {...tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Image Tools Section */}
      <section className="py-4 md:py-10 bg-muted/50" id="image-tools">
        <div className="container mx-auto px-4">
          <div className="text-center mb-4 md:mb-8">
            <h2 className="text-xl md:text-3xl font-bold mb-2">Image Tools</h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto hidden md:block">
              Powerful image tools to compress and edit your images. 
              <strong> I Love Image</strong> tools for quick, browser-based processing.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 max-w-3xl mx-auto">
            {imageTools.map((tool) => (
              <ToolCard key={tool.href} {...tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Text Tools Section */}
      <section className="py-4 md:py-10" id="text-tools">
        <div className="container mx-auto px-4">
          <div className="text-center mb-4 md:mb-8">
            <h2 className="text-xl md:text-3xl font-bold mb-2">Text Tools</h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto hidden md:block">
              Free online text utilities - count words, generate lorem ipsum, convert case, and compare texts instantly.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 max-w-4xl mx-auto">
            {textTools.map((tool) => (
              <ToolCard key={tool.href} {...tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Calculator & Generator Tools Section */}
      <section className="py-4 md:py-10 bg-muted/50" id="calculator-tools">
        <div className="container mx-auto px-4">
          <div className="text-center mb-4 md:mb-8">
            <h2 className="text-xl md:text-3xl font-bold mb-2">Calculators & Generators</h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto hidden md:block">
              Essential calculators and generators - age calculator, BMI calculator, percentage calculator, and QR code generator.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 max-w-4xl mx-auto">
            {calculatorTools.map((tool) => (
              <ToolCard key={tool.href} {...tool} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Compact */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">How Pine Tools Hub Works</h2>
            <p className="text-muted-foreground">Simple three-step process for all your document needs</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { step: "1", title: "Upload Your File", desc: "Drag and drop or click to upload your PDF or image file" },
              { step: "2", title: "Process Instantly", desc: "Your file is processed right in your browser - no uploads to servers" },
              { step: "3", title: "Download Result", desc: "Get your processed file instantly with one click" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground text-lg font-bold flex items-center justify-center mx-auto mb-3">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Why Choose Pine Tools Hub?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The best <strong>I Love PDF alternative</strong> with unmatched privacy and ease of use.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-5 bg-card border border-border rounded-xl">
              <div className="inline-flex p-3 bg-primary/10 rounded-full mb-3">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Complete Privacy</h3>
              <p className="text-sm text-muted-foreground">
                All processing happens in your browser. Your files never leave your device.
              </p>
            </div>
            <div className="text-center p-5 bg-card border border-border rounded-xl">
              <div className="inline-flex p-3 bg-primary/10 rounded-full mb-3">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground">
                No upload queues, no server processing. Start instantly in your browser.
              </p>
            </div>
            <div className="text-center p-5 bg-card border border-border rounded-xl">
              <div className="inline-flex p-3 bg-primary/10 rounded-full mb-3">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Works Anywhere</h3>
              <p className="text-sm text-muted-foreground">
                Use on any device with a modern browser. No software to install.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">PDF Tips & Tutorials</h2>
            <p className="text-muted-foreground">Learn how to work more efficiently with PDF files</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <Link 
              to="/blog/how-to-merge-pdf-files-free" 
              className="p-5 bg-card border border-border rounded-xl hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <h3 className="font-semibold mb-2">How to Merge PDF Files for Free</h3>
              <p className="text-sm text-muted-foreground mb-3">Complete guide to combining PDFs</p>
              <span className="text-primary text-sm font-medium flex items-center gap-1">
                Read More <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
            <Link 
              to="/blog/how-to-compress-pdf-files-free" 
              className="p-5 bg-card border border-border rounded-xl hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <h3 className="font-semibold mb-2">Compress PDF Without Losing Quality</h3>
              <p className="text-sm text-muted-foreground mb-3">Professional compression tips</p>
              <span className="text-primary text-sm font-medium flex items-center gap-1">
                Read More <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
            <Link 
              to="/blog/pdf-to-word-converter-guide" 
              className="p-5 bg-card border border-border rounded-xl hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <h3 className="font-semibold mb-2">PDF to Word Conversion Tips</h3>
              <p className="text-sm text-muted-foreground mb-3">Get perfect conversion results</p>
              <span className="text-primary text-sm font-medium flex items-center gap-1">
                Read More <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
          <div className="text-center mt-6">
            <Button asChild variant="outline">
              <Link to="/blog">View All Articles <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-10 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="prose prose-slate dark:prose-invert max-w-4xl mx-auto">
            <h2>Your Complete Online PDF & Image Toolkit</h2>
            <p>
              Welcome to <strong>Pine Tools Hub</strong> - your one-stop destination for free online PDF and image tools. 
              We've created a comprehensive suite of <strong>I Love PDF style tools</strong> that prioritize your privacy 
              while delivering professional-quality results.
            </p>
            <p>
              Whether you need to <Link to="/merge-pdf">merge PDF files</Link> for a presentation, 
              <Link to="/compress-image"> compress images</Link> for your website, 
              convert documents between formats, or remove backgrounds from product photos, 
              Pine Tools Hub has you covered.
            </p>
            
            <h3>I Love PDF Alternative with Enhanced Privacy</h3>
            <p>
              Unlike traditional online PDF tools that upload your files to servers, Pine Tools Hub 
              processes everything directly in your web browser. Your sensitive documents never leave your device. 
              It's the privacy you deserve from an <strong>I Love PDF alternative</strong>.
            </p>
            
            <h3>Popular PDF Tools</h3>
            <p>
              Our most-used tools include <Link to="/merge-pdf">Merge PDF</Link> for combining multiple documents, 
              <Link to="/compress-pdf"> Compress PDF</Link> for reducing file sizes, 
              <Link to="/pdf-to-word"> PDF to Word</Link> for converting to editable documents,
              <Link to="/sign-pdf"> Sign PDF</Link> for adding signatures, and
              <Link to="/crop-pdf"> Crop PDF</Link> for trimming margins.
            </p>
            
            <h3>Trusted by Professionals Worldwide</h3>
            <p>
              Pine Tools Hub is trusted by millions of users worldwide for document management. 
              Whether you're a student, professional, or business owner, our tools help you 
              work more efficiently with PDFs and images.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;