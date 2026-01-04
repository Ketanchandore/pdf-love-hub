import { useState, useMemo } from "react";
import SEOHead from "@/components/seo/SEOHead";
import ToolHero from "@/components/shared/ToolHero";
import FAQSection from "@/components/seo/FAQSection";
import { ToolStructuredData, FAQStructuredData } from "@/components/seo/StructuredData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar, Cake, Clock, Heart } from "lucide-react";
import { toast } from "sonner";

const AgeCalculator = () => {
  const [birthDate, setBirthDate] = useState("");
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split("T")[0]);

  const ageData = useMemo(() => {
    if (!birthDate || !targetDate) return null;

    const birth = new Date(birthDate);
    const target = new Date(targetDate);

    if (birth >= target) return null;

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Total calculations
    const totalMs = target.getTime() - birth.getTime();
    const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;

    // Next birthday
    const nextBirthday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday <= target) {
      nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
    }
    const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

    // Zodiac sign
    const month = birth.getMonth() + 1;
    const day = birth.getDate();
    let zodiac = "";
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) zodiac = "Aries ♈";
    else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) zodiac = "Taurus ♉";
    else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) zodiac = "Gemini ♊";
    else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) zodiac = "Cancer ♋";
    else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) zodiac = "Leo ♌";
    else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) zodiac = "Virgo ♍";
    else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) zodiac = "Libra ♎";
    else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) zodiac = "Scorpio ♏";
    else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) zodiac = "Sagittarius ♐";
    else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) zodiac = "Capricorn ♑";
    else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) zodiac = "Aquarius ♒";
    else zodiac = "Pisces ♓";

    // Day of week born
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayBorn = daysOfWeek[birth.getDay()];

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalMonths,
      totalHours,
      totalMinutes,
      totalSeconds,
      daysUntilBirthday,
      zodiac,
      dayBorn,
      nextBirthdayAge: years + 1
    };
  }, [birthDate, targetDate]);

  const faqs = [
    {
      question: "How does the age calculator work?",
      answer: "Our age calculator calculates your exact age by comparing your birth date to today's date (or any target date). It computes years, months, and days precisely, accounting for different month lengths and leap years. The result shows your exact age in multiple formats."
    },
    {
      question: "Is this age calculator accurate?",
      answer: "Yes! Our age calculator is 100% accurate. It accounts for leap years, varying month lengths (28-31 days), and provides precise calculations down to the day. It's perfect for legal documents, birthday planning, or just curiosity about your exact age."
    },
    {
      question: "Can I calculate age for a future date?",
      answer: "Absolutely! You can set any target date to see how old someone will be on that date. This is useful for planning milestone birthdays, calculating age for future events, or determining eligibility for age-restricted activities."
    },
    {
      question: "What is the zodiac sign feature?",
      answer: "Based on your birth date, we automatically determine your Western zodiac sign. The 12 zodiac signs are based on the position of the sun at the time of birth and range from Aries (March 21) through Pisces (March 20)."
    },
    {
      question: "How many days until my next birthday?",
      answer: "The calculator automatically shows how many days remain until your next birthday. It also shows what age you'll turn on that birthday - great for countdown planning and celebration preparations!"
    },
    {
      question: "Can I use this for legal age verification?",
      answer: "Yes, our calculator shows precise age which can help determine eligibility for age-restricted activities like voting (18+), drinking (21+ in USA), retirement benefits, or any age-based requirements. Always verify with official documents for legal purposes."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Age Calculator - Calculate Your Exact Age Online Free 2025"
        description="Calculate your exact age in years, months, and days. Free online age calculator with zodiac sign, days until birthday, and more. Find how old you are today!"
        keywords="age calculator, calculate age, how old am i, exact age calculator, age in days, birthday calculator, age from date of birth, age calculator online free"
        canonical="https://pinetoolshub.com/age-calculator"
      />
      
      <ToolStructuredData
        toolName="Age Calculator - Calculate Exact Age Online"
        toolDescription="Calculate your exact age in years, months, days, hours, and minutes. Free online age calculator with zodiac sign and birthday countdown."
        toolUrl="https://pinetoolshub.com/age-calculator"
        category="Calculator"
      />
      
      <FAQStructuredData faqs={faqs} />

      <ToolHero
        title="Age Calculator"
        description="Calculate your exact age in years, months, and days. Find zodiac sign, days until birthday, and more!"
        icon={<Calendar className="h-8 w-8" />}
        color="bg-pink-500/20"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Input Section */}
          <Card className="bg-card border-border mb-6">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="birthDate" className="text-sm font-medium mb-2 block">
                    <Cake className="h-4 w-4 inline mr-2" />
                    Date of Birth
                  </Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    max={targetDate}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="targetDate" className="text-sm font-medium mb-2 block">
                    <Calendar className="h-4 w-4 inline mr-2" />
                    Calculate Age On
                  </Label>
                  <Input
                    id="targetDate"
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {ageData && (
            <>
              {/* Main Age Display */}
              <Card className="bg-gradient-to-r from-primary/20 to-pink-500/20 border-primary/50 mb-6">
                <CardContent className="p-8 text-center">
                  <h2 className="text-lg text-muted-foreground mb-2">Your Age</h2>
                  <div className="flex justify-center items-baseline gap-4 flex-wrap">
                    <div>
                      <span className="text-5xl md:text-6xl font-bold text-primary">{ageData.years}</span>
                      <span className="text-xl text-muted-foreground ml-2">years</span>
                    </div>
                    <div>
                      <span className="text-4xl md:text-5xl font-bold text-pink-400">{ageData.months}</span>
                      <span className="text-lg text-muted-foreground ml-2">months</span>
                    </div>
                    <div>
                      <span className="text-4xl md:text-5xl font-bold text-violet-400">{ageData.days}</span>
                      <span className="text-lg text-muted-foreground ml-2">days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card className="bg-card border-border">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-primary">{ageData.totalDays.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total Days</p>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-green-400">{ageData.totalWeeks.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total Weeks</p>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-blue-400">{ageData.totalMonths}</p>
                    <p className="text-xs text-muted-foreground">Total Months</p>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-orange-400">{ageData.totalHours.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total Hours</p>
                  </CardContent>
                </Card>
              </div>

              {/* Additional Info */}
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-card border-border">
                  <CardContent className="p-4 text-center">
                    <Heart className="h-6 w-6 mx-auto mb-2 text-red-400" />
                    <p className="text-lg font-bold">{ageData.daysUntilBirthday}</p>
                    <p className="text-xs text-muted-foreground">Days until birthday #{ageData.nextBirthdayAge}</p>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border">
                  <CardContent className="p-4 text-center">
                    <span className="text-3xl mb-2 block">{ageData.zodiac.split(" ")[1]}</span>
                    <p className="text-lg font-bold">{ageData.zodiac.split(" ")[0]}</p>
                    <p className="text-xs text-muted-foreground">Zodiac Sign</p>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border">
                  <CardContent className="p-4 text-center">
                    <Clock className="h-6 w-6 mx-auto mb-2 text-cyan-400" />
                    <p className="text-lg font-bold">{ageData.dayBorn}</p>
                    <p className="text-xs text-muted-foreground">Day You Were Born</p>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {!ageData && birthDate && (
            <Card className="bg-card border-border">
              <CardContent className="p-8 text-center text-muted-foreground">
                Please select a valid birth date before the target date.
              </CardContent>
            </Card>
          )}
        </div>

        {/* SEO Content */}
        <div className="max-w-4xl mx-auto mt-16 prose prose-invert">
          <h2 className="text-2xl font-bold text-foreground mb-4">Free Online Age Calculator</h2>
          <p className="text-muted-foreground mb-4">
            Want to know your exact age? Our free age calculator tells you precisely how old you are in years, months, 
            and days. It also shows your age in total days, weeks, hours, and even minutes - plus fun extras like your 
            zodiac sign and days until your next birthday.
          </p>
          
          <h3 className="text-xl font-semibold text-foreground mb-3">What This Age Calculator Shows</h3>
          <ul className="text-muted-foreground space-y-2 mb-6">
            <li><strong>Exact Age:</strong> Years, months, and days since your birth</li>
            <li><strong>Total Days Lived:</strong> Complete count of days you've been alive</li>
            <li><strong>Total Weeks & Months:</strong> Your age in different time units</li>
            <li><strong>Birthday Countdown:</strong> Days until your next birthday</li>
            <li><strong>Zodiac Sign:</strong> Your astrological sign based on birth date</li>
            <li><strong>Day Born:</strong> What day of the week you were born</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-3">Common Uses</h3>
          <p className="text-muted-foreground mb-4">
            People use age calculators for legal age verification, calculating retirement eligibility, determining 
            age for school enrollment, planning milestone birthdays, and simply satisfying curiosity about their exact age.
          </p>
        </div>

        <FAQSection faqs={faqs} />
      </div>
    </div>
  );
};

export default AgeCalculator;
