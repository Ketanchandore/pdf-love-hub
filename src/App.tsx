import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// PDF Tools
import MergePdf from "./pages/tools/MergePdf";
import SplitPdf from "./pages/tools/SplitPdf";
import CompressPdf from "./pages/tools/CompressPdf";
import PdfToWord from "./pages/tools/PdfToWord";
import WordToPdf from "./pages/tools/WordToPdf";
import PdfToJpg from "./pages/tools/PdfToJpg";
import JpgToPdf from "./pages/tools/JpgToPdf";
import RotatePdf from "./pages/tools/RotatePdf";
import AddWatermark from "./pages/tools/AddWatermark";
import UnlockPdf from "./pages/tools/UnlockPdf";
import ProtectPdf from "./pages/tools/ProtectPdf";
import PdfToPng from "./pages/tools/PdfToPng";
import PngToPdf from "./pages/tools/PngToPdf";
import OrganizePdf from "./pages/tools/OrganizePdf";
import ExtractPages from "./pages/tools/ExtractPages";
import AddPageNumbers from "./pages/tools/AddPageNumbers";
import HtmlToPdf from "./pages/tools/HtmlToPdf";
import SignPdf from "./pages/tools/SignPdf";
import CropPdf from "./pages/tools/CropPdf";

// Image Tools
import CompressImage from "./pages/tools/CompressImage";
import RemoveBackground from "./pages/tools/RemoveBackground";

// Info Pages
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

// Blog
import Blog from "./pages/Blog";
import HowToMergePdf from "./pages/blog/HowToMergePdf";
import HowToCompressPdf from "./pages/blog/HowToCompressPdf";
import PdfToWordGuide from "./pages/blog/PdfToWordGuide";
import JpgToPdfGuide from "./pages/blog/JpgToPdfGuide";
import SplitPdfGuide from "./pages/blog/SplitPdfGuide";
import PdfToJpgGuide from "./pages/blog/PdfToJpgGuide";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              
              {/* PDF Tools */}
              <Route path="merge-pdf" element={<MergePdf />} />
              <Route path="split-pdf" element={<SplitPdf />} />
              <Route path="compress-pdf" element={<CompressPdf />} />
              <Route path="pdf-to-word" element={<PdfToWord />} />
              <Route path="word-to-pdf" element={<WordToPdf />} />
              <Route path="pdf-to-jpg" element={<PdfToJpg />} />
              <Route path="jpg-to-pdf" element={<JpgToPdf />} />
              <Route path="rotate-pdf" element={<RotatePdf />} />
              <Route path="add-watermark" element={<AddWatermark />} />
              <Route path="unlock-pdf" element={<UnlockPdf />} />
              <Route path="protect-pdf" element={<ProtectPdf />} />
              <Route path="pdf-to-png" element={<PdfToPng />} />
              <Route path="png-to-pdf" element={<PngToPdf />} />
              <Route path="organize-pdf" element={<OrganizePdf />} />
              <Route path="extract-pages" element={<ExtractPages />} />
              <Route path="add-page-numbers" element={<AddPageNumbers />} />
              <Route path="html-to-pdf" element={<HtmlToPdf />} />
              <Route path="sign-pdf" element={<SignPdf />} />
              <Route path="crop-pdf" element={<CropPdf />} />
              
              {/* Image Tools */}
              <Route path="compress-image" element={<CompressImage />} />
              <Route path="remove-background" element={<RemoveBackground />} />
              
              {/* Blog */}
              <Route path="blog" element={<Blog />} />
              <Route path="blog/how-to-merge-pdf-files-free" element={<HowToMergePdf />} />
              <Route path="blog/how-to-compress-pdf-files-free" element={<HowToCompressPdf />} />
              <Route path="blog/pdf-to-word-converter-guide" element={<PdfToWordGuide />} />
              <Route path="blog/jpg-to-pdf-converter-guide" element={<JpgToPdfGuide />} />
              <Route path="blog/how-to-split-pdf-files-free" element={<SplitPdfGuide />} />
              <Route path="blog/pdf-to-jpg-converter-guide" element={<PdfToJpgGuide />} />
              
              {/* Info Pages */}
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="privacy-policy" element={<PrivacyPolicy />} />
              <Route path="terms-of-service" element={<TermsOfService />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;