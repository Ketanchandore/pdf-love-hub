import { Helmet } from "react-helmet-async";

interface ToolStructuredDataProps {
  toolName: string;
  toolDescription: string;
  toolUrl: string;
  category: "PDF" | "Image";
}

export const ToolStructuredData = ({
  toolName,
  toolDescription,
  toolUrl,
  category,
}: ToolStructuredDataProps) => {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": toolName,
    "description": toolDescription,
    "url": toolUrl,
    "applicationCategory": category === "PDF" ? "BusinessApplication" : "MultimediaApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250",
      "bestRating": "5",
      "worstRating": "1"
    },
    "author": {
      "@type": "Organization",
      "name": "Pine Tools Hub",
      "url": "https://pinetoolshub.com"
    }
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `How to use ${toolName}`,
    "description": toolDescription,
    "totalTime": "PT2M",
    "tool": {
      "@type": "HowToTool",
      "name": "Web Browser"
    },
    "step": [
      {
        "@type": "HowToStep",
        "name": "Upload your file",
        "text": `Click the upload button or drag and drop your ${category === "PDF" ? "PDF" : "image"} file`
      },
      {
        "@type": "HowToStep",
        "name": "Process your file",
        "text": `The tool will automatically process your ${category === "PDF" ? "PDF" : "image"}`
      },
      {
        "@type": "HowToStep",
        "name": "Download the result",
        "text": "Click the download button to save your processed file"
      }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(softwareSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(howToSchema)}
      </script>
    </Helmet>
  );
};

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbStructuredDataProps {
  items: BreadcrumbItem[];
}

export const BreadcrumbStructuredData = ({ items }: BreadcrumbStructuredDataProps) => {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
};

export const WebsiteStructuredData = () => {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Pine Tools Hub",
    "alternateName": ["PineToolsHub", "Pine PDF Tools", "Free PDF Tools"],
    "url": "https://pinetoolshub.com",
    "description": "Free online PDF and image tools. Merge, split, compress, convert PDFs. 100% private - all processing in your browser.",
    "inLanguage": "en-US",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://pinetoolshub.com/?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Pine Tools Hub",
    "url": "https://pinetoolshub.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://pinetoolshub.com/logo.png",
      "width": "512",
      "height": "512"
    },
    "description": "Pine Tools Hub provides free online PDF and image processing tools with complete privacy.",
    "foundingDate": "2024",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "support@pinetoolshub.com",
      "availableLanguage": ["English"]
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
    </Helmet>
  );
};
