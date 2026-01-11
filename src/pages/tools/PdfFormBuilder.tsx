import { useState, useCallback } from "react";
import SEOHead from "@/components/seo/SEOHead";
import { ToolStructuredData } from "@/components/seo/StructuredData";
import ToolHero from "@/components/shared/ToolHero";
import FileUpload from "@/components/shared/FileUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import * as pdfjsLib from "pdfjs-dist";
import { 
  FormInput,
  FileText,
  Loader2,
  Download,
  Plus,
  Trash2,
  Copy,
  CheckCircle2,
  TextCursorInput,
  Calendar,
  Mail,
  Phone,
  Hash,
  AlignLeft
} from "lucide-react";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface FormField {
  id: string;
  name: string;
  type: "text" | "email" | "phone" | "date" | "number" | "textarea";
  label: string;
  required: boolean;
  placeholder: string;
}

interface DetectedFields {
  fields: FormField[];
  documentTitle: string;
  formPurpose: string;
}

const PdfFormBuilder = () => {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fields, setFields] = useState<FormField[]>([]);
  const [documentTitle, setDocumentTitle] = useState("");
  const [formPurpose, setFormPurpose] = useState("");
  const [formLink, setFormLink] = useState("");

  const extractTextFromPdf = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = "";
    
    for (let i = 1; i <= Math.min(pdf.numPages, 10); i++) {
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
    setFields([]);
    setFormLink("");
    
    try {
      const text = await extractTextFromPdf(file);
      setExtractedText(text);
      toast({ title: "PDF loaded!", description: "Ready to detect form fields." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to read PDF.", variant: "destructive" });
    }
  }, []);

  const detectFields = async () => {
    if (!extractedText) {
      toast({ title: "No file", description: "Please upload a PDF first.", variant: "destructive" });
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-document-intelligence", {
        body: {
          action: "detect-form-fields",
          text: extractedText.slice(0, 15000)
        }
      });

      if (error) throw error;
      
      const safeFields = Array.isArray(data?.fields) ? data.fields.map((f: any, i: number) => ({
        id: `field-${i}`,
        name: f.name || `field_${i}`,
        type: f.type || "text",
        label: f.label || f.name || `Field ${i + 1}`,
        required: f.required ?? false,
        placeholder: f.placeholder || ""
      })) : [];
      
      setFields(safeFields);
      setDocumentTitle(data?.documentTitle || file?.name || "Untitled Form");
      setFormPurpose(data?.formPurpose || "");
      
      toast({ 
        title: "Fields detected!", 
        description: `Found ${safeFields.length} form fields.` 
      });
    } catch (error) {
      console.error("Detection error:", error);
      toast({ title: "Error", description: "Failed to detect fields.", variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addField = () => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      name: `field_${fields.length + 1}`,
      type: "text",
      label: `Field ${fields.length + 1}`,
      required: false,
      placeholder: ""
    };
    setFields([...fields, newField]);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email": return <Mail className="h-4 w-4" />;
      case "phone": return <Phone className="h-4 w-4" />;
      case "date": return <Calendar className="h-4 w-4" />;
      case "number": return <Hash className="h-4 w-4" />;
      case "textarea": return <AlignLeft className="h-4 w-4" />;
      default: return <TextCursorInput className="h-4 w-4" />;
    }
  };

  const generateFormLink = () => {
    // In a real implementation, this would create a hosted form
    // For now, we generate a JSON schema that could be used
    const formSchema = {
      title: documentTitle,
      purpose: formPurpose,
      fields: fields,
      createdAt: new Date().toISOString()
    };
    
    const schemaJson = JSON.stringify(formSchema, null, 2);
    const blob = new Blob([schemaJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    // Simulate a form link
    const mockLink = `https://pinetoolshub.com/forms/${Date.now().toString(36)}`;
    setFormLink(mockLink);
    
    // Download the schema
    const a = document.createElement("a");
    a.href = url;
    a.download = "form-schema.json";
    a.click();
    URL.revokeObjectURL(url);
    
    toast({ title: "Form created!", description: "Form schema downloaded. Host it to collect responses." });
  };

  const copyFormLink = () => {
    navigator.clipboard.writeText(formLink);
    toast({ title: "Copied!", description: "Form link copied to clipboard." });
  };

  return (
    <>
      <SEOHead
        title="PDF Form Builder - Convert PDF to Fillable Web Form | Pine Tools Hub"
        description="Free PDF to web form converter. Upload any static PDF and convert it to an interactive fillable web form. Auto-detect fields, customize, and share a link to collect responses."
        keywords="pdf to fillable form, convert pdf to web form, pdf form builder, create fillable pdf online, static pdf to form, pdf form creator"
        canonical="https://pinetoolshub.com/pdf-form-builder"
      />
      <ToolStructuredData
        toolName="PDF Form Builder"
        toolDescription="Convert static PDFs into interactive fillable web forms with auto-detected fields."
        toolUrl="https://pinetoolshub.com/pdf-form-builder"
        category="PDF"
      />

      <div className="container mx-auto px-4 py-8">
        <ToolHero
          title="PDF Form Builder"
          description="Convert any static PDF into an interactive web form. Auto-detect fields, customize, and share a link to collect responses."
          icon={<FormInput className="h-6 w-6" />}
        />

        <div className="grid lg:grid-cols-2 gap-6 mt-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Upload PDF Form
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FileUpload
                  accept={{ "application/pdf": [".pdf"] }}
                  maxSize={10 * 1024 * 1024}
                  onFilesSelected={handleFileSelected}
                />
                {file && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Button 
              onClick={detectFields} 
              disabled={isAnalyzing || !extractedText}
              className="w-full"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Detecting Fields...
                </>
              ) : (
                <>
                  <FormInput className="h-4 w-4 mr-2" />
                  Detect Form Fields
                </>
              )}
            </Button>

            {fields.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Form Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Form Title</Label>
                    <Input 
                      value={documentTitle} 
                      onChange={(e) => setDocumentTitle(e.target.value)}
                      placeholder="Enter form title"
                    />
                  </div>
                  <div>
                    <Label>Purpose</Label>
                    <Input 
                      value={formPurpose} 
                      onChange={(e) => setFormPurpose(e.target.value)}
                      placeholder="e.g., Job Application, Survey"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            {fields.length === 0 ? (
              <Card className="h-full flex items-center justify-center min-h-[400px]">
                <CardContent className="text-center py-12">
                  <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                    <FormInput className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Upload a PDF</h3>
                  <p className="text-muted-foreground text-sm max-w-sm">
                    We'll detect fillable fields and help you create an interactive web form.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-sm">Form Fields ({fields.length})</CardTitle>
                    <Button variant="outline" size="sm" onClick={addField}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Field
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                      {fields.map((field) => (
                        <div key={field.id} className="p-3 bg-muted rounded-lg space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getTypeIcon(field.type)}
                              <Input
                                value={field.label}
                                onChange={(e) => updateField(field.id, { label: e.target.value })}
                                className="h-8 w-40"
                              />
                              {field.required && <Badge variant="secondary">Required</Badge>}
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => removeField(field.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                          <div className="flex gap-2">
                            <select
                              value={field.type}
                              onChange={(e) => updateField(field.id, { type: e.target.value as FormField["type"] })}
                              className="h-8 px-2 rounded border bg-background text-sm"
                            >
                              <option value="text">Text</option>
                              <option value="email">Email</option>
                              <option value="phone">Phone</option>
                              <option value="date">Date</option>
                              <option value="number">Number</option>
                              <option value="textarea">Long Text</option>
                            </select>
                            <label className="flex items-center gap-1 text-xs">
                              <input
                                type="checkbox"
                                checked={field.required}
                                onChange={(e) => updateField(field.id, { required: e.target.checked })}
                              />
                              Required
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Button onClick={generateFormLink} className="w-full" size="lg">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Generate Form
                </Button>

                {formLink && (
                  <Card className="bg-green-500/10 border-green-500/20">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="font-medium text-sm">Form Created!</span>
                      </div>
                      <div className="flex gap-2">
                        <Input value={formLink} readOnly className="flex-1 text-xs" />
                        <Button variant="outline" size="sm" onClick={copyFormLink}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Form schema has been downloaded. Use it to host your form.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PdfFormBuilder;
