import { useState, useRef } from "react";
import { Captions, Download, Upload, Play, Pause, Plus, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import SEOHead from "@/components/seo/SEOHead";
import ToolHero from "@/components/shared/ToolHero";
import FAQSection from "@/components/seo/FAQSection";
import { ToolStructuredData } from "@/components/seo/StructuredData";

interface Subtitle {
  id: number;
  startTime: string;
  endTime: string;
  text: string;
}

const SubtitleGenerator = () => {
  const [subtitles, setSubtitles] = useState<Subtitle[]>([
    { id: 1, startTime: "00:00:00,000", endTime: "00:00:03,000", text: "Welcome to our video!" },
    { id: 2, startTime: "00:00:03,500", endTime: "00:00:07,000", text: "This is a sample subtitle." },
  ]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [exportFormat, setExportFormat] = useState<"srt" | "vtt">("srt");
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
    }
  };

  const addSubtitle = () => {
    const lastSub = subtitles[subtitles.length - 1];
    const newStart = lastSub ? lastSub.endTime.replace(",", ".") : "00:00:00,000";
    const newId = Math.max(...subtitles.map(s => s.id), 0) + 1;
    
    setSubtitles([...subtitles, {
      id: newId,
      startTime: newStart.replace(".", ","),
      endTime: incrementTime(newStart.replace(".", ",")),
      text: "",
    }]);
  };

  const incrementTime = (time: string): string => {
    const parts = time.split(/[:,]/);
    let hours = parseInt(parts[0]);
    let minutes = parseInt(parts[1]);
    let seconds = parseInt(parts[2]) + 3;
    const ms = parts[3] || "000";

    if (seconds >= 60) { seconds -= 60; minutes += 1; }
    if (minutes >= 60) { minutes -= 60; hours += 1; }

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")},${ms}`;
  };

  const updateSubtitle = (id: number, field: keyof Subtitle, value: string) => {
    setSubtitles(subtitles.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const deleteSubtitle = (id: number) => {
    setSubtitles(subtitles.filter(s => s.id !== id));
  };

  const exportSubtitles = () => {
    let content = "";
    
    if (exportFormat === "srt") {
      subtitles.forEach((sub, index) => {
        content += `${index + 1}\n`;
        content += `${sub.startTime} --> ${sub.endTime}\n`;
        content += `${sub.text}\n\n`;
      });
    } else {
      content = "WEBVTT\n\n";
      subtitles.forEach((sub, index) => {
        const start = sub.startTime.replace(",", ".");
        const end = sub.endTime.replace(",", ".");
        content += `${index + 1}\n`;
        content += `${start} --> ${end}\n`;
        content += `${sub.text}\n\n`;
      });
    }

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `subtitles.${exportFormat}`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`Subtitles exported as ${exportFormat.toUpperCase()}!`);
  };

  const importSubtitles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const lines = content.split("\n");
      const newSubtitles: Subtitle[] = [];
      let currentSub: Partial<Subtitle> = {};
      let id = 1;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (/^\d+$/.test(line)) {
          if (currentSub.text) {
            newSubtitles.push(currentSub as Subtitle);
          }
          currentSub = { id: id++ };
        } else if (line.includes("-->")) {
          const [start, end] = line.split("-->").map(t => t.trim());
          currentSub.startTime = start.replace(".", ",");
          currentSub.endTime = end.replace(".", ",");
        } else if (line && !line.startsWith("WEBVTT")) {
          currentSub.text = (currentSub.text ? currentSub.text + " " : "") + line;
        }
      }

      if (currentSub.text) {
        newSubtitles.push(currentSub as Subtitle);
      }

      if (newSubtitles.length > 0) {
        setSubtitles(newSubtitles);
        toast.success(`Imported ${newSubtitles.length} subtitles!`);
      }
    };
    reader.readAsText(file);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const faqs = [
    { question: "What subtitle formats are supported?", answer: "We support SRT (SubRip) and VTT (WebVTT) formats. SRT is widely compatible with most video players and platforms. VTT is the web standard." },
    { question: "Can I import existing subtitles?", answer: "Yes! Click 'Import SRT/VTT' to load an existing subtitle file for editing." },
    { question: "How do I time my subtitles?", answer: "Use the format HH:MM:SS,mmm (hours:minutes:seconds,milliseconds). You can also preview with a video file." },
    { question: "What's the best subtitle duration?", answer: "Keep subtitles visible for 1-7 seconds. Shorter subtitles (under 1 second) are hard to read." },
    { question: "Can I add styling to subtitles?", answer: "SRT format supports basic styling. VTT format supports more advanced CSS styling for web use." },
  ];

  return (
    <>
      <SEOHead
        title="Subtitle Generator & Editor - Create SRT/VTT Files | Free Online"
        description="Create and edit subtitles for videos. Export as SRT or VTT format. Import existing subtitles, sync with video preview. Free online subtitle editor."
        keywords="subtitle generator, srt editor, vtt editor, create subtitles online, subtitle maker, video captions, free subtitle editor, srt file creator"
        canonical="https://pinetoolshub.com/subtitle-generator"
      />
      <ToolStructuredData
        toolName="Subtitle Generator & Editor"
        toolDescription="Create and edit subtitles for videos. Export as SRT or VTT format with video preview sync."
        toolUrl="https://pinetoolshub.com/subtitle-generator"
        category="Image"
      />

      <ToolHero
        title="Subtitle Generator & Editor"
        description="Create professional subtitles for your videos. Edit timings, export as SRT or VTT, preview with video sync."
        icon={<Captions className="h-6 w-6" />}
      />

      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Video Preview */}
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-4">Video Preview (Optional)</h3>
                    {videoUrl ? (
                      <div className="space-y-4">
                        <video
                          ref={videoRef}
                          src={videoUrl}
                          className="w-full rounded-lg"
                          onPlay={() => setIsPlaying(true)}
                          onPause={() => setIsPlaying(false)}
                        />
                        <div className="flex gap-2">
                          <Button onClick={togglePlay} variant="outline" size="sm">
                            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                          <Button onClick={() => setVideoUrl(null)} variant="outline" size="sm">
                            Remove Video
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Upload video for preview (optional)</p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="video/*"
                          onChange={handleVideoUpload}
                          className="hidden"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-4">Import/Export</h3>
                    <div className="space-y-4">
                      <div>
                        <Label>Import Subtitles</Label>
                        <Input type="file" accept=".srt,.vtt" onChange={importSubtitles} />
                      </div>
                      <div>
                        <Label>Export Format</Label>
                        <Select value={exportFormat} onValueChange={(v) => setExportFormat(v as "srt" | "vtt")}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="srt">SRT (SubRip)</SelectItem>
                            <SelectItem value="vtt">VTT (WebVTT)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={exportSubtitles} className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Export Subtitles
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Subtitle Editor */}
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold">Subtitles ({subtitles.length})</h3>
                      <Button onClick={addSubtitle} size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto">
                      {subtitles.map((sub, index) => (
                        <div key={sub.id} className="p-3 bg-muted rounded-lg space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">#{index + 1}</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => deleteSubtitle(sub.id)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs flex items-center gap-1">
                                <Clock className="h-3 w-3" /> Start
                              </Label>
                              <Input
                                value={sub.startTime}
                                onChange={(e) => updateSubtitle(sub.id, "startTime", e.target.value)}
                                placeholder="00:00:00,000"
                                className="text-sm"
                              />
                            </div>
                            <div>
                              <Label className="text-xs flex items-center gap-1">
                                <Clock className="h-3 w-3" /> End
                              </Label>
                              <Input
                                value={sub.endTime}
                                onChange={(e) => updateSubtitle(sub.id, "endTime", e.target.value)}
                                placeholder="00:00:03,000"
                                className="text-sm"
                              />
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs">Text</Label>
                            <Textarea
                              value={sub.text}
                              onChange={(e) => updateSubtitle(sub.id, "text", e.target.value)}
                              placeholder="Subtitle text..."
                              rows={2}
                              className="text-sm"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQSection faqs={faqs} toolName="Subtitle Generator" />
    </>
  );
};

export default SubtitleGenerator;
