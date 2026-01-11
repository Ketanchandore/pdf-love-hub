import { useState, useCallback } from "react";
import SEOHead from "@/components/seo/SEOHead";
import { ToolStructuredData } from "@/components/seo/StructuredData";
import ToolHero from "@/components/shared/ToolHero";
import FileUpload from "@/components/shared/FileUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import * as pdfjsLib from "pdfjs-dist";
import { 
  Landmark, 
  Download,
  Loader2,
  FileSpreadsheet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft
} from "lucide-react";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface Transaction {
  date: string;
  description: string;
  amount: number;
  type: "credit" | "debit";
  category: string;
}

interface ExtractionResult {
  bankName: string;
  accountNumber: string;
  period: string;
  openingBalance: number;
  closingBalance: number;
  totalCredits: number;
  totalDebits: number;
  transactions: Transaction[];
}

const banks = [
  { id: "auto", name: "Auto-detect" },
  { id: "chase", name: "Chase Bank" },
  { id: "bofa", name: "Bank of America" },
  { id: "wells", name: "Wells Fargo" },
  { id: "citi", name: "Citibank" },
  { id: "capital", name: "Capital One" },
  { id: "hdfc", name: "HDFC Bank" },
  { id: "icici", name: "ICICI Bank" },
  { id: "sbi", name: "State Bank of India" },
];

