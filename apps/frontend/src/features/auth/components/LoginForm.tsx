import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type LoginBody, LoginBodySchema } from "@relay/shared";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<LoginBody>({
    resolver: zodResolver(LoginBodySchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  // TODO apply api
  const onSubmit = (values: LoginBody) => {
    try {
      console.log(values);
    } catch (error: any) {
      form.setError("root", {
        message: error.message,
      });
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your Email and Password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  {...form.register("email")}
                />

                <FieldError errors={[form.formState.errors.email]} />
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  {...form.register("password")}
                />

                <FieldError errors={[form.formState.errors.password]} />
              </Field>

              {form.formState.errors.root && (
                <FieldError errors={[form.formState.errors.root]} />
              )}

              <Field>
                <Button type="submit">Login</Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link to={"/auth/signup"}>Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
