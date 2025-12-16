import { Link } from "react-router-dom";
import { FileText } from "lucide-react";

const pdfTools = [
  { name: "Merge PDF", href: "/merge-pdf" },
  { name: "Split PDF", href: "/split-pdf" },
  { name: "Compress PDF", href: "/compress-pdf" },
  { name: "PDF to Word", href: "/pdf-to-word" },
  { name: "Word to PDF", href: "/word-to-pdf" },
  { name: "PDF to JPG", href: "/pdf-to-jpg" },
  { name: "JPG to PDF", href: "/jpg-to-pdf" },
];

const moreTools = [
  { name: "Rotate PDF", href: "/rotate-pdf" },
  { name: "Add Watermark", href: "/add-watermark" },
  { name: "Unlock PDF", href: "/unlock-pdf" },
  { name: "Protect PDF", href: "/protect-pdf" },
  { name: "Organize PDF", href: "/organize-pdf" },
  { name: "Compress Image", href: "/compress-image" },
  { name: "Remove Background", href: "/remove-background" },
];

const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <FileText className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Pine Tools Hub</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Free online PDF tools that work like iLovePDF. Process your files securely in your browser with no upload required. 100% free, no registration needed.
            </p>
          </div>

          {/* PDF Tools */}
          <div>
            <h3 className="font-semibold mb-4">PDF Tools</h3>
            <ul className="space-y-2">
              {pdfTools.map((tool) => (
                <li key={tool.href}>
                  <Link
                    to={tool.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Tools */}
          <div>
            <h3 className="font-semibold mb-4">More Tools</h3>
            <ul className="space-y-2">
              {moreTools.map((tool) => (
                <li key={tool.href}>
                  <Link
                    to={tool.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Pine Tools Hub. All rights reserved. Free PDF tools online.
            </p>
            <p className="text-xs text-muted-foreground">
              I Love PDF alternative • Free PDF converter • Online PDF editor
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
