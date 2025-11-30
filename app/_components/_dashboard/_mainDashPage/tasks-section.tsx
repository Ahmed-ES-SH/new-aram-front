"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCheck,
  FiCircle,
  FiAlertCircle,
  FiClock,
  FiPlus,
} from "react-icons/fi";
import { Task } from "./types";

// Initial tasks data
const initialTasks: Task[] = [
  {
    id: "1",
    title: "مراجعة طلبات الخدمات الجديدة (5)",
    completed: false,
    priority: "high",
  },
  {
    id: "2",
    title: "التحقق من الكوبونات النشطة",
    completed: false,
    priority: "medium",
  },
  {
    id: "3",
    title: "متابعة الرسائل غير المقروءة (12)",
    completed: false,
    priority: "high",
  },
  {
    id: "4",
    title: "مراجعة تقارير المسوقين الشهرية",
    completed: true,
    priority: "medium",
  },
  {
    id: "5",
    title: "تحديث بيانات المراكز",
    completed: false,
    priority: "low",
  },
  {
    id: "6",
    title: "إعداد العروض الموسمية",
    completed: true,
    priority: "medium",
  },
];

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
      return {
        bg: "bg-blue-100",
        text: "text-blue-600",
        label: "منخفض",
        icon: <FiCircle className="h-3 w-3" />,
      };
  }
}

// Single task item component
function TaskItem({
  task,
  onToggle,
  index,
}: {
  task: Task;
  onToggle: (id: string) => void;
  index: number;
}) {
  const priority = getPriorityStyle(task.priority);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      layout
      className={`group flex items-center gap-3 rounded-xl p-3 transition-all ${
        task.completed ? "bg-gray-50" : "bg-white hover:bg-gray-50"
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className={`flex h-6 w-6 items-center justify-center rounded-lg border-2 transition-all ${
          task.completed
            ? "border-green-500 bg-green-500 text-white"
            : "border-gray-300 hover:border-green-500"
        }`}
      >
        {task.completed && <FiCheck className="h-4 w-4" />}
      </button>

      {/* Task content */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium transition-all ${
            task.completed ? "text-gray-400 line-through" : "text-gray-900"
          }`}
        >
          {task.title}
        </p>
      </div>

      {/* Priority badge */}
      {!task.completed && (
        <div
          className={`flex items-center gap-1 rounded-full px-2 py-1 ${priority.bg} ${priority.text}`}
        >
          {priority.icon}
          <span className="text-xs font-medium">{priority.label}</span>
        </div>
      )}
    </motion.div>
  );
}

// Tasks section component
export function TasksSection() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.filter((t) => !t.completed).length;
  const progress = Math.round((completedCount / tasks.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">مهام المدير</h3>
          <p className="text-sm text-gray-500">
            {pendingCount} مهمة معلقة • {completedCount} مكتملة
          </p>
        </div>
        <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg">
          <FiPlus className="h-5 w-5" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">التقدم اليومي</span>
          <span className="text-sm font-semibold text-blue-600">
            {progress}%
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full bg-linear-to-l from-blue-600 to-indigo-600"
          />
        </div>
      </div>

      {/* Tasks list */}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        <AnimatePresence>
          {tasks
            .sort((a, b) => Number(a.completed) - Number(b.completed))
            .map((task, index) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleTask}
                index={index}
              />
            ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
