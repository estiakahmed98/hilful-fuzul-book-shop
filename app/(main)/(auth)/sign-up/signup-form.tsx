"use client";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { signUpSchema } from "@/validators/authValidators";

type SignUpFormValues = {
  name: string;
  email: string;
  password: string;
  role?: string;
  division?: string;
  district?: string;
  area?: string;
  upazila?: string;
  union?: string;
  markaz?: string;
  phone?: string;
};
import { useForm } from "react-hook-form";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormFieldset,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signUp } from "@/lib/auth-client";
import { FormError } from "@/components/FormError";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const SignupForm = () => {
  const [formError, setFormError] = useState("");
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "centraladmin",
      division: "Dhaka",
      district: "Dhaka",
      area: "Dhanmondi",
      upazila: "Dhaka",
      union: "Dhaka",
      phone: "01736486851",
    },
  });

  const onSubmit = async (values: SignUpFormValues) => {
    console.log(values);
    try {
      await signUp.email(
        {
          name: values.name,
          password: values.password,
          email: values.email,
          role: values.role || "user", // Ensure role is always provided with a default
          division: values.division,
          district: values.district,
          area: values.area,
          upazila: values.upazila,
          union: values.union,
          phone: values.phone,
        },
        {
          onRequest: () => {
            setFormError("");
            toast.loading("Creating account...");
          },
          onSuccess: () => {
            toast.success("Account created successfully!");
            router.push(/^\/admin\/.*/.test(window.location.pathname) ? "/admin" : "/");
          },
          onError: (ctx) => {
            const errorMessage = ctx.error?.message || "An error occurred during sign up";
            setFormError(errorMessage);
            toast.error(errorMessage);
          },
        }
      );
    } catch (error) {
      console.error("Signup error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      setFormError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>Create your account to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormFieldset>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
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
                      <Input
                        type="email"
                        placeholder="Enter email address"
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
                        placeholder="Enter password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormFieldset>
            <FormError message={formError} />
            <Button type="submit" className="mt-4 w-full">
              Sign Up
            </Button>
          </form>
        </Form>
        <div className="mt-5 space-x-1 text-center text-sm">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:underline"
          >
            Already have an account?
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignupForm;
