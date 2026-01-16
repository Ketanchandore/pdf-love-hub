import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import ToolHero from "@/components/shared/ToolHero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Download, Palette, Share2 } from "lucide-react";
import FAQSection from "@/components/seo/FAQSection";
import RelatedTools from "@/components/seo/RelatedTools";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

const themes = [
  { id: "royal", name: "Royal Gold", primary: "#D4AF37", secondary: "#8B0000", bg: "linear-gradient(135deg, #FFF8E7 0%, #FFE4B5 100%)" },
  { id: "floral", name: "Floral Pink", primary: "#E91E63", secondary: "#4CAF50", bg: "linear-gradient(135deg, #FFF0F5 0%, #FFE4E1 100%)" },
  { id: "traditional", name: "Traditional Red", primary: "#B22222", secondary: "#FFD700", bg: "linear-gradient(135deg, #FFF5EE 0%, #FFE4C4 100%)" },
  { id: "modern", name: "Modern Minimal", primary: "#333333", secondary: "#666666", bg: "linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)" },
  { id: "peacock", name: "Peacock Blue", primary: "#006064", secondary: "#FFD54F", bg: "linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%)" },
  { id: "lavender", name: "Lavender Dreams", primary: "#7B1FA2", secondary: "#E1BEE7", bg: "linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)" },
];

