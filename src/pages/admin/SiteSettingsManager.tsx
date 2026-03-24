import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2, UploadCloud } from "lucide-react";

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
  const [heroUploading, setHeroUploading] = useState<{
    hero1: boolean;
    hero2: boolean;
  }>({ hero1: false, hero2: false });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/site-settings");
        if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Failed to load settings");
        const data = await res.json();
        setSettings(data ?? {});
      } catch (err: any) {
        toast({ title: "Load failed", description: err.message, variant: "destructive" });
        setSettings({});
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Save failed");
      toast({ title: "Settings saved successfully" });
    } catch (err: any) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const update = (key: string, value: string) => {
    setSettings((s) => ({ ...s, [key]: value }));
  };

  const savePartial = async (partial: Record<string, string>) => {
    const res = await fetch("/api/admin/site-settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(partial),
    });
    if (!res.ok) {
      throw new Error((await res.json().catch(() => ({}))).error || "Failed to save");
    }
  };

  const hero_image_1 = settings?.hero_image_1 || "/hero1.jpeg";
  const hero_image_2 = settings?.hero_image_2 || "/hero2.jpeg";

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

      {/* Hero images upload */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Hero Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label>Hero Image 1</Label>
              <div className="rounded-card overflow-hidden border border-border/40 bg-card">
                <img src={hero_image_1} alt="Hero 1 preview" className="w-full h-40 object-cover" />
              </div>
              <div className="space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  disabled={heroUploading.hero1 || heroUploading.hero2}
                  onChange={async (e) => {
                    const inputEl = e.currentTarget;
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setHeroUploading((s) => ({ ...s, hero1: true }));
                    try {
                      const fd = new FormData();
                      fd.append("hero1", file);
                      const res = await fetch("/api/admin/hero-images", { method: "POST", body: fd });
                      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Upload failed");
                      const data = await res.json();
                      const url = data.hero_image_1 as string | undefined;
                      if (url) {
                        setSettings((s) => ({ ...s, hero_image_1: url }));
                        await savePartial({ hero_image_1: url });
                        toast({ title: "Hero Image 1 uploaded" });
                      }
                    } catch (err: any) {
                      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
                    } finally {
                      setHeroUploading((s) => ({ ...s, hero1: false }));
                      inputEl.value = "";
                    }
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">Used as About section fallback if `about_image` is empty.</p>
            </div>

            <div className="space-y-3">
              <Label>Hero Image 2</Label>
              <div className="rounded-card overflow-hidden border border-border/40 bg-card">
                <img src={hero_image_2} alt="Hero 2 preview" className="w-full h-40 object-cover" />
              </div>
              <div className="space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  disabled={heroUploading.hero1 || heroUploading.hero2}
                  onChange={async (e) => {
                    const inputEl = e.currentTarget;
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setHeroUploading((s) => ({ ...s, hero2: true }));
                    try {
                      const fd = new FormData();
                      fd.append("hero2", file);
                      const res = await fetch("/api/admin/hero-images", { method: "POST", body: fd });
                      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Upload failed");
                      const data = await res.json();
                      const url = data.hero_image_2 as string | undefined;
                      if (url) {
                        setSettings((s) => ({ ...s, hero_image_2: url }));
                        await savePartial({ hero_image_2: url });
                        toast({ title: "Hero Image 2 uploaded" });
                      }
                    } catch (err: any) {
                      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
                    } finally {
                      setHeroUploading((s) => ({ ...s, hero2: false }));
                      inputEl.value = "";
                    }
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">Used in the landing hero section.</p>
            </div>
          </div>

          {(heroUploading.hero1 || heroUploading.hero2) && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <UploadCloud className="h-4 w-4 animate-spin" />
              <span>Uploading...</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
