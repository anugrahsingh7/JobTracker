import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case "applied":
      return "from-blue-500 to-cyan-500";
    case "interviewing":
      return "from-purple-500 to-pink-500";
    case "offer":
      return "from-green-500 to-emerald-500";
    case "rejected":
      return "from-red-500 to-orange-500";
    default:
      return "from-gray-500 to-slate-500";
  }
};

export const getStatusBg = (status: string) => {
  switch (status) {
    case "applied":
      return "bg-blue-500/10 border-blue-500/20";
    case "interviewing":
      return "bg-purple-500/10 border-purple-500/20";
    case "offer":
      return "bg-green-500/10 border-green-500/20";
    case "rejected":
      return "bg-red-500/10 border-red-500/20";
    default:
      return "bg-gray-500/10 border-gray-500/20";
  }
};
