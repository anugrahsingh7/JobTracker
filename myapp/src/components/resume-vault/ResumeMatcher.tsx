"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Upload,
  Target,
  Brain,
  Sparkles,
} from "lucide-react";
import { useCareerStore } from "@/store/useCareerStore";

export default function ResumeMatcher() {
  const resumes = useCareerStore((state) => state.resumes);
  const [selectedResume, setSelectedResume] = useState(resumes[0]?.id || "");
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchResult, setMatchResult] = useState<{
    percentage: number;
    matchedSkills: string[];
    missingSkills: string[];
    radarData: { subject: string; A: number; fullMark: number }[];
  } | null>(null);

  const currentResume = resumes.find((r) => r.id === selectedResume);

  const analyzeMatch = () => {
    if (!jobDescription.trim() || !currentResume) return;

    setIsAnalyzing(true);

    setTimeout(() => {
      const skillsToCheck = currentResume.skills;
      const jdLower = jobDescription.toLowerCase();

      const matchedSkills = skillsToCheck.filter((skill) =>
        jdLower.includes(skill.toLowerCase()),
      );

      const importantSkills = [
        "React",
        "Next.js",
        "TypeScript",
        "Node.js",
        "JavaScript",
        "Tailwind",
        "CSS",
        "HTML",
      ];

      const percentage = Math.round(
        (matchedSkills.length / skillsToCheck.length) * 100,
      );

      const radarData = [
        {
          subject: "React",
          A: matchedSkills.includes("React") ? 100 : 30,
          fullMark: 100,
        },
        {
          subject: "Next.js",
          A: matchedSkills.includes("Next.js") ? 100 : 25,
          fullMark: 100,
        },
        {
          subject: "TypeScript",
          A: matchedSkills.includes("TypeScript") ? 100 : 40,
          fullMark: 100,
        },
        {
          subject: "Node.js",
          A: matchedSkills.includes("Node.js") ? 100 : 35,
          fullMark: 100,
        },
        {
          subject: "Tailwind",
          A:
            matchedSkills.includes("Tailwind") ||
            matchedSkills.includes("Tailwind CSS")
              ? 100
              : 20,
          fullMark: 100,
        },
        {
          subject: "GSAP",
          A: matchedSkills.includes("GSAP") ? 100 : 15,
          fullMark: 100,
        },
      ];

      setMatchResult({
        percentage,
        matchedSkills,
        missingSkills: importantSkills.filter(
          (s) => !matchedSkills.includes(s),
        ),
        radarData,
      });

      setIsAnalyzing(false);
    }, 1500);
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return "from-emerald-500 to-green-500";
    if (percentage >= 60) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-pink-500";
  };

  return (
    <div className="h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-1">Resume Matcher</h1>
        <p className="text-slate-400">
          Match your resume against job descriptions and see your compatibility
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-cyan-400" />
              <h2 className="text-xl font-bold text-white">Select Resume</h2>
            </div>
            <div className="space-y-3">
              {resumes.map((resume) => (
                <button
                  key={resume.id}
                  onClick={() => setSelectedResume(resume.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                    selectedResume === resume.id
                      ? "bg-cyan-500/10 border-cyan-500/50"
                      : "bg-slate-800/50 border-slate-700 hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white">
                        {resume.name}
                      </h3>
                      <p className="text-sm text-slate-400">
                        {resume.skills.length} skills • Updated{" "}
                        {new Date(resume.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {selectedResume === resume.id && (
                      <CheckCircle2 className="w-6 h-6 text-cyan-400" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-bold text-white">Job Description</h2>
            </div>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="w-full h-64 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 resize-none"
            />
            <button
              onClick={analyzeMatch}
              disabled={isAnalyzing || !jobDescription.trim() || !currentResume}
              className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold text-white transition-all duration-300 shadow-lg"
            >
              {isAnalyzing ? (
                <>
                  <Brain className="w-5 h-5 animate-pulse" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Analyze Match
                </>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {matchResult && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 backdrop-blur-xl text-center"
              >
                <div className="relative inline-block mb-4">
                  <div
                    className={`w-40 h-40 rounded-full bg-gradient-to-br ${getMatchColor(matchResult.percentage)} flex items-center justify-center shadow-2xl`}
                  >
                    <div className="w-32 h-32 rounded-full bg-slate-900 flex items-center justify-center">
                      <span className="text-4xl font-bold text-white">
                        {matchResult.percentage}%
                      </span>
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Match Score
                </h3>
                <p className="text-slate-400">
                  {matchResult.percentage >= 80
                    ? "Excellent match! You&apos;re a strong candidate."
                    : matchResult.percentage >= 60
                      ? "Good match! Consider applying."
                      : "You may want to optimize your resume for this role."}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl"
              >
                <h3 className="text-xl font-bold text-white mb-4">
                  Skills Radar
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                      cx="50%"
                      cy="50%"
                      outerRadius="70%"
                      data={matchResult.radarData}
                    >
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: "#94a3b8", fontSize: 12 }}
                      />
                      <PolarRadiusAxis
                        angle={90}
                        domain={[0, 100]}
                        tick={false}
                        axisLine={false}
                      />
                      <Radar
                        name="Skills"
                        dataKey="A"
                        stroke="#06b6d4"
                        strokeWidth={3}
                        fill="#06b6d4"
                        fillOpacity={0.3}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          border: "1px solid #334155",
                          borderRadius: "8px",
                        }}
                        itemStyle={{ color: "#06b6d4" }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-lg font-bold text-white">
                      Matched Skills
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {matchResult.matchedSkills.map((skill, i) => (
                      <motion.span
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.05 }}
                        className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm font-medium border border-emerald-500/30"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="w-5 h-5 text-orange-400" />
                    <h3 className="text-lg font-bold text-white">
                      Missing Skills
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {matchResult.missingSkills.map((skill, i) => (
                      <motion.span
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + i * 0.05 }}
                        className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm font-medium border border-orange-500/30"
                      >
                        {skill}
                      </motion.span>
                    ))}
                    {matchResult.missingSkills.length === 0 && (
                      <p className="text-slate-500 text-sm">
                        No missing skills detected!
                      </p>
                    )}
                  </div>
                </motion.div>
              </div>
            </>
          )}

          {!matchResult && !isAnalyzing && (
            <div className="bg-slate-900/50 border border-slate-800 border-dashed rounded-2xl p-12 text-center backdrop-blur-xl">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-10 h-10 text-slate-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Ready to Match
              </h3>
              <p className="text-slate-400">
                Select a resume, paste a job description, and click
                &quot;Analyze Match&quot;
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
