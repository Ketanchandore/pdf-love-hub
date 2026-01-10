import { useState, useCallback, useRef } from "react";
import SEOHead from "@/components/seo/SEOHead";
import { ToolStructuredData } from "@/components/seo/StructuredData";
import ToolHero from "@/components/shared/ToolHero";
import FileUpload from "@/components/shared/FileUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import * as pdfjsLib from "pdfjs-dist";
import { 
  Headphones, 
  Play, 
  Pause, 
  Download,
  Loader2,
  Mic,
  Users,
  Volume2,
  FileAudio,
  Sparkles
} from "lucide-react";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PodcastSegment {
  speaker: "host" | "expert";
  text: string;
}

const PdfToPodcast = () => {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [podcastScript, setPodcastScript] = useState<PodcastSegment[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSegment, setCurrentSegment] = useState(0);
  const [podcastStyle, setPodcastStyle] = useState("conversational");
  const [duration, setDuration] = useState([5]); // minutes
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const extractTextFromPdf = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = "";
    
    for (let i = 1; i <= Math.min(pdf.numPages, 50); i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(" ") + "\n";
    }
    
    return text;
  };

  const handleFileSelected = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setFile(file);
    
    try {
      const text = await extractTextFromPdf(file);
      setExtractedText(text);
      toast({ title: "PDF loaded!", description: `Extracted ${text.split(" ").length} words.` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to extract text.", variant: "destructive" });
    }
  }, []);

  const generatePodcast = async () => {
    if (!extractedText) {
      toast({ title: "No content", description: "Please upload a PDF first.", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-document-intelligence", {
        body: {
          action: "pdf-to-podcast",
          text: extractedText.slice(0, 15000),
          style: podcastStyle,
          durationMinutes: duration[0]
        }
      });

      if (error) throw error;
      setPodcastScript(data.segments);
      toast({ title: "Podcast generated!", description: `Created ${data.segments.length} dialogue segments.` });
    } catch (error) {
      console.error("Generation error:", error);
      toast({ title: "Error", description: "Failed to generate podcast.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const playPodcast = () => {
    if (!podcastScript.length) return;

    if (isPlaying) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    playSpeech(currentSegment);
  };

  const playSpeech = (index: number) => {
    if (index >= podcastScript.length) {
      setIsPlaying(false);
      setCurrentSegment(0);
      return;
    }

    const segment = podcastScript[index];
    const utterance = new SpeechSynthesisUtterance(segment.text);
    
    // Different voices for host and expert
    const voices = speechSynthesis.getVoices();
    const maleVoice = voices.find(v => v.name.includes("Male") || v.name.includes("David"));
    const femaleVoice = voices.find(v => v.name.includes("Female") || v.name.includes("Samantha"));
    
    utterance.voice = segment.speaker === "host" ? (maleVoice || voices[0]) : (femaleVoice || voices[1]);
    utterance.rate = 0.95;
    utterance.pitch = segment.speaker === "host" ? 1.0 : 1.1;

    utterance.onend = () => {
      setCurrentSegment(index + 1);
      playSpeech(index + 1);
    };

    speechRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const downloadScript = () => {
    const scriptText = podcastScript.map(s => 
      `[${s.speaker.toUpperCase()}]: ${s.text}`
    ).join("\n\n");
    
    const blob = new Blob([scriptText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "podcast-script.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <SEOHead
        title="PDF to Podcast - Listen to PDF as Audio Conversation | Pine Tools Hub"
        description="Convert your PDF documents into engaging podcast-style audio conversations. AI generates a 2-person dialogue that explains the content naturally. Perfect for learning on the go!"
        keywords="pdf to podcast, listen to pdf, convert pdf to audio, pdf audiobook maker, document to podcast, ai podcast generator, study pdf while driving"
        canonical="https://pinetoolshub.com/pdf-to-podcast"
      />
      <ToolStructuredData
        toolName="PDF to Podcast"
        toolDescription="Convert PDF documents into podcast-style audio conversations with AI-generated dialogue."
        toolUrl="https://pinetoolshub.com/pdf-to-podcast"
        category="PDF"
      />

      <div className="container mx-auto px-4 py-8">
        <ToolHero
          title="PDF to Podcast"
          description="Transform your documents into engaging podcast conversations. Listen to your PDFs like a professional podcast while driving, exercising, or relaxing."
          icon={<Headphones className="h-6 w-6" />}
        />

        <div className="grid lg:grid-cols-2 gap-6 mt-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileAudio className="h-5 w-5" />
                  Upload PDF Document
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FileUpload
                  accept={{ "application/pdf": [".pdf"] }}
                  maxSize={20 * 1024 * 1024}
                  onFilesSelected={handleFileSelected}
                />
                {file && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {extractedText.split(" ").length.toLocaleString()} words extracted
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Podcast Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Conversation Style</label>
                  <Select value={podcastStyle} onValueChange={setPodcastStyle}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conversational">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Casual Conversation
                        </div>
                      </SelectItem>
                      <SelectItem value="educational">
                        <div className="flex items-center gap-2">
                          <Mic className="h-4 w-4" />
                          Educational Deep Dive
                        </div>
                      </SelectItem>
                      <SelectItem value="interview">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Interview Style
                        </div>
                      </SelectItem>
                      <SelectItem value="summary">
                        <div className="flex items-center gap-2">
                          <Volume2 className="h-4 w-4" />
                          Quick Summary
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Target Duration: {duration[0]} minutes
                  </label>
                  <Slider
                    value={duration}
                    onValueChange={setDuration}
                    min={2}
                    max={15}
                    step={1}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={generatePodcast} 
              disabled={isGenerating || !extractedText}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Podcast Script...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Podcast
                </>
              )}
            </Button>
          </div>

          {/* Player Section */}
          <div className="space-y-6">
            {podcastScript.length === 0 ? (
              <Card className="h-full flex items-center justify-center min-h-[400px]">
                <CardContent className="text-center py-12">
                  <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                    <Headphones className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Your Podcast Awaits</h3>
                  <p className="text-muted-foreground text-sm max-w-sm">
                    Upload a PDF and we'll transform it into an engaging two-person podcast conversation.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Player Controls */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-medium">Your Podcast</h3>
                        <p className="text-sm text-muted-foreground">
                          {podcastScript.length} segments • ~{duration[0]} min
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={playPodcast}
                        >
                          {isPlaying ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={downloadScript}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all"
                        style={{ width: `${(currentSegment / podcastScript.length) * 100}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Transcript */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Conversation Transcript</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto">
                      {podcastScript.map((segment, index) => (
                        <div 
                          key={index}
                          className={`flex gap-3 p-3 rounded-lg transition-all ${
                            currentSegment === index && isPlaying 
                              ? "bg-primary/10 ring-2 ring-primary" 
                              : "bg-muted/50"
                          }`}
                        >
                          <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            segment.speaker === "host" 
                              ? "bg-blue-500 text-white" 
                              : "bg-purple-500 text-white"
                          }`}>
                            {segment.speaker === "host" ? "H" : "E"}
                          </div>
                          <div>
                            <Badge variant="secondary" className="mb-1">
                              {segment.speaker === "host" ? "Host" : "Expert"}
                            </Badge>
                            <p className="text-sm">{segment.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PdfToPodcast;
