import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { BreadcrumbStructuredData } from "./StructuredData";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  const structuredDataItems = [
    { name: "Home", url: "https://pinetoolshub.com" },
    ...items.map((item) => ({
      name: item.label,
      url: item.href ? `https://pinetoolshub.com${item.href}` : "https://pinetoolshub.com"
    }))
  ];

  return (
    <>
      <BreadcrumbStructuredData items={structuredDataItems} />
      <nav aria-label="Breadcrumb" className="py-3">
        <ol className="flex items-center flex-wrap gap-1 text-sm text-muted-foreground">
          <li>
            <Link 
              to="/" 
              className="flex items-center gap-1 hover:text-primary transition-colors"
              aria-label="Home"
            >
              <Home className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only">Home</span>
            </Link>
          </li>
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-1">
              <ChevronRight className="h-4 w-4" />
              {item.href && index < items.length - 1 ? (
                <Link 
                  to={item.href} 
                  className="hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-foreground font-medium" aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumbs;
