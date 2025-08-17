"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useClientSignupMutation } from "@/hooks/client/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters long" }),
  lastName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters long" }),
  email: z.email("Invalid email address"),
  phoneNumber: z
    .string()
    .min(7, { message: "Phone Number must be atleast 7 digits" }),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  cityIdNumber: z
    .string()
    .min(2, { message: "City must be atleast 2 characters long" }),
});

type ClientSignUpSchemaType = z.infer<typeof formSchema>;

export default function AdoptionRegisterPage() {
  const router = useRouter();
  const { mutate, data, isPending, isSuccess, error, isError } =
    useClientSignupMutation();
  const form = useForm<ClientSignUpSchemaType>({
    defaultValues: {
      cityIdNumber: "",
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      phoneNumber: "",
    },
    resolver: zodResolver(formSchema),
  });

  function onSubmit(data: ClientSignUpSchemaType) {
    // TODO: Store user info (API call or local storage)

    const newData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      password: data.password,
      cityIdNumber: data.cityIdNumber,
    };
    console.log(newData);
    mutate(newData);
  }

  useEffect(() => {
    if (isSuccess) {
      console.log(data);
      toast("Signup was successfull");
      router.push("/applicant-portal/portal");
    }
    if (isError) {
      console.log(error.message);
      toast("Sigup Failed", {
        description: error.message,
      });
    }
  }, [isSuccess, isError, data, error, router]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 bg-gray-50">
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl gap-10">
        {/* Left Side: Logo and Title */}
        <div className="flex flex-col items-center text-center md:text-left">
          <img
            src="/assets/WCSA_logo.jpg"
            alt="logo"
            className="w-40 h-20 md:w-80 md:h-60 object-contain mb-8"
          />
          <p className="text-2xl font-semibold font-lexend">Welcome</p>
        </div>
        {/* Right Side: Registration Form */}
        <Card className="w-full max-w-md flex flex-col px-10 py-10">
          <h1 className="text-xl font-semibold font-lexend mb-4">
            Adoption Sign Up
          </h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your last name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your phone number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cityIdNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City Id</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your city Id" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your email" />
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
                        {...field}
                        type="password"
                        placeholder="Enter your password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isPending ? (
                <Button className="w-full" disabled>
                  <Loader2 className="animate-spin" />
                </Button>
              ) : (
                <Button type="submit" className="w-full" disabled={isPending}>
                  Sign up
                </Button>
              )}
            </form>
          </Form>
        </Card>
      </div>
      <div className="absolute bottom-6 left-0 right-0 text-xs flex flex-wrap justify-center items-center gap-2 px-4 text-foreground/65">
        <p className="font-medium text-center font-lexend">
          {`2025 Bureau of Women, children & social Affairs.`}
        </p>
        <p className="font-semibold cursor-pointer hover:scale-105 transition font-lexend">
          Addis Ababa
        </p>
      </div>
    </div>
  );
}
