"use client";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { signInSchema } from "@/validators/authValidators";
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

import { signIn, useSession } from "@/lib/auth-client";
import { FormError } from "../../../../components/FormError";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

type SignInValues = yup.InferType<typeof signInSchema>;

const SigninForm = () => {
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const search = useSearchParams();
  const callbackUrl = search.get("callbackUrl") || "/admin";
  const { status } = useSession();

  const form = useForm<SignInValues>({
    resolver: yupResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: SignInValues) => {
    setFormError("");
    const dismiss = toast.loading("Signing you in...");
    try {
      const res = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      toast.dismiss(dismiss);
      if (res?.ok) {
        toast.success("Login successful");
        router.push(callbackUrl);
        return;
      }
      const message =
        res?.error ||
        "Invalid credentials. Please check your email and password.";
      setFormError(message);
      toast.error(message);
    } catch (err: any) {
      toast.dismiss(dismiss);
      const message =
        err?.message || "Something went wrong while signing in.";
      setFormError(message);
      toast.error(message);
    }
  };

  return (
    <Card className="border border-[#D1D8BE] bg-[#EEEFE0] shadow-md max-w-md mx-auto">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#819A91] via-[#A7C1A8] to-[#D1D8BE] rounded-t-xl" />

      <CardHeader className="items-center pb-4 pt-6">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#819A91]/10 text-[#819A91]">
          <Lock className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-semibold text-[#2D4A3C]">
          Log In
        </CardTitle>
        <CardDescription className="text-sm text-[#2D4A3C]/70 text-center">
          Enter your account details to access your dashboard
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0 pb-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormFieldset className="space-y-4">
              {/* Email field */}
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

              {/* Password field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-sm font-medium text-[#2D4A3C]">
                        Password
                      </FormLabel>
                      <Link
                        href="/auth/forgot-password"
                        className="text-xs text-[#2D4A3C]/70 hover:text-[#2D4A3C] hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter password"
                          autoComplete="current-password"
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
              disabled={status === "loading" || form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>

        {/* Divider */}
        <div className="mt-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#D1D8BE]" />
          <span className="text-xs text-[#2D4A3C]/60">or</span>
          <div className="h-px flex-1 bg-[#D1D8BE]" />
        </div>

        <div className="mt-3 text-center text-sm">
          <span className="text-[#2D4A3C]/70">
            Don&apos;t have an account?{" "}
          </span>
          <Link
            href="/sign-up"
            className="font-medium text-[#819A91] hover:underline"
          >
            Create an account
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default SigninForm;
