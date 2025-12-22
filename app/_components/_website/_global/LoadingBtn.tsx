import { getIconComponent } from "@/app/_helpers/helpers";
import React from "react";
import { VscLoading } from "react-icons/vsc";

interface props {
  className: string;
  loadingState: boolean;
  onClick?: () => void;
  text: string;
  iconName?: string;
  iconStyle?: string;
  loadingIconStyle?: string;
}

export default function LoadingBtn({
  className,
  loadingState,
  onClick,
  text,
  iconStyle,
  iconName,
  loadingIconStyle,
}: props) {
  const Icon = iconName ? getIconComponent(iconName) : null;

  return (
    <button
      onClick={onClick}
      className={`${className} flex items-center justify-center`}
    >
      <div className="flex items-center gap-1">
        {loadingState ? (
          <VscLoading
            className={`text-white animate-spin ${loadingIconStyle}`}
          />
        ) : (
          <>
            {Icon && <Icon className={iconStyle} />}
            <p>{text}</p>
          </>
        )}
      </div>
    </button>
  );
}
