"use client";

import { useAppStore } from "@/lib/store";
import { useState, type FormEvent } from "react";

export function SignupBody() {
  const { setActivePage, signUp } = useAppStore();

  // ── Form state ─────────────────────────────────────────────────────
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState<number | null>(null);
  const [province, setProvince] = useState("");
  const [selectedRole, setSelectedRole] = useState("student");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState("");

  // ── Form submission ───────────────────────────────────────────────
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!firstName.trim() || !surname.trim()) {
      setError("Please enter your first name and surname.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!password) {
      setError("Please enter a password.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!gender) {
      setError("Please select your gender.");
      return;
    }
    if (age === null || age < 1 || age > 150) {
      setError("Please enter a valid age.");
      return;
    }
    if (!province) {
      setError("Please select your province.");
      return;
    }
    if (!agreedToTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }

    signUp({
      firstName: firstName.trim(),
      surname: surname.trim(),
      email: email.trim(),
      role: selectedRole as "student" | "parent" | "tutor" | "school",
      gender,
      age: Number(age),
      province,
    });
  };

  // ── Role options ──────────────────────────────────────────────────
  const roles = [
    { role: "student", icon: "school", label: "Student" },
    { role: "parent", icon: "family_history", label: "Parent" },
    { role: "tutor", icon: "auto_stories", label: "Tutor" },
    { role: "school", icon: "business", label: "School" },
  ] as const;

  return (
    <>
      
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-fixed opacity-20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-tertiary-fixed opacity-20 rounded-full blur-3xl"></div>
      </div>
      
      <main className="relative z-10 flex min-h-screen items-center justify-center p-md lg:p-xl">
      <div className="w-full max-w-[1200px] grid lg:grid-cols-2 gap-xl items-center">
      
      <div className="hidden lg:flex flex-col space-y-lg pr-xl">
      <img alt="Zedskillz Hub Logo" className="h-16 w-auto object-contain self-start" src="/logo.png" />
      <h1 className="font-display-lg text-display-lg text-primary max-w-md">
                          Empower your future with AI-assisted learning.
                      </h1>
      <p className="font-body-md text-on-surface-variant max-w-lg leading-relaxed">
                          Join Zambia's leading hub for digital skills. Bridge the digital divide with personalized tutoring, professional certifications, and a community of high-achievers.
                      </p>
      <div className="grid grid-cols-2 gap-md pt-lg">
      <div className="p-md bg-white/60 rounded-xl border border-outline-variant/30 flex flex-col gap-sm">
      <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: '"FILL" 1' }}>rocket_launch</span>
      <p className="font-title-sm text-title-sm">Skill Acceleration</p>
      <p className="font-body-sm text-body-sm text-on-surface-variant">Master modern tools 3x faster with AI tutors.</p>
      </div>
      <div className="p-md bg-white/60 rounded-xl border border-outline-variant/30 flex flex-col gap-sm">
      <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: '"FILL" 1' }}>verified</span>
      <p className="font-title-sm text-title-sm">Certified Paths</p>
      <p className="font-body-sm text-body-sm text-on-surface-variant">Earn industry-recognized Zambian credentials.</p>
      </div>
      </div>
      </div>
      
      <div className="flex flex-col items-center justify-center w-full">
      
      <img alt="Zedskillz Hub Logo" className="lg:hidden h-12 w-auto mb-lg object-contain" src="/logo.png" />
      <div className="glass-panel w-full max-w-lg p-lg lg:p-xl rounded-xl shadow-lg">
      <div className="mb-lg">
      <h2 className="font-headline-md text-headline-md text-on-surface">Create an Account</h2>
      <p className="font-body-sm text-body-sm text-on-surface-variant mt-sm whitespace-nowrap">Start your learning journey today.</p>
      </div>
      
      <form className="space-y-md" onSubmit={handleSubmit}>
      
      {/* Role selector */}
      <div className="space-y-xs">
        <label className="font-label-caps text-label-caps text-on-surface-variant block">I am a</label>
        <div className="grid grid-cols-2 gap-sm" data-role-selector>
          {roles.map(({ role, icon, label }) => (
            <button
              key={role}
              type="button"
              data-role={role}
              data-selected={selectedRole === role ? "true" : undefined}
              onClick={() => setSelectedRole(role)}
              className={`flex flex-col items-center gap-xs px-md py-md rounded-xl border-2 transition-all active:scale-95 ${
                selectedRole === role
                  ? "border-primary bg-primary-fixed/20"
                  : "border-outline-variant bg-white hover:border-primary hover:bg-primary-fixed/10"
              }`}
            >
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: '"FILL" 1' }}>{icon}</span>
              <span className="font-body-sm font-semibold text-on-surface">{label}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
      <div className="space-y-xs">
      <label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="first_name">First Name</label>
      <div className="relative">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">person</span>
      <input className="w-full pl-10 pr-md py-sm bg-white border border-outline-variant rounded-lg font-body-md transition-all" id="first_name" placeholder="John" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      </div>
      </div>
      <div className="space-y-xs">
      <label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="surname">Surname</label>
      <div className="relative">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">badge</span>
      <input className="w-full pl-10 pr-md py-sm bg-white border border-outline-variant rounded-lg font-body-md transition-all" id="surname" placeholder="Doe" type="text" value={surname} onChange={(e) => setSurname(e.target.value)} />
      </div>
      </div>
      </div>
      
      <div className="space-y-xs">
      <label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="email">Email Address</label>
      <div className="relative">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">mail</span>
      <input className="w-full pl-10 pr-md py-sm bg-white border border-outline-variant rounded-lg font-body-md transition-all" id="email" placeholder="name@email.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
      <div className="space-y-xs">
      <label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="password">Password</label>
      <div className="relative">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">lock</span>
      <input className="w-full pl-10 pr-md py-sm bg-white border border-outline-variant rounded-lg font-body-md transition-all" id="password" placeholder="••••••••" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      </div>
      <div className="space-y-xs">
      <label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="confirm_password">Confirm</label>
      <div className="relative">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">shield</span>
      <input className="w-full pl-10 pr-md py-sm bg-white border border-outline-variant rounded-lg font-body-md transition-all" id="confirm_password" placeholder="••••••••" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
      </div>
      </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
      <div className="space-y-xs">
      <label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="gender">Gender</label>
      <div className="relative">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">wc</span>
      <select className="w-full pl-10 pr-md py-sm bg-white border border-outline-variant rounded-lg font-body-md transition-all appearance-none cursor-pointer" id="gender" value={gender} onChange={(e) => setGender(e.target.value)}>
      <option value="">Select gender</option>
      <option value="male">Male</option>
      <option value="female">Female</option>
      <option value="other">Other</option>
      </select>
      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none">arrow_drop_down</span>
      </div>
      </div>
      <div className="space-y-xs">
      <label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="age">Age</label>
      <div className="relative">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">cake</span>
      <input className="w-full pl-10 pr-md py-sm bg-white border border-outline-variant rounded-lg font-body-md transition-all" id="age" placeholder="Your age" type="number" min="1" max="150" value={age ?? ""} onChange={(e) => setAge(e.target.value ? Number(e.target.value) : null)} />
      </div>
      </div>
      </div>

      {/* Province */}
      <div className="space-y-xs">
      <label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="province">Province</label>
      <div className="relative">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">map</span>
      <select className="w-full pl-10 pr-md py-sm bg-white border border-outline-variant rounded-lg font-body-md transition-all appearance-none cursor-pointer" id="province" value={province} onChange={(e) => setProvince(e.target.value)}>
      <option value="">Select your province</option>
      <option value="Central">Central</option>
      <option value="Copperbelt">Copperbelt</option>
      <option value="Eastern">Eastern</option>
      <option value="Luapula">Luapula</option>
      <option value="Lusaka">Lusaka</option>
      <option value="Muchinga">Muchinga</option>
      <option value="Northern">Northern</option>
      <option value="North-Western">North-Western</option>
      <option value="Southern">Southern</option>
      <option value="Western">Western</option>
      <option value="outside_zambia">Outside Zambia</option>
      </select>
      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none">arrow_drop_down</span>
      </div>
      </div>

      <div className="flex items-start gap-sm pt-sm">
      <input className="mt-1 rounded text-primary focus:ring-primary h-4 w-4 border-outline-variant" id="terms" type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} />
      <label className="font-body-sm text-body-sm text-on-surface-variant leading-tight whitespace-nowrap" htmlFor="terms">
                                      I agree to the <a className="text-primary font-semibold hover:underline" href="#">Terms of Service</a> and <a className="text-primary font-semibold hover:underline" href="#">Privacy Policy</a>.
                                  </label>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-md py-sm text-body-sm text-destructive font-medium">
          {error}
        </div>
      )}
      
      <div className="pt-md space-y-md">
      <button className="w-full h-touch-target bg-primary text-on-primary rounded-lg font-title-sm transition-all active:scale-95 shadow-md hover:bg-primary-container" type="submit">
                                      Create Account
                                  </button>
      <div className="relative flex items-center py-sm">
      <div className="flex-grow border-t border-outline-variant/30"></div>
      <span className="flex-shrink mx-4 font-label-caps text-label-caps text-outline whitespace-nowrap">OR SIGN UP WITH</span>
      <div className="flex-grow border-t border-outline-variant/30"></div>
      </div>
      <button className="w-full h-touch-target bg-white border border-outline-variant rounded-lg font-title-sm flex items-center justify-center gap-sm transition-all hover:bg-surface-container active:scale-95" type="button">
      <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
      </svg>
                                      Continue with Google
                                  </button>
      </div>
      </form>
      <div className="mt-xl text-center">
      <p className="font-body-md text-body-md text-on-surface-variant whitespace-nowrap">
                                  Already have an account? 
                                  <a className="text-primary font-bold hover:underline ml-1" href="#" onClick={(event) => {
                                    event.preventDefault();
                                    const { intendedPage } = useAppStore.getState();
                                    if (!intendedPage) {
                                      useAppStore.getState().setIntendedPage(null);
                                      useAppStore.getState().setIntendedAiOverlay(false);
                                    }
                                    setActivePage("auth");
                                  }}>Sign In</a>
      </p>
      </div>
      </div>
      </div>
      </div>
      </main>
      

      
    </>
  );
}
