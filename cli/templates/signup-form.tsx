import React from "react";
import { cn } from "@/lib/utils";

/**
 * 🧠 Generated via ebade
 * Intent: signup-form
 */
export function SignupForm() {
  return (
    <div className="w-full max-w-md mx-auto p-8">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-black tracking-tight mb-2">
          Create an account
        </h2>
        <p className="text-muted-foreground">
          Start building your next big idea
        </p>
      </div>

      <form className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="John Doe"
            className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="At least 8 characters"
            className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 px-6 rounded-lg bg-primary text-primary-foreground font-bold hover:opacity-90 transition-all shadow-lg hover:scale-[1.02] active:scale-95"
        >
          Create account
        </button>

        <p className="text-center text-xs text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <a href="#" className="underline hover:text-primary">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-primary">
            Privacy Policy
          </a>
          .
        </p>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or register with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            className="py-3 px-4 rounded-lg border border-border bg-background hover:bg-accent transition-all flex items-center justify-center gap-2 font-medium"
          >
            Google
          </button>
          <button
            type="button"
            className="py-3 px-4 rounded-lg border border-border bg-background hover:bg-accent transition-all flex items-center justify-center gap-2 font-medium"
          >
            GitHub
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <a href="#" className="text-primary font-medium hover:underline">
            Sign in
          </a>
        </p>
      </form>
    </div>
  );
}
