import React from 'react'

interface LogoProps {
  size?: number
  color?: string
}

const Logo: React.FC<LogoProps> = ({ size = 32, color = '#FFFFFF' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 主体TV形状 */}
      <rect
        x="6"
        y="8"
        width="20"
        height="16"
        rx="3"
        stroke={color}
        strokeWidth="2"
      />

      {/* 音频波形 */}
      <path
        d="M11 14v4M14 12v8M17 10v12M20 12v8M23 14v4"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* 装饰性天线 */}
      <path
        d="M13 8c0-2 1.5-3 3-3M19 8c0-2-1.5-3-3-3"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default Logo
