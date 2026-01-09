import React from 'react';
import { ProfileForm } from '@/components/profile-form';
import { PasswordChange } from '@/components/password-change';
import { NotificationPreferences } from '@/components/notification-preferences';
import { ConnectedAccounts } from '@/components/connected-accounts';

/**
 * 🧠 Generated via ebade - The Agent-First Framework
 * https://github.com/hasankemaldemirci/ebade
 * 
 * @page('/dashboard/settings')
 * @intent('user-settings')
 */
export default function UserSettingsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight opacity-90">UserSettings</h1>
          <p className="text-sm opacity-40 mt-1">Route: /dashboard/settings</p>
        </header>
        
        <main className="space-y-12">
          <ProfileForm />
          <PasswordChange />
          <NotificationPreferences />
          <ConnectedAccounts />
        </main>
      </div>
    </div>
  );
}

// Auth: required