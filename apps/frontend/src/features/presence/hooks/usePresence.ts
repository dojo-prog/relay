import type { UserPresence } from "@/services/socket/listeners/presence.listener";
import { useQuery } from "@tanstack/react-query";

export const usePresence = () => {
  return useQuery<UserPresence[] | null>({
    queryKey: ["presence"],
    queryFn: async () => null,
  });
};
