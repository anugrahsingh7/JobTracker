import { create } from "zustand";

export type JobStatus = "applied" | "interviewing" | "offer" | "rejected";

export interface JobApplication {
  id: string;
  companyName: string;
  role: string;
  status: JobStatus;
  date: string;
  description?: string;
  companyResearch?: string;
  keyQuestions?: string;
  followUpReminder?: string;
  interviewDate?: string;
  skills?: string[];
}

export interface Resume {
  id: string;
  name: string;
  content: string;
  skills: string[];
  createdAt: string;
}

export interface BioVersion {
  id: "short" | "professional" | "technical";
  name: string;
  content: string;
}

interface CareerState {
  jobs: JobApplication[];
  resumes: Resume[];
  bioVersions: BioVersion[];
  activeTab: "kanban" | "resume-vault" | "about" | "interview-prep" | "analytics";
  addJob: (job: Omit<JobApplication, "id" | "date">) => void;
  updateJob: (id: string, updates: Partial<JobApplication>) => void;
  deleteJob: (id: string) => void;
  moveJob: (jobId: string, newStatus: JobStatus) => void;
  addResume: (resume: Omit<Resume, "id" | "createdAt">) => void;
  updateBio: (id: BioVersion["id"], content: string) => void;
  setActiveTab: (tab: CareerState["activeTab"]) => void;
}

const initialBioVersions: BioVersion[] = [
  {
    id: "short",
    name: "Short Bio",
    content: "Passionate Full Stack Developer with expertise in React, Next.js, and modern web technologies.",
  },
  {
    id: "professional",
    name: "Professional Bio",
    content: "Experienced software engineer specializing in building scalable web applications with React, Next.js, TypeScript, and Node.js. Proven track record of delivering high-performance solutions in fast-paced environments.",
  },
  {
    id: "technical",
    name: "Technical Bio",
    content: "Full Stack Developer proficient in React 19, Next.js 15, TypeScript, Tailwind CSS, GSAP, Framer Motion, Zustand, and MongoDB. Experienced in building high-performance dashboards with drag-and-drop interfaces, data visualization, and state-of-the-art UI/UX.",
  },
];

export const useCareerStore = create<CareerState>((set) => ({
  jobs: [],
  resumes: [
    {
      id: "1",
      name: "Main Resume",
      content: "Experienced Full Stack Developer...",
      skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "MongoDB", "GSAP", "Framer Motion"],
      createdAt: new Date().toISOString(),
    },
  ],
  bioVersions: initialBioVersions,
  activeTab: "kanban",

  addJob: (job) =>
    set((state) => ({
      jobs: [
        ...state.jobs,
        {
          ...job,
          id: Date.now().toString(),
          date: new Date().toISOString(),
        },
      ],
    })),

  updateJob: (id, updates) =>
    set((state) => ({
      jobs: state.jobs.map((job) => (job.id === id ? { ...job, ...updates } : job)),
    })),

  deleteJob: (id) =>
    set((state) => ({
      jobs: state.jobs.filter((job) => job.id !== id),
    })),

  moveJob: (jobId, newStatus) =>
    set((state) => ({
      jobs: state.jobs.map((job) =>
        job.id === jobId ? { ...job, status: newStatus } : job
      ),
    })),

  addResume: (resume) =>
    set((state) => ({
      resumes: [
        ...state.resumes,
        {
          ...resume,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        },
      ],
    })),

  updateBio: (id, content) =>
    set((state) => ({
      bioVersions: state.bioVersions.map((bio) =>
        bio.id === id ? { ...bio, content } : bio
      ),
    })),

  setActiveTab: (tab) => set({ activeTab: tab }),
}));
