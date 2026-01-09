import React from 'react';
import { SignupForm } from '@/components/signup-form';
import { PlanSelector } from '@/components/plan-selector';
import { SocialAuthButtons } from '@/components/social-auth-buttons';

/**
 * 🧠 Generated via ebade - The Agent-First Framework
 * https://github.com/hasankemaldemirci/ebade
 * 
 * @page('/signup')
 * @intent('auth-register')
 */
export default function AuthRegisterPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight opacity-90">AuthRegister</h1>
          <p className="text-sm opacity-40 mt-1">Route: /signup</p>
        </header>
        
        <main className="space-y-12">
          <SignupForm />
          <PlanSelector />
          <SocialAuthButtons />
        </main>
      </div>
    </div>
  );
}

// Auth: public