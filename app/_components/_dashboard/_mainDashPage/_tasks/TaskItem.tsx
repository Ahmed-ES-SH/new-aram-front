"use client";

import { motion } from "framer-motion";
import {
  FiCheck,
  FiAlertCircle,
  FiClock,
  FiCircle,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import { Task } from "../types";

// Get priority styles
function getPriorityStyle(priority: Task["priority"]) {
  switch (priority) {
    case "high":
      return {
        bg: "bg-red-100",
        text: "text-red-600",
        label: "عاجل",
        icon: <FiAlertCircle className="h-3 w-3" />,
      };
    case "medium":
      return {
        bg: "bg-amber-100",
        text: "text-amber-600",
        label: "متوسط",
        icon: <FiClock className="h-3 w-3" />,
      };
    case "low":
    default:
      return {
        bg: "bg-blue-100",
        text: "text-blue-600",
        label: "منخفض",
        icon: <FiCircle className="h-3 w-3" />,
      };
  }
}

interface TaskItemProps {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete: (task: Task) => void;
  onEdit: (task: Task) => void;
  index: number;
}

export default function TaskItem({
  task,
  onToggle,
  onDelete,
  onEdit,
  index,
}: TaskItemProps) {
  const priority = getPriorityStyle(task.priority);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      layout
      className={`group flex items-center gap-3 rounded-xl p-3 transition-all border border-transparent hover:border-gray-200 ${
        task.is_completed
          ? "bg-gray-50"
          : "bg-white hover:bg-gray-50 hover:shadow-sm"
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task)}
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-all cursor-pointer ${
          task.is_completed
            ? "border-green-500 bg-green-500 text-white"
            : "border-gray-300 hover:border-green-500"
        }`}
      >
        {task.is_completed && <FiCheck className="h-4 w-4" />}
      </button>

      {/* Task content */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium transition-all ${
            task.is_completed ? "text-gray-400 line-through" : "text-gray-900"
          }`}
        >
          {task.title}
        </p>
        {task.description && !task.is_completed && (
          <p className="text-xs text-gray-400 truncate mt-0.5">
            {task.description}
          </p>
        )}
      </div>

      {/* Priority badge */}
      {!task.is_completed && (
        <div
          className={`flex items-center gap-1 rounded-full px-2 py-1 ${priority.bg} ${priority.text}`}
        >
          {priority.icon}
          <span className="text-xs font-medium">{priority.label}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(task)}
          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
          title="تعديل"
        >
          <FiEdit2 className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(task)}
          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          title="حذف"
        >
          <FiTrash2 className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
