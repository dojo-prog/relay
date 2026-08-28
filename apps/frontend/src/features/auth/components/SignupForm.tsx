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
import { RegisterBodySchema, type RegisterBody } from "@relay/shared";
import { zodResolver } from "@hookform/resolvers/zod";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<RegisterBody>({
    resolver: zodResolver(RegisterBodySchema),

    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  // TODO apply api
  const onSubmit = (values: RegisterBody) => {
    try {
      console.log(values);
    } catch (error: any) {
      form.setError("root", { message: error.message });
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              {/* Username */}
              <Field>
                <FieldLabel htmlFor="name">Username</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  {...form.register("username")}
                />

                <FieldError errors={[form.formState.errors.username]} />
              </Field>

              {/* Email */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...form.register("email")}
                />

                <FieldError errors={[form.formState.errors.email]} />
              </Field>

              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  {/* Password */}
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter password"
                      {...form.register("password")}
                    />

                    <FieldError errors={[form.formState.errors.password]} />
                  </Field>

                  {/* Confirm Password */}
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Repeat password"
                      {...form.register("confirm_password")}
                    />

                    <FieldError
                      errors={[form.formState.errors.confirm_password]}
                    />
                  </Field>
                </Field>
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>

              <Field>
                <Button type="submit">Create Account</Button>
                <FieldDescription className="text-center">
                  Already have an account?{" "}
                  <Link to={"/auth/login"}>Sign in</Link>
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
