"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";

type FormFields = {
  name: string;
  phone: string;
  cityId: string;
  email: string;
};

export default function AdoptionRegisterPage() {
  const router = useRouter();
  const form = useForm<FormFields>({
    defaultValues: {
      name: "",
      phone: "",
      cityId: "",
      email: "",
    },
  });

  function onSubmit(data: FormFields) {
    // TODO: Store user info (API call or local storage)
    // For now, just redirect
    router.push("/adoption/applicant-portal/portal");
  }

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
                name="name"
                rules={{ required: "Name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                rules={{ required: "Phone number is required" }}
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
                name="cityId"
                rules={{ required: "City Id is required" }}
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
                rules={{ required: "Email is required" }}
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
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
            </form>
          </Form>
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
