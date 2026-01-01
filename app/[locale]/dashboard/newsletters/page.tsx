"use client";
import React, { useEffect, useState } from "react";
import { instance } from "@/app/_helpers/axios";
import {
  FaEdit,
  FaPlus,
  FaTrash,
  FaPaperPlane,
  FaSpinner,
} from "react-icons/fa";
import Link from "next/link";
import { toast } from "sonner";
import { useLocale } from "next-intl";
import LoadingSpin from "@/app/_components/LoadingSpin";
import NewsletterWizard from "@/app/_components/_dashboard/_newsletter/NewsletterWizard";

interface Newsletter {
  id: number;
  subject: string;
  created_at: string;
}

export default function NewslettersPage() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNewsletter, setSelectedNewsletter] =
    useState<Newsletter | null>(null);
  const [isSendPopupOpen, setIsSendPopupOpen] = useState(false);
  const [newsletterToSend, setNewsletterToSend] = useState<Newsletter | null>(
    null
  );
  const locale = useLocale();

  const fetchNewsletters = async () => {
    try {
      setLoading(true);
      const response = await instance.get("/newsletters");
      if (response.status === 200) {
        setNewsletters(response.data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load newsletters");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsletters();
  }, []);

  const handleDelete = async () => {
    if (!selectedNewsletter) return;
    try {
      await instance.delete(`/newsletters/${selectedNewsletter.id}`);
      toast.success("Newsletter deleted successfully");
      setNewsletters(newsletters.filter((n) => n.id !== selectedNewsletter.id));
      setShowDeleteModal(false);
      setSelectedNewsletter(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete newsletter");
    }
  };

  const confirmDelete = (newsletter: Newsletter) => {
    setSelectedNewsletter(newsletter);
    setShowDeleteModal(true);
  };

  const openSendPopup = (newsletter: Newsletter) => {
    setNewsletterToSend(newsletter);
    setIsSendPopupOpen(true);
  };

  if (loading) return <LoadingSpin />;

  return (
    <div dir="rtl" className="p-6 space-y-6 min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">النشرات البريدية</h1>
          <p className="text-gray-500 text-sm mt-1">
            إدارة جميع النشرات البريدية من هنا
          </p>
        </div>

        <Link
          href={`/${locale}/dashboard/newsletters/new`}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 font-medium"
        >
          <FaPlus />
          <span>إنشاء نشرة جديدة</span>
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {newsletters && Array.isArray(newsletters) && newsletters.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-500 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">المعرّف</th>
                  <th className="px-6 py-4">العنوان</th>
                  <th className="px-6 py-4">تاريخ الإنشاء</th>
                  <th className="px-6 py-4 text-left">الإجراءات</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {newsletters.map((newsletter) => (
                  <tr
                    key={newsletter.id}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-500">
                      #{newsletter.id}
                    </td>

                    <td className="px-6 py-4 font-medium text-gray-900">
                      {newsletter.subject}
                    </td>

                    <td className="px-6 py-4 text-gray-500">
                      {new Date(newsletter.created_at).toLocaleDateString(
                        locale
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openSendPopup(newsletter)}
                          title="إرسال إلى البريد الإلكتروني"
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <FaPaperPlane />
                        </button>

                        <Link
                          href={`/${locale}/dashboard/newsletters/${newsletter.id}`}
                          title="تعديل"
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <FaEdit />
                        </Link>

                        <button
                          onClick={() => confirmDelete(newsletter)}
                          title="حذف"
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <FaPaperPlane className="text-2xl text-gray-300" />
            </div>
            <p>لا توجد نشرات بريدية</p>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              حذف النشرة البريدية
            </h3>

            <p className="text-gray-500 text-sm mb-6">
              هل أنت متأكد أنك تريد حذف هذه النشرة البريدية؟ لا يمكن التراجع عن
              هذا الإجراء.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium text-sm"
              >
                إلغاء
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors font-medium text-sm"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Newsletter Popup */}
      <NewsletterWizard
        show={isSendPopupOpen}
        setShow={setIsSendPopupOpen}
        newsletterId={newsletterToSend?.id ?? null}
      />
    </div>
  );
}
