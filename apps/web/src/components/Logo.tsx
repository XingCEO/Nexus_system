'use client'

import { motion } from 'framer-motion'

/**
 * 超級系統 Logo
 *
 * 設計理念：
 * - 霸氣幾何造型：兩個交錯的粗體方塊形成 S 形流動
 * - 象徵「超級」：向上突破的力量感
 * - 象徵「系統」：結構化的幾何堆疊
 * - 象徵「記憶」：連續流動、永不中斷的視覺語言
 * - 純淨去背：無需背景框架，獨立存在即具備識別度
 * - 任何尺寸皆清晰可辨，從 favicon 到大型展示皆適用
 *
 * 動畫流程（5秒循環）：
 * 1. 靜止原狀 (30%) - 0~1.5s
 * 2. 分離滑開 (15%) - 1.5~2.25s
 * 3. 保持分離 (10%) - 2.25~2.75s
 * 4. 滑回合體 (15%) - 2.75~3.5s
 * 5. 靜止原狀 (30%) - 3.5~5s
 */

// 上半部 L 形路徑
const topPath = "M6 4 L22 4 L22 14 L10 14 L10 18 L6 18 Z"
// 下半部 L 形路徑
const bottomPath = "M22 14 L26 14 L26 28 L10 28 L10 18 L22 18 Z"

// 動畫 easing（來自 design-system）
const easing = [0.4, 0, 0.2, 1] // smooth

// 動畫時間軸 keyframes
const times = [0, 0.30, 0.45, 0.55, 0.70, 1]

export function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 霸氣 S 形幾何 - 兩個交錯方塊 */}
      <path
        d="M6 4 L22 4 L22 14 L26 14 L26 28 L10 28 L10 18 L6 18 Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function LogoMark({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 與 Logo 相同的設計 */}
      <path
        d="M6 4 L22 4 L22 14 L26 14 L26 28 L10 28 L10 18 L6 18 Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function AnimatedLogo({ className = "w-24 h-24" }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 上半部 L 形 - 往右上滑開再回來 */}
      {/* 動畫：靜止(30%) → 分離(15%) → 保持(10%) → 滑回(15%) → 靜止(30%) */}
      <motion.path
        d={topPath}
        fill="currentColor"
        animate={{
          x: [0, 0, 4, 4, 0, 0],
          y: [0, 0, -4, -4, 0, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: easing,
          times: times,
        }}
      />

      {/* 下半部 L 形 - 往左下滑開再回來 */}
      <motion.path
        d={bottomPath}
        fill="currentColor"
        animate={{
          x: [0, 0, -4, -4, 0, 0],
          y: [0, 0, 4, 4, 0, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: easing,
          times: times,
        }}
      />
    </motion.svg>
  )
}

export function LogoWithText({ className = "h-8" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Logo className="h-full w-auto" />
      <span className="text-lg font-bold tracking-tight">NEXUS</span>
    </div>
  )
}
