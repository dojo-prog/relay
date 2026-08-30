import ConversationSkeletion from "./ConversationSkeletion";

const ConversationListSkeleton = () => {
  return (
    <div className="space-y-1 p-1">
      {Array.from({ length: 6 }).map((_, index) => (
        <ConversationSkeletion key={index} />
      ))}
    </div>
  );
};

export default ConversationListSkeleton;
