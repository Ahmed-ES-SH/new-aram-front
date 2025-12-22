"use client";
import { getIconComponent } from "@/app/_helpers/helpers";

// Feature Card with Icon
export default function FeatureEditCard({
  feature,
  onEditText,
  onEditIcon,
}: {
  feature: CardsFeature;
  onEditText: () => void;
  onEditIcon: () => void;
}) {
  const IconComponent = getIconComponent(feature.icon_name);

  return (
    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
      <div className="space-y-3">
        <div
          onClick={onEditIcon}
          className="cursor-pointer hover:bg-white p-3 rounded-lg transition-all group flex items-center gap-3"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            {IconComponent && (
              <IconComponent className="text-2xl text-primary" />
            )}
          </div>
          <div>
            <span className="text-xs text-gray-500 block">الأيقونة</span>
            <span className="text-sm text-gray-700">{feature.icon_name}</span>
          </div>
        </div>
        <div
          onClick={onEditText}
          className="cursor-pointer hover:bg-white p-3 rounded-lg transition-all group"
        >
          <span className="text-xs text-gray-500 block">النص</span>
          <span className="text-sm text-gray-700 group-hover:text-gray-900">
            {feature.text.ar} / {feature.text.en}
          </span>
        </div>
      </div>
    </div>
  );
}
