"use client";

import { useAppStore } from "@/lib/store";
import { SigninBody } from "@/components/pages/signin-body";
import { useState, useEffect } from "react";

/**
 * SigninPage — wraps the auto-generated SigninBody with form submission handling.
 * Intercepts the form submit, reads email/password, calls store.signIn(),
 * and shows a loading state.
 */
export function SigninPage() {
  const { signIn } = useAppStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Find the form and wire up submission
    const form = document.getElementById("signin-form") as HTMLFormElement | null;
    if (!form) return;

    const handleSubmit = (e: Event) => {
      e.preventDefault();
      const emailInput = document.getElementById("email") as HTMLInputElement | null;
      const passwordInput = document.getElementById("password") as HTMLInputElement | null;
      const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;

      const email = emailInput?.value?.trim() || "";
      const password = passwordInput?.value?.trim() || "";

      if (!email || !password) return;

      // Show loading state
      setLoading(true);
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "◌ Signing in...";
      }

      // Simulate auth delay then sign in
      setTimeout(() => {
        signIn(email);
      }, 800);
    };

    form.addEventListener("submit", handleSubmit);
    return () => form.removeEventListener("submit", handleSubmit);
  }, [signIn]);

  // Re-attach listener when loading state changes (button text update)
  useEffect(() => {
    if (loading) {
      const submitButton = document.querySelector('#signin-form button[type="submit"]') as HTMLButtonElement | null;
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "◌ Signing in...";
      }
    }
  }, [loading]);

  return <SigninBody />;
}
