"use client"

import { useRouter, usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { FiGlobe } from "react-icons/fi"

interface LanguageSwitcherProps {
  locale: string
}

// Language switcher component
export default function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = () => {
    const newLocale = locale === "en" ? "ar" : "en"
    // Replace the current locale in the pathname
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`)
    router.push(newPath)
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={switchLocale}
      className="fixed top-4 end-4 z-50 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
    >
      <FiGlobe className="w-4 h-4" />
      <span className="text-sm font-medium">{locale === "en" ? "العربية" : "English"}</span>
    </motion.button>
  )
}
