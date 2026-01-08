import { useState, useCallback, useRef, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/seo/SEOHead";
import { ToolStructuredData, FAQStructuredData } from "@/components/seo/StructuredData";
import ToolHero from "@/components/shared/ToolHero";
import FileUpload from "@/components/shared/FileUpload";
import FAQSection from "@/components/seo/FAQSection";
import { Volume2, Play, Pause, Square, SkipBack, SkipForward, ChevronLeft, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const VoicePdfReader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [rate, setRate] = useState([1]);
  const [pitch, setPitch] = useState([1]);
  const [progress, setProgress] = useState(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !selectedVoice) {
        // Prefer English voices
        const englishVoice = availableVoices.find((v) => v.lang.startsWith("en"));
        setSelectedVoice(englishVoice?.name || availableVoices[0].name);
      }
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      speechSynthesis.cancel();
    };
  }, [selectedVoice]);

  const handleFilesSelected = async (files: File[]) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      stopSpeaking();
      
      if (selectedFile.type === "application/pdf") {
        try {
          const arrayBuffer = await selectedFile.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          const extractedPages: string[] = [];
          
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
              .map((item: any) => item.str)
              .join(" ")
              .replace(/\s+/g, " ")
              .trim();
            extractedPages.push(pageText);
          }
          
          setPages(extractedPages);
          setCurrentPage(0);
          toast({
            title: "PDF Loaded",
            description: `Ready to read ${pdf.numPages} pages`,
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to extract text from PDF",
            variant: "destructive",
          });
        }
      }
    }
  };

  const speakPage = useCallback((pageIndex: number) => {
    if (pageIndex < 0 || pageIndex >= pages.length) return;

    speechSynthesis.cancel();
    const text = pages[pageIndex];
    
    if (!text.trim()) {
      toast({
        title: "Empty Page",
        description: "This page has no text to read",
      });
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate[0];
    utterance.pitch = pitch[0];
    
    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) utterance.voice = voice;

    utterance.onstart = () => {
      setIsPlaying(true);
      setProgress(0);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setProgress(100);
      // Auto-advance to next page
      if (pageIndex < pages.length - 1) {
        setCurrentPage(pageIndex + 1);
        setTimeout(() => speakPage(pageIndex + 1), 500);
      }
    };

    utterance.onboundary = (event) => {
      if (event.charIndex !== undefined) {
        const progressPercent = (event.charIndex / text.length) * 100;
        setProgress(progressPercent);
      }
    };

    utterance.onerror = (event) => {
      console.error("Speech error:", event);
      setIsPlaying(false);
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  }, [pages, rate, pitch, selectedVoice, voices, toast]);

  const togglePlayPause = () => {
    if (isPlaying) {
      speechSynthesis.pause();
      setIsPlaying(false);
    } else if (speechSynthesis.paused) {
      speechSynthesis.resume();
      setIsPlaying(true);
    } else {
      speakPage(currentPage);
    }
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setProgress(0);
  };

  const goToPage = (pageIndex: number) => {
    if (pageIndex >= 0 && pageIndex < pages.length) {
      setCurrentPage(pageIndex);
      stopSpeaking();
    }
  };

  const skipBack = () => {
    stopSpeaking();
    speakPage(currentPage);
  };

  const skipForward = () => {
    if (currentPage < pages.length - 1) {
      goToPage(currentPage + 1);
      speakPage(currentPage + 1);
    }
  };

  const faqs = [
    {
      question: "How does the voice PDF reader work?",
      answer: "Our tool uses the Web Speech API built into modern browsers to convert the text from your PDF into natural-sounding speech. The processing happens entirely in your browser, so your documents stay private.",
    },
    {
      question: "Which voices are available?",
      answer: "The available voices depend on your browser and operating system. Most systems include multiple English voices plus voices for other languages. Chrome typically offers the most voice options.",
    },
    {
      question: "Can I adjust the reading speed?",
      answer: "Yes! Use the speed slider to adjust from 0.5x (slower) to 2x (faster). This is helpful for studying complex material slowly or reviewing familiar content quickly.",
    },
    {
      question: "Does it work on mobile devices?",
      answer: "Yes, the voice reader works on most modern mobile browsers. However, some mobile browsers may have limited voice options or require the screen to stay on during playback.",
    },
    {
      question: "Can I read documents in other languages?",
      answer: "Yes! Select a voice in your target language from the voice dropdown. The reader will use that voice's pronunciation and intonation for the text.",
    },
  ];

  return (
    <>
      <SEOHead
        title="Voice PDF Reader | Listen to Your Documents with Text-to-Speech"
        description="Convert any PDF to audio using natural text-to-speech. Listen to your documents, books, and study materials on the go. Free and works offline."
        canonicalUrl="https://pinetoolshub.com/voice-pdf-reader"
        keywords="PDF reader, text to speech, voice reader, audio PDF, listen to PDF, TTS, document reader, accessibility tool"
      />
      <ToolStructuredData
        name="Voice PDF Reader"
        description="Listen to your PDF documents with natural text-to-speech"
        category="PDF"
      />
      <FAQStructuredData faqs={faqs} />

      <div className="container max-w-4xl mx-auto px-4 py-8">
        <ToolHero
          title="Voice PDF Reader"
          description="Listen to your PDF documents with natural text-to-speech. Perfect for studying on the go, accessibility, or multitasking."
          icon={<Volume2 className="h-6 w-6" />}
        />

        <div className="mt-8 space-y-6">
          <Card className="border-2 border-dashed">
            <CardContent className="p-6 space-y-6">
              <FileUpload
                acceptedFormats={{
                  "application/pdf": [".pdf"],
                }}
                maxSize={20 * 1024 * 1024}
                onFilesSelected={handleFilesSelected}
              />
            </CardContent>
          </Card>

          {pages.length > 0 && (
            <Card>
              <CardContent className="p-6 space-y-6">
                {/* Now Playing */}
                <div className="text-center">
                  <h3 className="font-semibold text-lg">{file?.name}</h3>
                  <p className="text-muted-foreground">
                    Page {currentPage + 1} of {pages.length}
                  </p>
                </div>

                {/* Progress */}
                <Progress value={progress} className="h-2" />

                {/* Page Preview */}
                <div className="bg-muted/50 rounded-lg p-4 max-h-40 overflow-y-auto">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {pages[currentPage]?.slice(0, 500) || "No text on this page"}
                    {pages[currentPage]?.length > 500 && "..."}
                  </p>
                </div>

                {/* Playback Controls */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 0}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={skipBack}
                  >
                    <SkipBack className="h-5 w-5" />
                  </Button>
                  <Button
                    size="lg"
                    className="h-14 w-14 rounded-full"
                    onClick={togglePlayPause}
                  >
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={stopSpeaking}
                  >
                    <Square className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={skipForward}
                    disabled={currentPage === pages.length - 1}
                  >
                    <SkipForward className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === pages.length - 1}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>

                {/* Voice Settings */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label className="mb-2 block">Voice</Label>
                    <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select voice" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {voices.map((voice) => (
                          <SelectItem key={voice.name} value={voice.name}>
                            {voice.name} ({voice.lang})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="mb-2 block">Speed: {rate[0]}x</Label>
                    <Slider
                      value={rate}
                      onValueChange={(v) => setRate(v)}
                      min={0.5}
                      max={2}
                      step={0.1}
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Pitch: {pitch[0]}</Label>
                    <Slider
                      value={pitch}
                      onValueChange={(v) => setPitch(v)}
                      min={0.5}
                      max={2}
                      step={0.1}
                    />
                  </div>
                </div>

                {/* Page Navigation */}
                <div className="flex flex-wrap gap-1 justify-center">
                  {pages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goToPage(idx)}
                      className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                        idx === currentPage
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted-foreground/20"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mt-12 prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold mb-4">Learn by Listening</h2>
          <p className="text-muted-foreground">
            The Voice PDF Reader transforms your documents into audio, enabling you to learn while commuting,
            exercising, or doing chores. It's a powerful tool for auditory learners and anyone looking to
            maximize their time.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Accessibility Made Easy</h3>
          <p className="text-muted-foreground">
            For users with visual impairments or reading difficulties, this tool provides an accessible way
            to consume written content. The adjustable speed and voice options ensure a comfortable experience.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Study Smarter, Not Harder</h3>
          <p className="text-muted-foreground">
            Research shows that combining visual and auditory learning improves retention. Use this tool
            alongside reading to reinforce your understanding of complex material.
          </p>
        </div>

        <FAQSection faqs={faqs} />
      </div>
    </>
  );
};

export default VoicePdfReader;
