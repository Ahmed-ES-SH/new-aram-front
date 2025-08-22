"use client";
import EditCurrencyCard from "@/app/_components/_dashboard/_currencymanager/EditCurrencyCard";
import ViewCurrencyCard from "@/app/_components/_dashboard/_currencymanager/ViewCurrencyCard";
import ErrorAlart from "@/app/_components/_popups/ErrorAlart";
import SuccessAlart from "@/app/_components/_popups/SuccessAlart";
import LoadingSpin from "@/app/_components/LoadingSpin";
import { instance } from "@/app/_helpers/axios";
import React, { useState, useEffect } from "react";
import { LuDollarSign, LuPlus } from "react-icons/lu";

type Currency = {
  id: number;
  name: string;
  code: string;
  symbol: string;
  exchange_rate: number;
  is_default: boolean;
};

const inputClass =
  "w-full outline-none px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors";

const fields = [
  {
    label: "اسم العملة",
    name: "name",
    placeholder: "e.g., US Dollar",
    type: "text",
    maxLength: undefined,
  },
  {
    label: "رمز العملة",
    name: "code",
    placeholder: "e.g., USD",
    type: "text",
    maxLength: 3,
  },
  {
    label: "إختصار العملة",
    name: "symbol",
    placeholder: "e.g., $",
    type: "text",
    maxLength: 3,
  },
  {
    label: "سعر الصرف",
    name: "exchange_rate",
    placeholder: "e.g., 1.00",
    type: "number",
    step: "0.01",
  },
];

const CurrencyManager: React.FC = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    symbol: "",
    exchange_rate: "",
  });
  const [editData, setEditData] = useState({
    name: "",
    code: "",
    symbol: "",
    exchange_rate: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorPopup, setErrorPopup] = useState(false);
  const [successPopup, setSuccessPopup] = useState(false);

  const loadCurrencies = async () => {
    try {
      const response = await instance.get(`/currencies`);
      if (response.status == 200) {
        const data = response.data.data;
        setCurrencies(data);
      }
    } catch (error) {
      console.error("Error loading currencies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCurrency = async () => {
    if (!formData.name || !formData.code || !formData.exchange_rate) return;

    try {
      setLoading(true);
      const data = {
        name: formData.name,
        code: formData.code.toUpperCase(),
        symbol: formData.symbol,
        exchange_rate: parseFloat(formData.exchange_rate),
      };
      const response = await instance.post(`/dashboard/add-currency`, data);
      if (response.status == 201) {
        const newCurrency = response.data.data;
        setCurrencies([...currencies, newCurrency]);
        setFormData({ name: "", code: "", symbol: "", exchange_rate: "" });
        setSuccessPopup(true);
        setSuccessMessage("تم إضافة العملة بنجاح");
      }
    } catch (error: any) {
      console.error("Error creating currency:", error);
      if (error.response.data.message) {
        setErrorPopup(true);
        setErrorMessage(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditStart = (currency: Currency) => {
    setEditingId(currency.id);
    setEditData({
      name: currency.name,
      code: currency.code,
      symbol: currency.symbol,
      exchange_rate: currency.exchange_rate.toString(),
    });
  };

  const handleEditSave = async (id: number) => {
    if (!editData.name || !editData.code || !editData.exchange_rate) return;

    const Editdata = {
      name: editData.name,
      code: editData.code.toUpperCase(),
      symbol: editData.symbol,
      exchange_rate: parseFloat(editData.exchange_rate),
    };

    try {
      setLoading(true);
      const response = await instance.post(
        `/dashboard/update-currency/${id}`,
        Editdata
      );
      if (response.status == 200) {
        const updatedCurrency = response.data.data;
        setCurrencies(
          currencies.map((c) => (c.id === id ? updatedCurrency : c))
        );
        setEditingId(null);
        setSuccessPopup(true);
        setSuccessMessage("تم تعديل العملة بنجاح");
      }
    } catch (error: any) {
      console.error("Error creating currency:", error);
      if (error.response.data.message) {
        setErrorPopup(true);
        setErrorMessage(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditData({ name: "", code: "", symbol: "", exchange_rate: "" });
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      const response = await instance.delete(`/dashboard/currencies/${id}`);
      if (response.status == 200) {
        setCurrencies(currencies.filter((c) => c.id !== id));
        setSuccessPopup(true);
        setSuccessMessage("تم حذف العملة بنجاح");
      }
    } catch (error: any) {
      console.error("Error creating currency:", error);
      if (error.response.data.message) {
        setErrorPopup(true);
        setErrorMessage(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Load currencies on component mount
  useEffect(() => {
    loadCurrencies();
  }, []);

  if (loading) return <LoadingSpin />;

  return (
    <>
      <div dir="rtl" className="min-h-screen  p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <LuDollarSign className="h-10 w-10 text-indigo-600 mr-3" />
              <h1 className="text-4xl font-bold text-gray-900">مدير العملات</h1>
            </div>
            <p className="text-gray-600">قم بإدارة أسعار صرف العملات بسهولة</p>
          </div>

          {/* Add New Currency Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <LuPlus className="h-5 w-5 mr-2 text-indigo-600" />
              أضف عملة جديدة
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={(formData as any)[field.name]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [field.name]:
                          field.type === "number"
                            ? parseFloat(e.target.value)
                            : e.target.value,
                      })
                    }
                    placeholder={field.placeholder}
                    maxLength={field.maxLength}
                    step={(field as any).step}
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
            <div className="flex items-end mt-6 max-w-xl mx-auto">
              <button
                onClick={handleAddCurrency}
                className="w-full outline-none bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center"
              >
                <LuPlus className="h-4 w-4 mr-2" />
                أضف العملة
              </button>
            </div>
          </div>

          {/* Currency List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              عدد العملات ({currencies.length} عملات)
            </h2>
            {currencies.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <LuDollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  لا توجد عملات متاحة. أضف واحدة لتبدأ!
                </p>
              </div>
            ) : (
              currencies.map((currency) => (
                <div key={currency.id}>
                  {editingId === currency.id ? (
                    <EditCurrencyCard
                      editData={editData}
                      onChange={setEditData}
                      onSave={() => handleEditSave(currency.id)}
                      onCancel={handleEditCancel}
                    />
                  ) : (
                    <ViewCurrencyCard
                      currency={currency}
                      onEdit={() => handleEditStart(currency)}
                      onDelete={() => handleDelete(currency.id)}
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <SuccessAlart
        showAlart={successPopup}
        Message={successMessage}
        onClose={() => setSuccessPopup(false)}
      />

      <ErrorAlart
        showAlart={errorPopup}
        Message={errorMessage}
        onClose={() => setErrorPopup(false)}
      />
    </>
  );
};

export default CurrencyManager;
