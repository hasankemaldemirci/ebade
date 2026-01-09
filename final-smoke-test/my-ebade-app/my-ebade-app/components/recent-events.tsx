import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, Info, ShieldAlert } from "lucide-react";

/**
 * 🧠 Generated via ebade
 * Component: RecentEvents
 */
export function RecentEvents() {
  const events = [
    {
      title: "Deployment Successful",
      time: "2m ago",
      type: "success",
      icon: CheckCircle2,
      desc: "Production environment updated to v1.2.4",
    },
    {
      title: "Security Alert",
      time: "15m ago",
      type: "error",
      icon: ShieldAlert,
      desc: "Anomalous login attempt from unknown IP",
    },
    {
      title: "Backup Completed",
      time: "1h ago",
      type: "info",
      icon: Clock,
      desc: "Global database backup finished successfully",
    },
    {
      title: "New Team Member",
      time: "3h ago",
      type: "info",
      icon: Info,
      desc: "Sarah Chen joined the Engineering team",
    },
  ];

  return (
    <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
      <h3 className="text-lg font-bold text-white mb-6">Recent Events</h3>
      <div className="space-y-6">
        {events.map((e, i) => {
          const Icon = e.icon;
          return (
            <div key={i} className="flex gap-4 group">
              <div
                className={cn(
                  "p-2 rounded-xl h-fit",
                  e.type === "success"
                    ? "bg-emerald-500/10 text-emerald-500"
                    : e.type === "error"
                    ? "bg-red-500/10 text-red-500"
                    : "bg-blue-500/10 text-blue-500"
                )}
              >
                <Icon size={18} />
              </div>
              <div className="flex-1 pb-6 border-b border-slate-800/50 group-last:border-0 group-last:pb-0">
                <div className="flex justify-between mb-1">
                  <h4 className="text-sm font-semibold text-slate-200">
                    {e.title}
                  </h4>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                    {e.time}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {e.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}