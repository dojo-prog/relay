import { useQuery } from "@tanstack/react-query";

export const useTypings = (conversationId: string) => {
  return useQuery<string[]>({
    queryKey: ["typing", conversationId],
    queryFn: () => [],
  });
};
