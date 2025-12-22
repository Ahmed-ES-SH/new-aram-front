"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaCheck } from "react-icons/fa";
import { useLocale, useTranslations } from "next-intl";
import { RegistrationStep } from "./types";
import { directionMap } from "@/app/constants/_website/global";
import { useAppSelector } from "@/app/Store/hooks";

interface StepProgressBarProps {
  currentStep: RegistrationStep;
  totalSteps: number;
}

const stepNames = ["account", "info", "scheduling", "media", "offer"] as const;

export function StepProgressBar({
  currentStep,
  totalSteps,
}: StepProgressBarProps) {
  const { width } = useAppSelector((state) => state.variables);

  const t = useTranslations("registration");
  const locale = useLocale();

  // Refs
  const outerRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  // translate state
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  // responsive: use width instead of matchMedia
  const isLg = width >= 1024;

  // function to compute translate to center the target child
  const updateTranslate = () => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const children = Array.from(inner.children) as HTMLElement[];
    const idx = Math.max(0, Math.min(children.length - 1, currentStep - 1));
    const target = children[idx];
    if (!target) return;

    const offsetTop = target.offsetTop;
    const offsetLeft = target.offsetLeft;

    const outerW = outer.clientWidth;
    const outerH = outer.clientHeight;

    const childW = target.clientWidth;
    const childH = target.clientHeight;

    const centerX = outerW / 2 - childW / 2;
    const centerY = outerH / 2 - childH / 2;

    const x = Math.round(centerX - offsetLeft);
    const y = Math.round(centerY - offsetTop);

    setTranslate({ x, y });
  };

  // update on currentStep, width, locale
  useEffect(() => {
    updateTranslate();
    const raf = requestAnimationFrame(updateTranslate);

    return () => {
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, isLg, totalSteps, locale, width]);

  return (
    <div
      ref={outerRef}
      dir={directionMap[locale]}
      className="lg:sticky top-28 max-lg:h-fit h-[80vh] lg:w-64 w-full p-6 bg-card border border-border rounded-xl shadow-lg overflow-hidden"
    >
      {/* inner list (we animate translateX or translateY on it) */}
      <motion.div
        ref={innerRef}
        animate={isLg ? { y: translate.y } : { x: translate.x }}
        transition={{ type: "spring", stiffness: 90, damping: 18 }}
        initial={false}
        className={`flex ${isLg ? "flex-col" : "flex-row"} items-center ${
          isLg ? "gap-6" : "gap-4"
        } relative`}
        style={{ willChange: "transform" }}
      >
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = (index + 1) as RegistrationStep;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const stepName = stepNames[index];

          return (
            <div
              key={stepNumber}
              className="flex flex-col items-center relative"
            >
              {/* Circle */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.28, delay: index * 0.06 }}
                className={`
                  relative flex items-center justify-center w-14 h-14 rounded-full
                  transition-all duration-300 font-semibold shadow-md
                  border-2 border-background
                  ${
                    isCompleted
                      ? "bg-primary text-primary-foreground shadow-primary/25"
                      : isCurrent
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-4 ring-primary/15 border-primary/20"
                      : "bg-muted text-muted-foreground shadow-muted/10"
                  }
                `}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <FaCheck className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <span className="text-sm font-bold">{stepNumber}</span>
                )}

                {isCurrent && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary/40"
                    animate={{ scale: [1, 1.18, 1], opacity: [1, 0, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}
              </motion.div>

              {/* Label */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: index * 0.06 + 0.06 }}
                className={`
                  mt-3 text-xs lg:text-sm font-semibold text-center whitespace-nowrap
                  max-w-[120px] px-2 py-1 rounded-lg transition-colors duration-200
                  ${
                    isCurrent
                      ? "text-foreground bg-primary/10"
                      : isCompleted
                      ? "text-foreground/80"
                      : "text-muted-foreground"
                  }
                `}
              >
                {t(`steps.${stepName}`)}
              </motion.div>

              {/* connector */}
              {index < totalSteps - 1 && (
                <div
                  className={`${
                    isLg ? "w-1 h-12 my-2" : "w-12 h-1 mx-2"
                  } bg-muted/50 relative overflow-hidden rounded-full shadow-inner`}
                >
                  <motion.div
                    initial={{ [isLg ? "height" : "width"]: "0%" }}
                    animate={{
                      [isLg ? "height" : "width"]: isCompleted ? "100%" : "0%",
                    }}
                    transition={{ duration: 0.45, delay: index * 0.06 }}
                    className={`absolute inset-0 ${
                      isLg ? "bg-gradient-to-b" : "bg-gradient-to-r"
                    } from-primary to-primary/80 rounded-full shadow-sm`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
