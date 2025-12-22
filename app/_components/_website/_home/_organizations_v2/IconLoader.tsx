// components/icons/IconLoader.tsx
import React from "react";
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";
import * as HiIcons from "react-icons/hi";
import * as IoIcons from "react-icons/io5";
import { IconType } from "react-icons";

interface IconLoaderProps {
  iconName: string;
  className?: string;
}

const IconLoader: React.FC<IconLoaderProps> = ({
  iconName,
  className = "w-5 h-5",
}) => {
  const iconLibraries: Record<string, any> = {
    Fa: FaIcons,
    Md: MdIcons,
    Hi: HiIcons,
    Io: IoIcons,
  };

  const getIcon = (name: string): IconType | null => {
    const prefix = name.substring(0, 2);
    const library = iconLibraries[prefix];

    if (library && library[name]) {
      return library[name] as IconType;
    }

    // Fallback to Fa icons if not found
    if (FaIcons[name as keyof typeof FaIcons]) {
      return FaIcons[name as keyof typeof FaIcons] as IconType;
    }

    return FaIcons.FaQuestionCircle as IconType;
  };

  const IconComponent = getIcon(iconName);

  if (!IconComponent) return null;

  return <IconComponent className={className} />;
};

export default IconLoader;
