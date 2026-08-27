import { Route, Routes } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import SignupPage from "../pages/auth/SignupPage";
import ChatLayout from "../layouts/ChatLayout";
import AuthLayout from "../layouts/AuthLayout";
import NotFoundPage from "../pages/public/NotFoundPage";
import ChatPage from "../pages/chat/ChatPage";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<ChatLayout />}>
          <Route index element={<ChatPage />} />
        </Route>

        {/* Auth */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<LoginPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
        </Route>

        {/* Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default App;
