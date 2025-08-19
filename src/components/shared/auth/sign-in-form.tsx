"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSignInMutation } from "@/hooks/client/auth";
import { useAuthStore } from "@/stores/auth-store";
import { DeputyBureau } from "@/types/api/auth";
import { moduleAndRouteMap } from "@/utils/app-route";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormSchemaType = z.infer<typeof formSchema>;

export default function SignInForm() {
  const router = useRouter();
  const locale = useLocale();

  const { mutate, data, isPending, isSuccess, error, isError } =
    useSignInMutation();
  const { user, orgUnit } = useAuthStore();

  const form = useForm<LoginFormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormSchemaType) {
    //TODO: handle submission here
    console.log("values submited: ", { values });

    const newData = {
      email: values.email,
      password: values.password,
    };

    console.log(`NEW DATA ON SIGN IN: `);
    console.log(newData);
    mutate(newData);
  }

  useEffect(() => {
    if (isSuccess) {
      console.log(`SIGN IN RESPONSE: `, data);
      toast("Signin was successful");
      if (user?.accountType === "CLIENT") {
        // router.push(`/${locale}/applicant-portal/portal`);
        router.push(`/applicant-portal/portal`);
      } else if (orgUnit?.deputyBureau == null) {
        router.push("/bureau-head");
      } else {
        const route = moduleAndRouteMap(orgUnit?.deputyBureau as DeputyBureau);
        router.push(route);
      }
    }
    if (isError) {
      console.log(error.message);
      toast("SignIn Failed", {
        description: error.message,
      });
    }
  }, [isSuccess, isError, data, error, user, orgUnit, locale]);

  return (
    <div className="mx-auto w-full mt-5 max-w-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </label>
            </div>
            <Link
              href="/auth/reset-password"
              className="text-sm text-foreground underline hover:opacity-80"
            >
              Forgot password?
            </Link>
          </div> */}
          {isPending ? (
            <Button className="w-full" disabled>
              <Loader2 className="animate-spin" />
            </Button>
          ) : (
            <Button className="w-full" disabled={form.formState.isSubmitting}>
              Sign in
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
}
