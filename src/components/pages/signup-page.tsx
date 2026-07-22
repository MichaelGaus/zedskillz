"use client";

import { useAppStore } from "@/lib/store";
import { SignupBody } from "@/components/pages/signup-body";
import { useEffect } from "react";

/**
 * SignupPage — wraps the auto-generated SignupBody with form submission handling.
 *
 * Attaches BOTH a submit event listener on the form AND a click listener on the
 * submit button for reliability.
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

    const cleanups: (() => void)[] = [];

    const performSignUp = () => {
      const inputs = form.querySelectorAll("input");
      const nameInput = Array.from(inputs).find((i) => i.type === "text") as HTMLInputElement | null;
      const emailInput = Array.from(inputs).find((i) => i.type === "email") as HTMLInputElement | null;
      const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;

      // Read selected role
      const activeRoleBtn = form.querySelector('[data-role-selector] [data-selected="true"]') as HTMLElement | null;
      const selectedRole = activeRoleBtn?.getAttribute("data-role") || "";

      const name = nameInput?.value?.trim() || "";
      const email = emailInput?.value?.trim() || "";

      if (!email) {
        emailInput?.focus();
        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "◌ Creating account...";
      }

      setTimeout(() => {
        signIn(email, name, selectedRole);
      }, 1000);
    };

    // Wire up role selector clicks
    const roleSelector = form.querySelector("[data-role-selector]");
    if (roleSelector) {
      const handleRoleClick = (e: Event) => {
        const btn = (e.target as HTMLElement).closest("[data-role]");
        if (!btn) return;
        roleSelector.querySelectorAll("[data-role]").forEach((b) => {
          (b as HTMLElement).removeAttribute("data-selected");
          (b as HTMLElement).classList.remove("border-primary", "bg-primary-fixed/20");
          (b as HTMLElement).classList.add("border-outline-variant", "bg-white");
        });
        (btn as HTMLElement).setAttribute("data-selected", "true");
        (btn as HTMLElement).classList.remove("border-outline-variant", "bg-white");
        (btn as HTMLElement).classList.add("border-primary", "bg-primary-fixed/20");
      };
      roleSelector.addEventListener("click", handleRoleClick);
      cleanups.push(() => roleSelector.removeEventListener("click", handleRoleClick));
    }

    const handleSubmit = (e: Event) => {
      e.preventDefault();
      performSignUp();
    };

    const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;
    const handleButtonClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      performSignUp();
    };

    form.addEventListener("submit", handleSubmit);
    if (submitButton) {
      submitButton.addEventListener("click", handleButtonClick);
    }

    return () => {
      cleanups.forEach((fn) => fn());
      form.removeEventListener("submit", handleSubmit);
      if (submitButton) {
        submitButton.removeEventListener("click", handleButtonClick);
      }
    };
  }, [signIn]);

  return <SignupBody />;
}
