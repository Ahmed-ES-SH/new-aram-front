import React from "react";
import { LuSave, LuX } from "react-icons/lu";

const EditCurrencyCard = ({ editData, onChange, onSave, onCancel }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...editData, [name]: value });
  };

  return (
    <div className="bg-gray-50 py-2 px-1 rounded-md shadow-md">
      <div className="flex max-md:flex-col items-center justify-between gap-4 ">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            اسم العملة
          </label>
          <input
            type="text"
            name="name"
            value={editData.name}
            onChange={handleChange}
            className="w-full outline-none px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            رمز العملة
          </label>
          <input
            type="text"
            name="code"
            value={editData.code}
            onChange={handleChange}
            maxLength={3}
            className="w-full outline-none px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            اختصار العملة
          </label>
          <input
            type="text"
            name="code"
            value={editData.symbol}
            onChange={handleChange}
            maxLength={3}
            className="w-full outline-none px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            سعر الصرف
          </label>
          <input
            type="number"
            step="0.01"
            name="exchange_rate"
            value={editData.exchange_rate}
            onChange={handleChange}
            className="w-full outline-none px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>
      <div className="flex mt-3 max-w-xl mx-auto gap-2">
        <button
          onClick={onSave}
          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
        >
          <LuSave className="h-4 w-4 mr-2" />
          حفظ
        </button>
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center justify-center"
        >
          <LuX className="h-4 w-4 mr-2" />
          إلغاء
        </button>
      </div>
    </div>
  );
};

export default EditCurrencyCard;
