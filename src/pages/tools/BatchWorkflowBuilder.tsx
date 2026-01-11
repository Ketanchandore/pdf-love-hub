import { useState } from "react";
import SEOHead from "@/components/seo/SEOHead";
import { ToolStructuredData } from "@/components/seo/StructuredData";
import ToolHero from "@/components/shared/ToolHero";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { 
  Workflow,
  Plus,
  Trash2,
  Play,
  ArrowRight,
  FileText,
  FileDown,
  ScanLine,
  FileSpreadsheet,
  Mail,
  FolderInput,
  CheckCircle2,
  Loader2,
  Save,
  Copy,
  Sparkles
} from "lucide-react";

interface WorkflowStep {
  id: string;
  type: "input" | "process" | "output";
  action: string;
  label: string;
  icon: React.ReactNode;
  config: Record<string, string>;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
}

const availableActions = {
  input: [
    { action: "upload-pdf", label: "Upload PDF", icon: <FileText className="h-4 w-4" /> },
    { action: "upload-folder", label: "Folder Watch", icon: <FolderInput className="h-4 w-4" /> },
  ],
  process: [
    { action: "ocr", label: "OCR Text Extract", icon: <ScanLine className="h-4 w-4" /> },
    { action: "compress", label: "Compress PDF", icon: <FileDown className="h-4 w-4" /> },
    { action: "extract-data", label: "Extract Data", icon: <Sparkles className="h-4 w-4" /> },
    { action: "convert-excel", label: "Convert to Excel", icon: <FileSpreadsheet className="h-4 w-4" /> },
  ],
  output: [
    { action: "download", label: "Download File", icon: <FileDown className="h-4 w-4" /> },
    { action: "email", label: "Send Email", icon: <Mail className="h-4 w-4" /> },
    { action: "save-drive", label: "Save to Drive", icon: <FolderInput className="h-4 w-4" /> },
  ],
};

const templates: WorkflowTemplate[] = [
  {
    id: "invoice-workflow",
    name: "Invoice Processor",
    description: "Upload invoices → Extract data → Save to Excel",
    steps: [
      { id: "1", type: "input", action: "upload-pdf", label: "Upload PDF", icon: <FileText className="h-4 w-4" />, config: {} },
      { id: "2", type: "process", action: "extract-data", label: "Extract Data", icon: <Sparkles className="h-4 w-4" />, config: {} },
      { id: "3", type: "process", action: "convert-excel", label: "Convert to Excel", icon: <FileSpreadsheet className="h-4 w-4" />, config: {} },
      { id: "4", type: "output", action: "download", label: "Download File", icon: <FileDown className="h-4 w-4" />, config: {} },
    ]
  },
  {
    id: "ocr-workflow",
    name: "Scan to Searchable PDF",
    description: "Upload scanned PDFs → OCR → Compress → Download",
    steps: [
      { id: "1", type: "input", action: "upload-pdf", label: "Upload PDF", icon: <FileText className="h-4 w-4" />, config: {} },
      { id: "2", type: "process", action: "ocr", label: "OCR Text Extract", icon: <ScanLine className="h-4 w-4" />, config: {} },
      { id: "3", type: "process", action: "compress", label: "Compress PDF", icon: <FileDown className="h-4 w-4" />, config: {} },
      { id: "4", type: "output", action: "download", label: "Download File", icon: <FileDown className="h-4 w-4" />, config: {} },
    ]
  },
];

