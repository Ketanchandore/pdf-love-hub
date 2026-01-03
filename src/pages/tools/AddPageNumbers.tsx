import { useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";
import SEOHead from "@/components/seo/SEOHead";
import { ToolStructuredData, FAQStructuredData } from "@/components/seo/StructuredData";
import ToolHero from "@/components/shared/ToolHero";
import FileUpload from "@/components/shared/FileUpload";
import ProcessingStatus from "@/components/shared/ProcessingStatus";
import FAQSection from "@/components/seo/FAQSection";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Hash, Download } from "lucide-react";

const AddPageNumbers = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [position, setPosition] = useState("bottom-center");
  const [startNumber, setStartNumber] = useState("1");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFilesSelected = async (files: File[]) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);

      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      setPageCount(pdf.getPageCount());
    }
  };

  const addPageNumbers = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const pages = pdf.getPages();
      const start = parseInt(startNumber) || 1;

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const { width, height } = page.getSize();
        const pageNum = start + i;
        const text = `${pageNum}`;
        const textWidth = font.widthOfTextAtSize(text, 12);

        let x = 0;
        let y = 0;

        switch (position) {
          case "bottom-left":
            x = 40;
            y = 30;
            break;
          case "bottom-center":
            x = (width - textWidth) / 2;
            y = 30;
            break;
          case "bottom-right":
            x = width - 40 - textWidth;
            y = 30;
            break;
          case "top-left":
            x = 40;
            y = height - 40;
            break;
          case "top-center":
            x = (width - textWidth) / 2;
            y = height - 40;
            break;
          case "top-right":
            x = width - 40 - textWidth;
            y = height - 40;
            break;
        }

        page.drawText(text, {
          x,
          y,
          size: 12,
          font,
          color: rgb(0, 0, 0),
        });

        setProgress(((i + 1) / pages.length) * 100);
      }

      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
      saveAs(blob, `numbered-${file.name}`);

      setFile(null);
      setPageCount(0);
    } catch (error) {
      console.error("Error adding page numbers:", error);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const faqs = [
    {
      question: "How do I add page numbers to a PDF online free?",
      answer: "Upload your PDF to our free page numbering tool, select the position for numbers (top or bottom, left/center/right), optionally set a starting number, and click Add Page Numbers. Download your numbered PDF instantly - no registration, no watermark."
    },
    {
      question: "Can I choose where page numbers appear on the page?",
      answer: "Yes! You can position page numbers at the top or bottom of pages, aligned to the left, center, or right. Most documents use bottom-center for a clean, professional appearance."
    },
    {
      question: "Can I start page numbering from a specific number?",
      answer: "Yes! You can set any starting number. This is useful if you're numbering a section that starts on page 5, or if you have front matter that shouldn't be numbered."
    },
    {
      question: "Is this page numbering tool completely free?",
      answer: "Absolutely! Pine Tools Hub's page numbering tool is 100% free with no limits on the number of pages or files you can process. No registration required, no watermarks added."
    },
    {
      question: "Can I add page numbers to PDF on mobile phone?",
      answer: "Yes! Our add page numbers online tool works perfectly on smartphones and tablets. The responsive interface adapts to any screen size for easy page numbering on iPhone, Android, and iPad devices."
    },
    {
      question: "Will adding page numbers affect my PDF content quality?",
      answer: "No, adding page numbers is a non-destructive operation. All existing text, images, and formatting in your PDF remain at their original quality."
    },
    {
      question: "Can I customize the font or size of page numbers?",
      answer: "Our current tool uses a standard, professional font and size that works well for most documents. For advanced customization options, professional PDF editors may be needed."
    },
    {
      question: "Is this page numbers tool better than iLovePDF page numbers?",
      answer: "Our free PDF page numbering tool offers complete privacy since all processing happens in your browser - your documents never get uploaded to external servers like with cloud-based alternatives."
    }
  ];

  return (
    <>
      <SEOHead
        title="Add Page Numbers to PDF Online Free - Insert Numbering | Pine Tools Hub"
        description="Add page numbers to PDF documents online free without watermark. Choose position and starting number easily. No registration, works on mobile, 100% private browser-based tool."
        keywords="add page numbers to pdf free, pdf page numbering online, insert page numbers pdf, number pdf pages, pdf page number tool, add pagination to pdf, ilovepdf page numbers alternative"
        canonical="https://pinetoolshub.com/add-page-numbers"
      />
      <ToolStructuredData
        toolName="Add Page Numbers to PDF"
        toolDescription="Free online PDF page numbering tool. Add professional page numbers to your documents with customizable position and starting number - no registration required."
        toolUrl="https://pinetoolshub.com/add-page-numbers"
        category="PDF"
      />
      <FAQStructuredData faqs={faqs} />

      <div className="py-12">
        <ToolHero
          title="Add Page Numbers to PDF Online Free"
          description="Insert professional page numbers into your PDF documents. Choose position and starting number - free, no watermark, works on mobile."
          icon={<Hash className="h-8 w-8 text-primary" />}
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
                  {pageCount} page{pageCount !== 1 ? "s" : ""} will be numbered
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Position</label>
                  <Select value={position} onValueChange={setPosition}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bottom-left">Bottom Left</SelectItem>
                      <SelectItem value="bottom-center">Bottom Center</SelectItem>
                      <SelectItem value="bottom-right">Bottom Right</SelectItem>
                      <SelectItem value="top-left">Top Left</SelectItem>
                      <SelectItem value="top-center">Top Center</SelectItem>
                      <SelectItem value="top-right">Top Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Number</label>
                  <Select value={startNumber} onValueChange={setStartNumber}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="0">0</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isProcessing ? (
                <ProcessingStatus progress={progress} message="Adding page numbers..." />
              ) : (
                <Button onClick={addPageNumbers} className="w-full" size="lg">
                  <Download className="mr-2 h-5 w-5" />
                  Add Page Numbers
                </Button>
              )}
            </div>
          )}

          <section className="mt-16 prose prose-slate dark:prose-invert max-w-none">
            <h2>Free PDF Page Numbering Tool - Add Professional Pagination</h2>
            <p>
              Need to <strong>add page numbers to a PDF</strong>? Pine Tools Hub's free page numbering tool lets you insert professional pagination to any PDF document instantly. Perfect for reports, manuals, presentations, contracts, and any multi-page document that needs clear page references.
            </p>
            <p>
              Our PDF page numbering tool processes everything directly in your browser, keeping your documents completely private. There's no uploading to external servers and no privacy concerns - ideal for sensitive business, legal, or personal documents.
            </p>

            <h3>How to Add Page Numbers to PDF Online Free</h3>
            <ol>
              <li><strong>Upload Your PDF:</strong> Drag and drop or click to select the PDF you want to number</li>
              <li><strong>Choose Position:</strong> Select where page numbers should appear (top/bottom, left/center/right)</li>
              <li><strong>Set Starting Number:</strong> Optionally change the starting number (default is 1)</li>
              <li><strong>Click Add Page Numbers:</strong> Numbers are added to all pages</li>
              <li><strong>Download Result:</strong> Save your numbered PDF immediately</li>
            </ol>

            <h3>Position Options for Page Numbers</h3>
            <p>
              Choose from six position options to place page numbers exactly where you need them:
            </p>
            <ul>
              <li><strong>Bottom Center:</strong> Most common and professional placement for reports and documents</li>
              <li><strong>Bottom Left/Right:</strong> Good for documents bound on one side</li>
              <li><strong>Top Center:</strong> Works well for presentations and manuals</li>
              <li><strong>Top Left/Right:</strong> Alternative header-style numbering</li>
            </ul>

            <h3>Common Uses for PDF Page Numbering</h3>
            <ul>
              <li><strong>Business Reports:</strong> Add professional pagination to quarterly reports and presentations</li>
              <li><strong>Legal Documents:</strong> Number contracts and agreements for easy reference</li>
              <li><strong>Manuals & Guides:</strong> Help readers navigate lengthy instruction documents</li>
              <li><strong>Academic Papers:</strong> Meet formatting requirements for theses and dissertations</li>
              <li><strong>eBooks & Publications:</strong> Add reader-friendly navigation to digital books</li>
            </ul>

            <h3>Best Free PDF Page Numbers Tool - iLovePDF Alternative</h3>
            <p>
              Looking for the <strong>best free PDF page numbering alternative to iLovePDF</strong>? Pine Tools Hub offers browser-based pagination with complete privacy. Your documents never leave your device, making our tool ideal for sensitive files that shouldn't be uploaded to cloud servers.
            </p>
          </section>

          <FAQSection faqs={faqs} />
        </div>
      </div>
    </>
  );
};

export default AddPageNumbers;