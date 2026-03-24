import { useQuery } from "@tanstack/react-query";

export type SiteSettings = Record<string, string>;

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const res = await fetch(`/api/site-settings?_=${Date.now()}`, {
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to load site settings");
      }
      return (await res.json()) as SiteSettings;
    },
    // Admin changes should reflect immediately on the landing page.
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}
