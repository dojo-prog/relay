import { SignupForm } from "@/features/auth/components/SignupForm";

const SignupPage = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <SignupForm className="max-w-md" />
    </div>
  );
};

export default SignupPage;
