import React from 'react';
import { StatsGrid } from '@/components/stats-grid';
import { ActivityChart } from '@/components/activity-chart';
import { RecentEvents } from '@/components/recent-events';
import { QuickActions } from '@/components/quick-actions';

/**
 * 🧠 Generated via ebade - The Agent-First Framework
 * https://github.com/hasankemaldemirci/ebade
 * 
 * @page('/dashboard')
 * @intent('main-dashboard')
 */
export default function MainDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight opacity-90">MainDashboard</h1>
          <p className="text-sm opacity-40 mt-1">Route: /dashboard</p>
        </header>
        
        <main className="space-y-12">
          <StatsGrid />
          <ActivityChart />
          <RecentEvents />
          <QuickActions />
        </main>
      </div>
    </div>
  );
}

// Auth: required