import { LoginForm } from "@/features/auth/components/LoginForm";

const LoginPage = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <LoginForm className="max-w-sm" />
    </div>
  );
};

export default LoginPage;
