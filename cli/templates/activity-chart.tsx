import React from "react";
import { cn } from "@/lib/utils";

/**
 * 🧠 Generated via ebade
 * Component: ActivityChart
 */
export function ActivityChart() {
  const data = [40, 70, 45, 90, 65, 80, 50, 85, 95, 60, 75, 55];

  return (
    <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold text-white">Activity Overview</h3>
          <p className="text-sm text-slate-500">
            System throughput over the last 12 hours
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
            <span className="text-xs text-slate-400">Requests</span>
          </div>
        </div>
      </div>

      <div className="flex items-end justify-between h-48 gap-2 px-2">
        {data.map((val, i) => (
          <div
            key={i}
            className="flex-1 flex flex-col items-center gap-2 group"
          >
            <div
              className="w-full bg-indigo-500/20 rounded-t-lg group-hover:bg-indigo-500/40 transition-all relative"
              style={{ height: `${val}%` }}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {val}k
              </div>
            </div>
            <span className="text-[10px] text-slate-600 font-mono">
              H{i + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
