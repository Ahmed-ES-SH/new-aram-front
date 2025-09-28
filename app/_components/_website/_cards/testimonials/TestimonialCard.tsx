"use client";

import { motion } from "framer-motion";
import { FaQuoteLeft } from "react-icons/fa";
import Img from "../../_global/Img";
import { Testimonial } from "./TestimonialsSection";

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
}

export function TestimonialCard({ testimonial, index }: TestimonialCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ scale: 1.05 }}
      className="h-full"
    >
      <div className="p-6 h-fit flex flex-col justify-between bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <FaQuoteLeft className="text-blue-600 text-xl flex-shrink-0 mt-1" />
            <blockquote className="text-gray-600 leading-relaxed">
              {`"${testimonial.feedback}"`}
            </blockquote>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-200/30">
          <div className="relative h-12 w-12 rounded-full overflow-hidden bg-blue-50 flex items-center justify-center">
            {testimonial.avatar ? (
              <Img
                src={testimonial.avatar || "/placeholder.svg"}
                alt={testimonial.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-blue-600 font-semibold text-sm">
                {getInitials(testimonial.name)}
              </span>
            )}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
            <p className="text-sm text-gray-600">
              {testimonial.role}
              {testimonial.company && (
                <span className="text-blue-600"> at {testimonial.company}</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
