import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { saveAs } from "file-saver";
import SEOHead from "@/components/seo/SEOHead";
import ToolHero from "@/components/shared/ToolHero";
import FileUpload from "@/components/shared/FileUpload";
import ProcessingStatus from "@/components/shared/ProcessingStatus";
import FAQSection from "@/components/seo/FAQSection";
import { Button } from "@/components/ui/button";
import { Table, Download } from "lucide-react";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PdfToExcel = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
    }
  };

  const convertToExcel = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let csvContent = "";
      const totalPages = pdf.numPages;

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str.replace(/,/g, ";"))
          .join(",");
        csvContent += pageText + "\n";
        setProgress((i / totalPages) * 90);
      }

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
      saveAs(blob, file.name.replace(".pdf", ".csv"));

      setProgress(100);
      setFile(null);
    } catch (error) {
      console.error("Error converting PDF to Excel:", error);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const faqs = [
    {
      question: "How do I convert PDF to Excel online for free?",
      answer: "Upload your PDF to our I Love PDF to Excel converter, click 'Convert to Excel', and download your CSV file that opens in Excel. It's completely free with no registration required."
    },
    {
      question: "Will my PDF tables be preserved in Excel?",
      answer: "Our converter extracts text data from your PDF. For best results with tables, ensure your PDF has clear table formatting. Complex multi-column layouts may need manual adjustment."
    },
    {
      question: "What format does the Excel file come in?",
      answer: "We export to CSV format which opens perfectly in Microsoft Excel, Google Sheets, and other spreadsheet applications. CSV ensures maximum compatibility across all platforms."
    },
    {
      question: "Is my PDF data secure during conversion?",
      answer: "Absolutely! All conversion happens locally in your browser. Your files never leave your device, ensuring complete privacy for sensitive financial or business data."
    },
    {
      question: "Can I convert scanned PDF tables to Excel?",
      answer: "Our converter works best with digital PDFs containing selectable text. Scanned documents may require OCR processing first to extract the text data."
    },
    {
      question: "Is there a limit on PDF size for Excel conversion?",
      answer: "Since processing happens in your browser, there's no server limit. Files up to 50MB typically convert smoothly depending on your device's capabilities."
    }
  ];

  return (
    <>
      <SEOHead
        title="PDF to Excel Converter Free Online - I Love PDF to Excel | Pine Tools Hub"
        description="Convert PDF to Excel spreadsheets online for free with our I Love PDF to Excel converter. Extract tables and data from PDFs to CSV/Excel format. No registration, 100% secure browser-based processing."
        keywords="pdf to excel, convert pdf to excel, i love pdf to excel, pdf to spreadsheet, extract pdf tables, pdf to csv, pdf table extractor, ilovepdf excel"
        canonical="https://pinetoolshub.com/pdf-to-excel"
      />

      <div className="py-12">
        <ToolHero
          title="PDF to Excel Converter"
          description="Extract data and tables from PDF files to Excel spreadsheets. I Love PDF to Excel makes data extraction quick and easy - completely free and secure."
          icon={<Table className="h-8 w-8 text-primary" />}
        />

        <div className="container max-w-4xl mx-auto px-4 mt-12">
          <FileUpload
            onFilesSelected={handleFilesSelected}
            accept={{ "application/pdf": [".pdf"] }}
            multiple={false}
            label="Drop a PDF file here or click to browse"
          />

          {file && (
            <div className="mt-8 space-y-6">
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  Ready to convert to Excel/CSV
                </p>
              </div>

              {isProcessing ? (
                <ProcessingStatus progress={progress} message="Converting to Excel..." />
              ) : (
                <Button onClick={convertToExcel} className="w-full" size="lg">
                  <Download className="mr-2 h-5 w-5" />
                  Convert to Excel
                </Button>
              )}
            </div>
          )}

          <section className="mt-16 prose prose-slate dark:prose-invert max-w-none">
            <h2>Free PDF to Excel Converter - I Love PDF to Spreadsheet Tool</h2>
            <p>
              Need to extract tables or data from a PDF into an Excel spreadsheet? Pine Tools Hub's <strong>I Love PDF to Excel</strong> converter transforms your PDF documents into editable CSV files that open perfectly in Microsoft Excel, Google Sheets, or any spreadsheet application.
            </p>
            <p>
              Unlike other online PDF to Excel converters that upload your sensitive financial data to servers, our tool processes everything directly in your browser. Your confidential spreadsheets and business data never leave your device.
            </p>
            <h3>Why Convert PDF to Excel?</h3>
            <ul>
              <li><strong>Data Analysis:</strong> Import PDF data into Excel for calculations and charts</li>
              <li><strong>Financial Reports:</strong> Extract tables from PDF financial statements</li>
              <li><strong>Database Import:</strong> Convert PDF tables for database uploads</li>
              <li><strong>Data Editing:</strong> Modify and update PDF table content easily</li>
              <li><strong>Report Generation:</strong> Use extracted data for new reports</li>
            </ul>
            <h3>How to Convert PDF to Excel</h3>
            <ol>
              <li>Upload your PDF document containing tables or data</li>
              <li>Click "Convert to Excel" to start extraction</li>
              <li>Wait for processing to complete</li>
              <li>Download your CSV file and open in Excel</li>
            </ol>
            <h3>Best PDF to Excel Alternative</h3>
            <p>
              Looking for the best <strong>I Love PDF to Excel alternative</strong>? Pine Tools Hub offers completely free PDF to spreadsheet conversion with no file limits, no registration, and complete privacy. Our browser-based tool ensures your sensitive data stays secure while delivering fast, accurate conversions.
            </p>
          </section>

          <FAQSection faqs={faqs} />
        </div>
      </div>
    </>
  );
};

export default PdfToExcel;
