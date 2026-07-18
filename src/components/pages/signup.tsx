"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Icon } from "@/components/shared/icon";
import { AIFab } from "@/components/shared/ai-fab";
import { toast } from "sonner";

export function SignupPage() {
  const { setActivePage } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    terms: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error("Passwords don't match");
      return;
    }
    if (!form.terms) {
      toast.error("Please accept the terms");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Account created! 🎉");
      setActivePage("my-courses");
    }, 1200);
  };

  const inputClass = (name: string) =>
    `w-full h-12 pl-11 pr-4 bg-surface-container-lowest border rounded-lg text-sm outline-none transition-all ${
      focused === name
        ? "border-primary ring-2 ring-primary/10"
        : "border-outline-variant"
    }`;

  const iconClass = (name: string) =>
    `absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${
      focused === name ? "text-primary" : "text-on-surface-variant"
    }`;

  return (
    <div className="relative min-h-screen flex items-center justify-center py-8 px-4 lg:px-12 overflow-hidden">
      {/* Decorative blurred circles */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary-fixed opacity-20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-tertiary-fixed opacity-20 blur-3xl rounded-full" />
      </div>

      <div className="max-w-[1200px] w-full grid lg:grid-cols-2 gap-12 items-center">
        {/* ===== Left: Info column ===== */}
        <div className="hidden lg:flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center">
              <Icon name="school" filled size={32} className="text-on-primary" />
            </div>
            <span className="font-display text-2xl font-bold text-primary">Zedskillz Hub</span>
          </div>

          <h1 className="font-display text-display-lg text-primary max-w-md leading-tight mb-4">
            Empower your future with AI-assisted learning.
          </h1>
          <p className="text-body-md text-on-surface-variant max-w-md mb-8 leading-relaxed">
            Join Zambia&apos;s leading hub for digital skills. Bridge the digital divide
            with personalized tutoring, professional certifications, and a community
            of high-achievers.
          </p>

          {/* 2x2 marketing mini-cards */}
          <div className="grid grid-cols-2 gap-4 max-w-md">
            {[
              { icon: "rocket_launch", title: "Skill Acceleration", desc: "Master modern tools 3x faster with AI tutors." },
              { icon: "verified", title: "Certified Paths", desc: "Earn industry-recognized Zambian credentials." },
              { icon: "translate", title: "Local Languages", desc: "Learn in Bemba, Nyanja, Tonga & more." },
              { icon: "groups", title: "Community", desc: "Join 5,000+ Zambian learners." },
            ].map((c) => (
              <div
                key={c.title}
                className="bg-white/60 backdrop-blur rounded-xl border border-outline-variant/30 p-4"
              >
                <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center mb-3">
                  <Icon name={c.icon} filled size={20} className="text-primary" />
                </div>
                <div className="font-title text-sm font-semibold text-on-surface mb-1">
                  {c.title}
                </div>
                <div className="text-xs text-on-surface-variant">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== Right: Form column ===== */}
        <div className="w-full max-w-md mx-auto">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <Icon name="school" filled size={26} className="text-on-primary" />
            </div>
            <span className="font-display text-xl font-bold text-primary">Zedskillz Hub</span>
          </div>

          <div className="glass-panel rounded-2xl shadow-xl p-6 lg:p-8">
            <h2 className="font-headline text-headline text-on-surface mb-1">
              Create an Account
            </h2>
            <p className="text-body-md text-on-surface-variant mb-6">
              Start your learning journey today.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="font-label-caps text-xs uppercase tracking-widest text-on-surface-variant block">
                  Full Name
                </label>
                <div className="relative">
                  <Icon name="person" size={20} className={iconClass("name")} />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    onFocus={() => setFocused("name")}
                    onBlur={() => setFocused(null)}
                    placeholder="John Doe"
                    required
                    className={inputClass("name")}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="font-label-caps text-xs uppercase tracking-widest text-on-surface-variant block">
                  Email Address
                </label>
                <div className="relative">
                  <Icon name="mail" size={20} className={iconClass("email")} />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    placeholder="name@email.com"
                    required
                    className={inputClass("email")}
                  />
                </div>
              </div>

              {/* Password + Confirm */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-label-caps text-xs uppercase tracking-widest text-on-surface-variant block">
                    Password
                  </label>
                  <div className="relative">
                    <Icon name="lock" size={20} className={iconClass("password")} />
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      onFocus={() => setFocused("password")}
                      onBlur={() => setFocused(null)}
                      placeholder="••••••••"
                      required
                      className={inputClass("password")}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="font-label-caps text-xs uppercase tracking-widest text-on-surface-variant block">
                    Confirm
                  </label>
                  <div className="relative">
                    <Icon name="shield" size={20} className={iconClass("confirm")} />
                    <input
                      type="password"
                      value={form.confirm}
                      onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                      onFocus={() => setFocused("confirm")}
                      onBlur={() => setFocused(null)}
                      placeholder="••••••••"
                      required
                      className={inputClass("confirm")}
                    />
                  </div>
                </div>
              </div>

              {/* Terms checkbox */}
              <label className="flex items-start gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.terms}
                  onChange={(e) => setForm({ ...form, terms: e.target.checked })}
                  className="mt-1 rounded border-outline-variant"
                />
                <span className="text-on-surface-variant">
                  I agree to the{" "}
                  <a href="#" className="text-primary font-medium underline">Terms of Service</a>{" "}
                  and{" "}
                  <a href="#" className="text-primary font-medium underline">Privacy Policy</a>.
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-primary text-on-primary rounded-lg font-title text-sm font-semibold shadow-md hover:bg-primary-container transition-colors disabled:opacity-70"
              >
                {loading ? "◌ Creating account..." : "Create Account"}
              </button>
            </form>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="flex-1 h-px bg-outline-variant" />
              <span className="font-label-caps text-xs uppercase tracking-widest text-outline">
                OR SIGN UP WITH
              </span>
              <div className="flex-1 h-px bg-outline-variant" />
            </div>

            {/* Google */}
            <button
              onClick={() => {
                toast.success("Redirecting to Google...");
                setActivePage("my-courses");
              }}
              className="w-full h-12 bg-white border border-outline-variant rounded-lg flex items-center justify-center gap-3 font-title text-sm font-medium hover:bg-surface-container transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.583-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" />
                <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" />
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
              </svg>
              Continue with Google
            </button>

            <p className="mt-5 text-center text-sm text-on-surface-variant">
              Already have an account?{" "}
              <button
                onClick={() => setActivePage("auth")}
                className="text-primary font-semibold hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>

      <AIFab variant="gradient" />
    </div>
  );
}
