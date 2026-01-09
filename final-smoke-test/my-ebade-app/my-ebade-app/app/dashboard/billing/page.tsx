import React from 'react';
import { CurrentPlanCard } from '@/components/current-plan-card';
import { UsageMeter } from '@/components/usage-meter';
import { UpgradeModal } from '@/components/upgrade-modal';
import { InvoiceHistory } from '@/components/invoice-history';

/**
 * 🧠 Generated via ebade - The Agent-First Framework
 * https://github.com/hasankemaldemirci/ebade
 * 
 * @page('/dashboard/billing')
 * @intent('billing-management')
 */
export default function BillingManagementPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight opacity-90">BillingManagement</h1>
          <p className="text-sm opacity-40 mt-1">Route: /dashboard/billing</p>
        </header>
        
        <main className="space-y-12">
          <CurrentPlanCard />
          <UsageMeter />
          <UpgradeModal />
          <InvoiceHistory />
        </main>
      </div>
    </div>
  );
}

// Auth: required