import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2 } from "lucide-react";

interface SettingRow {
  id: string;
  setting_key: string;
  setting_value: string;
}

const SETTING_GROUPS = [
  {
    title: "Contact & WhatsApp",
    fields: [
      { key: "whatsapp_number", label: "WhatsApp Number (no +)", placeholder: "94722507196" },
      { key: "phone", label: "Phone Display", placeholder: "+94 72 250 7196" },
      { key: "address", label: "Address", placeholder: "Nagoda, Kaluthara" },
      { key: "google_maps_link", label: "Google Maps Link", placeholder: "https://maps.app.goo.gl/..." },
    ],
  },
  {
    title: "Hero Section",
    fields: [
      { key: "hero_tagline", label: "Tagline", placeholder: "We Make Every Moment Special" },
      { key: "hero_title", label: "Hero Title", placeholder: "Make Every Moment Magical with Flowers" },
      { key: "hero_subtitle", label: "Hero Subtitle", placeholder: "Elegant bouquet designs, teddy bouquets, and custom arrangements..." },
    ],
  },
  {
    title: "About Us",
    fields: [
      { key: "about_title", label: "Section Label", placeholder: "About Tinkerfly" },
      { key: "about_heading", label: "Heading", placeholder: "Crafting Elegance..." },
      { key: "about_description", label: "Description", placeholder: "At Tinkerfly...", multiline: true },
      { key: "about_image", label: "Image URL (optional)", placeholder: "https://..." },
    ],
  },
  {
    title: "Social Media Links",
    fields: [
      { key: "facebook_url", label: "Facebook URL", placeholder: "https://facebook.com/..." },
      { key: "instagram_url", label: "Instagram URL", placeholder: "https://instagram.com/..." },
      { key: "tiktok_url", label: "TikTok URL", placeholder: "https://tiktok.com/..." },
    ],
  },
  {
    title: "Footer",
    fields: [
      { key: "footer_tagline", label: "Footer Tagline", placeholder: "We Make Every Moment Special" },
    ],
  },
];

export default function SiteSettingsManager() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const raw = localStorage.getItem("tinkerfly_site_settings");
    if (raw) {
      setSettings(JSON.parse(raw));
    }
    setLoading(false);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    // Artificial delay to mimic save
    await new Promise(r => setTimeout(r, 500));
    localStorage.setItem("tinkerfly_site_settings", JSON.stringify(settings));
    setSaving(false);
    toast({ title: "Settings saved successfully" });
  };

  const update = (key: string, value: string) => {
    setSettings((s) => ({ ...s, [key]: value }));
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold">Site Settings</h2>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Save All
        </Button>
      </div>

      <div className="grid gap-6">
        {SETTING_GROUPS.map((group) => (
          <Card key={group.title}>
            <CardHeader>
              <CardTitle className="text-lg">{group.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {group.fields.map((field: any) => (
                <div key={field.key} className="space-y-2">
                  <Label>{field.label}</Label>
                  {field.multiline ? (
                    <Textarea
                      value={settings[field.key] || ""}
                      onChange={(e) => update(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      rows={4}
                    />
                  ) : (
                    <Input
                      value={settings[field.key] || ""}
                      onChange={(e) => update(field.key, e.target.value)}
                      placeholder={field.placeholder}
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
