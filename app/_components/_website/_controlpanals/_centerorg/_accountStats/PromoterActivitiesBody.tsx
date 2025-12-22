import { easeOut, motion } from "framer-motion";
import { ActivityData } from "./PromoterActivitiesTable";
import {
  FaShoppingCart,
  FaEye,
  FaLink,
  FaUser,
  FaMobile,
  FaTabletAlt,
  FaDesktop,
} from "react-icons/fa";
import { useLocale } from "next-intl";

interface props {
  data: ActivityData[];
  t: any;
}

export default function PromoterActivitiesBody({ data, t }: props) {
  const locale = useLocale();

  // Get activity type icon
  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "purchase":
        return <FaShoppingCart className="w-4 h-4" />;
      case "visit":
        return <FaEye className="w-4 h-4" />;
      case "referral":
        return <FaLink className="w-4 h-4" />;
      default:
        return <FaUser className="w-4 h-4" />;
    }
  };

  // Get device type icon
  const getDeviceIcon = (type: string) => {
    if (type == null || type == undefined || typeof type !== "string")
      return "_";
    switch (type.toLowerCase()) {
      case "mobile":
        return <FaMobile className="w-4 h-4" />;
      case "tablet":
        return <FaTabletAlt className="w-4 h-4" />;
      case "desktop":
        return <FaDesktop className="w-4 h-4" />;
      default:
        return "_";
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === "en" ? "en-US" : "ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format commission
  const formatCommission = (amount: number | null) => {
    if (amount == null || amount == undefined || typeof amount !== "number")
      return "—";
    return `${amount.toFixed(2)} ${locale === "en" ? "Points" : "نقاط"}`;
  };

  // Row animation variants
  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: easeOut },
    },
  };

  if (data.length == 0) {
    return (
      <tbody>
        <tr>
          <td colSpan={12} className="py-12 text-center">
            <div className="flex w-full h-[70vh] py-20 justify-center items-center">
              <p className="text-muted-foreground text-lg">{t("noData")}</p>
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <>
      {/* Table Body */}
      <tbody>
        {data.map((row, index) => (
          <motion.tr
            key={row.id}
            variants={rowVariants}
            whileHover="hover"
            custom={index}
            className="not-last:border-b border-border hover:bg-muted/50 transition-colors cursor-pointer"
          >
            {/* ID Column */}
            <td className="px-6 py-4 text-sm text-foreground font-medium">
              #{row.id}
            </td>

            {/* Activity Type Column */}
            <td className="px-6 py-4 text-sm text-foreground">
              <div className="flex items-center gap-2">
                <span className="text-primary">
                  {getActivityIcon(row.activity_type)}
                </span>
                <span className="capitalize">{row.activity_type}</span>
              </div>
            </td>

            {/* Referral Code Column */}
            <td className="px-6 py-4 text-sm text-foreground font-mono font-semibold">
              {row.ref_code}
            </td>

            {/* Commission Column */}
            <td className="px-6 py-4 text-sm text-foreground font-semibold">
              {formatCommission(Number(row.commission_amount))}
            </td>

            {/* device type Column */}
            <td className="px-6 py-4 text-primary text-xs flex items-center gap-1 font-semibold">
              {getDeviceIcon(row.device_type)}
              <span className="capitalize">{row.device_type}</span>
            </td>

            {/* Created Date Column */}
            <td className="px-6 py-4 text-sm text-muted-foreground">
              {formatDate(row.created_at)}
            </td>
          </motion.tr>
        ))}
      </tbody>
    </>
  );
}
