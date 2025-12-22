"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { FiUsers, FiShoppingCart, FiDollarSign, FiAward } from "react-icons/fi";
import { instance } from "@/app/_helpers/axios";
import { useParams } from "next/navigation";

// النوع الأساسي للعضو (User)
interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  // يمكن إضافة خصائص إضافية حسب الحاجة
  avatar?: string;
  created_at?: string;
  updated_at?: string;
  status?: "active" | "inactive" | "suspended";
}

// النوع الأساسي للإحصائيات
interface MemberStats {
  id: number;
  member_id: number;
  member_type: "user" | "organization"; // يمكن توسيعه إذا كان هناك أنواع أخرى
  member: Member;
  purchases: number;
  total_spent: number;
  last_purchase_at: string; // ISO 8601 format
}

export default function TopReferredMembers() {
  const params = useParams();
  const promoterId = params.promoterId;

  const [activities, setActivities] = useState<MemberStats[]>([]);
  const [loading, setLoading] = useState(false);

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "bg-amber-100 text-amber-700 border-amber-300";
    if (rank === 2) return "bg-gray-100 text-gray-700 border-gray-300";
    if (rank === 3) return "bg-orange-100 text-orange-700 border-orange-300";
    return "bg-blue-50 text-blue-700 border-blue-200";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await instance.get(
          `/top-referred-buyers?promoter_type=user&promoter_id=${promoterId}`
        );
        if (response.status == 200) {
          setActivities(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
      className="space-y-4"
    >
      <h2 className="text-xl font-bold text-foreground">
        أفضل العملاء المحالين
      </h2>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {activities.length > 0 ? (
          <div className="divide-y divide-border">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="p-4 hover:bg-gray-200 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {/* Rank Badge */}
                  <div
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold ${getRankBadge(
                      index + 1
                    )}`}
                  >
                    {index < 3 ? <FiAward className="w-5 h-5" /> : index + 1}
                  </div>

                  {/* activity Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">
                      {activity.member.name}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {activity.member.email}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-muted-foreground mb-0.5">
                        <FiShoppingCart className="w-3.5 h-3.5" />
                        <span>المشتريات</span>
                      </div>
                      <p className="font-semibold text-foreground">
                        {activity.purchases}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-muted-foreground mb-0.5">
                        <FiDollarSign className="w-3.5 h-3.5" />
                        <span>الإجمالي</span>
                      </div>
                      <p className="font-semibold text-green-600">
                        {activity.total_spent} ر.ع
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <FiUsers className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              لا يوجد عملاء محالين حتى الآن
            </p>
          </div>
        )}
      </div>
    </motion.section>
  );
}
