"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { Icon } from "@/components/shared/icon";
import { AIFab } from "@/components/shared/ai-fab";
import { toast } from "sonner";

export function AuthPage() {
  const { setActivePage } = useAppStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Welcome back! 👋");
      setActivePage("my-courses");
    }, 1200);
  };

  // Mouse parallax on background (desktop)
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth < 1024) return;
    const handler = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setParallax({ x, y });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center lg:justify-start px-4 lg:px-12 py-8 overflow-hidden">
      {/* Background — Victoria Falls photo + gradient + polka-dot pattern */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center transition-transform duration-300"
        style={{
          backgroundImage: `url(https://picsum.photos/seed/victoria-falls-zambia/1920/1080)`,
          transform: `translate(${parallax.x}px, ${parallax.y}px) scale(1.05)`,
        }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-surface/80 to-surface-dim/80" />
      <div
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(#480008 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Sign-in card */}
      <div className="glass-panel rounded-xl shadow-2xl border border-outline-variant/30 w-full max-w-[480px] p-8 md:p-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary mb-4">
            <Icon name="school" filled size={32} className="text-on-primary" />
          </div>
          <h1 className="font-display text-display-lg-mobile md:text-display-lg text-primary">
            Welcome Back
          </h1>
          <p className="text-body-md text-on-surface-variant mt-1">
            Empowering your learning journey with AI.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <label className="font-label-caps text-xs uppercase tracking-widest text-on-surface-variant block">
              Email Address
            </label>
            <div className="relative">
              <Icon
                name="mail"
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full h-12 pl-11 pr-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-label-caps text-xs uppercase tracking-widest text-on-surface-variant">
                Password
              </label>
              <a href="#" className="text-xs text-primary hover:underline">
                Forgot Password?
              </a>
            </div>
            <div className="relative">
              <Icon
                name="lock"
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full h-12 pl-11 pr-11 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"
              >
                <Icon name={showPassword ? "visibility_off" : "visibility"} size={20} />
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-primary text-on-primary rounded-lg font-title text-sm font-semibold shadow-md hover:bg-primary-container transition-colors disabled:opacity-70"
          >
            {loading ? "◌ Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-outline-variant" />
          <span className="font-label-caps text-xs uppercase tracking-widest text-on-surface-variant">
            Or continue with
          </span>
          <div className="flex-1 h-px bg-outline-variant" />
        </div>

        {/* Google OAuth */}
        <button
          onClick={() => {
            toast.success("Redirecting to Google...");
            setActivePage("my-courses");
          }}
          className="w-full h-12 bg-surface-container-lowest border border-outline-variant rounded-lg flex items-center justify-center gap-3 font-title text-sm font-medium hover:bg-surface-container transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path
              fill="#4285F4"
              d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
            />
            <path
              fill="#34A853"
              d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.583-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
            />
            <path
              fill="#FBBC05"
              d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
            />
            <path
              fill="#EA4335"
              d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
            />
          </svg>
          Google
        </button>

        {/* Footer link */}
        <p className="mt-6 text-center text-sm text-on-surface-variant">
          Don&apos;t have an account?{" "}
          <button
            onClick={() => setActivePage("signup")}
            className="text-primary font-semibold hover:underline"
          >
            Sign Up
          </button>
        </p>

        {/* Branding accent */}
        <div className="mt-6 pt-6 border-t border-outline-variant/30 flex items-center justify-center gap-2 font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant opacity-60">
          <span>PRESTIGE</span>
          <span className="w-1 h-1 rounded-full bg-primary" />
          <span>INNOVATION</span>
          <span className="w-1 h-1 rounded-full bg-primary" />
          <span>ACHIEVEMENT</span>
        </div>
      </div>

      <AIFab variant="solid" tooltip="Need help with your studies?" />
    </div>
  );
}
