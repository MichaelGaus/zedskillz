"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  KeyRound,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

type AuthMode =
  | "login"
  | "register"
  | "forgot"
  | "otp"
  | "reset"
  | "2fa";

export function AuthPage() {
  const { setRole, setActivePage } = useAppStore();
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [role, setRoleState] = useState("student");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      toast.success("Welcome back! 👋");
      setRole(role as any);
      setActivePage(
        role === "instructor"
          ? "instructor-dashboard"
          : role === "admin" || role === "super_admin"
          ? "admin-dashboard"
          : role === "parent"
          ? "parent-portal"
          : "student-dashboard"
      );
    } else if (mode === "register") {
      setMode("otp");
      toast.info("OTP sent to your phone + email");
    } else if (mode === "otp") {
      setMode("2fa");
    } else if (mode === "2fa") {
      toast.success("Account verified! 🎉");
      setRole(role as any);
      setActivePage(
        role === "instructor"
          ? "instructor-dashboard"
          : role === "admin"
          ? "admin-dashboard"
          : role === "parent"
          ? "parent-portal"
          : "student-dashboard"
      );
    } else if (mode === "forgot") {
      setMode("reset");
      toast.success("Reset link sent to your email");
    } else if (mode === "reset") {
      toast.success("Password reset! Please login");
      setMode("login");
    }
  };

  const handleOtpChange = (idx: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) {
      const nextInput = document.getElementById(`otp-${idx + 1}`);
      nextInput?.focus();
    }
  };

  const socialLogins = [
    { name: "Google", icon: "G", color: "bg-white text-slate-700 border" },
    { name: "Microsoft", icon: "M", color: "bg-blue-600 text-white" },
    { name: "Apple", icon: "", color: "bg-black text-white" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* LEFT — Marketing panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar text-sidebar-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-400 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg gradient-emerald flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-xl">Zedskillz</div>
              <div className="text-[11px] text-sidebar-foreground/60">
                AI Learning Platform
              </div>
            </div>
          </div>

          <div>
            <h1 className="text-4xl font-bold leading-tight mb-4">
              The future of African education starts here.
            </h1>
            <p className="text-sidebar-foreground/70 text-lg mb-8">
              Join 124,000+ learners, 1,200+ instructors, and 80+ schools
              building skills for tomorrow.
            </p>

            <div className="space-y-3">
              {[
                { icon: ShieldCheck, text: "Bank-grade security with 2FA & biometric login" },
                { icon: Smartphone, text: "Works offline — perfect for low-connectivity areas" },
                { icon: KeyRound, text: "AI tutors in Bemba, Nyanja, Tonga, Lozi & more" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-sidebar-accent flex items-center justify-center">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm text-sidebar-foreground/80">
                      {item.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <img
                  key={i}
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`}
                  alt=""
                  className="w-8 h-8 rounded-full ring-2 ring-sidebar"
                />
              ))}
            </div>
            <div className="text-xs text-sidebar-foreground/60">
              <div className="font-semibold text-sidebar-foreground">
                Trusted by 124,000+ learners
              </div>
              across 12 African countries
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT — Auth form */}
      <div className="flex-1 flex flex-col">
        <div className="p-6 flex items-center justify-between">
          <button
            onClick={() => setActivePage("landing")}
            className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </button>
          <div className="text-sm text-muted-foreground">
            {mode === "login" && (
              <>
                New here?{" "}
                <button
                  onClick={() => setMode("register")}
                  className="text-primary font-medium hover:underline"
                >
                  Create account
                </button>
              </>
            )}
            {mode !== "login" && (
              <>
                Have an account?{" "}
                <button
                  onClick={() => setMode("login")}
                  className="text-primary font-medium hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold">
                {mode === "login" && "Welcome back"}
                {mode === "register" && "Create your account"}
                {mode === "forgot" && "Reset your password"}
                {mode === "otp" && "Verify your account"}
                {mode === "reset" && "Set new password"}
                {mode === "2fa" && "Two-factor authentication"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {mode === "login" &&
                  "Sign in to continue your learning journey"}
                {mode === "register" &&
                  "Start learning with AI tutors that speak your language"}
                {mode === "forgot" &&
                  "We'll send you a reset link via email"}
                {mode === "otp" &&
                  "Enter the 6-digit code sent to your phone & email"}
                {mode === "reset" && "Choose a strong new password"}
                {mode === "2fa" &&
                  "Enter the code from your authenticator app"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role selector for register */}
              {mode === "register" && (
                <div className="space-y-2">
                  <Label>I am a...</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "student", label: "Student" },
                      { value: "instructor", label: "Instructor" },
                      { value: "parent", label: "Parent" },
                      { value: "school", label: "School" },
                    ].map((r) => (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => setRoleState(r.value)}
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                          role === r.value
                            ? "border-primary bg-primary/10 text-primary font-medium"
                            : "hover:bg-muted"
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Login fields */}
              {(mode === "login" || mode === "register") && (
                <>
                  {mode === "register" && (
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="name"
                          placeholder="Chitalu Banda"
                          className="pl-9"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>

                  {mode === "register" && (
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+260 97 123 4567"
                          className="pl-9"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      {mode === "login" && (
                        <button
                          type="button"
                          onClick={() => setMode("forgot")}
                          className="text-xs text-primary hover:underline"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-9 pr-9"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {mode === "login" && (
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="remember"
                        className="rounded border-border"
                      />
                      <Label
                        htmlFor="remember"
                        className="text-sm font-normal cursor-pointer"
                      >
                        Remember me on this device
                      </Label>
                    </div>
                  )}
                </>
              )}

              {/* Forgot password fields */}
              {mode === "forgot" && (
                <div className="space-y-2">
                  <Label htmlFor="forgot-email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="forgot-email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Reset password fields */}
              {mode === "reset" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="new-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-primary" /> At least
                      8 characters
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-primary" /> Mix of
                      upper & lower case
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-primary" /> At least
                      one number & symbol
                    </div>
                  </div>
                </>
              )}

              {/* OTP fields */}
              {mode === "otp" && (
                <div className="space-y-4">
                  <div className="flex justify-between gap-2">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-${idx}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        className="w-12 h-14 text-center text-xl font-bold border-2 rounded-lg focus:border-primary outline-none"
                      />
                    ))}
                  </div>
                  <div className="text-xs text-center text-muted-foreground">
                    Didn&apos;t receive code?{" "}
                    <button
                      type="button"
                      onClick={() => toast.info("Code resent!")}
                      className="text-primary hover:underline"
                    >
                      Resend in 0:42
                    </button>
                  </div>
                </div>
              )}

              {/* 2FA */}
              {mode === "2fa" && (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Smartphone className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="2fa">Authentication Code</Label>
                    <Input
                      id="2fa"
                      inputMode="numeric"
                      placeholder="Enter 6-digit code"
                      className="text-center text-lg tracking-widest"
                      maxLength={6}
                      required
                    />
                  </div>
                  <div className="text-xs text-center text-muted-foreground">
                    Code sent to your authenticator app
                  </div>
                </div>
              )}

              {/* Submit */}
              <Button type="submit" className="w-full h-11" size="lg">
                {mode === "login" && "Sign In"}
                {mode === "register" && "Create Account"}
                {mode === "forgot" && "Send Reset Link"}
                {mode === "otp" && "Verify & Continue"}
                {mode === "reset" && "Reset Password"}
                {mode === "2fa" && "Verify & Sign In"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>

            {/* Social logins — only on login/register */}
            {(mode === "login" || mode === "register") && (
              <>
                <div className="relative my-6">
                  <Separator />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-background px-3 text-xs text-muted-foreground">
                      or continue with
                    </span>
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {socialLogins.map((s) => (
                    <button
                      key={s.name}
                      onClick={() => {
                        toast.success(`Signed in with ${s.name}`);
                        setRole("student");
                        setActivePage("student-dashboard");
                      }}
                      className={`flex items-center justify-center h-11 rounded-lg ${s.color} hover:opacity-90 transition-opacity text-sm font-medium`}
                    >
                      <span className="text-lg font-bold mr-1">{s.icon}</span>
                      <span className="text-xs hidden sm:inline">{s.name}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-6 grid grid-cols-3 gap-2">
                  {[
                    { name: "MTN", color: "bg-yellow-400 text-black" },
                    { name: "Airtel", color: "bg-red-500 text-white" },
                    { name: "Zamtel", color: "bg-green-600 text-white" },
                  ].map((p) => (
                    <button
                      key={p.name}
                      onClick={() => {
                        toast.success(`OTP sent via ${p.name} Money`);
                        setMode("otp");
                      }}
                      className={`flex items-center justify-center h-10 rounded-lg ${p.color} hover:opacity-90 transition-opacity text-xs font-medium`}
                    >
                      <Smartphone className="w-3 h-3 mr-1" />
                      {p.name}
                    </button>
                  ))}
                </div>
              </>
            )}

            <p className="mt-6 text-xs text-center text-muted-foreground">
              By continuing, you agree to our{" "}
              <a href="#" className="underline">Terms</a> and{" "}
              <a href="#" className="underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
