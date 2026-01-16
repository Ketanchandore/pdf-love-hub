import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import ToolHero from "@/components/shared/ToolHero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, ChevronDown, ChevronUp } from "lucide-react";
import FAQSection from "@/components/seo/FAQSection";
import RelatedTools from "@/components/seo/RelatedTools";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ChecklistItem {
  id: string;
  task: string;
  completed: boolean;
}

interface ChecklistCategory {
  id: string;
  name: string;
  timeline: string;
  items: ChecklistItem[];
  isOpen: boolean;
}

const defaultChecklist: Omit<ChecklistCategory, 'isOpen'>[] = [
  {
    id: "12-months",
    name: "12 Months Before",
    timeline: "1 Year",
    items: [
      { id: "1", task: "Set wedding date", completed: false },
      { id: "2", task: "Decide on budget", completed: false },
      { id: "3", task: "Create guest list draft", completed: false },
      { id: "4", task: "Book venue", completed: false },
      { id: "5", task: "Book wedding planner (if needed)", completed: false },
      { id: "6", task: "Start researching vendors", completed: false },
    ]
  },
  {
    id: "9-months",
    name: "9 Months Before",
    timeline: "9 Months",
    items: [
      { id: "7", task: "Book photographer & videographer", completed: false },
      { id: "8", task: "Book caterer", completed: false },
      { id: "9", task: "Start shopping for wedding attire", completed: false },
      { id: "10", task: "Book mehendi artist", completed: false },
      { id: "11", task: "Book makeup artist", completed: false },
      { id: "12", task: "Start selecting jewelry", completed: false },
    ]
  },
  {
    id: "6-months",
    name: "6 Months Before",
    timeline: "6 Months",
    items: [
      { id: "13", task: "Book DJ/band for sangeet", completed: false },
      { id: "14", task: "Order wedding cards/invitations", completed: false },
      { id: "15", task: "Book decorator", completed: false },
      { id: "16", task: "Plan honeymoon destination", completed: false },
      { id: "17", task: "Finalize wedding attire", completed: false },
      { id: "18", task: "Book pandit/officiant", completed: false },
    ]
  },
  {
    id: "3-months",
    name: "3 Months Before",
    timeline: "3 Months",
    items: [
      { id: "19", task: "Send save-the-dates", completed: false },
      { id: "20", task: "Plan sangeet/mehendi ceremony", completed: false },
      { id: "21", task: "Arrange accommodation for guests", completed: false },
      { id: "22", task: "Book transportation", completed: false },
      { id: "23", task: "Order wedding favors", completed: false },
      { id: "24", task: "Schedule dress fittings", completed: false },
    ]
  },
  {
    id: "1-month",
    name: "1 Month Before",
    timeline: "1 Month",
    items: [
      { id: "25", task: "Send formal invitations", completed: false },
      { id: "26", task: "Confirm all vendors", completed: false },
      { id: "27", task: "Final venue walkthrough", completed: false },
      { id: "28", task: "Finalize seating arrangements", completed: false },
      { id: "29", task: "Get marriage license", completed: false },
      { id: "30", task: "Bridal beauty treatments start", completed: false },
    ]
  },
  {
    id: "1-week",
    name: "1 Week Before",
    timeline: "1 Week",
    items: [
      { id: "31", task: "Confirm guest headcount with caterer", completed: false },
      { id: "32", task: "Prepare tips for vendors", completed: false },
      { id: "33", task: "Pack for honeymoon", completed: false },
      { id: "34", task: "Final fitting for outfits", completed: false },
      { id: "35", task: "Prepare wedding day timeline", completed: false },
      { id: "36", task: "Delegate day-of responsibilities", completed: false },
    ]
  },
  {
    id: "day-of",
    name: "Wedding Day",
    timeline: "Day Of",
    items: [
      { id: "37", task: "Get ready and stay calm!", completed: false },
      { id: "38", task: "Have emergency kit ready", completed: false },
      { id: "39", task: "Eat breakfast", completed: false },
      { id: "40", task: "Give rings to best man", completed: false },
      { id: "41", task: "Enjoy your special day!", completed: false },
    ]
  },
];

