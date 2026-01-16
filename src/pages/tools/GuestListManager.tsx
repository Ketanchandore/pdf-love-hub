import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import ToolHero from "@/components/shared/ToolHero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Plus, Trash2, Search, Download, UserCheck, UserX, HelpCircle } from "lucide-react";
import ToolHero from "@/components/shared/ToolHero";
import FAQSection from "@/components/seo/FAQSection";
import RelatedTools from "@/components/seo/RelatedTools";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

interface Guest {
  id: string;
  name: string;
  phone: string;
  email: string;
  side: "bride" | "groom" | "mutual";
  status: "pending" | "confirmed" | "declined";
  plusOne: boolean;
  dietary: string;
}

const GuestListManager = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterSide, setFilterSide] = useState<string>("all");
  const [newGuest, setNewGuest] = useState({
    name: "",
    phone: "",
    email: "",
    side: "mutual" as const,
    dietary: "",
  });

  const addGuest = () => {
    if (!newGuest.name.trim()) return;
    setGuests([...guests, {
      id: `guest-${Date.now()}`,
      ...newGuest,
      status: "pending",
      plusOne: false,
    }]);
    setNewGuest({ name: "", phone: "", email: "", side: "mutual", dietary: "" });
  };

  const updateGuestStatus = (id: string, status: Guest["status"]) => {
    setGuests(guests.map(g => g.id === id ? { ...g, status } : g));
  };

  const togglePlusOne = (id: string) => {
    setGuests(guests.map(g => g.id === id ? { ...g, plusOne: !g.plusOne } : g));
  };

  const removeGuest = (id: string) => {
    setGuests(guests.filter(g => g.id !== id));
  };

  const filteredGuests = guests.filter(guest => {
    const matchesSearch = guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          guest.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || guest.status === filterStatus;
    const matchesSide = filterSide === "all" || guest.side === filterSide;
    return matchesSearch && matchesStatus && matchesSide;
  });

  const totalGuests = guests.length + guests.filter(g => g.plusOne).length;
  const confirmedGuests = guests.filter(g => g.status === "confirmed").length +
                          guests.filter(g => g.status === "confirmed" && g.plusOne).length;
  const pendingGuests = guests.filter(g => g.status === "pending").length;
  const declinedGuests = guests.filter(g => g.status === "declined").length;

  const exportToCSV = () => {
    const headers = ["Name", "Phone", "Email", "Side", "Status", "Plus One", "Dietary"];
    const rows = guests.map(g => [
      g.name, g.phone, g.email, g.side, g.status, g.plusOne ? "Yes" : "No", g.dietary
    ]);
    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "wedding-guest-list.csv";
    a.click();
  };


  return (
    <Layout>
      <Helmet>
        <title>Wedding Guest List Manager | Free RSVP Tracker | Pine Tools Hub</title>
        <meta name="description" content="Free wedding guest list manager to track RSVPs, manage invitations, and organize your wedding guests. Perfect for Indian weddings." />
        <meta name="keywords" content="wedding guest list, RSVP tracker, shaadi guest manager, wedding invitation list, marriage guest tracker" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-6xl">

        <ToolHero
          title="Wedding Guest List Manager"
          description="Effortlessly manage your wedding guests, track RSVPs, and export your list for vendors."
          icon={<Users className="h-8 w-8 text-primary" />}
        />

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-primary">{totalGuests}</div>
              <div className="text-sm text-muted-foreground">Total Guests</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-green-600">{confirmedGuests}</div>
              <div className="text-sm text-muted-foreground">Confirmed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-yellow-600">{pendingGuests}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-red-600">{declinedGuests}</div>
              <div className="text-sm text-muted-foreground">Declined</div>
            </CardContent>
          </Card>
        </div>

        {/* Add Guest Form */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Add New Guest</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-6 gap-4">
              <Input
                placeholder="Guest Name *"
                value={newGuest.name}
                onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
                className="md:col-span-2"
              />
              <Input
                placeholder="Phone Number"
                value={newGuest.phone}
                onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
              />
              <Input
                placeholder="Email"
                value={newGuest.email}
                onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
              />
              <Select
                value={newGuest.side}
                onValueChange={(v: "bride" | "groom" | "mutual") => setNewGuest({ ...newGuest, side: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Side" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bride">Bride's Side</SelectItem>
                  <SelectItem value="groom">Groom's Side</SelectItem>
                  <SelectItem value="mutual">Mutual</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={addGuest} className="w-full">
                <Plus className="h-4 w-4 mr-2" /> Add
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Filters & Search */}
        <div className="flex flex-wrap gap-4 mt-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search guests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterSide} onValueChange={setFilterSide}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Side" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sides</SelectItem>
              <SelectItem value="bride">Bride's Side</SelectItem>
              <SelectItem value="groom">Groom's Side</SelectItem>
              <SelectItem value="mutual">Mutual</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportToCSV} disabled={guests.length === 0}>
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </Button>
        </div>

        {/* Guest List */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            {filteredGuests.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No guests added yet. Add your first guest above!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredGuests.map((guest) => (
                  <div key={guest.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                    <div className="flex-1">
                      <div className="font-medium flex items-center gap-2">
                        {guest.name}
                        {guest.plusOne && <Badge variant="secondary">+1</Badge>}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {guest.phone && <span>{guest.phone} • </span>}
                        {guest.email && <span>{guest.email}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={guest.side === "bride" ? "default" : guest.side === "groom" ? "secondary" : "outline"}>
                        {guest.side}
                      </Badge>
                      <Button
                        variant={guest.status === "confirmed" ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateGuestStatus(guest.id, "confirmed")}
                      >
                        <UserCheck className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={guest.status === "declined" ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => updateGuestStatus(guest.id, "declined")}
                      >
                        <UserX className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={guest.status === "pending" ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => updateGuestStatus(guest.id, "pending")}
                      >
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => togglePlusOne(guest.id)}
                      >
                        +1
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeGuest(guest.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </Layout>
  );
};

export default GuestListManager;
