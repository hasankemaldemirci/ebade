import React from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BarChart3,
  Users2,
  Settings,
  CreditCard,
  Key,
} from "lucide-react";

/**
 * 🧠 Generated via ebade
 * Component: SidebarNavigation
 */
export function SidebarNavigation() {
  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, active: true },
    { label: "Analytics", icon: BarChart3 },
    { label: "Team", icon: Users2 },
    { label: "Billing", icon: CreditCard },
    { label: "API Keys", icon: Key },
    { label: "Settings", icon: Settings },
  ];

  return (
    <div className="w-64 h-full bg-slate-900 border-r border-slate-800 flex flex-col p-6">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold">
          A
        </div>
        <span className="text-white font-bold tracking-tight">AnalyticsHQ</span>
      </div>

      <div className="flex-1 space-y-2">
        {menuItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <button
              key={i}
              className={cn(
                "flex items-center gap-3 w-full px-4 py-3 rounded-2xl transition-all",
                item.active
                  ? "bg-indigo-500 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <Icon size={20} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-auto p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
        <p className="text-xs text-indigo-300 font-bold mb-1 italic">
          PRO PLAN
        </p>
        <p className="text-[10px] text-indigo-400/70 mb-3">
          Upgrade to Enterprise for unlimited seats.
        </p>
        <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
          <div className="bg-indigo-500 h-full w-[65%]"></div>
        </div>
      </div>
    </div>
  );
}
