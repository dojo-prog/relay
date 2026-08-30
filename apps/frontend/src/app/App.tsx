import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import SignupPage from "../pages/auth/SignupPage";
import ChatLayout from "../layouts/ChatLayout";
import AuthLayout from "../layouts/AuthLayout";
import NotFoundPage from "../pages/public/NotFoundPage";
import ChatPage from "../pages/chat/ChatPage";
import { Toaster } from "@/components/ui/sonner";
import useAuthStore from "@/stores/auth.store";
import { useEffect } from "react";
import { socket } from "@/services/socket/socket";
import { registerConversationListeners } from "@/services/socket/listeners/conversation.listeners";
import { useQueryClient } from "@tanstack/react-query";
import { registerMessageListener } from "@/services/socket/listeners/message.listener";

const App = () => {
  const { user, checkAuth } = useAuthStore();

  const queryClient = useQueryClient();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!user) {
      socket.disconnect();
      return;
    }

    socket.connect();

    const cleanupConversationListeners =
      registerConversationListeners(queryClient);

    const cleanupMessageListeners = registerMessageListener(
      queryClient,
      user.id,
    );

    return () => {
      cleanupConversationListeners();
      cleanupMessageListeners();

      socket.disconnect();
    };
  }, [user]);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={user ? <ChatLayout /> : <Navigate to={"/auth"} />}
        >
          <Route index element={<ChatPage />} />
          <Route path="conversations/:conversationId" element={<ChatPage />} />
        </Route>

        {/* Auth */}
        <Route
          path="/auth"
          element={!user ? <AuthLayout /> : <Navigate to={"/"} />}
        >
          <Route index element={<LoginPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
        </Route>

        {/* Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Toaster />
    </>
  );
};

export default App;
