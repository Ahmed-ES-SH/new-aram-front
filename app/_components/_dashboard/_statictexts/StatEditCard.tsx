// Stat Edit Card Component
"use client";
export default function StatEditCard({
  stat,
  onEditValue,
  onEditLabel,
}: {
  stat: StatItem;
  onEditValue: () => void;
  onEditLabel: () => void;
}) {
  return (
    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
      <div className="space-y-3">
        <div
          onClick={onEditValue}
          className="cursor-pointer hover:bg-white p-3 rounded-lg transition-all group"
        >
          <span className="text-xs text-gray-500 block">القيمة</span>
          <span className="text-2xl font-bold text-primary group-hover:text-orange-600">
            {stat.value}
          </span>
        </div>
        <div
          onClick={onEditLabel}
          className="cursor-pointer hover:bg-white p-3 rounded-lg transition-all group"
        >
          <span className="text-xs text-gray-500 block">التسمية</span>
          <span className="text-sm text-gray-700 group-hover:text-gray-900">
            {stat.label.ar} / {stat.label.en}
          </span>
        </div>
      </div>
    </div>
  );
}
