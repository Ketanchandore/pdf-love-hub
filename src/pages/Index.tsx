import { Link } from "react-router-dom";
import SEOHead from "@/components/seo/SEOHead";
import { WebsiteStructuredData } from "@/components/seo/StructuredData";
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
  Users,
  Clock,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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

const stats = [
  { label: "Files Processed", value: "10M+", icon: FileText },
  { label: "Happy Users", value: "500K+", icon: Users },
  { label: "Average Processing", value: "<3 sec", icon: Clock },
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
      <WebsiteStructuredData />

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 via-primary/3 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="container mx-auto px-4 text-center relative">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-full animate-pulse">
              <TreePine className="h-16 w-16 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
            Free Online PDF & Image Tools
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
            The best <strong>I Love PDF alternative</strong> with complete privacy. 
            Merge, split, compress, convert PDFs and images - all processing happens directly in your browser.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full shadow-sm">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">100% Private</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full shadow-sm">
              <Zap className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Instant Processing</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full shadow-sm">
              <Globe className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Works Offline</span>
            </div>
          </div>
          
          {/* Popular Tools Quick Access */}
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/merge-pdf">Merge PDF</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/compress-pdf">Compress PDF</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/pdf-to-word">PDF to Word</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-8 border-y border-border bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PDF Tools Section */}
      <section className="py-16" id="pdf-tools">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">PDF Tools</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Complete suite of <strong>I Love PDF style tools</strong> for all your PDF needs. 
              Merge, split, compress, convert, and more - completely free and private.
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
      <section className="py-16 bg-muted/50" id="image-tools">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Image Tools</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful image tools to compress and edit your images. 
              <strong> I Love Image</strong> tools for quick, browser-based processing.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {imageTools.map((tool) => (
              <ToolCard key={tool.href} {...tool} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Pine Tools Hub Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple three-step process for all your document needs
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "1", title: "Upload Your File", desc: "Drag and drop or click to upload your PDF or image file" },
              { step: "2", title: "Process Instantly", desc: "Your file is processed right in your browser - no uploads to servers" },
              { step: "3", title: "Download Result", desc: "Get your processed file instantly with one click" },
            ].map((item) => (
              <div key={item.step} className="text-center relative">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground text-xl font-bold flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Pine Tools Hub?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The best <strong>I Love PDF alternative</strong> with unmatched privacy and ease of use.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-card border border-border rounded-xl">
              <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Complete Privacy</h3>
              <p className="text-muted-foreground">
                All processing happens in your browser. Your files never leave your device - 
                we can't see them even if we wanted to.
              </p>
            </div>
            <div className="text-center p-6 bg-card border border-border rounded-xl">
              <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground">
                No upload queues, no server processing time. Start working with your files 
                instantly, right in your browser.
              </p>
            </div>
            <div className="text-center p-6 bg-card border border-border rounded-xl">
              <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Works Anywhere</h3>
              <p className="text-muted-foreground">
                Use on any device with a modern browser - Windows, Mac, Linux, iPhone, Android. 
                No software to install.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">PDF Tips & Tutorials</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Learn how to work more efficiently with PDF files and images
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Link 
              to="/blog/how-to-merge-pdf-files-free" 
              className="p-6 bg-card border border-border rounded-xl hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <h3 className="font-semibold mb-2">How to Merge PDF Files for Free</h3>
              <p className="text-sm text-muted-foreground mb-4">Complete guide to combining PDFs</p>
              <span className="text-primary text-sm font-medium flex items-center gap-1">
                Read More <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
            <Link 
              to="/blog" 
              className="p-6 bg-card border border-border rounded-xl hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <h3 className="font-semibold mb-2">Compress PDF Without Losing Quality</h3>
              <p className="text-sm text-muted-foreground mb-4">Professional compression tips</p>
              <span className="text-primary text-sm font-medium flex items-center gap-1">
                Read More <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
            <Link 
              to="/blog" 
              className="p-6 bg-card border border-border rounded-xl hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <h3 className="font-semibold mb-2">PDF to Word Conversion Tips</h3>
              <p className="text-sm text-muted-foreground mb-4">Get perfect conversion results</p>
              <span className="text-primary text-sm font-medium flex items-center gap-1">
                Read More <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link to="/blog">View All Articles <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-16 bg-muted/50">
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
              Pine Tools Hub has you covered. Our tools are designed to be intuitive and efficient, 
              requiring no technical knowledge to use.
            </p>
            
            <h3>I Love PDF Alternative with Enhanced Privacy</h3>
            <p>
              Unlike traditional online PDF tools that upload your files to servers, Pine Tools Hub 
              processes everything directly in your web browser. This innovative approach means your 
              sensitive documents - contracts, financial statements, personal photos - never leave your device. 
              It's the privacy you deserve from an <strong>I Love PDF alternative</strong>.
            </p>
            
            <h3>Popular PDF Tools</h3>
            <p>
              Our most-used tools include <Link to="/merge-pdf">Merge PDF</Link> for combining multiple documents, 
              <Link to="/compress-pdf"> Compress PDF</Link> for reducing file sizes, and 
              <Link to="/pdf-to-word"> PDF to Word</Link> for converting to editable documents. 
              Each tool is optimized for speed and quality, giving you professional results in seconds.
            </p>
            
            <h3>Image Processing Made Easy</h3>
            <p>
              Beyond PDFs, we offer powerful image tools including 
              <Link to="/compress-image"> Image Compress</Link> for web optimization and 
              <Link to="/remove-background"> Remove Background</Link> for creating transparent images. 
              These tools are perfect for e-commerce, social media, and web design projects.
            </p>
            
            <h3>Trusted by Professionals Worldwide</h3>
            <p>
              Pine Tools Hub is used by students, professionals, and businesses in over 150 countries. 
              Our commitment to privacy, speed, and reliability has made us a trusted choice for 
              document processing needs. Join millions of users who trust Pine Tools Hub for their 
              PDF and image editing tasks.
            </p>
            
            <h3>Free Forever, No Registration Required</h3>
            <p>
              Pine Tools Hub is completely free to use with no registration required. We support our 
              service through non-intrusive advertising, allowing us to provide professional-quality 
              tools without charging users. Start using our tools right now - no sign-up, no credit card, no limits.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Choose a tool above or explore our most popular options below
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/merge-pdf">Merge PDF</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/compress-pdf">Compress PDF</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/pdf-to-word">PDF to Word</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/compress-image">Compress Image</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
