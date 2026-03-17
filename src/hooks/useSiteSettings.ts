import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = Record<string, string>;

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("setting_key, setting_value");
      const settings: SiteSettings = {};
      (data ?? []).forEach((row: any) => {
        settings[row.setting_key] = row.setting_value;
      });
      return settings;
    },
    staleTime: 5 * 60 * 1000,
  });
}
