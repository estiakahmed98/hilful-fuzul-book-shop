"use client";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { signUpSchema } from "@/validators/authValidators";
import { useForm } from "react-hook-form";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../../../components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormFieldset,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../components/ui/form";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import Link from "next/link";
import { FormError } from "../../../../components/FormError";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { signIn } from "@/lib/auth-client";

type SignUpValues = yup.InferType<typeof signUpSchema>;

const SignupForm = () => {
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<SignUpValues>({
    resolver: yupResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (values: SignUpValues) => {
    setFormError("");
    const loadingId = toast.loading("Creating your account...");

    try {
      // 1) Create user via your API
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Registration failed");
      }

      // 2) Auto sign-in with NextAuth credentials
      const signInRes = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      toast.dismiss(loadingId);

      if (!signInRes?.ok) {
        throw new Error(
          signInRes?.error || "Sign in after registration failed"
        );
      }

      toast.success("Account created! You're now signed in.");
      router.push("/admin/");
    } catch (err: any) {
      toast.dismiss(loadingId);
      const msg = err?.message || "Something went wrong";
      setFormError(msg);
      toast.error(msg);
    }
  };

  return (
    <Card className="border border-[#D1D8BE] bg-[#EEEFE0] shadow-md max-w-md mx-auto">
      {/* Top gradient bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#819A91] via-[#A7C1A8] to-[#D1D8BE] rounded-t-xl" />

      <CardHeader className="items-center pb-4 pt-6">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#819A91]/10 text-[#819A91]">
          <User className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-semibold text-[#2D4A3C]">
          Sign Up
        </CardTitle>
        <CardDescription className="text-sm text-[#2D4A3C]/70 text-center">
          Create your account to continue
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0 pb-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormFieldset className="space-y-4">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-[#2D4A3C]">
                      Name
                    </FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          placeholder="Enter your name"
                          autoComplete="name"
                          className="border-[#D1D8BE] bg-[#EEEFE0] text-[#2D4A3C] placeholder:text-[#2D4A3C]/50 focus-visible:ring-[#819A91] focus-visible:border-[#819A91] pr-10"
                          {...field}
                        />
                      </FormControl>
                      <User className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2D4A3C]/50" />
                    </div>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-[#2D4A3C]">
                      Email
                    </FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter email address"
                          autoComplete="email"
                          className="border-[#D1D8BE] bg-[#EEEFE0] text-[#2D4A3C] placeholder:text-[#2D4A3C]/50 focus-visible:ring-[#819A91] focus-visible:border-[#819A91] pr-10"
                          {...field}
                        />
                      </FormControl>
                      <Mail className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2D4A3C]/50" />
                    </div>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-[#2D4A3C]">
                      Password
                    </FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter password"
                          autoComplete="new-password"
                          className="border-[#D1D8BE] bg-[#EEEFE0] text-[#2D4A3C] placeholder:text-[#2D4A3C]/50 focus-visible:ring-[#819A91] focus-visible:border-[#819A91] pr-10"
                          {...field}
                        />
                      </FormControl>
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[#2D4A3C]/60 hover:text-[#2D4A3C]"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2D4A3C]/40" />
                    </div>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />
            </FormFieldset>

            <FormError message={formError} />

            <Button
              type="submit"
              className="mt-2 w-full rounded-lg bg-[#819A91] text-white hover:bg-[#819A91]/90 border border-[#819A91] text-sm font-medium py-2.5 shadow-sm hover:shadow-md transition-all duration-200"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Signing up..." : "Sign Up"}
            </Button>
          </form>
        </Form>

        {/* Divider */}
        <div className="mt-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#D1D8BE]" />
          <span className="text-xs text-[#2D4A3C]/60">or</span>
          <div className="h-px flex-1 bg-[#D1D8BE]" />
        </div>

        {/* Already have account */}
        <div className="mt-4 text-center text-sm">
          <span className="text-[#2D4A3C]/70">
            Already have an account?{" "}
          </span>
          <Link
            href="/signin"
            className="font-medium text-[#819A91] hover:underline"
          >
            Log in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignupForm;
