import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import ToolHero from "@/components/shared/ToolHero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Star, Moon, Sun } from "lucide-react";
import FAQSection from "@/components/seo/FAQSection";
import RelatedTools from "@/components/seo/RelatedTools";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

interface Muhurat {
  date: string;
  day: string;
  tithi: string;
  nakshatra: string;
  timing: string;
  rating: number;
  occasion: string;
}

const muhurats2024: Muhurat[] = [
  { date: "January 15, 2024", day: "Monday", tithi: "Panchami", nakshatra: "Rohini", timing: "6:30 AM - 12:00 PM", rating: 5, occasion: "Makar Sankranti" },
  { date: "January 18, 2024", day: "Thursday", tithi: "Ashtami", nakshatra: "Mrigashira", timing: "7:00 AM - 3:00 PM", rating: 4, occasion: "Shubh Vivah" },
  { date: "February 7, 2024", day: "Wednesday", tithi: "Trayodashi", nakshatra: "Uttara Phalguni", timing: "8:00 AM - 6:00 PM", rating: 5, occasion: "Basant Panchami" },
  { date: "February 14, 2024", day: "Wednesday", tithi: "Panchami", nakshatra: "Swati", timing: "10:00 AM - 4:00 PM", rating: 4, occasion: "Shubh Vivah" },
  { date: "February 22, 2024", day: "Thursday", tithi: "Trayodashi", nakshatra: "Uttara Bhadrapada", timing: "6:00 AM - 2:00 PM", rating: 5, occasion: "Maha Shivratri Week" },
  { date: "April 10, 2024", day: "Wednesday", tithi: "Dwitiya", nakshatra: "Rohini", timing: "9:00 AM - 5:00 PM", rating: 5, occasion: "Chaitra Navratri" },
  { date: "April 17, 2024", day: "Wednesday", tithi: "Navami", nakshatra: "Magha", timing: "7:30 AM - 3:30 PM", rating: 4, occasion: "Ram Navami" },
  { date: "May 3, 2024", day: "Friday", tithi: "Panchami", nakshatra: "Uttara Phalguni", timing: "8:00 AM - 4:00 PM", rating: 5, occasion: "Akshaya Tritiya Week" },
  { date: "May 10, 2024", day: "Friday", tithi: "Trayodashi", nakshatra: "Swati", timing: "6:30 AM - 2:00 PM", rating: 5, occasion: "Shubh Vivah" },
  { date: "November 12, 2024", day: "Tuesday", tithi: "Ekadashi", nakshatra: "Rohini", timing: "9:00 AM - 6:00 PM", rating: 5, occasion: "Dev Uthani Ekadashi" },
  { date: "November 15, 2024", day: "Friday", tithi: "Chaturdashi", nakshatra: "Mrigashira", timing: "7:00 AM - 3:00 PM", rating: 4, occasion: "Tulsi Vivah" },
  { date: "December 4, 2024", day: "Wednesday", tithi: "Tritiya", nakshatra: "Uttara Phalguni", timing: "8:30 AM - 5:00 PM", rating: 5, occasion: "Shubh Vivah" },
];

