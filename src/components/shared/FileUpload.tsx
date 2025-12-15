import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, FileIcon, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  accept?: Record<string, string[]>;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  onFilesSelected: (files: File[]) => void;
  files: File[];
  onRemoveFile: (index: number) => void;
  label?: string;
  description?: string;
}

const FileUpload = ({
  accept = { "application/pdf": [".pdf"] },
  multiple = true,
  maxFiles = 20,
  maxSize = 100 * 1024 * 1024, // 100MB
  onFilesSelected,
  files,
  onRemoveFile,
  label = "Drop your PDF files here",
  description = "or click to select files",
}: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesSelected(acceptedFiles);
      setIsDragging(false);
    },
    [onFilesSelected]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
    multiple,
    maxFiles,
    maxSize,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const isImage = (file: File) => file.type.startsWith("image/");
  const isPdf = (file: File) => file.type === "application/pdf";

  return (
    <div className="w-full space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "upload-zone",
          isDragging && "dragging"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">{label}</p>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
          <Button type="button" variant="default" className="mt-2">
            Select Files
          </Button>
          <p className="text-xs text-muted-foreground">
            Maximum file size: {formatFileSize(maxSize)}
          </p>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-muted-foreground">
            Selected Files ({files.length})
          </h4>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  {isImage(file) ? (
                    <ImageIcon className="h-5 w-5 text-primary" />
                  ) : (
                    <FileIcon className="h-5 w-5 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => onRemoveFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
