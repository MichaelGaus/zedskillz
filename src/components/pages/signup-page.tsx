"use client";

import { useAppStore } from "@/lib/store";
import { SignupBody } from "@/components/pages/signup-body";
import { useEffect } from "react";

/**
 * SignupPage — wraps the auto-generated SignupBody with form submission handling.
 */
export function SignupPage() {
  const { signIn } = useAppStore();

  useEffect(() => {
    // The signup form — find by its submit button text
    const findForm = () => {
      const buttons = Array.from(document.querySelectorAll('button[type="submit"]'));
      const createBtn = buttons.find((b) => b.textContent?.includes("Create Account"));
      return createBtn?.closest("form") as HTMLFormElement | null;
    };

    const form = findForm();
    if (!form) return;

    const handleSubmit = (e: Event) => {
      e.preventDefault();
      const inputs = form.querySelectorAll("input");
      const nameInput = Array.from(inputs).find((i) => i.type === "text") as HTMLInputElement | null;
      const emailInput = Array.from(inputs).find((i) => i.type === "email") as HTMLInputElement | null;
      const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;

      const name = nameInput?.value?.trim() || "";
      const email = emailInput?.value?.trim() || "";

      if (!email) return;

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "◌ Creating account...";
      }

      setTimeout(() => {
        signIn(email, name);
      }, 1000);
    };

    form.addEventListener("submit", handleSubmit);
    return () => form.removeEventListener("submit", handleSubmit);
  }, [signIn]);

  return <SignupBody />;
}
