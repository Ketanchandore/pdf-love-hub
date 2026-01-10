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
import PdfToExcel from "./pages/tools/PdfToExcel";
import PdfToPowerPoint from "./pages/tools/PdfToPowerPoint";
import PowerPointToPdf from "./pages/tools/PowerPointToPdf";
import ExcelToPdf from "./pages/tools/ExcelToPdf";
import OcrPdf from "./pages/tools/OcrPdf";
import RepairPdf from "./pages/tools/RepairPdf";
import ComparePdf from "./pages/tools/ComparePdf";
import RedactPdf from "./pages/tools/RedactPdf";

// Image Tools
import CompressImage from "./pages/tools/CompressImage";
import RemoveBackground from "./pages/tools/RemoveBackground";

// Text Tools
import WordCounter from "./pages/tools/WordCounter";
import LoremIpsum from "./pages/tools/LoremIpsum";
import CaseConverter from "./pages/tools/CaseConverter";
import TextCompare from "./pages/tools/TextCompare";

// Calculator Tools
import AgeCalculator from "./pages/tools/AgeCalculator";
import PercentageCalculator from "./pages/tools/PercentageCalculator";
import BMICalculator from "./pages/tools/BMICalculator";

// QR Code
import QRCodeGenerator from "./pages/tools/QRCodeGenerator";

// AI Intelligence Tools
import SemanticPdfAssistant from "./pages/tools/SemanticPdfAssistant";
import DecisionIntelligence from "./pages/tools/DecisionIntelligence";
import DocumentChat from "./pages/tools/DocumentChat";

// Education Tools
import FlashcardGenerator from "./pages/tools/FlashcardGenerator";
import ExamQuestionGenerator from "./pages/tools/ExamQuestionGenerator";
import MindmapGenerator from "./pages/tools/MindmapGenerator";
import PdfSummarizer from "./pages/tools/PdfSummarizer";
import StudyPlanner from "./pages/tools/StudyPlanner";
import VoicePdfReader from "./pages/tools/VoicePdfReader";

// New AI Tools
import ResumeOptimizer from "./pages/tools/ResumeOptimizer";
import PdfToPodcast from "./pages/tools/PdfToPodcast";
import BankStatementExtractor from "./pages/tools/BankStatementExtractor";
import ContractRiskScanner from "./pages/tools/ContractRiskScanner";
import LinkedInCarouselGenerator from "./pages/tools/LinkedInCarouselGenerator";
import SmartRedactor from "./pages/tools/SmartRedactor";
import KnowledgeVault from "./pages/tools/KnowledgeVault";

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
              <Route path="pdf-to-excel" element={<PdfToExcel />} />
              <Route path="pdf-to-powerpoint" element={<PdfToPowerPoint />} />
              <Route path="powerpoint-to-pdf" element={<PowerPointToPdf />} />
              <Route path="excel-to-pdf" element={<ExcelToPdf />} />
              <Route path="ocr-pdf" element={<OcrPdf />} />
              <Route path="repair-pdf" element={<RepairPdf />} />
              <Route path="compare-pdf" element={<ComparePdf />} />
              <Route path="redact-pdf" element={<RedactPdf />} />
              
              {/* Image Tools */}
              <Route path="compress-image" element={<CompressImage />} />
              <Route path="remove-background" element={<RemoveBackground />} />
              
              {/* Text Tools */}
              <Route path="word-counter" element={<WordCounter />} />
              <Route path="lorem-ipsum" element={<LoremIpsum />} />
              <Route path="case-converter" element={<CaseConverter />} />
              <Route path="text-compare" element={<TextCompare />} />
              
              {/* Calculator Tools */}
              <Route path="age-calculator" element={<AgeCalculator />} />
              <Route path="percentage-calculator" element={<PercentageCalculator />} />
              <Route path="bmi-calculator" element={<BMICalculator />} />
              
              {/* QR Code */}
              <Route path="qr-code-generator" element={<QRCodeGenerator />} />
              
              {/* AI Intelligence Tools */}
              <Route path="semantic-pdf-assistant" element={<SemanticPdfAssistant />} />
              <Route path="decision-intelligence" element={<DecisionIntelligence />} />
              <Route path="document-chat" element={<DocumentChat />} />
              
              {/* Education Tools */}
              <Route path="flashcard-generator" element={<FlashcardGenerator />} />
              <Route path="exam-question-generator" element={<ExamQuestionGenerator />} />
              <Route path="mindmap-generator" element={<MindmapGenerator />} />
              <Route path="pdf-summarizer" element={<PdfSummarizer />} />
              <Route path="study-planner" element={<StudyPlanner />} />
              <Route path="voice-pdf-reader" element={<VoicePdfReader />} />
              
              {/* New AI Tools */}
              <Route path="resume-optimizer" element={<ResumeOptimizer />} />
              <Route path="pdf-to-podcast" element={<PdfToPodcast />} />
              <Route path="bank-statement-extractor" element={<BankStatementExtractor />} />
              <Route path="contract-risk-scanner" element={<ContractRiskScanner />} />
              <Route path="linkedin-carousel-generator" element={<LinkedInCarouselGenerator />} />
              <Route path="smart-redactor" element={<SmartRedactor />} />
              <Route path="knowledge-vault" element={<KnowledgeVault />} />
              
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