import ChatContainer from "@/features/conversations/components/ChatContainer";
import ChatList from "@/features/conversations/components/ChatList";

const ChatPage = () => {
  return (
    <div className="flex h-[calc(100vh-12rem)] w-full gap-6 bg-background overflow-hidden">
      <aside className="hidden w-80 shrink-0 md:block">
        <ChatList />
      </aside>

      <main className="min-w-0 flex-1">
        <ChatContainer />
      </main>
    </div>
  );
};

export default ChatPage;
