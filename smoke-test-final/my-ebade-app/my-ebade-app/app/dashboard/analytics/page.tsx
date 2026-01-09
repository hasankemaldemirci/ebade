import React from 'react';
import { DateRangePicker } from '@/components/date-range-picker';
import { MetricsCards } from '@/components/metrics-cards';
import { LineChart } from '@/components/line-chart';
import { BarChart } from '@/components/bar-chart';
import { DataTable } from '@/components/data-table';

/**
 * 🧠 Generated via ebade - The Agent-First Framework
 * https://github.com/hasankemaldemirci/ebade
 * 
 * @page('/dashboard/analytics')
 * @intent('analytics-view')
 */
export default function AnalyticsViewPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight opacity-90">AnalyticsView</h1>
          <p className="text-sm opacity-40 mt-1">Route: /dashboard/analytics</p>
        </header>
        
        <main className="space-y-12">
          <DateRangePicker />
          <MetricsCards />
          <LineChart />
          <BarChart />
          <DataTable />
        </main>
      </div>
    </div>
  );
}

// Auth: required