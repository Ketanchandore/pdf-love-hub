import { useState, useCallback } from "react";
import SEOHead from "@/components/seo/SEOHead";
import ToolHero from "@/components/shared/ToolHero";
import FAQSection from "@/components/seo/FAQSection";
import { ToolStructuredData, FAQStructuredData } from "@/components/seo/StructuredData";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Key, Copy, RefreshCw, Shield, ShieldCheck, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

const PasswordGenerator = () => {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState("");

  const generatePassword = useCallback(() => {
    let chars = "";
    if (uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lowercase) chars += "abcdefghijklmnopqrstuvwxyz";
    if (numbers) chars += "0123456789";
    if (symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (!chars) {
      toast.error("Please select at least one character type");
      return;
    }

    let result = "";
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }
    setPassword(result);
  }, [length, uppercase, lowercase, numbers, symbols]);

  const copyToClipboard = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    toast.success("Password copied to clipboard!");
  };

  const getStrength = () => {
    if (!password) return { label: "None", color: "text-muted-foreground", icon: Shield, score: 0 };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 3) return { label: "Weak", color: "text-red-400", icon: ShieldAlert, score };
    if (score <= 5) return { label: "Medium", color: "text-yellow-400", icon: Shield, score };
    return { label: "Strong", color: "text-green-400", icon: ShieldCheck, score };
  };

  const strength = getStrength();

  const faqs = [
    {
      question: "What makes a password strong?",
      answer: "A strong password is at least 12-16 characters long, includes uppercase and lowercase letters, numbers, and special symbols, and doesn't contain personal information or common words."
    },
    {
      question: "Is this password generator secure?",
      answer: "Yes! Our generator uses cryptographically secure random number generation (crypto.getRandomValues) and runs entirely in your browser. Passwords are never transmitted or stored anywhere."
    },
    {
      question: "How long should my password be?",
      answer: "We recommend at least 16 characters for important accounts. For maximum security, use 20+ characters. Longer passwords are exponentially harder to crack."
    },
    {
      question: "Should I use special characters in passwords?",
      answer: "Yes, special characters significantly increase password strength by expanding the character set. A 12-character password with symbols is much stronger than one without."
    },
    {
      question: "How often should I change my passwords?",
      answer: "Change passwords immediately if you suspect a breach. Otherwise, focus on using unique, strong passwords for each account rather than frequently changing them."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Password Generator - Strong Random Password Maker Free"
        description="Generate strong, secure random passwords instantly. Free password generator with customizable length, symbols, numbers. Create uncrackable passwords online."
        keywords="password generator, random password, strong password, secure password generator, password maker, generate password, strong password generator"
        canonical="https://pinetoolshub.com/password-generator"
      />
      
      <ToolStructuredData
        toolName="Password Generator"
        toolDescription="Generate strong, secure random passwords with customizable options."
        toolUrl="https://pinetoolshub.com/password-generator"
        category="Calculator"
      />
      
      <FAQStructuredData faqs={faqs} />

      <ToolHero
        title="Password Generator"
        description="Generate strong, secure random passwords instantly"
        icon={<Key className="h-8 w-8" />}
        color="bg-emerald-500/20"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Generated Password */}
          <Card className="bg-card border-border mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 p-4 bg-muted rounded-lg font-mono text-lg break-all min-h-[60px] flex items-center">
                  {password || <span className="text-muted-foreground">Click generate to create password</span>}
                </div>
                <Button variant="outline" size="icon" onClick={copyToClipboard} disabled={!password}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              {password && (
                <div className="flex items-center gap-2 mb-4">
                  <strength.icon className={`h-5 w-5 ${strength.color}`} />
                  <span className={`font-semibold ${strength.color}`}>{strength.label}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        strength.score <= 3 ? 'bg-red-400' : strength.score <= 5 ? 'bg-yellow-400' : 'bg-green-400'
                      }`}
                      style={{ width: `${(strength.score / 7) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              <Button onClick={generatePassword} className="w-full" size="lg">
                <RefreshCw className="h-4 w-4 mr-2" /> Generate Password
              </Button>
            </CardContent>
          </Card>

          {/* Options */}
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Password Options</h3>
              
              <div className="space-y-6">
                {/* Length */}
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Password Length</Label>
                    <span className="font-mono font-bold">{length}</span>
                  </div>
                  <Slider
                    value={[length]}
                    onValueChange={([val]) => setLength(val)}
                    min={4}
                    max={64}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>4</span>
                    <span>64</span>
                  </div>
                </div>

                {/* Character Types */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <Label htmlFor="uppercase" className="cursor-pointer">Uppercase (A-Z)</Label>
                    <Switch id="uppercase" checked={uppercase} onCheckedChange={setUppercase} />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <Label htmlFor="lowercase" className="cursor-pointer">Lowercase (a-z)</Label>
                    <Switch id="lowercase" checked={lowercase} onCheckedChange={setLowercase} />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <Label htmlFor="numbers" className="cursor-pointer">Numbers (0-9)</Label>
                    <Switch id="numbers" checked={numbers} onCheckedChange={setNumbers} />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <Label htmlFor="symbols" className="cursor-pointer">Symbols (!@#$)</Label>
                    <Switch id="symbols" checked={symbols} onCheckedChange={setSymbols} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto mt-16 prose prose-invert">
          <h2 className="text-2xl font-bold text-foreground mb-4">Free Secure Password Generator</h2>
          <p className="text-muted-foreground mb-4">
            Create strong, random passwords instantly with our free password generator. All passwords are 
            generated locally in your browser using cryptographic randomness - nothing is ever sent over the internet.
          </p>
          
          <h3 className="text-xl font-semibold text-foreground mb-3">Password Security Tips</h3>
          <ul className="text-muted-foreground space-y-2 mb-6">
            <li>Use a unique password for every account</li>
            <li>Enable two-factor authentication whenever possible</li>
            <li>Consider using a password manager</li>
            <li>Never share passwords via email or text</li>
          </ul>
        </div>

        <FAQSection faqs={faqs} />
      </div>
    </div>
  );
};

export default PasswordGenerator;
