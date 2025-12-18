import { useState } from "react";
import SEOHead from "@/components/seo/SEOHead";
import ToolHero from "@/components/shared/ToolHero";
import FileUpload from "@/components/shared/FileUpload";
import FAQSection from "@/components/seo/FAQSection";
import { Button } from "@/components/ui/button";
import { Table, Download, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ExcelToPdf = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
    }
  };

  const faqs = [
    {
      question: "How do I convert Excel to PDF online for free?",
      answer: "Upload your XLS or XLSX file to our I Love PDF Excel converter. For perfect conversion with all formatting preserved, use Microsoft Excel's built-in 'Save as PDF' or Google Sheets export feature."
    },
    {
      question: "Will my Excel formulas be visible in the PDF?",
      answer: "PDF shows the calculated values, not the formulas. If you want to share formulas, consider sharing the original Excel file or taking screenshots of the formula bar."
    },
    {
      question: "Can I convert multiple Excel sheets to one PDF?",
      answer: "Yes! When using Excel's native PDF export, you can choose to include all worksheets in a single PDF document or export only the active sheet."
    },
    {
      question: "Is my spreadsheet data secure during conversion?",
      answer: "For maximum security with sensitive financial data, we recommend using offline tools like Microsoft Excel or LibreOffice Calc which process files entirely on your device."
    },
    {
      question: "Will my charts and graphs be included in the PDF?",
      answer: "Yes! Charts, graphs, images, and all visual elements are preserved when converting Excel to PDF using native applications like Microsoft Excel."
    },
    {
      question: "What's the best way to convert large Excel files?",
      answer: "For large spreadsheets, Microsoft Excel's built-in PDF export handles them best. You can also adjust print settings to fit data on fewer pages."
    }
  ];

  return (
    <>
      <SEOHead
        title="Excel to PDF Converter Free Online - I Love PDF Excel to PDF | Pine Tools Hub"
        description="Convert Excel to PDF online for free with our I Love PDF Excel converter. Transform XLS and XLSX spreadsheets to PDF format. Best Excel to PDF tool with complete privacy."
        keywords="excel to pdf, convert excel to pdf, i love pdf excel, spreadsheet to pdf, xls to pdf, xlsx to pdf converter, ilovepdf excel, convert spreadsheet"
        canonical="https://pinetoolshub.com/excel-to-pdf"
      />

      <div className="py-12">
        <ToolHero
          title="Excel to PDF Converter"
          description="Convert your Excel spreadsheets to PDF format. I Love PDF Excel converter helps you create professional PDF documents from your data - completely free and secure."
          icon={<Table className="h-8 w-8 text-primary" />}
        />

        <div className="container max-w-4xl mx-auto px-4 mt-12">
          <FileUpload
            onFilesSelected={handleFilesSelected}
            accept={{ 
              "application/vnd.ms-excel": [".xls"],
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"]
            }}
            multiple={false}
            label="Drop an Excel file here or click to browse"
          />

          {file && (
            <div className="mt-8 space-y-6">
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  Excel file selected
                </p>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  For the best Excel to PDF conversion with preserved formatting and charts, we recommend:
                  <ul className="mt-2 list-disc list-inside space-y-1">
                    <li>Microsoft Excel: File → Save As → PDF</li>
                    <li>Google Sheets: File → Download → PDF Document</li>
                    <li>LibreOffice Calc: File → Export as PDF</li>
                  </ul>
                  These methods ensure perfect conversion with all data and charts intact.
                </AlertDescription>
              </Alert>

              <Button disabled className="w-full" size="lg">
                <Download className="mr-2 h-5 w-5" />
                Use Desktop App for Best Results
              </Button>
            </div>
          )}

          <section className="mt-16 prose prose-slate dark:prose-invert max-w-none">
            <h2>Free Excel to PDF Converter - I Love PDF Spreadsheet Tool</h2>
            <p>
              Need to convert your Excel spreadsheets to PDF? Pine Tools Hub's <strong>I Love PDF Excel to PDF</strong> guide helps you create professional PDF documents from your XLS and XLSX files with perfect formatting, charts, and data preservation.
            </p>
            <p>
              While browser-based Excel conversion has limitations with complex spreadsheets, we provide the best methods to achieve perfect results using tools you already have.
            </p>
            <h3>Best Methods to Convert Excel to PDF</h3>
            <ul>
              <li><strong>Microsoft Excel:</strong> Open your spreadsheet → File → Save As → Choose PDF format. Adjust page setup for best results.</li>
              <li><strong>Google Sheets:</strong> Upload your Excel to Google Drive → Open with Sheets → File → Download → PDF Document.</li>
              <li><strong>LibreOffice Calc:</strong> Free, open-source tool that handles Excel to PDF conversion excellently.</li>
            </ul>
            <h3>Why Convert Excel to PDF?</h3>
            <ul>
              <li><strong>Protect Data:</strong> Prevent accidental changes to your spreadsheet</li>
              <li><strong>Universal Format:</strong> PDFs open on any device without Excel</li>
              <li><strong>Print Ready:</strong> Perfect formatting for professional printing</li>
              <li><strong>Share Safely:</strong> Share data without revealing formulas</li>
              <li><strong>Consistent View:</strong> Everyone sees exactly what you intended</li>
            </ul>
            <h3>I Love PDF Excel Alternative</h3>
            <p>
              Looking for an <strong>I Love PDF Excel to PDF alternative</strong>? Pine Tools Hub offers comprehensive guides and tools for all your document conversion needs. While Excel conversion works best with desktop applications, our PDF tools like merge, split, compress, and PDF to Excel work entirely in your browser with complete privacy.
            </p>
            <h3>Tips for Better Excel to PDF Conversion</h3>
            <p>
              Before converting, adjust your Excel page layout settings: set appropriate margins, choose landscape or portrait orientation, and use "Fit to Page" options to ensure all columns are visible. Preview the print layout to see exactly how your PDF will look.
            </p>
          </section>

          <FAQSection faqs={faqs} />
        </div>
      </div>
    </>
  );
};

export default ExcelToPdf;
