"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCareerStore } from "@/store/useCareerStore";
import KanbanBoard from "@/components/kanban/KanbanBoard";
import ResumeMatcher from "@/components/resume-vault/ResumeMatcher";
import AboutEngine from "@/components/about/AboutEngine";

export default function DashboardContent() {
  const activeTab = useCareerStore((state) => state.activeTab);

  const renderContent = () => {
    switch (activeTab) {
      case "kanban":
        return <KanbanBoard />;
      case "resume-vault":
        return <ResumeMatcher />;
      case "about":
        return <AboutEngine />;
      case "interview-prep":
        return (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Interview Prep Zone</h2>
              <p className="text-slate-400">Coming soon - Stay tuned!</p>
            </div>
          </div>
        );
      case "analytics":
        return (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Analytics Dashboard</h2>
              <p className="text-slate-400">Coming soon - Stay tuned!</p>
            </div>
          </div>
        );
      default:
        return <KanbanBoard />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="h-full"
      >
        {renderContent()}
      </motion.div>
    </AnimatePresence>
  );
}
