import React from 'react';
import { Navbar } from '@/components/navbar';
import { HeroSection } from '@/components/hero-section';
import { FeatureGrid } from '@/components/feature-grid';
import { PricingTable } from '@/components/pricing-table';
import { Testimonials } from '@/components/testimonials';
import { FaqAccordion } from '@/components/faq-accordion';
import { CtaBanner } from '@/components/cta-banner';
import { Footer } from '@/components/footer';

/**
 * 🧠 Generated via ebade - The Agent-First Framework
 * https://github.com/hasankemaldemirci/ebade
 * 
 * @page('/')
 * @intent('landing-page')
 */
export default function LandingPagePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight opacity-90">LandingPage</h1>
          <p className="text-sm opacity-40 mt-1">Route: /</p>
        </header>
        
        <main className="space-y-12">
          <Navbar />
          <HeroSection />
          <FeatureGrid />
          <PricingTable />
          <Testimonials />
          <FaqAccordion />
          <CtaBanner />
          <Footer />
        </main>
      </div>
    </div>
  );
}

// Auth: none