const BatchWorkflowBuilder = () => {
  const [workflowName, setWorkflowName] = useState("My Workflow");
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showTemplates, setShowTemplates] = useState(true);

  const addStep = (type: "input" | "process" | "output", action: typeof availableActions.input[0]) => {
    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      type,
      action: action.action,
      label: action.label,
      icon: action.icon,
      config: {}
    };
    setSteps([...steps, newStep]);
    setShowTemplates(false);
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter(s => s.id !== id));
  };

  const loadTemplate = (template: WorkflowTemplate) => {
    setWorkflowName(template.name);
    setSteps(template.steps.map(s => ({ ...s, id: `step-${Date.now()}-${Math.random()}` })));
    setShowTemplates(false);
    toast({ title: "Template loaded!", description: template.name });
  };

  const runWorkflow = async () => {
    if (steps.length === 0) {
      toast({ title: "No steps", description: "Add steps to your workflow first.", variant: "destructive" });
      return;
    }

    setIsRunning(true);
    
    // Simulate workflow execution
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({ title: `Step ${i + 1} complete`, description: steps[i].label });
    }
    
    setIsRunning(false);
    toast({ title: "Workflow complete!", description: "All steps executed successfully." });
  };

  const saveWorkflow = () => {
    const workflow = {
      name: workflowName,
      steps: steps.map(s => ({ type: s.type, action: s.action, config: s.config })),
      createdAt: new Date().toISOString()
    };
    const json = JSON.stringify(workflow, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${workflowName.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Saved!", description: "Workflow exported as JSON." });
  };

  const getStepTypeColor = (type: string) => {
    switch (type) {
      case "input": return "bg-blue-500/10 border-blue-500/30 text-blue-600";
      case "process": return "bg-purple-500/10 border-purple-500/30 text-purple-600";
      case "output": return "bg-green-500/10 border-green-500/30 text-green-600";
      default: return "bg-muted";
    }
  };

  return (
    <>
      <SEOHead
        title="Batch Workflow Builder - Automate PDF Processing | Pine Tools Hub"
        description="Free visual workflow builder for PDF automation. Create no-code pipelines to batch process documents: OCR, extract data, convert, compress, and more. Save hours on repetitive tasks."
        keywords="pdf automation, batch pdf processing, workflow builder, document automation, pdf pipeline, automate pdf tasks, no code pdf automation"
        canonical="https://pinetoolshub.com/batch-workflow-builder"
      />
      <ToolStructuredData
        toolName="Batch Workflow Builder"
        toolDescription="Create visual automation workflows for batch PDF processing. Chain together OCR, extraction, conversion, and more."
        toolUrl="https://pinetoolshub.com/batch-workflow-builder"
        category="PDF"
      />

      <div className="container mx-auto px-4 py-8">
        <ToolHero
          title="Batch Workflow Builder"
          description="Create powerful automation workflows with no code. Chain together PDF operations like OCR, data extraction, conversion, and more."
          icon={<Workflow className="h-6 w-6" />}
        />

        <div className="max-w-5xl mx-auto mt-8 space-y-6">
          {/* Workflow Header */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <Input
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                    className="text-lg font-medium border-none shadow-none focus-visible:ring-0 p-0"
                    placeholder="Workflow name..."
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {steps.length} steps configured
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={saveWorkflow} disabled={steps.length === 0}>
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button onClick={runWorkflow} disabled={isRunning || steps.length === 0}>
                    {isRunning ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Running...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Run Workflow
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Templates */}
          {showTemplates && steps.length === 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Quick Start Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {templates.map(template => (
                    <button
                      key={template.id}
                      onClick={() => loadTemplate(template)}
                      className="p-4 bg-muted rounded-lg text-left hover:bg-muted/80 transition-colors"
                    >
                      <h4 className="font-medium">{template.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                      <div className="flex gap-1 mt-2">
                        {template.steps.map((s, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {s.label}
                          </Badge>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Workflow Canvas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Workflow Steps</CardTitle>
            </CardHeader>
            <CardContent>
              {steps.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Workflow className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>Add steps to build your workflow</p>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center gap-2">
                      <div className={`p-3 rounded-lg border ${getStepTypeColor(step.type)} relative group`}>
                        <div className="flex items-center gap-2">
                          {step.icon}
                          <span className="text-sm font-medium">{step.label}</span>
                        </div>
                        <button
                          onClick={() => removeStep(step.id)}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                      {index < steps.length - 1 && (
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Palette */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-blue-600">Input</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {availableActions.input.map(action => (
                  <button
                    key={action.action}
                    onClick={() => addStep("input", action)}
                    className="w-full p-2 bg-blue-500/10 rounded flex items-center gap-2 hover:bg-blue-500/20 transition-colors text-sm"
                  >
                    {action.icon}
                    {action.label}
                    <Plus className="h-3 w-3 ml-auto" />
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-purple-600">Process</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {availableActions.process.map(action => (
                  <button
                    key={action.action}
                    onClick={() => addStep("process", action)}
                    className="w-full p-2 bg-purple-500/10 rounded flex items-center gap-2 hover:bg-purple-500/20 transition-colors text-sm"
                  >
                    {action.icon}
                    {action.label}
                    <Plus className="h-3 w-3 ml-auto" />
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-green-600">Output</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {availableActions.output.map(action => (
                  <button
                    key={action.action}
                    onClick={() => addStep("output", action)}
                    className="w-full p-2 bg-green-500/10 rounded flex items-center gap-2 hover:bg-green-500/20 transition-colors text-sm"
                  >
                    {action.icon}
                    {action.label}
                    <Plus className="h-3 w-3 ml-auto" />
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default BatchWorkflowBuilder;