const months = [
  "All Months", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const MuhuratFinder = () => {
  const [selectedMonth, setSelectedMonth] = useState("All Months");
  const [selectedYear, setSelectedYear] = useState("2024");

  const filteredMuhurats = muhurats2024.filter(m => {
    if (selectedMonth === "All Months") return true;
    return m.date.includes(selectedMonth);
  });

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted'}`} 
      />
    ));
  };

  const faqs = [
    {
      question: "What is a Shubh Muhurat for wedding?",
      answer: "A Shubh Muhurat is an auspicious time determined by Hindu astrology based on planetary positions, nakshatra (lunar mansion), and tithi (lunar day). Weddings performed during these times are believed to bring prosperity and happiness."
    },
    {
      question: "How is wedding muhurat calculated?",
      answer: "Wedding muhurat is calculated based on multiple factors: Panchang (Hindu calendar), bride and groom's birth charts, planetary positions, auspicious nakshatras (like Rohini, Uttara Phalguni), and avoiding inauspicious periods."
    },
    {
      question: "Which months are best for Indian weddings?",
      answer: "The most auspicious months for Hindu weddings are: November-December (after Dev Uthani Ekadashi), January-February (before Holi), and April-May (around Akshaya Tritiya). Avoid Pitru Paksha and inauspicious months."
    },
    {
      question: "Should I consult a pandit for final muhurat?",
      answer: "Yes, we recommend consulting a qualified pandit/astrologer who can match your specific birth charts and provide personalized muhurat. Our tool provides general auspicious dates as a starting point."
    },
  ];

  const relatedTools = [
    { name: "Wedding Budget Calculator", href: "/tools/wedding-budget-calculator", description: "Plan your budget" },
    { name: "Guest List Manager", href: "/tools/guest-list-manager", description: "Manage guests" },
    { name: "Wedding Checklist", href: "/tools/wedding-checklist", description: "Track wedding tasks" },
  ];

  return (
    <Layout>
      <Helmet>
        <title>Shubh Muhurat Finder 2024 | Wedding Auspicious Dates | Pine Tools Hub</title>
        <meta name="description" content="Find shubh muhurat dates for wedding in 2024. Get auspicious Hindu wedding dates with nakshatra, tithi, and timing details for your marriage ceremony." />
        <meta name="keywords" content="shubh muhurat 2024, wedding muhurat, vivah muhurat, auspicious wedding dates, hindu wedding dates, marriage muhurat" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Breadcrumbs 
          items={[
            { label: "Home", href: "/" },
            { label: "Wedding Tools", href: "#" },
            { label: "Muhurat Finder", href: "/tools/muhurat-finder" },
          ]} 
        />

        <ToolHero
          title="Shubh Muhurat Finder"
          description="Find auspicious wedding dates based on Hindu Panchang. Discover the best muhurat for your special day."
          icon={<Calendar className="h-8 w-8 text-primary" />}
        />

        {/* Filters */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map(month => (
                      <SelectItem key={month} value={month}>{month}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-6 justify-center">
          <div className="flex items-center gap-2 text-sm">
            <Moon className="h-4 w-4 text-blue-500" />
            <span>Tithi (Lunar Day)</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Star className="h-4 w-4 text-purple-500" />
            <span>Nakshatra (Lunar Mansion)</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Sun className="h-4 w-4 text-orange-500" />
            <span>Auspicious Timing</span>
          </div>
        </div>

        {/* Muhurat Cards */}
        <div className="mt-6 space-y-4">
          {filteredMuhurats.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No auspicious dates found for the selected month. Try selecting a different month.
              </CardContent>
            </Card>
          ) : (
            filteredMuhurats.map((muhurat, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold">{muhurat.date}</h3>
                        <Badge variant="secondary">{muhurat.day}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {renderStars(muhurat.rating)}
                      </div>
                      <Badge variant="outline" className="mt-2">{muhurat.occasion}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="text-muted-foreground">Tithi</p>
                          <p className="font-medium">{muhurat.tithi}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-purple-500" />
                        <div>
                          <p className="text-muted-foreground">Nakshatra</p>
                          <p className="font-medium">{muhurat.nakshatra}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 col-span-2 md:col-span-1">
                        <Sun className="h-4 w-4 text-orange-500" />
                        <div>
                          <p className="text-muted-foreground">Timing</p>
                          <p className="font-medium">{muhurat.timing}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <Card className="mt-8 bg-muted/50">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              <strong>Disclaimer:</strong> These muhurat dates are based on general Hindu Panchang. 
              For your specific wedding, we strongly recommend consulting a qualified pandit or 
              astrologer who can match the bride and groom's birth charts for the most auspicious timing.
            </p>
          </CardContent>
        </Card>

        <div className="mt-12 prose prose-gray max-w-none">
          <h2>Finding the Perfect Wedding Muhurat</h2>
          <p>
            In Hindu tradition, choosing the right muhurat (auspicious time) for a wedding is 
            considered essential for a blessed married life. Our Muhurat Finder helps you 
            discover auspicious dates based on traditional Panchang calculations.
          </p>
          <h3>Key Factors in Muhurat Selection</h3>
          <ul>
            <li><strong>Tithi:</strong> The lunar day in the Hindu calendar</li>
            <li><strong>Nakshatra:</strong> The lunar mansion or constellation</li>
            <li><strong>Yoga:</strong> Combination of sun and moon positions</li>
            <li><strong>Karana:</strong> Half of a tithi</li>
            <li><strong>Var:</strong> Day of the week</li>
          </ul>
        </div>

        <FAQSection faqs={faqs} />
        <RelatedTools tools={relatedTools} />
      </div>
    </Layout>
  );
};

export default MuhuratFinder;
