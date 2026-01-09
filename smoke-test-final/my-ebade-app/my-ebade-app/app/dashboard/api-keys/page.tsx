import React from 'react';
import { ApiKeysTable } from '@/components/api-keys-table';
import { CreateKeyModal } from '@/components/create-key-modal';
import { KeyPermissions } from '@/components/key-permissions';

/**
 * 🧠 Generated via ebade - The Agent-First Framework
 * https://github.com/hasankemaldemirci/ebade
 * 
 * @page('/dashboard/api-keys')
 * @intent('api-key-management')
 */
export default function ApiKeyManagementPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight opacity-90">ApiKeyManagement</h1>
          <p className="text-sm opacity-40 mt-1">Route: /dashboard/api-keys</p>
        </header>
        
        <main className="space-y-12">
          <ApiKeysTable />
          <CreateKeyModal />
          <KeyPermissions />
        </main>
      </div>
    </div>
  );
}

// Auth: required