const BankStatementExtractor = () => {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [selectedBank, setSelectedBank] = useState("auto");
  const [isExtracting, setIsExtracting] = useState(false);
  const [result, setResult] = useState<ExtractionResult | null>(null);

  const extractTextFromPdf = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = "";
    
    for (let i = 1; i <= pdf.numPages; i++) {
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
      toast({ title: "Statement uploaded!", description: "Ready to extract data." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to read PDF.", variant: "destructive" });
    }
  }, []);

  const extractData = async () => {
    if (!extractedText) {
      toast({ title: "No file", description: "Please upload a statement first.", variant: "destructive" });
      return;
    }

    setIsExtracting(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-document-intelligence", {
        body: {
          action: "bank-statement-extract",
          text: extractedText,
          bankHint: selectedBank !== "auto" ? selectedBank : undefined
        }
      });

      if (error) throw error;
      // Ensure data has valid structure with defaults
      const safeResult: ExtractionResult = {
        bankName: data?.bankName || "Unknown Bank",
        accountNumber: data?.accountNumber || "",
        period: data?.period || "N/A",
        openingBalance: data?.openingBalance || 0,
        closingBalance: data?.closingBalance || 0,
        totalCredits: data?.totalCredits || 0,
        totalDebits: data?.totalDebits || 0,
        transactions: Array.isArray(data?.transactions) ? data.transactions : []
      };
      setResult(safeResult);
      toast({ 
        title: "Extraction complete!", 
        description: `Found ${safeResult.transactions.length} transactions.` 
      });
    } catch (error) {
      console.error("Extraction error:", error);
      toast({ title: "Error", description: "Failed to extract data.", variant: "destructive" });
    } finally {
      setIsExtracting(false);
    }
  };

  const downloadCSV = () => {
    if (!result) return;
    
    const headers = ["Date", "Description", "Amount", "Type", "Category"];
    const rows = result.transactions.map(t => [
      t.date,
      `"${t.description}"`,
      t.amount.toFixed(2),
      t.type,
      t.category
    ]);
    
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bank-transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadExcel = () => {
    // For Excel, we'll create a simple tab-separated file that Excel can open
    if (!result) return;
    
    const headers = ["Date", "Description", "Amount", "Type", "Category"];
    const rows = result.transactions.map(t => [
      t.date,
      t.description,
      t.amount.toFixed(2),
      t.type,
      t.category
    ]);
    
    const tsv = [headers.join("\t"), ...rows.map(r => r.join("\t"))].join("\n");
    const blob = new Blob([tsv], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bank-transactions.xls";
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount);
  };

  return (
    <>
      <SEOHead
        title="Bank Statement to Excel - Extract Transactions from PDF Free | Pine Tools Hub"
        description="Convert bank statement PDF to Excel or CSV. AI automatically extracts transactions, dates, amounts from Chase, Bank of America, Wells Fargo, HDFC, and more. Free bank statement converter."
        keywords="bank statement to excel, convert chase statement to csv, pdf bank statement extractor, bank statement converter, extract transactions from pdf, bank statement parser free"
        canonical="https://pinetoolshub.com/bank-statement-extractor"
      />
      <ToolStructuredData
        toolName="Bank Statement to Excel Extractor"
        toolDescription="AI-powered bank statement converter that extracts transactions from PDF and exports to Excel or CSV format."
        toolUrl="https://pinetoolshub.com/bank-statement-extractor"
        category="PDF"
      />

      <div className="container mx-auto px-4 py-8">
        <ToolHero
          title="Bank Statement to Excel"
          description="AI extracts every transaction from your bank statement PDF into a clean Excel spreadsheet. Works with Chase, Bank of America, Wells Fargo, HDFC, and 50+ more banks."
          icon={<Landmark className="h-6 w-6" />}
        />

        <div className="grid lg:grid-cols-2 gap-6 mt-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5" />
                  Upload Bank Statement
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
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bank Selection</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedBank} onValueChange={setSelectedBank}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bank" />
                  </SelectTrigger>
                  <SelectContent>
                    {banks.map(bank => (
                      <SelectItem key={bank.id} value={bank.id}>
                        {bank.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-2">
                  Selecting your bank helps improve extraction accuracy
                </p>
              </CardContent>
            </Card>

            <Button 
              onClick={extractData} 
              disabled={isExtracting || !extractedText}
              className="w-full"
              size="lg"
            >
              {isExtracting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Extracting Transactions...
                </>
              ) : (
                <>
                  <Landmark className="h-4 w-4 mr-2" />
                  Extract to Excel
                </>
              )}
            </Button>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {!result ? (
              <Card className="h-full flex items-center justify-center min-h-[400px]">
                <CardContent className="text-center py-12">
                  <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                    <DollarSign className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Ready to Extract</h3>
                  <p className="text-muted-foreground text-sm max-w-sm">
                    Upload your bank statement PDF and we'll extract all transactions into Excel format.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">Total Credits</p>
                          <p className="text-xl font-bold text-green-500">
                            {formatCurrency(result.totalCredits)}
                          </p>
                        </div>
                        <TrendingUp className="h-6 w-6 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">Total Debits</p>
                          <p className="text-xl font-bold text-red-500">
                            {formatCurrency(result.totalDebits)}
                          </p>
                        </div>
                        <TrendingDown className="h-6 w-6 text-red-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Account Info */}
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{result.bankName || "Unknown Bank"}</p>
                        <p className="text-xs text-muted-foreground">
                          Account: ****{result.accountNumber ? result.accountNumber.slice(-4) : "XXXX"}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {result.period}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Export Buttons */}
                <div className="flex gap-2">
                  <Button onClick={downloadCSV} variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download CSV
                  </Button>
                  <Button onClick={downloadExcel} className="flex-1">
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Download Excel
                  </Button>
                </div>

                {/* Transactions Table */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      Transactions ({result.transactions.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-[300px] overflow-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {result.transactions.slice(0, 20).map((t, i) => (
                            <TableRow key={i}>
                              <TableCell className="text-xs">{t.date}</TableCell>
                              <TableCell className="text-xs max-w-[150px] truncate">
                                {t.description}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                  {t.type === "credit" ? (
                                    <ArrowUpRight className="h-3 w-3 text-green-500" />
                                  ) : (
                                    <ArrowDownLeft className="h-3 w-3 text-red-500" />
                                  )}
                                  <span className={t.type === "credit" ? "text-green-500" : "text-red-500"}>
                                    {formatCurrency(t.amount)}
                                  </span>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      {result.transactions.length > 20 && (
                        <p className="text-xs text-center text-muted-foreground py-2">
                          +{result.transactions.length - 20} more transactions in download
                        </p>
                      )}
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

export default BankStatementExtractor;
