"use client";

import { useAppStore } from "@/lib/store";
import { SigninBody } from "@/components/pages/signin-body";
import { useState, useEffect } from "react";

/**
 * SigninPage — wraps the auto-generated SigninBody with form submission handling.
 *
 * Attaches BOTH a submit event listener on the form AND a click listener on the
 * submit button, because in some browsers the native form.submit() triggered by
 * clicking a submit button doesn't fire the React onSubmit handler reliably.
 */
export function SigninPage() {
  const { signIn } = useAppStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const form = document.getElementById("signin-form") as HTMLFormElement | null;
    if (!form) return;

    const performSignIn = () => {
      const emailInput = document.getElementById("email") as HTMLInputElement | null;
      const passwordInput = document.getElementById("password") as HTMLInputElement | null;
      const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;

      const email = emailInput?.value?.trim() || "";
      const password = passwordInput?.value?.trim() || "";

      if (!email || !password) {
        // Highlight empty fields
        if (!email) emailInput?.focus();
        else if (!password) passwordInput?.focus();
        return;
      }

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

    const handleSubmit = (e: Event) => {
      e.preventDefault();
      performSignIn();
    };

    // Also handle click on the submit button directly (more reliable than form submit)
    const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;
    const handleButtonClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      performSignIn();
    };

    form.addEventListener("submit", handleSubmit);
    if (submitButton) {
      submitButton.addEventListener("click", handleButtonClick);
    }

    return () => {
      form.removeEventListener("submit", handleSubmit);
      if (submitButton) {
        submitButton.removeEventListener("click", handleButtonClick);
      }
    };
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
