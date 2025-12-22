"use client"

import { motion } from "framer-motion"

const data = [
  { label: "Quality", value: 85 },
  { label: "Speed", value: 92 },
  { label: "Reliability", value: 78 },
  { label: "Support", value: 88 },
  { label: "Value", value: 82 },
  { label: "Innovation", value: 90 },
]

export function RadarChart() {
  const center = 120
  const maxRadius = 80
  const levels = 5

  const angleStep = (2 * Math.PI) / data.length

  const getPoint = (value: number, index: number) => {
    const angle = index * angleStep - Math.PI / 2
    const radius = (value / 100) * maxRadius
    const x = center + radius * Math.cos(angle)
    const y = center + radius * Math.sin(angle)
    return { x, y }
  }

  const getLevelPoint = (level: number, index: number) => {
    const angle = index * angleStep - Math.PI / 2
    const radius = (level / levels) * maxRadius
    const x = center + radius * Math.cos(angle)
    const y = center + radius * Math.sin(angle)
    return { x, y }
  }

  return (
    <div className="h-64 flex items-center justify-center">
      <svg width="240" height="240" viewBox="0 0 240 240">
        {/* Grid levels */}
        {Array.from({ length: levels }, (_, level) => (
          <motion.polygon
            key={level}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 0.5, delay: level * 0.1 }}
            points={data
              .map((_, i) => {
                const point = getLevelPoint(level + 1, i)
                return `${point.x},${point.y}`
              })
              .join(" ")}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}

        {/* Grid lines */}
        {data.map((_, index) => {
          const point = getLevelPoint(levels, index)
          return (
            <motion.line
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              x1={center}
              y1={center}
              x2={point.x}
              y2={point.y}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          )
        })}

        {/* Data area */}
        <motion.polygon
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          points={data
            .map((item, i) => {
              const point = getPoint(item.value, i)
              return `${point.x},${point.y}`
            })
            .join(" ")}
          fill="#3b82f6"
          fillOpacity="0.3"
          stroke="#3b82f6"
          strokeWidth="2"
        />

        {/* Data points */}
        {data.map((item, index) => {
          const point = getPoint(item.value, index)
          return (
            <motion.circle
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#3b82f6"
              className="hover:r-6 transition-all cursor-pointer"
            />
          )
        })}

        {/* Labels */}
        {data.map((item, index) => {
          const labelPoint = getLevelPoint(levels + 0.5, index)
          return (
            <text
              key={index}
              x={labelPoint.x}
              y={labelPoint.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs fill-gray-600 font-medium"
            >
              {item.label}
            </text>
          )
        })}
      </svg>
    </div>
  )
}
