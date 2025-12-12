"use client";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { LocaleType } from "@/app/types/_dashboard/GlobalTypes";
import CTAServiceSection from "./CTAServiceSection";
import ServiceTestimonialsSection from "./ServiceTestimonialsSection";

const translations = {
  ar: {
    stats: [
      { number: "24/7", label: "دعم فني" },
      { number: "100k+", label: "عميل يثق فينا" },
      { number: "100%", label: "ضمان الجودة" },
      { number: "500+", label: "عميل سعيد" },
    ],
    testimonialTitle: "ماذا يقول عملاؤنا؟",
    testimonials: [
      {
        name: "أحمد الحسن",
        text: "خدماتهم احترافية للغاية. ساعدوني في تحويل طريقة عرض منتجاتنا واتصال العملاء بنا بطريقة أكثر عصرية",
        rating: 5,
      },
      {
        name: "سارة الحلبي",
        text: "مميزات كثيرة على بطاقة واحدة! أصبح من السهل في شبكة جوجل بفضل بطاقتهم. لم أتصور أن تكون التقييمات بهذه السرعة",
        rating: 5,
      },
      {
        name: "محمد المهندس",
        text: "ممتازة! مع بطاقة الأعمال جعلوني أشارك معلوماتي بسهولة ولا داعي للقلق بعد الآن بشأن نفاذ البطاقات الورقية المهدرة",
        rating: 5,
      },
    ],
    ctaTitle: "جاهز لتطوير أعملك؟",
    ctaSubtitle:
      "انضم للنخبة واحصل على بطاقات NFC الذكية اليوم. عروض خاصة للأعيان والشركات",
    ctaButton1: "اطلب الآن عبر الموقع",
    ctaButton2: "تواصل معنا واتساب",
  },
  en: {
    stats: [
      { number: "24/7", label: "Technical Support" },
      { number: "100k+", label: "Trusted Clients" },
      { number: "100%", label: "Quality Guarantee" },
      { number: "500+", label: "Happy Clients" },
    ],
    testimonialTitle: "What Our Clients Say?",
    testimonials: [
      {
        name: "Ahmed Al Hassan",
        text: "Their services are extremely professional. They helped me transform the way we present our products and connect with customers in a more modern way",
        rating: 5,
      },
      {
        name: "Sarah Al Halabi",
        text: "Many features on one card! It became easy on Google network thanks to their card. I didn't imagine reviews could be this quick",
        rating: 5,
      },
      {
        name: "Mohammed Al Mohandis",
        text: "Excellent! With the business card they made it easy to share my information and no need to worry anymore about running out of wasted paper cards",
        rating: 5,
      },
    ],
    ctaTitle: "Ready to Develop Your Business?",
    ctaSubtitle:
      "Join the elite and get smart NFC cards today. Special offers for notables and companies",
    ctaButton1: "Order Now via Website",
    ctaButton2: "Contact Us on WhatsApp",
  },
};

export default function TestimonialsCTASection() {
  const locale = useLocale() as LocaleType;

  const t = translations[locale];

  return (
    <div
      className={`py-20 bg-linear-to-br from-white via-blue-50 to-purple-50`}
    >
      <div className="container mx-auto px-4">
        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
        >
          {t.stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <motion.h3
                  className="text-4xl font-bold gradient-text mb-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.15 }}
                >
                  {stat.number}
                </motion.h3>
                <p className="text-gray-600 text-sm font-medium">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials Section */}
        <ServiceTestimonialsSection t={t} />

        <CTAServiceSection t={t} />
      </div>
    </div>
  );
}
