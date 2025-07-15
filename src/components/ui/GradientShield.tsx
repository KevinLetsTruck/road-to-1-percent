import React from 'react'

interface GradientShieldProps {
  className?: string
  width?: number
  height?: number
}

export default function GradientShield({ className = '', width = 100, height = 100 }: GradientShieldProps) {
  return (
    <svg 
      className={className}
      width={width} 
      height={height} 
      viewBox="0 0 1073.5 1119.5" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <style>
          {`
            .st0 {
              fill: url(#linear-gradient1);
            }
            .st1 {
              fill: url(#linear-gradient);
            }
          `}
        </style>
        <linearGradient id="linear-gradient" x1="536.75" y1="683.3" x2="536.75" y2="1120" gradientTransform="translate(0 1120) scale(1 -1)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ff9d00"/>
          <stop offset="1" stopColor="#ed5500"/>
        </linearGradient>
        <linearGradient id="linear-gradient1" x1="536.75" y1="543.6" x2="536.75" y2=".6" gradientTransform="translate(0 1120) scale(1 -1)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#434448"/>
          <stop offset="1" stopColor="#6c6d73"/>
        </linearGradient>
      </defs>
      <path className="st1" d="M140.6,436.7c2.4-32.2,7.6-65.1,15.7-98.2,9.4-38.6,22.5-77.6,39.1-116,4-9.3,8.2-18.5,12.6-27.7,42.5,15.9,88.8,24,137.9,24,51.8,0,102.4-7.8,150.4-23.2,13.7-4.4,27.1-9.4,40.2-14.9,13,5.5,26.5,10.6,40.3,15,47.9,15.3,98.6,23.1,150.7,23.1s96.2-8.2,139-24.3c4,8.2,7.8,16.5,11.5,24.8,16.6,37.8,29.8,76.6,39.1,115.5,8.2,34,13.6,68.2,15.9,101.9h139.4c-5.1-91.5-27.6-183.3-67.1-273.3-33.9-77.4-69.2-126.1-73-131.3L909,.2l-24.2,22.5c-27.9,26-77.9,57-157.4,57-86.4,0-147-29.5-175.5-47.1l-15.4-9.5-15.4,9.5c-28.7,17.6-89.6,47.2-175.1,47.2-79.2,0-129.2-31-157.3-57L164.1,0l-23.1,32.5C135.6,40.1,14.4,211.6,1.1,436.7h139.5Z"/>
      <path className="st0" d="M922.3,576.4c-8.6,34.7-21.7,68.5-39.2,101.1-35.5,65.7-89.1,126.8-159.4,181.4-72.5,56.4-144.6,92.4-187,111.1-42.5-18.7-114.7-54.8-187.1-111.1-70.2-54.7-123.8-115.7-159.3-181.5-17.5-32.6-30.6-66.3-39.2-101H8.9c26.8,148,113.7,282.1,255.3,392.3,128.9,100.3,255.2,144.6,260.4,146.4l12.4,4.3,11.7-4.3c8.9-3.1,132.6-47,260.4-146.4,141.7-110.2,228.7-244.3,255.5-392.3h-142.3Z"/>
    </svg>
  )
} 