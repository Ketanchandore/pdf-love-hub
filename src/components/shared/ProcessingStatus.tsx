import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ProcessingStatusProps {
  progress: number;
  message?: string;
  isProcessing?: boolean;
  isComplete?: boolean;
  onDownload?: () => void;
  downloadLabel?: string;
}

const ProcessingStatus = ({
  progress,
  message = "Processing your files...",
  isProcessing = true,
  isComplete = false,
  onDownload,
  downloadLabel = "Download",
}: ProcessingStatusProps) => {
  if (isComplete && onDownload) {
    return (
      <div className="w-full space-y-4 p-6 bg-muted/50 rounded-xl border border-border">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Download className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Processing Complete!</h3>
            <p className="text-sm text-muted-foreground mt-1">Your file is ready to download</p>
          </div>
          <Button onClick={onDownload} size="lg" className="gap-2">
            <Download className="h-5 w-5" />
            {downloadLabel}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 p-6 bg-muted/50 rounded-xl border border-border">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="font-medium">{message}</span>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-muted-foreground">{Math.round(progress)}% complete</p>
      </div>
    </div>
  );
};

export default ProcessingStatus;
