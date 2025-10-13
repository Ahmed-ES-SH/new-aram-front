import Img from "@/app/_components/_website/_global/Img";
import { AvatarProps } from "./types";

export default function Avatar({ user, size = "sm" }: AvatarProps) {
  const sizes: Record<string, string> = {
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg",
  };

  const classes = `flex shrink-0 items-center justify-center rounded-full bg-gray-100 ${sizes[size]} overflow-hidden`;

  if (user.image) {
    return (
      <Img
        src={user.image}
        alt={user.name}
        className={`${classes} object-cover`}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
    );
  }

  const initials = getInitials(user.name);
  return <div className={classes + " text-gray-700"}>{initials}</div>;
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
