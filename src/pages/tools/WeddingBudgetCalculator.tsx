import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import ToolHero from "@/components/shared/ToolHero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calculator, Plus, Trash2, IndianRupee, DollarSign } from "lucide-react";
import RelatedTools from "@/components/seo/RelatedTools";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

interface BudgetItem {
  id: string;
  category: string;
  name: string;
  estimated: number;
  actual: number;
}

const defaultCategories = [
  { category: "Venue", name: "Wedding Venue", estimated: 200000 },
  { category: "Venue", name: "Decoration", estimated: 50000 },
  { category: "Catering", name: "Food & Beverages", estimated: 150000 },
  { category: "Attire", name: "Bride's Outfit", estimated: 100000 },
  { category: "Attire", name: "Groom's Outfit", estimated: 50000 },
  { category: "Photography", name: "Photo & Video", estimated: 80000 },
  { category: "Entertainment", name: "DJ & Music", estimated: 30000 },
  { category: "Jewelry", name: "Wedding Jewelry", estimated: 200000 },
  { category: "Invitations", name: "Cards & Stationery", estimated: 20000 },
  { category: "Miscellaneous", name: "Gifts & Favors", estimated: 30000 },
];

const WeddingBudgetCalculator = () => {
  const [totalBudget, setTotalBudget] = useState<number>(1000000);
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [items, setItems] = useState<BudgetItem[]>(
    defaultCategories.map((cat, idx) => ({
      id: `item-${idx}`,
      ...cat,
      actual: 0,
    }))
  );

  const totalEstimated = items.reduce((sum, item) => sum + item.estimated, 0);
  const totalActual = items.reduce((sum, item) => sum + item.actual, 0);
  const remaining = totalBudget - totalActual;
  const budgetUsedPercent = totalBudget > 0 ? (totalActual / totalBudget) * 100 : 0;

  const updateItem = (id: string, field: "estimated" | "actual", value: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const addItem = () => {
    setItems([...items, {
      id: `item-${Date.now()}`,
      category: "Custom",
      name: "New Item",
      estimated: 0,
      actual: 0,
    }]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const formatCurrency = (amount: number) => {
    return currency === "INR" 
      ? `₹${amount.toLocaleString('en-IN')}`
      : `$${amount.toLocaleString('en-US')}`;
  };

  const faqs = [
    {
      question: "How much should I budget for an Indian wedding?",
      answer: "Indian weddings typically range from ₹10 lakhs to ₹1 crore+ depending on scale. A modest wedding costs ₹10-25 lakhs, mid-range ₹25-50 lakhs, and luxury weddings ₹50 lakhs to several crores."
    },
    {
      question: "What's the biggest expense in a wedding?",
      answer: "Venue and catering typically account for 40-50% of the total budget. Jewelry and attire can also be significant expenses, especially in traditional Indian weddings."
    },
    {
      question: "How can I reduce wedding costs?",
      answer: "Consider off-season dates, limit guest count, choose all-inclusive venues, DIY decorations, and prioritize what matters most to you. Our calculator helps track where you can cut costs."
    },
    {
      question: "Should I include honeymoon in wedding budget?",
      answer: "It's recommended to budget separately for honeymoon. However, you can add it as a custom item in our calculator to get a complete picture of wedding-related expenses."
    },
  ];

  return (
    <Layout>
      <Helmet>
        <title>Wedding Budget Calculator | Plan Your Dream Wedding | Pine Tools Hub</title>
        <meta name="description" content="Free wedding budget calculator to plan your perfect wedding. Track expenses, manage costs, and stay within budget for Indian & destination weddings." />
        <meta name="keywords" content="wedding budget calculator, shaadi budget planner, indian wedding cost, marriage budget, wedding expense tracker" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Breadcrumbs 
          items={[
            { label: "Home", href: "/" },
            { label: "Wedding Tools", href: "#" },
            { label: "Budget Calculator", href: "/tools/wedding-budget-calculator" },
          ]} 
        />

        <ToolHero
          title="Wedding Budget Calculator"
          description="Plan your dream wedding without breaking the bank. Track every expense and stay organized."
          icon={<Calculator className="h-8 w-8 text-primary" />}
        />

        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Budget Items</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={currency === "INR" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrency("INR")}
                  >
                    <IndianRupee className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={currency === "USD" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrency("USD")}
                  >
                    <DollarSign className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground pb-2 border-b">
                  <div className="col-span-4">Item</div>
                  <div className="col-span-3">Estimated</div>
                  <div className="col-span-3">Actual</div>
                  <div className="col-span-2"></div>
                </div>
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-4">
                      <Input
                        value={item.name}
                        onChange={(e) => {
                          setItems(items.map(i => 
                            i.id === item.id ? { ...i, name: e.target.value } : i
                          ));
                        }}
                        className="text-sm"
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        type="number"
                        value={item.estimated}
                        onChange={(e) => updateItem(item.id, "estimated", Number(e.target.value))}
                        className="text-sm"
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        type="number"
                        value={item.actual}
                        onChange={(e) => updateItem(item.id, "actual", Number(e.target.value))}
                        className="text-sm"
                      />
                    </div>
                    <div className="col-span-2 flex justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button onClick={addItem} variant="outline" className="w-full mt-4">
                  <Plus className="h-4 w-4 mr-2" /> Add Item
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Budget</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Your Budget</Label>
                  <Input
                    type="number"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(Number(e.target.value))}
                    className="text-lg font-semibold"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Budget Used</span>
                    <span>{budgetUsedPercent.toFixed(1)}%</span>
                  </div>
                  <Progress value={Math.min(budgetUsedPercent, 100)} className="h-3" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Budget</span>
                  <span className="font-semibold">{formatCurrency(totalBudget)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Total</span>
                  <span className="font-semibold">{formatCurrency(totalEstimated)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Actual Spent</span>
                  <span className="font-semibold">{formatCurrency(totalActual)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Remaining</span>
                    <span className={`font-bold text-lg ${remaining >= 0 ? 'text-green-600' : 'text-destructive'}`}>
                      {formatCurrency(remaining)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-12 prose prose-gray max-w-none">
          <h2>Plan Your Perfect Wedding Budget</h2>
          <p>
            Our free Wedding Budget Calculator helps you plan every aspect of your special day. 
            Whether you're planning a traditional Indian wedding, a destination ceremony, or an 
            intimate celebration, tracking your expenses is crucial to avoid overspending.
          </p>
          <h3>Key Features</h3>
          <ul>
            <li>Pre-loaded categories common to Indian weddings</li>
            <li>Support for INR and USD currencies</li>
            <li>Track estimated vs actual expenses</li>
            <li>Add custom items for your unique needs</li>
            <li>Visual progress tracking</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default WeddingBudgetCalculator;