const WeddingInvitationMaker = () => {
  const [formData, setFormData] = useState({
    brideName: "Priya",
    groomName: "Rahul",
    brideFamily: "Sharma",
    groomFamily: "Verma",
    date: "2024-12-15",
    time: "7:00 PM",
    venue: "The Grand Palace",
    venueAddress: "123 Wedding Lane, Mumbai",
    message: "Together with their families, request the pleasure of your company",
  });
  const [selectedTheme, setSelectedTheme] = useState(themes[0]);

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const downloadInvitation = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 1100;

    // Background
    ctx.fillStyle = '#FFF8E7';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = selectedTheme.primary;
    ctx.lineWidth = 8;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

    // Inner border
    ctx.strokeStyle = selectedTheme.secondary;
    ctx.lineWidth = 2;
    ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);

    // Text
    ctx.fillStyle = selectedTheme.primary;
    ctx.textAlign = 'center';

    ctx.font = 'italic 24px Georgia';
    ctx.fillText(formData.message, canvas.width / 2, 150);

    ctx.font = 'bold 48px Georgia';
    ctx.fillText(formData.brideName, canvas.width / 2, 280);
    
    ctx.font = '28px Georgia';
    ctx.fillText('&', canvas.width / 2, 340);
    
    ctx.font = 'bold 48px Georgia';
    ctx.fillText(formData.groomName, canvas.width / 2, 400);

    ctx.font = '20px Georgia';
    ctx.fillStyle = selectedTheme.secondary;
    ctx.fillText(`${formData.brideFamily} Family  ❤  ${formData.groomFamily} Family`, canvas.width / 2, 480);

    ctx.fillStyle = selectedTheme.primary;
    ctx.font = 'bold 28px Georgia';
    ctx.fillText(formatDate(formData.date), canvas.width / 2, 600);
    
    ctx.font = '24px Georgia';
    ctx.fillText(`at ${formData.time}`, canvas.width / 2, 650);

    ctx.font = 'bold 26px Georgia';
    ctx.fillText(formData.venue, canvas.width / 2, 750);
    
    ctx.font = '20px Georgia';
    ctx.fillText(formData.venueAddress, canvas.width / 2, 790);

    // Download
    const link = document.createElement('a');
    link.download = 'wedding-invitation.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const faqs = [
    {
      question: "How do I create a digital wedding invitation?",
      answer: "Simply fill in your details (names, date, venue) in our form, choose a theme that matches your wedding style, preview your invitation, and download it as an image to share digitally."
    },
    {
      question: "Can I share the invitation on WhatsApp?",
      answer: "Yes! Download the invitation as an image and share it directly on WhatsApp, Instagram, Facebook, or any other platform. It's perfect for digital invitations."
    },
    {
      question: "What formats are available for download?",
      answer: "Currently, we offer PNG format which is perfect for sharing on social media and messaging apps. The high-resolution output ensures your invitation looks great on any device."
    },
    {
      question: "Can I customize the colors and design?",
      answer: "Yes, we offer multiple themes including Royal Gold, Floral Pink, Traditional Red, Modern Minimal, Peacock Blue, and Lavender Dreams. Each theme has coordinated colors and styling."
    },
  ];

  const relatedTools = [
    { name: "Guest List Manager", href: "/tools/guest-list-manager", description: "Manage your wedding guests" },
    { name: "Wedding Budget Calculator", href: "/tools/wedding-budget-calculator", description: "Plan your budget" },
    { name: "Wedding Checklist", href: "/tools/wedding-checklist", description: "Track wedding tasks" },
  ];

  return (
    <Layout>
      <Helmet>
        <title>Wedding Invitation Maker | Create Beautiful Cards Free | Pine Tools Hub</title>
        <meta name="description" content="Create stunning digital wedding invitations for free. Choose from beautiful Indian themes, customize with your details, and share on WhatsApp instantly." />
        <meta name="keywords" content="wedding invitation maker, shaadi card maker, digital wedding card, indian wedding invitation, free invitation generator" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Breadcrumbs 
          items={[
            { label: "Home", href: "/" },
            { label: "Wedding Tools", href: "#" },
            { label: "Invitation Maker", href: "/tools/wedding-invitation-maker" },
          ]} 
        />

        <ToolHero
          title="Wedding Invitation Maker"
          description="Create beautiful digital wedding invitations in minutes. Perfect for sharing on WhatsApp and social media."
          icon={<Heart className="h-8 w-8 text-primary" />}
        />

        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          {/* Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" /> Choose Theme
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedTheme.id === theme.id 
                          ? 'border-primary ring-2 ring-primary/20' 
                          : 'border-muted hover:border-primary/50'
                      }`}
                      style={{ background: theme.bg }}
                    >
                      <div className="w-full h-8 rounded" style={{ backgroundColor: theme.primary }} />
                      <p className="text-xs mt-2 font-medium">{theme.name}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Couple Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Bride's Name</Label>
                    <Input 
                      value={formData.brideName}
                      onChange={(e) => handleInputChange('brideName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Groom's Name</Label>
                    <Input 
                      value={formData.groomName}
                      onChange={(e) => handleInputChange('groomName', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Bride's Family</Label>
                    <Input 
                      value={formData.brideFamily}
                      onChange={(e) => handleInputChange('brideFamily', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Groom's Family</Label>
                    <Input 
                      value={formData.groomFamily}
                      onChange={(e) => handleInputChange('groomFamily', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Wedding Date</Label>
                    <Input 
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Time</Label>
                    <Input 
                      value={formData.time}
                      onChange={(e) => handleInputChange('time', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label>Venue Name</Label>
                  <Input 
                    value={formData.venue}
                    onChange={(e) => handleInputChange('venue', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Venue Address</Label>
                  <Input 
                    value={formData.venueAddress}
                    onChange={(e) => handleInputChange('venueAddress', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Custom Message</Label>
                  <Textarea 
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="aspect-[3/4] rounded-lg p-8 flex flex-col items-center justify-center text-center relative overflow-hidden"
                  style={{ background: selectedTheme.bg }}
                >
                  {/* Border decoration */}
                  <div 
                    className="absolute inset-4 border-4 rounded-lg pointer-events-none"
                    style={{ borderColor: selectedTheme.primary }}
                  />
                  <div 
                    className="absolute inset-6 border-2 rounded-lg pointer-events-none"
                    style={{ borderColor: selectedTheme.secondary }}
                  />

                  <div className="z-10 space-y-4">
                    <p className="text-sm italic opacity-80" style={{ color: selectedTheme.primary }}>
                      {formData.message}
                    </p>
                    
                    <div className="space-y-2">
                      <h2 className="text-3xl font-bold" style={{ color: selectedTheme.primary }}>
                        {formData.brideName}
                      </h2>
                      <p className="text-xl" style={{ color: selectedTheme.primary }}>&</p>
                      <h2 className="text-3xl font-bold" style={{ color: selectedTheme.primary }}>
                        {formData.groomName}
                      </h2>
                    </div>

                    <p className="text-sm" style={{ color: selectedTheme.secondary }}>
                      {formData.brideFamily} Family ❤ {formData.groomFamily} Family
                    </p>

                    <div className="pt-4">
                      <p className="text-lg font-semibold" style={{ color: selectedTheme.primary }}>
                        {formatDate(formData.date)}
                      </p>
                      <p className="text-md" style={{ color: selectedTheme.primary }}>
                        at {formData.time}
                      </p>
                    </div>

                    <div className="pt-4">
                      <p className="font-semibold" style={{ color: selectedTheme.primary }}>
                        {formData.venue}
                      </p>
                      <p className="text-sm opacity-80" style={{ color: selectedTheme.primary }}>
                        {formData.venueAddress}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button onClick={downloadInvitation} className="flex-1">
                <Download className="h-4 w-4 mr-2" /> Download
              </Button>
              <Button variant="outline" className="flex-1">
                <Share2 className="h-4 w-4 mr-2" /> Share
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 prose prose-gray max-w-none">
          <h2>Create Stunning Wedding Invitations</h2>
          <p>
            Our free Wedding Invitation Maker lets you create beautiful digital invitations 
            that are perfect for sharing on WhatsApp, Instagram, and other platforms. Choose 
            from traditional Indian themes or modern minimal designs.
          </p>
        </div>

        <FAQSection faqs={faqs} />
        <RelatedTools tools={relatedTools} />
      </div>
    </Layout>
  );
};

export default WeddingInvitationMaker;
