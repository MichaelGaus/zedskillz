"use client";

// AUTO-GENERATED from zedskillz_signin_page_ui.txt — DO NOT EDIT MANUALLY
// Conversion: HTML body → JSX (class=→className=, void tags self-closed, style attrs converted)

import { useAppStore } from "@/lib/store";

export function SigninBody() {
  const { setActivePage } = useAppStore();

  return (
    <>
      
      
      <main className="relative min-h-screen flex items-center justify-center lg:justify-start px-container-margin md:px-xl">
      
      <div className="absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-surface to-surface-dim opacity-90 z-10"></div>
      <div className="w-full h-full bg-cover bg-center transition-transform duration-[20000ms] hover:scale-110" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBf8qCxqmUvX1mDYk5LlLJcX5B1qlnBX3ERNCkhpzvn1IxQdQkVcRaqwI5jS5UYx05HtmJPDEEZ0lVwtIaA-CQjXYGugBxplcjereEMcNW4GbxtRIO-xCLxNdUGNCS6BXDj5rBKUCmyVHepYW4obCJSdTG7Lh6DjbB0Po_dJYY4Rhhu9pF0OWW754CmTFCcNBFLE17sVFLTcMuyoIaLj3-0HRp3ciKau175N-Ld1ASnMW8ELcqptusuTA')"}}></div>
      
      <div className="absolute inset-0 opacity-[0.03] z-20 pointer-events-none" style={{backgroundImage: "radial-gradient(#480008 1px, transparent 1px)", backgroundSize: "24px 24px"}}></div>
      </div>
      
      <div className="relative z-30 w-full max-w-[480px] animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="glass-panel p-xl md:p-12 rounded-xl shadow-lg border border-outline-variant/30">
      
      <div className="flex flex-col items-center mb-10">
      <img alt="Zedskillz Hub Logo" className="h-16 w-auto mb-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKkuyLFN1zxSgvJrD_lXBE6SDBj4mK-vE9qZuxizNlfrPHESO2HxJBWUhe8mvWvQn2ScDNUpbzt_eCky4qUmScH9S0F19wo1TKauuMyLSQm7_dPIEd9uGXoAC13os-3fm9ks_fhVHRq8l8M-fXDdDGjSq70chwCbJdmDdyHMyr3JQQ0z0NSxlbtgrVlDp0vGn91BC50UtQ-lmehw_waThPOaXZvflj-JKrxmN7rxxbr43t-21J3zNIORRJNuoWGc9y6qw" />
      <h1 className="font-display-lg text-display-lg text-primary text-center">Welcome Back</h1>
      <p className="font-body-md text-on-surface-variant text-center mt-2">Empowering your learning journey with AI.</p>
      </div>
      
      <form className="space-y-6" id="signin-form">
      
      <div className="space-y-2">
      <label className="block font-label-caps text-label-caps text-on-surface-variant" htmlFor="email">Email Address</label>
      <div className="relative group">
      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">mail</span>
      <input className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all font-body-md outline-none" id="email" placeholder="name@example.com" required type="email" />
      </div>
      </div>
      
      <div className="space-y-2">
      <div className="flex justify-between items-center">
      <label className="block font-label-caps text-label-caps text-on-surface-variant" htmlFor="password">Password</label>
      <a className="font-body-sm text-primary hover:underline font-semibold transition-all" href="#">Forgot Password?</a>
      </div>
      <div className="relative group">
      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">lock</span>
      <input className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all font-body-md outline-none" id="password" placeholder="••••••••" required type="password" />
      <button className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors" type="button">
      <span className="material-symbols-outlined">visibility</span>
      </button>
      </div>
      </div>
      
      <button className="w-full py-4 bg-primary text-white font-title-sm text-title-sm rounded-lg shadow-md hover:bg-primary-container active:scale-[0.98] transition-all duration-200" type="submit">
                              Sign In
                          </button>
      </form>
      
      <div className="relative my-8">
      <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-outline-variant/50"></div>
      </div>
      <div className="relative flex justify-center text-sm">
      <span className="px-4 bg-transparent font-label-caps text-on-surface-variant">Or continue with</span>
      </div>
      </div>
      
      <button className="w-full flex items-center justify-center gap-3 py-3 border border-outline-variant rounded-lg bg-surface-container-lowest hover:bg-surface-container-low active:scale-[0.98] transition-all font-body-md font-semibold text-on-surface" type="button">
      <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
      </svg>
                          Google
                      </button>
      
      <p className="mt-8 text-center font-body-md text-on-surface-variant">
                          Don't have an account? 
                          <a className="text-primary font-bold hover:underline transition-all" href="#" onClick={(event) => {
                            event.preventDefault();
                            setActivePage("signup");
                          }}>Sign Up</a>
      </p>
      </div>
      
      <div className="mt-8 text-center flex items-center justify-center gap-2 text-on-surface-variant font-label-caps opacity-60">
      <span className="">PRESTIGE</span>
      <span className="w-1 h-1 rounded-full bg-primary"></span>
      <span className="">INNOVATION</span>
      <span className="w-1 h-1 rounded-full bg-primary"></span>
      <span className="">ACHIEVEMENT</span>
      </div>
      </div>
      </main>
      

      
    </>
  );
}
