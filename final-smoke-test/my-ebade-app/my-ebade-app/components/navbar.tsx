import React from "react";
import { cn } from "@/lib/utils";

/**
 * 🧠 Generated via ebade
 * Intent: navbar
 */
export function Navbar() {
  const links = [
    { label: "Essence", href: "#essence" },
    { label: "Flow", href: "#flow" },
    { label: "Pricing", href: "#pricing" },
    { label: "Github", href: "https://github.com/hasankemaldemirci/ebade" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all border-b border-white/5 backdrop-blur-md bg-background/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-black text-primary-foreground transform rotate-3">
              e
            </div>
            <span className="text-xl font-black tracking-tighter uppercase italic">
              ebade
            </span>
          </div>

          <div className="hidden md:flex items-center gap-10">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[13px] uppercase font-bold tracking-widest text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <button className="text-xs font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity">
              Login
            </button>
            <button className="h-10 px-6 rounded-lg bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg active:scale-95">
              Launch App
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}