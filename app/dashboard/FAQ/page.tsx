"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPen, FaTrash } from "react-icons/fa";
import { MdOutlineBookmarkAdd } from "react-icons/md";
import { instance } from "@/app/_helpers/axios";
import useFetchData from "@/app/_helpers/FetchDataWithAxios";
import LoadingSpin from "@/app/_components/LoadingSpin";
import ConfirmDeletePopup from "@/app/_components/_popups/ConfirmDeletePopup";
import { handleDeleteItem } from "@/app/_helpers/deleteHelper";
import SuccessAlart from "@/app/_components/_popups/SuccessAlart";
import ErrorAlart from "@/app/_components/_popups/ErrorAlart";

export default function FAQ() {
  const { loading, data, currentPage, lastPage, setCurrentPage } = useFetchData(
    "all-faqs",
    true
  );
  const [questions, setQuestions] = useState<any>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [loadingPage, setLoadingPage] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);

  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [successPopup, setSuccessPopup] = useState(false);
  const [errorPopup, setErrorPopup] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [questionToDelete, setQuestionToDelete] = useState<any>(null);

  // إضافة سؤال جديد
  const addQuestion = async () => {
    // التحقق من أن السؤال والإجابة غير فارغين
    if (!newQuestion.trim() || !newAnswer.trim()) {
      setErrorPopup(true);
      setError("يجب إدخال السؤال والإجابة.");
      return;
    }
    try {
      const data = {
        question: newQuestion,
        answer: newAnswer,
        user_id: "1",
      };
      setLoadingPage(true);
      const response = await instance.post("/add-faq", data);
      if (response.status == 201) {
        const question = response.data.data;
        setQuestions((prevData) => [...prevData, question]);
        setNewQuestion("");
        setNewAnswer("");
        setLoadingPage(false);
        setSuccessMessage("تم إضافة السؤال الجديد بنجاح .");
        setSuccessPopup(true);
      }
    } catch (error) {
      setLoadingPage(false);
      console.log(error);
    }
  };

  // تأكيد حذف السؤال
  const confirmDelete = async () => {
    handleDeleteItem({
      endpoint: "/delete-faq",
      id: questionToDelete.id,
      setSuccess: setSuccessMessage,
      setStateFunction: setQuestions,
      onShowSuccessAlert: () => setSuccessPopup(true),
      onClosePopup: closeDeletePopup,
      onShowErrorAlert: () => setErrorPopup(true),
      setError: setError,
    });
    setSuccessMessage("تم حذف السؤال بنجاح .");
  };

  // فتح popup الحذف
  const openDeletePopup = (question: any) => {
    setQuestionToDelete(question);
    setIsDeletePopupOpen(true);
  };

  // إغلاق popup الحذف
  const closeDeletePopup = () => {
    setIsDeletePopupOpen(false);
    setQuestionToDelete(null);
  };

  // فتح نافذة التعديل
  const openEditModal = (question: any) => {
    setCurrentQuestion(question);
    setIsEditing(true);
  };

  // حفظ التعديلات
  const saveEdit = async () => {
    try {
      setLoadingPage(true);
      const response = await instance.post(
        `/update-faq/${currentQuestion.id}`,
        {
          question: currentQuestion.question,
          answer: currentQuestion.answer,
        }
      );
      if (response.status == 200) {
        setIsEditing(false);
        setSuccessMessage("تم تعديل بيانات السؤال بنجاح ");
        setSuccessPopup(true);
        setQuestions((prevData) =>
          prevData.map((q) =>
            q.id === currentQuestion.id
              ? {
                  ...q,
                  question: currentQuestion.question,
                  answer: currentQuestion.answer,
                }
              : q
          )
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingPage(false);
    }
  };

  // الانتقال إلى الصفحة التالية
  const nextPage = () => {
    if (currentPage < lastPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  // الانتقال إلى الصفحة السابقة
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    if (data) {
      setQuestions(data);
    }
  }, [data]);

  if (loading || loadingPage) return <LoadingSpin />;

  return (
    <>
      <div
        style={{ direction: "rtl" }}
        className="w-[95%] max-md:w-full mt-16 mx-auto bg-gray-100 dark:bg-secend_dash dark:text-secend_text max-md:p-2 p-6"
      >
        <div className="w-full mx-auto bg-white dark:bg-secend_dash dark:text-secend_text p-6 max-md:p-3 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-center mb-6">
            الأسئلة الشائعة
          </h1>

          {/* قائمة الأسئلة */}
          <AnimatePresence>
            {questions.map((q: any) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="border-b border-gray-300 dark:border-gray-600 py-4"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold">{q.question}</h3>
                    <p className="text-gray-600">{q.answer}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => openEditModal(q)}
                      className="text-blue-500 hover:text-blue-700 transition"
                    >
                      <FaPen />
                    </button>
                    <button
                      onClick={() => openDeletePopup(q)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* التصفح (pagination) */}
          <div className="mt-4 flex max-md:flex-col items-center gap-3 justify-between">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="bg-gray-300 text-black px-4 py-2 max-md:w-full  rounded hover:bg-gray-400 transition"
            >
              الصفحة السابقة
            </button>
            <span className="text-xl">
              الصفحة {currentPage} من {lastPage}
            </span>
            <button
              onClick={nextPage}
              disabled={currentPage === lastPage}
              className="bg-gray-300 text-black px-4 py-2 max-md:w-full  rounded hover:bg-gray-400 transition"
            >
              الصفحة التالية
            </button>
          </div>

          {/* إضافة سؤال جديد */}
          <div className="mt-6">
            <div className="flex items-center gap-2">
              <span className="w-full h-[1px] bg-black "></span>
              <div className="flex items-baseline gap-1">
                <h2 className="text-xl font-semibold whitespace-nowrap mb-4">
                  إضافة سؤال جديد
                </h2>
                <MdOutlineBookmarkAdd className="size-6 pt-1" />
              </div>
              <span className="w-full h-[1px] bg-black"></span>
            </div>
            <div className="space-y-4">
              <textarea
                placeholder="أدخل السؤال"
                className="input-style h-32"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
              />
              <textarea
                placeholder="أدخل الإجابة"
                className="input-style h-32"
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
              />
              <button
                onClick={addQuestion}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                إضافة السؤال
              </button>
            </div>
          </div>
        </div>

        {/* نافذة التعديل المنبثقة */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              className="fixed w-full  inset-0 bg-primary-boldgray backdrop-blur-lg  bg-opacity-50 flex justify-center items-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white  border border-gray-300 p-6 rounded-lg shadow-lg w-[80%] mx-auto"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <h2 className="text-xl font-semibold mb-4">تعديل السؤال</h2>
                <textarea
                  className="input-style h-32"
                  value={currentQuestion?.question}
                  onChange={(e) =>
                    setCurrentQuestion({
                      ...currentQuestion,
                      question: e.target.value,
                    })
                  }
                />
                <textarea
                  className="input-style h-32"
                  value={currentQuestion?.answer}
                  onChange={(e) =>
                    setCurrentQuestion({
                      ...currentQuestion,
                      answer: e.target.value,
                    })
                  }
                />
                <div className="flex justify-between">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={saveEdit}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                  >
                    حفظ
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* نافذة تأكيد الحذف */}
        <ConfirmDeletePopup
          title={
            questionToDelete &&
            questionToDelete?.question &&
            questionToDelete?.question.slice(0, 20) + "..."
          }
          id={questionToDelete?.id}
          showConfirm={isDeletePopupOpen}
          onDelete={confirmDelete}
          onClose={closeDeletePopup}
        />
        <SuccessAlart
          showAlart={successPopup}
          Message={successMessage}
          onClose={() => setSuccessPopup(false)}
        />
        <ErrorAlart
          showAlart={errorPopup}
          Message={error}
          onClose={() => setErrorPopup(false)}
        />
      </div>
    </>
  );
}
