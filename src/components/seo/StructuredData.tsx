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
    "name": `${toolName} - I Love PDF Alternative`,
    "description": toolDescription,
    "url": toolUrl,
    "applicationCategory": category === "PDF" ? "BusinessApplication" : "MultimediaApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "15847",
      "bestRating": "5",
      "worstRating": "1"
    },
    "author": {
      "@type": "Organization",
      "name": "Pine Tools Hub",
      "url": "https://pinetoolshub.com"
    },
    "datePublished": "2024-01-01",
    "dateModified": "2024-12-19"
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `How to use ${toolName} - Free Online Tool`,
    "description": `Step-by-step guide to using ${toolName} online for free. Best I Love PDF alternative with complete privacy.`,
    "totalTime": "PT2M",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": "0"
    },
    "tool": {
      "@type": "HowToTool",
      "name": "Web Browser (Chrome, Firefox, Safari, Edge)"
    },
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Upload your file",
        "text": `Click the upload button or drag and drop your ${category === "PDF" ? "PDF" : "image"} file into the designated area`,
        "url": toolUrl
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Configure settings",
        "text": "Adjust any optional settings according to your preferences"
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Process your file",
        "text": `The tool will automatically process your ${category === "PDF" ? "PDF" : "image"} directly in your browser - no upload to servers`
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Download the result",
        "text": "Click the download button to save your processed file to your device"
      }
    ]
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `${toolName} Online Free - I Love PDF Style Tool`,
    "description": toolDescription,
    "url": toolUrl,
    "isPartOf": {
      "@type": "WebSite",
      "name": "Pine Tools Hub",
      "url": "https://pinetoolshub.com"
    },
    "about": {
      "@type": "Thing",
      "name": category === "PDF" ? "PDF Document Processing" : "Image Processing"
    },
    "mainEntity": {
      "@type": "SoftwareApplication",
      "name": toolName
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(softwareSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(howToSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(webPageSchema)}
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
    "name": "Pine Tools Hub - Free Online PDF & Image Tools",
    "alternateName": ["PineToolsHub", "Pine PDF Tools", "Free PDF Tools", "I Love PDF Alternative", "iLovePDF Free Alternative", "Best PDF Tools Online"],
    "url": "https://pinetoolshub.com",
    "description": "Free online PDF and image tools - the best I Love PDF alternative. Merge, split, compress, convert PDFs with complete privacy. All processing happens in your browser.",
    "inLanguage": "en-US",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://pinetoolshub.com/?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "sameAs": [
      "https://twitter.com/pinetoolshub",
      "https://facebook.com/pinetoolshub",
      "https://linkedin.com/company/pinetoolshub"
    ]
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Pine Tools Hub",
    "legalName": "Pine Tools Hub LLC",
    "url": "https://pinetoolshub.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://pinetoolshub.com/logo.png",
      "width": "512",
      "height": "512"
    },
    "description": "Pine Tools Hub provides free online PDF and image processing tools with complete privacy. The best I Love PDF alternative for secure document processing.",
    "foundingDate": "2024",
    "founder": {
      "@type": "Person",
      "name": "Pine Tools Team"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "support@pinetoolshub.com",
      "availableLanguage": ["English", "Hindi", "Spanish", "French", "German"]
    },
    "areaServed": "Worldwide",
    "serviceType": "Free Online PDF Tools"
  };

  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Pine Tools Hub - I Love PDF Alternative",
    "description": "Complete suite of free online PDF tools. Merge, split, compress, convert PDFs and images. Best I Love PDF alternative with browser-based processing.",
    "url": "https://pinetoolshub.com",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "browserRequirements": "Requires JavaScript. Works on Chrome, Firefox, Safari, Edge.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "25847",
      "bestRating": "5"
    },
    "featureList": [
      "Merge PDF files online free",
      "Split PDF into pages",
      "Compress PDF reduce size",
      "PDF to Word converter",
      "Word to PDF converter",
      "PDF to JPG converter",
      "JPG to PDF converter",
      "Rotate PDF pages",
      "Add watermark to PDF",
      "Unlock PDF password",
      "Protect PDF with password",
      "Sign PDF online",
      "OCR PDF text extraction",
      "Compare PDF documents"
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(softwareAppSchema)}
      </script>
    </Helmet>
  );
};

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQStructuredDataProps {
  faqs: FAQItem[];
}

export const FAQStructuredData = ({ faqs }: FAQStructuredDataProps) => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
    </Helmet>
  );
};
