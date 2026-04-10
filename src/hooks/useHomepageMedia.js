import { useQuery } from "@tanstack/react-query";
import { entities } from "@/api/appClient";

export function useHomepageMedia() {
  return useQuery({
    queryKey: ["homepage-media"],
    staleTime: 60_000,
    queryFn: async () => {
      try {
        const rows = await entities.SiteSetting.filter({ setting_key: "homepage_media" }, "created_at", 1);
        return rows?.[0] || null;
      } catch {
        return null;
      }
    },
  });
}
