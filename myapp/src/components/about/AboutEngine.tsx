"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, User, Briefcase, Code } from "lucide-react";
import { useCareerStore, type BioVersion } from "@/store/useCareerStore";

export default function AboutEngine() {
  const bioVersions = useCareerStore((state) => state.bioVersions);
  const updateBio = useCareerStore((state) => state.updateBio);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleEditStart = (bio: BioVersion) => {
    setEditingId(bio.id);
    setEditValue(bio.content);
  };

  const handleEditSave = (id: BioVersion["id"]) => {
    updateBio(id, editValue);
    setEditingId(null);
  };

  const versions: {
    id: BioVersion["id"];
    name: string;
    icon: React.ElementType;
    color: string;
  }[] = [
    {
      id: "short",
      name: "Short Bio",
      icon: User,
      color: "from-cyan-500 to-blue-500",
    },
    {
      id: "professional",
      name: "Professional",
      icon: Briefcase,
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "technical",
      name: "Technical",
      icon: Code,
      color: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <div className="h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">About Engine</h1>
        <p className="text-slate-400">
          Multiple bio versions for every occasion
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {versions.map((version, index) => {
          const Icon = version.icon;
          const bio = bioVersions.find((b) => b.id === version.id);

          return (
            <motion.div
              key={version.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel rounded-2xl p-6 gradient-border"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${version.color} rounded-xl flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {version.name}
                  </h3>
                  <p className="text-sm text-slate-500">
                    Perfect for{" "}
                    {version.id === "short"
                      ? "social profiles"
                      : version.id === "professional"
                        ? "cover letters"
                        : "technical roles"}
                  </p>
                </div>
              </div>

              {editingId === version.id ? (
                <div className="space-y-3">
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full h-40 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditSave(version.id)}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold text-white"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 bg-slate-700 rounded-xl font-semibold text-slate-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-slate-300 leading-relaxed min-h-[120px]">
                    {bio?.content}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopy(version.id, bio?.content || "")}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl font-semibold text-slate-300 transition-all duration-200"
                    >
                      {copiedId === version.id ? (
                        <>
                          <Check className="w-4 h-4 text-green-400" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => bio && handleEditStart(bio)}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl font-semibold text-slate-300 transition-all duration-200"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
