import { useState, useRef, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import { QrCode, Download, Palette, Link, Wifi, CreditCard, Calendar, Mail, Phone, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import SEOHead from "@/components/seo/SEOHead";
import ToolHero from "@/components/shared/ToolHero";
import FAQSection from "@/components/seo/FAQSection";
import { ToolStructuredData } from "@/components/seo/StructuredData";

const QRCodePro = () => {
  const [qrType, setQrType] = useState("url");
  const [qrData, setQrData] = useState("");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [size, setSize] = useState(256);
  const [logoUrl, setLogoUrl] = useState("");
  const [errorLevel, setErrorLevel] = useState<"L" | "M" | "Q" | "H">("M");
  const qrRef = useRef<HTMLDivElement>(null);

  // WiFi settings
  const [wifiSSID, setWifiSSID] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiEncryption, setWifiEncryption] = useState("WPA");

  // vCard settings
  const [vcardName, setVcardName] = useState("");
  const [vcardPhone, setVcardPhone] = useState("");
  const [vcardEmail, setVcardEmail] = useState("");
  const [vcardCompany, setVcardCompany] = useState("");

  const getQRValue = () => {
    switch (qrType) {
      case "wifi":
        return `WIFI:T:${wifiEncryption};S:${wifiSSID};P:${wifiPassword};;`;
      case "vcard":
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${vcardName}\nTEL:${vcardPhone}\nEMAIL:${vcardEmail}\nORG:${vcardCompany}\nEND:VCARD`;
      case "email":
        return `mailto:${qrData}`;
      case "phone":
        return `tel:${qrData}`;
      default:
        return qrData;
    }
  };

  const downloadQR = useCallback((format: "png" | "svg") => {
    if (!qrRef.current) return;
    
    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;

    if (format === "svg") {
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = "qrcode.svg";
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      const img = new Image();
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);
      
      img.onload = () => {
        canvas.width = size;
        canvas.height = size;
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
        const pngUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = "qrcode.png";
        link.href = pngUrl;
        link.click();
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }
    toast.success(`QR code downloaded as ${format.toUpperCase()}!`);
  }, [size, bgColor]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const qrValue = getQRValue();

  const faqs = [
    { question: "What types of QR codes can I create?", answer: "Create QR codes for URLs, WiFi networks, vCards (contact info), emails, phone numbers, and plain text. Each type has specific formatting for optimal scanning." },
    { question: "Can I add my logo to the QR code?", answer: "Yes! Upload your logo and it will be centered on the QR code. We recommend using a high error correction level (H) when adding logos." },
    { question: "What file formats can I download?", answer: "Download your QR codes as PNG (best for web/print) or SVG (vector format, infinitely scalable)." },
    { question: "Will the QR code still work with a logo?", answer: "Yes! QR codes have built-in error correction. Use the 'High' error correction level for best results with logos." },
    { question: "What's the best size for printing?", answer: "For print, use at least 300px. The minimum scanning size is about 2cm x 2cm. Larger is always better for reliability." },
  ];

  return (
    <>
      <SEOHead
        title="QR Code Generator Pro - Custom Design, Logo, WiFi QR | Free Online"
        description="Create custom QR codes with logos, colors, and designs. Generate WiFi QR, vCard, URL, email, and phone QR codes. Download PNG or SVG. 100% free."
        keywords="qr code generator, custom qr code, qr code with logo, wifi qr code, vcard qr, free qr generator, qr code maker, design qr code"
        canonical="https://pinetoolshub.com/qr-code-pro"
      />
      <ToolStructuredData
        toolName="QR Code Generator Pro"
        toolDescription="Create custom QR codes with logos, colors, and designs. Generate WiFi, vCard, URL, and more."
        toolUrl="https://pinetoolshub.com/qr-code-pro"
        category="QR"
      />

      <ToolHero
        title="QR Code Generator Pro"
        description="Create stunning custom QR codes with logos, colors, and patterns. Support for WiFi, vCard, URLs, and more."
        icon={<QrCode className="h-6 w-6" />}
      />

      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Settings Panel */}
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <Tabs value={qrType} onValueChange={setQrType}>
                      <TabsList className="grid grid-cols-3 mb-4">
                        <TabsTrigger value="url"><Link className="h-4 w-4 mr-1" />URL</TabsTrigger>
                        <TabsTrigger value="wifi"><Wifi className="h-4 w-4 mr-1" />WiFi</TabsTrigger>
                        <TabsTrigger value="vcard"><CreditCard className="h-4 w-4 mr-1" />vCard</TabsTrigger>
                      </TabsList>
                      <TabsList className="grid grid-cols-3 mb-4">
                        <TabsTrigger value="email"><Mail className="h-4 w-4 mr-1" />Email</TabsTrigger>
                        <TabsTrigger value="phone"><Phone className="h-4 w-4 mr-1" />Phone</TabsTrigger>
                        <TabsTrigger value="text"><QrCode className="h-4 w-4 mr-1" />Text</TabsTrigger>
                      </TabsList>

                      <TabsContent value="url" className="space-y-4">
                        <div>
                          <Label>Website URL</Label>
                          <Input placeholder="https://example.com" value={qrData} onChange={(e) => setQrData(e.target.value)} />
                        </div>
                      </TabsContent>

                      <TabsContent value="wifi" className="space-y-4">
                        <div>
                          <Label>Network Name (SSID)</Label>
                          <Input placeholder="MyWiFi" value={wifiSSID} onChange={(e) => setWifiSSID(e.target.value)} />
                        </div>
                        <div>
                          <Label>Password</Label>
                          <Input type="password" placeholder="Password" value={wifiPassword} onChange={(e) => setWifiPassword(e.target.value)} />
                        </div>
                        <div>
                          <Label>Encryption</Label>
                          <Select value={wifiEncryption} onValueChange={setWifiEncryption}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="WPA">WPA/WPA2</SelectItem>
                              <SelectItem value="WEP">WEP</SelectItem>
                              <SelectItem value="nopass">None</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TabsContent>

                      <TabsContent value="vcard" className="space-y-4">
                        <div>
                          <Label>Full Name</Label>
                          <Input placeholder="John Doe" value={vcardName} onChange={(e) => setVcardName(e.target.value)} />
                        </div>
                        <div>
                          <Label>Phone</Label>
                          <Input placeholder="+1234567890" value={vcardPhone} onChange={(e) => setVcardPhone(e.target.value)} />
                        </div>
                        <div>
                          <Label>Email</Label>
                          <Input placeholder="john@example.com" value={vcardEmail} onChange={(e) => setVcardEmail(e.target.value)} />
                        </div>
                        <div>
                          <Label>Company</Label>
                          <Input placeholder="Company Name" value={vcardCompany} onChange={(e) => setVcardCompany(e.target.value)} />
                        </div>
                      </TabsContent>

                      <TabsContent value="email" className="space-y-4">
                        <div>
                          <Label>Email Address</Label>
                          <Input type="email" placeholder="email@example.com" value={qrData} onChange={(e) => setQrData(e.target.value)} />
                        </div>
                      </TabsContent>

                      <TabsContent value="phone" className="space-y-4">
                        <div>
                          <Label>Phone Number</Label>
                          <Input type="tel" placeholder="+1234567890" value={qrData} onChange={(e) => setQrData(e.target.value)} />
                        </div>
                      </TabsContent>

                      <TabsContent value="text" className="space-y-4">
                        <div>
                          <Label>Text Content</Label>
                          <Input placeholder="Your text here" value={qrData} onChange={(e) => setQrData(e.target.value)} />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 space-y-4">
                    <h3 className="font-semibold flex items-center gap-2"><Palette className="h-4 w-4" /> Customize</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Foreground Color</Label>
                        <div className="flex gap-2">
                          <Input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-12 h-10 p-1" />
                          <Input value={fgColor} onChange={(e) => setFgColor(e.target.value)} />
                        </div>
                      </div>
                      <div>
                        <Label>Background Color</Label>
                        <div className="flex gap-2">
                          <Input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-12 h-10 p-1" />
                          <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>Size</Label>
                        <span className="text-sm text-muted-foreground">{size}px</span>
                      </div>
                      <Slider value={[size]} onValueChange={([v]) => setSize(v)} min={128} max={512} step={32} />
                    </div>

                    <div>
                      <Label>Error Correction</Label>
                      <Select value={errorLevel} onValueChange={(v) => setErrorLevel(v as "L" | "M" | "Q" | "H")}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="L">Low (7%)</SelectItem>
                          <SelectItem value="M">Medium (15%)</SelectItem>
                          <SelectItem value="Q">Quartile (25%)</SelectItem>
                          <SelectItem value="H">High (30%) - Best for logos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="flex items-center gap-2"><ImageIcon className="h-4 w-4" /> Logo (optional)</Label>
                      <Input type="file" accept="image/*" onChange={handleLogoUpload} className="mt-1" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Preview Panel */}
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Preview</h3>
                    <div ref={qrRef} className="flex justify-center p-4 bg-white rounded-lg" style={{ backgroundColor: bgColor }}>
                      <QRCodeSVG
                        value={qrValue || "https://pinetoolshub.com"}
                        size={size}
                        fgColor={fgColor}
                        bgColor={bgColor}
                        level={errorLevel}
                        includeMargin={true}
                        imageSettings={logoUrl ? {
                          src: logoUrl,
                          x: undefined,
                          y: undefined,
                          height: size * 0.2,
                          width: size * 0.2,
                          excavate: true,
                        } : undefined}
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-3">
                  <Button onClick={() => downloadQR("png")} className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download PNG
                  </Button>
                  <Button onClick={() => downloadQR("svg")} variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download SVG
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQSection faqs={faqs} toolName="QR Code Pro" />
    </>
  );
};

export default QRCodePro;
