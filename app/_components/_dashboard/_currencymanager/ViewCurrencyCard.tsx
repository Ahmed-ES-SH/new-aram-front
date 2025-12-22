import React from "react";
import { LuDollarSign } from "react-icons/lu";
import { CiEdit } from "react-icons/ci";
import { LuTrash2 } from "react-icons/lu";

const ViewCurrencyCard = ({ currency, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
      <div className="flex max-md:flex-col gap-4 max-md:items-start items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-indigo-100 rounded-full p-2 mr-4">
              <LuDollarSign className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {currency.name}
              </h3>
              <p className="text-gray-600">رمز: {currency.code}</p>
            </div>
          </div>
          <div className="mr-14">
            <p className="block my-1">اختصار العملة : {currency.symbol}</p>
            <p className="text-sm text-gray-600">
              سعر الصرف:
              <span dir="ltr" className="font-semibold text-indigo-600">
                {" "}
                1 USD = {Number(currency.exchange_rate).toFixed(3)}{" "}
                {currency.code}
              </span>
            </p>
          </div>
        </div>

        <div className="flex gap-2 max-md:self-end">
          <button
            onClick={onEdit}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-1"
          >
            <CiEdit className="h-4 w-4" />
            تعديل
          </button>
          <button
            onClick={onDelete}
            className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-1"
          >
            <LuTrash2 className="h-4 w-4" />
            حذف
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewCurrencyCard;