const WeddingChecklist = () => {
  const [categories, setCategories] = useState<ChecklistCategory[]>(
    defaultChecklist.map(cat => ({ ...cat, isOpen: true }))
  );

  const toggleItem = (categoryId: string, itemId: string) => {
    setCategories(categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          items: cat.items.map(item => 
            item.id === itemId ? { ...item, completed: !item.completed } : item
          )
        };
      }
      return cat;
    }));
  };

  const toggleCategory = (categoryId: string) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId ? { ...cat, isOpen: !cat.isOpen } : cat
    ));
  };

  const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0);
  const completedItems = categories.reduce(
    (sum, cat) => sum + cat.items.filter(item => item.completed).length, 
    0
  );
  const progressPercent = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  const faqs = [
    {
      question: "When should I start planning my wedding?",
      answer: "Ideally, start planning 12-18 months before your wedding date. This gives you enough time to book popular venues and vendors, especially during wedding season."
    },
    {
      question: "What are the most important things to book first?",
      answer: "Venue, photographer, and caterer should be your top priorities as they book up fastest. In India, also prioritize mehendi artist and makeup artist early."
    },
    {
      question: "How do I stay organized during wedding planning?",
      answer: "Use this checklist to track all tasks, set reminders for important deadlines, and consider using our Guest List Manager and Budget Calculator tools together."
    },
    {
      question: "What if I'm planning a destination wedding?",
      answer: "Start even earlier (15-18 months) for destination weddings. You'll need extra time for venue visits, guest travel arrangements, and vendor coordination."
    },
  ];

  const relatedTools = [
    { name: "Wedding Budget Calculator", href: "/tools/wedding-budget-calculator", description: "Plan your budget" },
    { name: "Guest List Manager", href: "/tools/guest-list-manager", description: "Manage guests" },
    { name: "Wedding Invitation Maker", href: "/tools/wedding-invitation-maker", description: "Create invitations" },
  ];

  return (
    <Layout>
      <Helmet>
        <title>Wedding Checklist | Complete Shaadi Planning Guide | Pine Tools Hub</title>
        <meta name="description" content="Complete Indian wedding checklist with timeline from 12 months to wedding day. Track tasks, stay organized, and plan your perfect shaadi." />
        <meta name="keywords" content="wedding checklist, shaadi planning, indian wedding timeline, marriage planning guide, wedding to-do list" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Breadcrumbs 
          items={[
            { label: "Home", href: "/" },
            { label: "Wedding Tools", href: "#" },
            { label: "Wedding Checklist", href: "/tools/wedding-checklist" },
          ]} 
        />

        <ToolHero
          title="Wedding Checklist"
          description="Your complete wedding planning timeline. Track every task from 12 months before to your big day."
          icon={<ClipboardList className="h-8 w-8 text-primary" />}
        />

        {/* Progress Card */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Overall Progress</h3>
                <p className="text-sm text-muted-foreground">
                  {completedItems} of {totalItems} tasks completed
                </p>
              </div>
              <div className="text-3xl font-bold text-primary">
                {progressPercent.toFixed(0)}%
              </div>
            </div>
            <Progress value={progressPercent} className="h-3" />
          </CardContent>
        </Card>

        {/* Checklist Categories */}
        <div className="mt-6 space-y-4">
          {categories.map((category) => {
            const categoryCompleted = category.items.filter(i => i.completed).length;
            const categoryTotal = category.items.length;
            const categoryPercent = categoryTotal > 0 ? (categoryCompleted / categoryTotal) * 100 : 0;

            return (
              <Collapsible key={category.id} open={category.isOpen}>
                <Card>
                  <CollapsibleTrigger 
                    className="w-full"
                    onClick={() => toggleCategory(category.id)}
                  >
                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-lg">{category.name}</CardTitle>
                          <Badge variant="secondary">{category.timeline}</Badge>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">
                            {categoryCompleted}/{categoryTotal}
                          </span>
                          <div className="w-24">
                            <Progress value={categoryPercent} className="h-2" />
                          </div>
                          {category.isOpen ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {category.items.map((item) => (
                          <div 
                            key={item.id}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <Checkbox
                              checked={item.completed}
                              onCheckedChange={() => toggleItem(category.id, item.id)}
                            />
                            <span className={item.completed ? "line-through text-muted-foreground" : ""}>
                              {item.task}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            );
          })}
        </div>

        <div className="mt-12 prose prose-gray max-w-none">
          <h2>Your Complete Wedding Planning Timeline</h2>
          <p>
            Planning an Indian wedding involves coordinating multiple events, vendors, and traditions. 
            Our comprehensive checklist breaks down every task you need to complete, organized by 
            timeline so you never miss an important deadline.
          </p>
          <h3>Why Use a Wedding Checklist?</h3>
          <ul>
            <li>Stay organized with clear timelines</li>
            <li>Never forget important tasks</li>
            <li>Reduce wedding planning stress</li>
            <li>Track your progress visually</li>
          </ul>
        </div>

        <FAQSection faqs={faqs} />
        <RelatedTools tools={relatedTools} />
      </div>
    </Layout>
  );
};

export default WeddingChecklist;
