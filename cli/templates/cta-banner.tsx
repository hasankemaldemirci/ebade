import React from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

/**
 * 🧠 Generated via ebade
 * Component: CtaBanner
 */
export function CtaBanner() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto p-12 rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-indigo-700 text-center relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-black/10 rounded-full blur-3xl"></div>

        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 relative z-10">
          Ready to build with Intent?
        </h2>
        <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto relative z-10 italic">
          Join the revolution of Agent-First engineering. Transform your YAML
          into production-ready software in seconds.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-10">
          <button className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-2 group shadow-xl">
            Get Started Free
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
          <button className="px-8 py-4 bg-transparent text-white border border-white/20 font-semibold rounded-2xl hover:bg-white/10 transition-all">
            Contact Sales
          </button>
        </div>
      </div>
    </section>
  );
}
