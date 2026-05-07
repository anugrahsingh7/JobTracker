"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { GripVertical, Plus, Trash2, Edit3, Calendar, Building2, Briefcase } from "lucide-react";
import { useCareerStore, type JobApplication, type JobStatus } from "@/store/useCareerStore";
import { cn, getStatusColor, getStatusBg } from "@/lib/utils";

const columns: { id: JobStatus; title: string; color: string }[] = [
  { id: "applied", title: "Applied", color: "text-blue-400" },
  { id: "interviewing", title: "Interviewing", color: "text-purple-400" },
  { id: "offer", title: "Offer", color: "text-green-400" },
  { id: "rejected", title: "Rejected", color: "text-red-400" },
];

interface SortableJobCardProps {
  job: JobApplication;
  isOverlay?: boolean;
}

const SortableJobCard = ({ job, isOverlay }: SortableJobCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 999 : "auto",
  };

  const deleteJob = useCareerStore((state) => state.deleteJob);
  const updateJob = useCareerStore((state) => state.updateJob);
  const [showEdit, setShowEdit] = useState(false);

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        "relative p-4 rounded-xl border backdrop-blur-xl transition-all duration-300 cursor-grab active:cursor-grabbing",
        isOverlay ? "shadow-2xl scale-105" : "hover:shadow-lg",
        getStatusBg(job.status)
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
          <GripVertical className="w-5 h-5 text-slate-500 hover:text-slate-300" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold text-slate-100 truncate">{job.companyName}</h3>
            <div
              className={cn("w-2 h-2 rounded-full bg-gradient-to-r", getStatusColor(job.status))}
            />
          </div>
          <p className="text-slate-400 text-sm mb-2">{job.role}</p>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Calendar className="w-3 h-3" />
            <span>{new Date(job.date).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => setShowEdit(!showEdit)}
            className="p-1.5 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => deleteJob(job.id)}
            className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

interface ColumnProps {
  column: (typeof columns)[0];
  jobs: JobApplication[];
}

const Column = ({ column, jobs }: ColumnProps) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <h2 className={cn("font-bold text-lg", column.color)}>{column.title}</h2>
          <span className="bg-slate-800 px-2 py-0.5 rounded-full text-xs font-medium text-slate-400">
            {jobs.length}
          </span>
        </div>
      </div>
      <div className="flex-1 bg-slate-900/30 rounded-2xl p-3 min-h-[500px] border border-slate-800">
        <SortableContext items={jobs.map((j) => j.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {jobs.map((job) => (
              <SortableJobCard key={job.id} job={job} />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
};

export default function KanbanBoard() {
  const jobs = useCareerStore((state) => state.jobs);
  const moveJob = useCareerStore((state) => state.moveJob);
  const addJob = useCareerStore((state) => state.addJob);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newJob, setNewJob] = useState({ companyName: "", role: "", status: "applied" as JobStatus });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeJob = jobs.find((j) => j.id === active.id);
    if (!activeJob) return;

    const overId = over.id as string;
    const overColumn = columns.find((c) => c.id === overId);
    const overJob = jobs.find((j) => j.id === overId);

    if (overColumn) {
      moveJob(activeJob.id, overColumn.id);
    } else if (overJob && overJob.status !== activeJob.status) {
      moveJob(activeJob.id, overJob.status);
    }
  };

  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (newJob.companyName && newJob.role) {
      addJob(newJob);
      setNewJob({ companyName: "", role: "", status: "applied" });
      setShowAddModal(false);
    }
  };

  const activeJob = jobs.find((j) => j.id === activeId);

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Kanban Board</h1>
          <p className="text-slate-400">Drag and drop to organize your applications</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-xl font-semibold text-white shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          Add Job
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((column) => (
            <div key={column.id} id={column.id}>
              <Column
                column={column}
                jobs={jobs.filter((j) => j.status === column.id)}
              />
            </div>
          ))}
        </div>

        <DragOverlay>
          {activeJob ? <SortableJobCard job={activeJob} isOverlay /> : null}
        </DragOverlay>
      </DndContext>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Add New Application</h2>
            <form onSubmit={handleAddJob} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={newJob.companyName}
                  onChange={(e) => setNewJob({ ...newJob, companyName: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
                  placeholder="e.g., Google"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
                <input
                  type="text"
                  value={newJob.role}
                  onChange={(e) => setNewJob({ ...newJob, role: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
                  placeholder="e.g., Senior Frontend Engineer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                <select
                  value={newJob.status}
                  onChange={(e) => setNewJob({ ...newJob, status: e.target.value as JobStatus })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
                >
                  {columns.map((col) => (
                    <option key={col.id} value={col.id}>
                      {col.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl font-semibold shadow-lg transition-all"
                >
                  Add Application
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
