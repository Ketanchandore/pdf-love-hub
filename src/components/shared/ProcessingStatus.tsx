import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ProcessingStatusProps {
  isProcessing: boolean;
  progress: number;
  isComplete: boolean;
  onDownload: () => void;
  downloadLabel?: string;
}

const ProcessingStatus = ({
  isProcessing,
  progress,
  isComplete,
  onDownload,
  downloadLabel = "Download",
}: ProcessingStatusProps) => {
  if (!isProcessing && !isComplete) return null;

  return (
    <div className="w-full space-y-4 p-6 bg-muted/50 rounded-xl border border-border">
      {isProcessing && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="font-medium">Processing your files...</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground">{Math.round(progress)}% complete</p>
        </div>
      )}

      {isComplete && (
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
      )}
    </div>
  );
};

export default ProcessingStatus;
