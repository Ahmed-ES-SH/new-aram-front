"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiCheck } from "react-icons/fi";
import { Task } from "./types";
import { instance } from "@/app/_helpers/axios";
import { toast } from "sonner";
import ConfirmDeletePopup from "../../_popups/ConfirmDeletePopup";
import TaskItem from "./_tasks/TaskItem";
import TaskModal from "./_tasks/TaskModal";

// Tasks section component
export function TasksSection() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Delete Popup State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await instance.get("/todos");
      if (res.data.status) {
        setTasks(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleToggle = async (task: Task) => {
    // Optimistic update
    const previousTasks = [...tasks];
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id ? { ...t, is_completed: !t.is_completed } : t
      )
    );

    try {
      await instance.put(`/todos/${task.id}`, {
        is_completed: !task.is_completed,
      });
      toast.success("تم تحديث حالة المهمة");
    } catch (error) {
      setTasks(previousTasks); // Revert on error
      toast.error("حدث خطأ أثناء تحديث المهمة");
      console.error(error);
    }
  };

  const handleSaveTask = async (data: Partial<Task>) => {
    try {
      if (editingTask) {
        const res = await instance.put(`/todos/${editingTask.id}`, data);
        if (res.data) {
          fetchTasks(); // Refresh to get exact server state or update locally
          toast.success("تم تعديل المهمة بنجاح");
        }
      } else {
        const res = await instance.post("/todos", data);
        if (res.data) {
          fetchTasks();
          toast.success("تم إضافة المهمة بنجاح");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ، يرجى المحاولة مرة أخرى");
      throw error; // Re-throw to be caught in modal
    }
  };

  const handleDeleteClick = (task: Task) => {
    setTaskToDelete(task);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    setIsDeleting(true);
    try {
      await instance.delete(`/todos/${taskToDelete.id}`);
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
      toast.success("تم حذف المهمة بنجاح");
      setIsDeleteOpen(false);
    } catch (error) {
      toast.error("فشل حذف المهمة");
      console.error(error);
    } finally {
      setIsDeleting(false);
      setTaskToDelete(null);
    }
  };

  const openNewTaskModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditTaskModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const completedCount = tasks.filter((t) => t.is_completed).length;
  const pendingCount = tasks.filter((t) => !t.is_completed).length;
  const progress =
    tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col h-full relative overflow-hidden"
      >
        <div className="mb-6 flex items-center justify-between relative z-10">
          <div>
            <h3 className="text-lg font-bold text-gray-900">مهام المدير</h3>
            {!loading && (
              <p className="text-sm text-gray-500">
                {pendingCount} مهمة معلقة • {completedCount} مكتملة
              </p>
            )}
          </div>
          <button
            onClick={openNewTaskModal}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-md transition-all hover:bg-primary/90 hover:shadow-lg hover:scale-105 cursor-pointer"
          >
            <FiPlus className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          /* Loading Skeletons */
          <div className="flex-1 space-y-4 animate-pulse">
            <div className="h-4 bg-gray-100 rounded-full w-full mb-6"></div>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-100"
              >
                <div className="h-6 w-6 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                </div>
                <div className="h-6 w-16 bg-gray-100 rounded-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Progress bar */}
            {tasks.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">التقدم اليومي</span>
                  <span className="text-sm font-semibold text-primary">
                    {progress}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full bg-linear-to-l from-primary to-orange-400"
                  />
                </div>
              </div>
            )}

            {/* Tasks list */}
            <div className="flex-1 overflow-y-auto max-h-[400px] -mx-2 px-2 custom-scrollbar space-y-2">
              {tasks.length === 0 ? (
                /* Empty state */
                <div className="flex flex-col items-center justify-center h-full py-10 text-center space-y-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                    <FiCheck className="h-8 w-8 text-gray-300" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 font-medium mb-1">
                      لا توجد مهام
                    </h4>
                    <p className="text-sm text-gray-500 max-w-[200px] mx-auto">
                      القائمة فارغة تماماً. ابدأ يومك بإضافة بعض المهام الجديدة!
                    </p>
                  </div>
                  <button
                    onClick={openNewTaskModal}
                    className="text-sm text-primary font-bold hover:underline cursor-pointer"
                  >
                    إضافة مهمة جديدة
                  </button>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {tasks
                    .sort((a, b) => {
                      // Sort logic: Incomplete first, then by priority (high > medium > low), then by date
                      if (a.is_completed !== b.is_completed)
                        return Number(a.is_completed) - Number(b.is_completed);

                      const priorityOrder = { high: 0, medium: 1, low: 2 };
                      if (a.priority !== b.priority)
                        return (
                          priorityOrder[a.priority] - priorityOrder[b.priority]
                        );

                      return 0;
                    })
                    .map((task, index) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={handleToggle}
                        onDelete={handleDeleteClick}
                        onEdit={openEditTaskModal}
                        index={index}
                      />
                    ))}
                </AnimatePresence>
              )}
            </div>
          </>
        )}
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {isModalOpen && (
          <TaskModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveTask}
            initialData={editingTask}
          />
        )}
      </AnimatePresence>

      <ConfirmDeletePopup
        title={taskToDelete?.title}
        id={taskToDelete?.id as number}
        showConfirm={isDeleteOpen}
        onDelete={handleConfirmDelete}
        onClose={() => setIsDeleteOpen(false)}
        loading={isDeleting}
      />
    </>
  );
}
