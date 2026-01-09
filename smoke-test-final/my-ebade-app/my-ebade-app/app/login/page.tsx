import React from 'react';
import { LoginForm } from '@/components/login-form';
import { SocialAuthButtons } from '@/components/social-auth-buttons';
import { ForgotPasswordLink } from '@/components/forgot-password-link';

/**
 * 🧠 Generated via ebade - The Agent-First Framework
 * https://github.com/hasankemaldemirci/ebade
 * 
 * @page('/login')
 * @intent('auth-login')
 */
export default function AuthLoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight opacity-90">AuthLogin</h1>
          <p className="text-sm opacity-40 mt-1">Route: /login</p>
        </header>
        
        <main className="space-y-12">
          <LoginForm />
          <SocialAuthButtons />
          <ForgotPasswordLink />
        </main>
      </div>
    </div>
  );
}

// Auth: public