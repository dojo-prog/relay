import { Skeleton } from "@/components/ui/skeleton";

const ConversationSkeletion = () => {
  return (
    <div className="flex w-full items-center gap-3 rounded-lg p-3 ">
      <Skeleton className="size-10 shrink-0 rounded-full" />

      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-28" />
        </div>

        <Skeleton className="h-3 w-40" />
      </div>
    </div>
  );
};

export default ConversationSkeletion;
