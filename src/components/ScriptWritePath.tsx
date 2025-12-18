'use client'

import { useEffect, useState, useRef } from 'react'

type Props = {
  pathData: string // 단일 문자열로 된 path 데이터
  viewBox: string // 데이터에 맞는 viewBox
  className?: string
  color?: string
  strokeWidth?: number // 선 두께 (중요)
  durationMs?: number // 그리는 데 걸리는 시간
  delayMs?: number // 시작 전 딜레이
  fillDelayRatio?: number // stroke 완료 후 fill 시작 비율 (0-1, 기본값 0.7)
}

export default function ScriptWritePath({
  pathData,
  viewBox,
  className = '',
  color = '#F5F5DC',
  strokeWidth = 1.5, // 기본적으로 얇게 설정
  durationMs = 2000,
  delayMs = 0,
  fillDelayRatio = 0.7, // stroke 완료 후 fill 시작 비율
}: Props) {
  const pathRef = useRef<SVGPathElement>(null)
  const [length, setLength] = useState(0)

  // Path의 전체 길이를 측정합니다.
  useEffect(() => {
    if (pathRef.current) {
      const totalLength = pathRef.current.getTotalLength()
      setLength(totalLength)
    }
  }, [pathData])

  // Fill 애니메이션 시작 시간 계산
  const fillStartDelay = delayMs + durationMs * fillDelayRatio
  const fillDuration = durationMs * (1 - fillDelayRatio)

  // 애니메이션 없이 바로 표시 (durationMs가 0이면)
  const showImmediately = durationMs === 0

  return (
    <svg
      viewBox={viewBox}
      className={className}
      fill="none"
      style={{ overflow: 'visible' }}
    >
      {/* CSS 애니메이션 정의 */}
      <style>{`
        @keyframes draw-stroke {
          to { stroke-dashoffset: 0; }
        }
        @keyframes fill-path {
          from { fill-opacity: 0; }
          to { fill-opacity: 1; }
        }
      `}</style>

      <path
        ref={pathRef}
        d={pathData}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={color} // 글씨 채우기 추가
        // 애니메이션이 없으면 바로 표시
        strokeDasharray={showImmediately ? 'none' : length}
        strokeDashoffset={showImmediately ? 0 : length}
        style={{
          // 배경 위에서 잘 보이도록 그림자 추가
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))',
          // Stroke 애니메이션: durationMs가 0이면 애니메이션 없음
          animation: showImmediately 
            ? 'none'
            : (length > 0 
              ? `draw-stroke ${durationMs}ms ease-in-out ${delayMs}ms forwards, fill-path ${fillDuration}ms ease-in ${fillStartDelay}ms forwards`
              : 'none'),
          fillOpacity: showImmediately ? 1 : 0, // 애니메이션 없으면 바로 채움
        }}
      />
    </svg>
  )
}
