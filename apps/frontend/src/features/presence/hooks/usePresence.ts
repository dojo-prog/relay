import { useQuery } from "@tanstack/react-query";

export const usePresence = () => {
  return useQuery<string[] | null>({
    queryKey: ["presence"],
    queryFn: async () => null,
  });
};
