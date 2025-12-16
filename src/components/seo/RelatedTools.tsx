import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface Tool {
  name: string;
  href: string;
  description: string;
}

interface RelatedToolsProps {
  currentTool: string;
  category: "pdf" | "image";
}

const pdfTools: Tool[] = [
  { name: "Merge PDF", href: "/merge-pdf", description: "Combine multiple PDFs into one" },
  { name: "Split PDF", href: "/split-pdf", description: "Separate PDF into multiple files" },
  { name: "Compress PDF", href: "/compress-pdf", description: "Reduce PDF file size" },
  { name: "PDF to Word", href: "/pdf-to-word", description: "Convert PDF to Word document" },
  { name: "Word to PDF", href: "/word-to-pdf", description: "Convert Word to PDF format" },
  { name: "PDF to JPG", href: "/pdf-to-jpg", description: "Convert PDF pages to JPG images" },
  { name: "JPG to PDF", href: "/jpg-to-pdf", description: "Create PDF from JPG images" },
  { name: "PDF to PNG", href: "/pdf-to-png", description: "Convert PDF pages to PNG images" },
  { name: "PNG to PDF", href: "/png-to-pdf", description: "Create PDF from PNG images" },
  { name: "Rotate PDF", href: "/rotate-pdf", description: "Rotate PDF pages" },
  { name: "Add Watermark", href: "/add-watermark", description: "Add watermark to PDF" },
  { name: "Unlock PDF", href: "/unlock-pdf", description: "Remove PDF password" },
  { name: "Protect PDF", href: "/protect-pdf", description: "Add password to PDF" },
  { name: "Organize PDF", href: "/organize-pdf", description: "Rearrange PDF pages" },
];

const imageTools: Tool[] = [
  { name: "Compress Image", href: "/compress-image", description: "Reduce image file size" },
  { name: "Remove Background", href: "/remove-background", description: "Remove image background" },
];

const RelatedTools = ({ currentTool, category }: RelatedToolsProps) => {
  const allTools = category === "pdf" ? pdfTools : imageTools;
  const relatedTools = allTools.filter(tool => tool.name !== currentTool).slice(0, 6);

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Related {category === "pdf" ? "PDF" : "Image"} Tools You Might Need
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {relatedTools.map((tool) => (
            <Link
              key={tool.href}
              to={tool.href}
              className="group p-4 bg-card rounded-lg border border-border hover:border-primary/50 hover:shadow-md transition-all text-center"
            >
              <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                {tool.name}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {tool.description}
              </p>
            </Link>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
          >
            View All Tools <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RelatedTools;
