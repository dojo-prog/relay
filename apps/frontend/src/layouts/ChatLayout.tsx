import { Outlet } from "react-router-dom";

const ChatLayout = () => {
  return (
    <div className="min-h-screen w-full">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-12 py-20">
        <Outlet />
      </div>
    </div>
  );
};

export default ChatLayout;
