import React from "react";
import { cn } from "@/lib/utils";
import { Users, Zap, Shield, TrendingUp } from "lucide-react";

/**
 * 🧠 Generated via ebade
 * Component: StatsGrid
 */
export function StatsGrid() {
  const stats = [
    {
      label: "Active Users",
      value: "12,402",
      growth: "+12.5%",
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Throughput",
      value: "84.2k",
      growth: "+8.1%",
      icon: Zap,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
    {
      label: "Security Score",
      value: "98/100",
      growth: "Stable",
      icon: Shield,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Revenue",
      value: "$42.1k",
      growth: "+24.3%",
      icon: TrendingUp,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((s, i) => {
        const Icon = s.icon;
        return (
          <div
            key={i}
            className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={cn("p-3 rounded-2xl", s.bg)}>
                <Icon size={24} className={s.color} />
              </div>
              <span
                className={cn(
                  "text-xs font-bold px-2 py-1 rounded-full",
                  s.growth.startsWith("+")
                    ? "bg-emerald-500/10 text-emerald-500"
                    : "bg-slate-800 text-slate-400"
                )}
              >
                {s.growth}
              </span>
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium mb-1">
                {s.label}
              </p>
              <h4 className="text-2xl font-bold text-white">{s.value}</h4>
            </div>
          </div>
        );
      })}
    </div>
  );
}
