import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import SEOHead from "@/components/seo/SEOHead";
import ToolHero from "@/components/shared/ToolHero";
import FAQSection from "@/components/seo/FAQSection";
import { ToolStructuredData, FAQStructuredData } from "@/components/seo/StructuredData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCode, Download, Link, Wifi, User, FileText, Mail, Phone } from "lucide-react";
import { toast } from "sonner";

const QRCodeGenerator = () => {
  const [activeTab, setActiveTab] = useState("url");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [wifiNetwork, setWifiNetwork] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiEncryption, setWifiEncryption] = useState("WPA");
  const [email, setEmail] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [phone, setPhone] = useState("");
  const [vCardName, setVCardName] = useState("");
  const [vCardPhone, setVCardPhone] = useState("");
  const [vCardEmail, setVCardEmail] = useState("");
  const [vCardCompany, setVCardCompany] = useState("");

  const getQRValue = () => {
    switch (activeTab) {
      case "url":
        return url || "https://pinetoolshub.com";
      case "text":
        return text || "Hello World";
      case "wifi":
        return `WIFI:T:${wifiEncryption};S:${wifiNetwork};P:${wifiPassword};;`;
      case "email":
        return `mailto:${email}?subject=${encodeURIComponent(emailSubject)}`;
      case "phone":
        return `tel:${phone}`;
      case "vcard":
        return `BEGIN:VCARD\nVERSION:3.0\nN:${vCardName}\nFN:${vCardName}\nORG:${vCardCompany}\nTEL:${vCardPhone}\nEMAIL:${vCardEmail}\nEND:VCARD`;
      default:
        return "https://pinetoolshub.com";
    }
  };

  const downloadQR = () => {
    const svg = document.getElementById("qr-code");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = 400;
      canvas.height = 400;
      ctx!.fillStyle = "white";
      ctx!.fillRect(0, 0, 400, 400);
      ctx!.drawImage(img, 0, 0, 400, 400);
      
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = "qrcode.png";
      downloadLink.href = pngFile;
      downloadLink.click();
      toast.success("QR Code downloaded!");
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const faqs = [
    {
      question: "What is a QR code?",
      answer: "A QR (Quick Response) code is a two-dimensional barcode that stores information. When scanned with a smartphone camera, it can instantly open websites, share contact info, connect to WiFi, and more. QR codes are widely used in marketing, payments, and information sharing."
    },
    {
      question: "Is this QR code generator free?",
      answer: "Yes! Our QR code generator is 100% free with no limits. Generate unlimited QR codes for URLs, text, WiFi, email, phone, and vCard contacts. No signup, no watermarks, no hidden fees - completely free forever."
    },
    {
      question: "What types of QR codes can I create?",
      answer: "You can create QR codes for: Website URLs (links), Plain text messages, WiFi network credentials (instant connection), Email addresses with subject, Phone numbers for quick calling, and vCard contacts (digital business cards)."
    },
    {
      question: "How do I scan a QR code?",
      answer: "Most modern smartphones can scan QR codes directly with the camera app. Open your camera, point it at the QR code, and a notification will appear. Tap it to open the link or action. Android and iOS devices have built-in QR scanning."
    },
    {
      question: "Do QR codes expire?",
      answer: "Static QR codes (like the ones we generate) never expire. They contain the data directly in the code itself. However, if you create a QR code for a website URL that later becomes inactive, the QR code will still scan but lead to a dead link."
    },
    {
      question: "Can I customize the QR code design?",
      answer: "Our generator creates clean, high-contrast QR codes optimized for maximum scannability. The black and white design ensures compatibility with all QR code readers. The generated codes can be downloaded as PNG images."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="QR Code Generator - Create Free QR Codes Online 2025"
        description="Generate QR codes for URLs, WiFi, email, phone, vCard & text. Free online QR code maker - no signup, no watermark. Download high-quality QR codes instantly!"
        keywords="qr code generator, free qr code, create qr code, qr code maker, wifi qr code, url qr code, vcard qr code, qr code online, qr generator free"
        canonical="https://pinetoolshub.com/qr-code-generator"
      />
      
      <ToolStructuredData
        toolName="QR Code Generator - Free Online QR Maker"
        toolDescription="Generate QR codes for URLs, WiFi networks, email, phone numbers, vCard contacts, and plain text. Free online QR code generator with instant download."
        toolUrl="https://pinetoolshub.com/qr-code-generator"
        category="QR"
      />
      
      <FAQStructuredData faqs={faqs} />

      <ToolHero
        title="QR Code Generator"
        description="Generate QR codes for URLs, WiFi, email, phone, vCard & more. Free, instant, no watermark!"
        icon={<QrCode className="h-8 w-8" />}
        color="bg-indigo-500/20"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="url" className="text-xs">
                      <Link className="h-3 w-3 mr-1" />
                      URL
                    </TabsTrigger>
                    <TabsTrigger value="text" className="text-xs">
                      <FileText className="h-3 w-3 mr-1" />
                      Text
                    </TabsTrigger>
                    <TabsTrigger value="wifi" className="text-xs">
                      <Wifi className="h-3 w-3 mr-1" />
                      WiFi
                    </TabsTrigger>
                  </TabsList>
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="email" className="text-xs">
                      <Mail className="h-3 w-3 mr-1" />
                      Email
                    </TabsTrigger>
                    <TabsTrigger value="phone" className="text-xs">
                      <Phone className="h-3 w-3 mr-1" />
                      Phone
                    </TabsTrigger>
                    <TabsTrigger value="vcard" className="text-xs">
                      <User className="h-3 w-3 mr-1" />
                      vCard
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="url" className="space-y-4">
                    <div>
                      <Label>Website URL</Label>
                      <Input
                        placeholder="https://example.com"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="text" className="space-y-4">
                    <div>
                      <Label>Text Message</Label>
                      <Textarea
                        placeholder="Enter your text here..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="wifi" className="space-y-4">
                    <div>
                      <Label>Network Name (SSID)</Label>
                      <Input
                        placeholder="MyWiFiNetwork"
                        value={wifiNetwork}
                        onChange={(e) => setWifiNetwork(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Password</Label>
                      <Input
                        type="password"
                        placeholder="WiFi password"
                        value={wifiPassword}
                        onChange={(e) => setWifiPassword(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Encryption</Label>
                      <select
                        value={wifiEncryption}
                        onChange={(e) => setWifiEncryption(e.target.value)}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      >
                        <option value="WPA">WPA/WPA2</option>
                        <option value="WEP">WEP</option>
                        <option value="nopass">None</option>
                      </select>
                    </div>
                  </TabsContent>

                  <TabsContent value="email" className="space-y-4">
                    <div>
                      <Label>Email Address</Label>
                      <Input
                        type="email"
                        placeholder="example@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Subject (optional)</Label>
                      <Input
                        placeholder="Email subject"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="phone" className="space-y-4">
                    <div>
                      <Label>Phone Number</Label>
                      <Input
                        type="tel"
                        placeholder="+1234567890"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="vcard" className="space-y-4">
                    <div>
                      <Label>Full Name</Label>
                      <Input
                        placeholder="John Doe"
                        value={vCardName}
                        onChange={(e) => setVCardName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input
                        placeholder="+1234567890"
                        value={vCardPhone}
                        onChange={(e) => setVCardPhone(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        value={vCardEmail}
                        onChange={(e) => setVCardEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Company</Label>
                      <Input
                        placeholder="Company Name"
                        value={vCardCompany}
                        onChange={(e) => setVCardCompany(e.target.value)}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* QR Code Preview */}
            <Card className="bg-card border-border">
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <div className="bg-white p-4 rounded-lg mb-4">
                  <QRCodeSVG
                    id="qr-code"
                    value={getQRValue()}
                    size={256}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <p className="text-sm text-muted-foreground mb-4 text-center">
                  Scan with your phone camera or QR reader
                </p>
                <Button onClick={downloadQR} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download QR Code (PNG)
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* SEO Content */}
        <div className="max-w-4xl mx-auto mt-16 prose prose-invert">
          <h2 className="text-2xl font-bold text-foreground mb-4">Free Online QR Code Generator</h2>
          <p className="text-muted-foreground mb-4">
            Create QR codes instantly with our free online generator. Generate QR codes for website URLs, WiFi network 
            credentials, email addresses, phone numbers, vCard contacts, and plain text. No signup required, no watermarks, 
            completely free to use.
          </p>
          
          <h3 className="text-xl font-semibold text-foreground mb-3">QR Code Types We Support</h3>
          <ul className="text-muted-foreground space-y-2 mb-6">
            <li><strong>URL QR Codes:</strong> Link to any website - perfect for marketing materials and business cards</li>
            <li><strong>WiFi QR Codes:</strong> Let guests connect to your WiFi instantly - no typing passwords</li>
            <li><strong>Email QR Codes:</strong> Pre-fill email address and subject for quick contact</li>
            <li><strong>Phone QR Codes:</strong> One scan to dial your phone number</li>
            <li><strong>vCard QR Codes:</strong> Share your complete contact information digitally</li>
            <li><strong>Text QR Codes:</strong> Share any text message or note</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-3">Common Uses</h3>
          <p className="text-muted-foreground mb-4">
            Business cards, marketing materials, restaurant menus, event tickets, WiFi access sharing, 
            product packaging, educational materials, and contactless information sharing.
          </p>
        </div>

        <FAQSection faqs={faqs} />
      </div>
    </div>
  );
};

export default QRCodeGenerator;
