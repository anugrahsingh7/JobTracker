"use client";

import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  User,
  CalendarCheck,
  BarChart3,
  Settings,
  Cpu,
} from "lucide-react";
import { useCareerStore, type CareerState } from "@/store/useCareerStore";
import { cn } from "@/lib/utils";

const menuItems = [
  { id: "kanban", label: "Kanban Board", icon: LayoutDashboard },
  { id: "resume-vault", label: "Resume Vault", icon: FileText },
  { id: "about", label: "About Engine", icon: User },
  { id: "interview-prep", label: "Interview Prep", icon: CalendarCheck },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

export default function Sidebar() {
  const activeTab = useCareerStore((state) => state.activeTab);
  const setActiveTab = useCareerStore((state) => state.setActiveTab);

  return (
    <div className="w-72 h-full glass-panel border-r border-slate-800/50 flex flex-col">
      <div className="p-6 border-b border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center glow-cyan">
            <Cpu className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Career OS
            </h1>
            <p className="text-xs text-slate-500">Professional Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setActiveTab(item.id as CareerState["activeTab"])}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                isActive
                  ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/30 glow-cyan"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50",
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 transition-colors",
                  isActive
                    ? "text-cyan-400"
                    : "text-slate-500 group-hover:text-slate-300",
                )}
              />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="active-indicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400"
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800/50">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all duration-300">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
}
