import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X, FileText, ChevronDown, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const pdfTools = [
  { name: "Merge PDF", href: "/merge-pdf", description: "Combine multiple PDFs into one" },
  { name: "Split PDF", href: "/split-pdf", description: "Extract pages from PDF" },
  { name: "Compress PDF", href: "/compress-pdf", description: "Reduce PDF file size" },
  { name: "PDF to Word", href: "/pdf-to-word", description: "Convert PDF to DOCX" },
  { name: "Word to PDF", href: "/word-to-pdf", description: "Convert DOCX to PDF" },
  { name: "PDF to JPG", href: "/pdf-to-jpg", description: "Export pages as JPG images" },
  { name: "JPG to PDF", href: "/jpg-to-pdf", description: "Create PDF from images" },
  { name: "Rotate PDF", href: "/rotate-pdf", description: "Rotate PDF pages" },
  { name: "Add Watermark", href: "/add-watermark", description: "Add text watermark" },
  { name: "Unlock PDF", href: "/unlock-pdf", description: "Remove password protection" },
  { name: "Protect PDF", href: "/protect-pdf", description: "Add password protection" },
  { name: "PDF to PNG", href: "/pdf-to-png", description: "Export pages as PNG images" },
  { name: "PNG to PDF", href: "/png-to-pdf", description: "Create PDF from PNG files" },
  { name: "Organize PDF", href: "/organize-pdf", description: "Rearrange PDF pages" },
];

const imageTools = [
  { name: "Compress Image", href: "/compress-image", description: "Reduce image file size" },
  { name: "Remove Background", href: "/remove-background", description: "AI-powered background removal" },
];

const aiTools = [
  { name: "Resume Optimizer", href: "/resume-optimizer", description: "Beat ATS bots with AI" },
  { name: "PDF to Podcast", href: "/pdf-to-podcast", description: "Convert docs to audio" },
  { name: "Bank Statement Extractor", href: "/bank-statement-extractor", description: "Extract to Excel" },
  { name: "Contract Risk Scanner", href: "/contract-risk-scanner", description: "Analyze legal contracts" },
  { name: "LinkedIn Carousel", href: "/linkedin-carousel-generator", description: "PDF to social slides" },
  { name: "Smart Redactor", href: "/smart-redactor", description: "Auto-redact PII" },
  { name: "Knowledge Vault", href: "/knowledge-vault", description: "Chat with documents" },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-lg bg-primary shrink-0">
            <FileText className="h-4 w-4 md:h-5 md:w-5 text-primary-foreground" />
          </div>
          <span className="text-lg md:text-xl font-bold text-foreground whitespace-nowrap">
            Pine Tools Hub
          </span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent">PDF Tools</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[600px] gap-2 p-4 md:grid-cols-2">
                  {pdfTools.map((tool) => (
                    <li key={tool.href}>
                      <NavigationMenuLink asChild>
                        <Link
                          to={tool.href}
                          className={cn(
                            "block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          )}
                        >
                          <div className="text-sm font-medium leading-none">{tool.name}</div>
                          <p className="line-clamp-1 text-sm leading-snug text-muted-foreground mt-1">
                            {tool.description}
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent">Image Tools</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[300px] gap-2 p-4">
                  {imageTools.map((tool) => (
                    <li key={tool.href}>
                      <NavigationMenuLink asChild>
                        <Link
                          to={tool.href}
                          className={cn(
                            "block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          )}
                        >
                          <div className="text-sm font-medium leading-none">{tool.name}</div>
                          <p className="line-clamp-1 text-sm leading-snug text-muted-foreground mt-1">
                            {tool.description}
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent">
                <Brain className="h-4 w-4 mr-1" />
                AI Tools
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-2 p-4 md:grid-cols-2">
                  {aiTools.map((tool) => (
                    <li key={tool.href}>
                      <NavigationMenuLink asChild>
                        <Link
                          to={tool.href}
                          className={cn(
                            "block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          )}
                        >
                          <div className="text-sm font-medium leading-none">{tool.name}</div>
                          <p className="line-clamp-1 text-sm leading-snug text-muted-foreground mt-1">
                            {tool.description}
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link to="/blog" className="inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none">
                Blog
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link to="/about" className="inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none">
                About
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link to="/contact" className="inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none">
                Contact
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="container py-4 space-y-4">
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-1">
                PDF Tools <ChevronDown className="h-4 w-4" />
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {pdfTools.map((tool) => (
                  <Link
                    key={tool.href}
                    to={tool.href}
                    className="text-sm text-muted-foreground hover:text-foreground p-2 rounded-md hover:bg-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {tool.name}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-1">
                Image Tools <ChevronDown className="h-4 w-4" />
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {imageTools.map((tool) => (
                  <Link
                    key={tool.href}
                    to={tool.href}
                    className="text-sm text-muted-foreground hover:text-foreground p-2 rounded-md hover:bg-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {tool.name}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-1">
                <Brain className="h-4 w-4" />
                AI Tools <ChevronDown className="h-4 w-4" />
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {aiTools.map((tool) => (
                  <Link
                    key={tool.href}
                    to={tool.href}
                    className="text-sm text-muted-foreground hover:text-foreground p-2 rounded-md hover:bg-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {tool.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex gap-4 pt-2 border-t border-border">
              <Link to="/blog" className="text-sm font-medium hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
              <Link to="/about" className="text-sm font-medium hover:text-primary" onClick={() => setMobileMenuOpen(false)}>About</Link>
              <Link to="/contact" className="text-sm font-medium hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
