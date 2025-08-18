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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Card } from "@/components/ui/card";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export default function ResetPasswordPage() {
  const [sent, setSent] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // TODO: Implement password reset link sending logic
    setSent(true);
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4">
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl gap-10">
        <div className="flex flex-col items-center   text-center md:text-left">
          <img
            src="/assets/WCSA_logo.jpg"
            alt="logo"
            className="w-40 h-20 md:w-80 md:h-60 object-contain mb-8"
          />
        </div>
        <Card className="w-full max-w-md flex flex-col px-10 py-10">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">Reset Password</h2>
            <p className="text-sm text-muted-foreground">
              Enter your email to receive a password reset link.
            </p>
          </div>
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

              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting || sent}
              >
                {form.formState.isSubmitting
                  ? "Sending..."
                  : sent
                  ? "Link Sent!"
                  : "Send Password Reset Link"}
              </Button>
            </form>
          </Form>
          {sent && (
            <div className="p-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg text-green-600 text-center">
              A password reset link has been sent
            </div>
          )}
        </Card>
      </div>
      <div className="absolute bottom-6 left-0 right-0 text-xs flex flex-wrap justify-center items-center gap-2 px-4 text-foreground/65">
        <p className="font-medium text-center font-lexend">
            {`@${new Date().getFullYear()} Bureau of Women, children & social Affairs.`}
        </p>

        <p className="font-semibold cursor-pointer hover:scale-105 transition font-lexend">
          Addis Ababa
        </p>
      </div>
    </div>
  );
}
