import { useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";
import SEOHead from "@/components/seo/SEOHead";
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
      question: "How do I add page numbers to a PDF?",
      answer: "Upload your PDF, select the position for page numbers (top/bottom, left/center/right), optionally set a starting number, and click Add Page Numbers."
    },
    {
      question: "Can I choose where page numbers appear?",
      answer: "Yes! You can position page numbers at the top or bottom of pages, aligned to the left, center, or right."
    },
    {
      question: "Can I start numbering from a specific number?",
      answer: "Yes! You can set any starting number. Useful if you're adding numbers to a section that starts on page 5, for example."
    },
    {
      question: "Is this tool free to use?",
      answer: "Absolutely! Pine Tools Hub's page numbering tool is completely free with no limits on the number of pages or files."
    }
  ];

  return (
    <>
      <SEOHead
        title="Add Page Numbers to PDF Free Online - I Love PDF Numbering | Pine Tools Hub"
        description="Add page numbers to PDF documents online for free. Choose position and starting number. I Love PDF style tool with complete privacy."
        keywords="add page numbers to pdf, pdf page numbering, number pdf pages, i love pdf page numbers, pdf page number free, insert page numbers pdf"
        canonical="https://pinetoolshub.com/add-page-numbers"
      />

      <div className="py-12">
        <ToolHero
          title="Add Page Numbers to PDF"
          description="Insert page numbers into your PDF documents. I Love PDF style tool - free, fast, and private."
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
            <h2>Free PDF Page Numbering Tool - I Love PDF Style</h2>
            <p>
              Add professional page numbers to your PDF documents with Pine Tools Hub. Perfect for reports, manuals, presentations, and any multi-page document.
            </p>
            <h3>How to Add Page Numbers</h3>
            <ol>
              <li>Upload your PDF file</li>
              <li>Choose the position for page numbers</li>
              <li>Set the starting number (optional)</li>
              <li>Click "Add Page Numbers" and download</li>
            </ol>
            <h3>Position Options</h3>
            <p>
              Choose from six position options: top-left, top-center, top-right, bottom-left, bottom-center, or bottom-right. Most documents use bottom-center for a clean, professional look.
            </p>
          </section>

          <FAQSection faqs={faqs} />
        </div>
      </div>
    </>
  );
};

export default AddPageNumbers;