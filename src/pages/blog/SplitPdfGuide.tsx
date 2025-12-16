import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Scissors, CheckCircle, Lightbulb, Zap, Shield, Clock } from "lucide-react";
import { BreadcrumbStructuredData } from "@/components/seo/StructuredData";

const SplitPdfGuide = () => {
  const breadcrumbItems = [
    { name: "Home", url: "https://pinetoolshub.com/" },
    { name: "Blog", url: "https://pinetoolshub.com/blog" },
    { name: "Split PDF Guide", url: "https://pinetoolshub.com/blog/how-to-split-pdf-files-free" }
  ];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "How to Split PDF Files Free - Complete Guide 2025",
    "description": "Learn how to split PDF files into separate pages or sections for free. Step-by-step guide to divide large PDFs using Pine Tools Hub.",
    "image": "https://pinetoolshub.com/og-split-pdf.png",
    "author": {
      "@type": "Organization",
      "name": "Pine Tools Hub"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Pine Tools Hub",
      "logo": {
        "@type": "ImageObject",
        "url": "https://pinetoolshub.com/logo.png"
      }
    },
    "datePublished": "2024-12-15",
    "dateModified": "2024-12-16"
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Split PDF Files Free Online",
    "description": "Divide large PDF files into smaller documents using Pine Tools Hub's free PDF splitter",
    "totalTime": "PT2M",
    "tool": {
      "@type": "HowToTool",
      "name": "Pine Tools Hub PDF Splitter"
    },
    "step": [
      {
        "@type": "HowToStep",
        "name": "Open PDF Splitter",
        "text": "Navigate to Pine Tools Hub's Split PDF tool",
        "url": "https://pinetoolshub.com/split-pdf"
      },
      {
        "@type": "HowToStep",
        "name": "Upload PDF",
        "text": "Upload the PDF file you want to split"
      },
      {
        "@type": "HowToStep",
        "name": "Choose Split Method",
        "text": "Select how to split: by page range or extract all pages"
      },
      {
        "@type": "HowToStep",
        "name": "Download Split PDFs",
        "text": "Download your split PDF files"
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>How to Split PDF Files Free - Complete Guide 2025 | Pine Tools Hub</title>
        <meta name="description" content="Learn how to split PDF files into separate pages for free. Our guide shows how to divide large PDFs into smaller documents in seconds." />
        <meta name="keywords" content="split pdf, divide pdf, i love pdf split, separate pdf pages, extract pdf pages, how to split pdf, pdf splitter online, split pdf free" />
        <link rel="canonical" href="https://pinetoolshub.com/blog/how-to-split-pdf-files-free" />
        <meta property="og:title" content="How to Split PDF Files Free - Complete Guide 2025" />
        <meta property="og:description" content="Step-by-step guide to split PDF files. Divide large PDFs into smaller documents instantly." />
        <meta property="og:url" content="https://pinetoolshub.com/blog/how-to-split-pdf-files-free" />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
      </Helmet>

      <BreadcrumbStructuredData items={breadcrumbItems} />

      <article className="py-12">
        <div className="container max-w-4xl mx-auto px-4">
          {/* Breadcrumb Navigation */}
          <nav className="mb-8 text-sm" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><Link to="/" className="text-muted-foreground hover:text-primary">Home</Link></li>
              <li className="text-muted-foreground">/</li>
              <li><Link to="/blog" className="text-muted-foreground hover:text-primary">Blog</Link></li>
              <li className="text-muted-foreground">/</li>
              <li className="text-foreground font-medium">Split PDF Guide</li>
            </ol>
          </nav>

          {/* Article Header */}
          <header className="mb-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <Scissors className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              How to Split PDF Files Free - Complete Guide 2025
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Divide large PDF documents into smaller files or extract specific pages. Our free I Love PDF Split tool makes it simple and secure.
            </p>
            <div className="flex items-center justify-center gap-4 mt-6 text-sm text-muted-foreground">
              <span>Updated: December 16, 2024</span>
              <span>•</span>
              <span>6 min read</span>
            </div>
          </header>

          {/* Quick Action CTA */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-12 text-center">
            <h2 className="text-xl font-semibold mb-2">Need to Split a PDF Right Now?</h2>
            <p className="text-muted-foreground mb-4">Jump to our free tool and split your PDF instantly!</p>
            <Link
              to="/split-pdf"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              <Scissors className="mr-2 h-5 w-5" />
              Split PDF Free Now
            </Link>
          </div>

          {/* Main Content */}
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h2>Why Split PDF Files?</h2>
            <p>
              Large PDF documents can be unwieldy to share, navigate, and manage. Splitting PDFs into smaller, focused documents offers numerous practical benefits for work and personal use.
            </p>

            <div className="my-8 not-prose">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-muted/30 rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center">
                    <Lightbulb className="h-5 w-5 text-primary mr-2" />
                    Common Reasons to Split PDFs
                  </h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Extract specific chapters from ebooks</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Separate invoices from combined files</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Share only relevant pages</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Reduce file size for email</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Organize documents by topic</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-muted/30 rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center">
                    <Zap className="h-5 w-5 text-primary mr-2" />
                    Benefits of Smaller PDFs
                  </h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Easier to share via email</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Faster to open and navigate</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Better organization</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Focused content delivery</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Improved document management</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <h2>Step-by-Step: How to Split PDF Online Free</h2>
            <p>
              Pine Tools Hub's I Love PDF Split tool offers a simple way to divide your PDFs:
            </p>

            <div className="my-8 not-prose">
              <div className="space-y-6">
                <div className="flex gap-4 items-start p-4 bg-muted/50 rounded-lg">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">1</div>
                  <div>
                    <h3 className="font-semibold text-lg">Open the PDF Splitter</h3>
                    <p className="text-muted-foreground">Visit <Link to="/split-pdf" className="text-primary hover:underline">Pine Tools Hub Split PDF</Link>. No registration or software installation required.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start p-4 bg-muted/50 rounded-lg">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">2</div>
                  <div>
                    <h3 className="font-semibold text-lg">Upload Your PDF</h3>
                    <p className="text-muted-foreground">Drag and drop your PDF file or click to browse. The tool will load and display your document's pages.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start p-4 bg-muted/50 rounded-lg">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">3</div>
                  <div>
                    <h3 className="font-semibold text-lg">Select Split Options</h3>
                    <p className="text-muted-foreground">Choose how to split: extract specific page ranges, separate every page, or split into equal sections.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start p-4 bg-muted/50 rounded-lg">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">4</div>
                  <div>
                    <h3 className="font-semibold text-lg">Download Your Files</h3>
                    <p className="text-muted-foreground">Click split and download your resulting PDF files. Multiple files are bundled in a ZIP archive.</p>
                  </div>
                </div>
              </div>
            </div>

            <h2>Split Methods Explained</h2>

            <h3>Extract Page Ranges</h3>
            <p>
              Specify exactly which pages you want to extract. For example, pages 1-5, 10-15, or individual pages like 3, 7, 12. This is perfect when you need specific sections from a larger document.
            </p>

            <h3>Split Every Page</h3>
            <p>
              Create a separate PDF for each page in the original document. Useful for creating individual files from multi-page scans or separating form submissions.
            </p>

            <h3>Split Into Equal Parts</h3>
            <p>
              Divide your PDF into equal sections. A 20-page document can become four 5-page PDFs, making it easier to distribute or process in parts.
            </p>

            <div className="my-8 not-prose grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-muted/30 rounded-lg">
                <Zap className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Fast Processing</h3>
                <p className="text-sm text-muted-foreground">Split PDFs in seconds using browser technology</p>
              </div>
              <div className="text-center p-6 bg-muted/30 rounded-lg">
                <Shield className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Complete Privacy</h3>
                <p className="text-sm text-muted-foreground">Your files stay on your device - never uploaded</p>
              </div>
              <div className="text-center p-6 bg-muted/30 rounded-lg">
                <Clock className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Always Free</h3>
                <p className="text-sm text-muted-foreground">Split unlimited PDFs without any charges</p>
              </div>
            </div>

            <h2>Frequently Asked Questions</h2>

            <h3>Can I split a password-protected PDF?</h3>
            <p>
              You'll need to unlock the PDF first. Use our <Link to="/unlock-pdf" className="text-primary hover:underline">Unlock PDF</Link> tool to remove password protection, then split the resulting file.
            </p>

            <h3>Is there a page limit?</h3>
            <p>
              Since processing happens in your browser, there's no server-imposed limit. Very large PDFs (500+ pages) may take longer depending on your device.
            </p>

            <h3>Will splitting affect PDF quality?</h3>
            <p>
              No, splitting preserves the original quality. Each resulting PDF maintains all the formatting, images, and text quality of the original.
            </p>

            <h2>Related PDF Tools</h2>
            <ul>
              <li><Link to="/merge-pdf" className="text-primary hover:underline">Merge PDF</Link> - Combine multiple PDFs into one</li>
              <li><Link to="/compress-pdf" className="text-primary hover:underline">Compress PDF</Link> - Reduce PDF file size</li>
              <li><Link to="/organize-pdf" className="text-primary hover:underline">Organize PDF</Link> - Rearrange PDF pages</li>
              <li><Link to="/rotate-pdf" className="text-primary hover:underline">Rotate PDF</Link> - Rotate PDF pages</li>
            </ul>

            <h2>Conclusion</h2>
            <p>
              Splitting PDF files is essential for managing large documents efficiently. Pine Tools Hub's free I Love PDF Split tool makes it easy to divide PDFs while maintaining complete privacy and quality.
            </p>
          </div>

          {/* Final CTA */}
          <div className="mt-12 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">Ready to Split Your PDF?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Divide your PDF into smaller files in seconds. Free, fast, and secure.
            </p>
            <Link
              to="/split-pdf"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-primary text-primary-foreground font-medium text-lg hover:bg-primary/90 transition-colors"
            >
              <Scissors className="mr-2 h-6 w-6" />
              Split PDF Free Now
            </Link>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default SplitPdfGuide;