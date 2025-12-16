import { Link } from "react-router-dom";
import SEOHead from "@/components/seo/SEOHead";
import ToolCard from "@/components/shared/ToolCard";
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
} from "lucide-react";

const pdfTools = [
  {
    title: "Merge PDF",
    description: "Combine multiple PDF files into one document",
    icon: <Merge className="h-6 w-6" />,
    href: "/merge-pdf",
    color: "bg-red-500",
  },
  {
    title: "Split PDF",
    description: "Separate PDF pages into multiple files",
    icon: <Scissors className="h-6 w-6" />,
    href: "/split-pdf",
    color: "bg-orange-500",
  },
  {
    title: "Compress PDF",
    description: "Reduce PDF file size without losing quality",
    icon: <FileDown className="h-6 w-6" />,
    href: "/compress-pdf",
    color: "bg-yellow-500",
  },
  {
    title: "PDF to Word",
    description: "Convert PDF files to editable Word documents",
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

const Index = () => {
  return (
    <>
      <SEOHead
        title="Pine Tools Hub - Free Online PDF & Image Tools | I Love PDF Alternative"
        description="Free online PDF and image tools. Merge, split, compress, convert PDFs and images. I Love PDF style tools with complete privacy - all processing happens in your browser. No registration required."
        keywords="i love pdf, free pdf tools, online pdf converter, merge pdf, split pdf, compress pdf, pdf to word, image compressor, remove background, pdf tools online free"
        canonical="https://pinetoolshub.com"
      />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-full">
              <TreePine className="h-16 w-16 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Free Online PDF & Image Tools
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            I Love PDF style tools with complete privacy. Merge, split, compress, convert PDFs and images - all processing happens directly in your browser. No uploads, no registration, 100% free.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">100% Private</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
              <Zap className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Instant Processing</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
              <Globe className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Works Offline</span>
            </div>
          </div>
        </div>
      </section>

      {/* PDF Tools Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">PDF Tools</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Complete suite of I Love PDF style tools for all your PDF needs. Merge, split, compress, convert, and more - completely free and private.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {pdfTools.map((tool) => (
              <ToolCard key={tool.href} {...tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Image Tools Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Image Tools</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powerful image tools to compress and edit your images. I Love Image tools for quick, browser-based processing.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {imageTools.map((tool) => (
              <ToolCard key={tool.href} {...tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Pine Tools Hub?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The best I Love PDF alternative with unmatched privacy and ease of use.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Complete Privacy</h3>
              <p className="text-muted-foreground">
                All processing happens in your browser. Your files never leave your device - we can't see them even if we wanted to.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground">
                No upload queues, no server processing time. Start working with your files instantly, right in your browser.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Works Anywhere</h3>
              <p className="text-muted-foreground">
                Use on any device with a modern browser - Windows, Mac, Linux, iPhone, Android. No software to install.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="prose prose-slate dark:prose-invert max-w-4xl mx-auto">
            <h2>Your Complete Online PDF & Image Toolkit</h2>
            <p>
              Welcome to Pine Tools Hub - your one-stop destination for free online PDF and image tools. We've created a comprehensive suite of I Love PDF style tools that prioritize your privacy while delivering professional-quality results.
            </p>
            <p>
              Whether you need to merge PDF files for a presentation, compress images for your website, convert documents between formats, or remove backgrounds from product photos, Pine Tools Hub has you covered. Our tools are designed to be intuitive and efficient, requiring no technical knowledge to use.
            </p>
            
            <h3>I Love PDF Alternative with Enhanced Privacy</h3>
            <p>
              Unlike traditional online PDF tools that upload your files to servers, Pine Tools Hub processes everything directly in your web browser. This innovative approach means your sensitive documents - contracts, financial statements, personal photos - never leave your device. It's the privacy you deserve from an I Love PDF alternative.
            </p>
            
            <h3>Popular PDF Tools</h3>
            <p>
              Our most-used tools include <Link to="/merge-pdf" className="text-primary hover:underline">Merge PDF</Link> for combining multiple documents, <Link to="/compress-pdf" className="text-primary hover:underline">Compress PDF</Link> for reducing file sizes, and <Link to="/pdf-to-word" className="text-primary hover:underline">PDF to Word</Link> for converting to editable documents. Each tool is optimized for speed and quality, giving you professional results in seconds.
            </p>
            
            <h3>Image Processing Made Easy</h3>
            <p>
              Beyond PDFs, we offer powerful image tools including <Link to="/compress-image" className="text-primary hover:underline">Image Compress</Link> for web optimization and <Link to="/remove-background" className="text-primary hover:underline">Remove Background</Link> for creating transparent images. These tools are perfect for e-commerce, social media, and web design projects.
            </p>
            
            <h3>Free Forever, No Registration Required</h3>
            <p>
              Pine Tools Hub is completely free to use with no registration required. We support our service through non-intrusive advertising, allowing us to provide professional-quality tools without charging users. Start using our tools right now - no sign-up, no credit card, no limits.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
