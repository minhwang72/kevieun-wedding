'use client'

import { useState, useEffect } from 'react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { COVER_PATHS } from './CoverSectionPaths'

export default function CoverSection() {
  const [imageUrl, setImageUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const photoAnimation = useScrollAnimation({ threshold: 0.2, animationDelay: 400 })

  useEffect(() => {
    const fetchCoverImage = async () => {
      try {
        // 타임아웃 설정 (10초)
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000)

        const response = await fetch('/api/cover-image', {
          signal: controller.signal
        })
        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const data = await response.json()
        if (data.success && data.data?.url) {
          setImageUrl(data.data.url)
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.error('Error fetching cover image: Request timeout')
        } else {
          console.error('Error fetching cover image:', error)
        }
        // 에러 발생 시 기본 이미지 사용 (무한 로딩 방지)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCoverImage()
  }, [])


  const hasImage = Boolean(imageUrl)
  const overlayTextShadow = { textShadow: '1px 1px 1px rgba(0,0,0,0.3)' }
  const beigeColor = '#F5F5DC' // 베이지색 (beige)
  const ivoryColor = '#fff0d0' // 아이보리 (ivory)



  return (
    <section className="w-full min-h-screen">
      <div className="relative w-full min-h-screen flex flex-col">
        <div className="absolute inset-0">
          {isLoading ? (
            <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          ) : hasImage ? (
            <img src={imageUrl} alt="Wedding Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center gap-4 border border-dashed border-gray-200 text-center px-6">
              <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm text-gray-500">커버 사진을 준비 중입니다.</p>
            </div>
          )}

        </div>

        {/* Brush Texture SVG */}
        {/* 1. 위치 수정: translate-y 값을 조절하여 아래로 내림 */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 translate-y-24">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 452 196" className="w-[80%] md:w-[60%]"> {/* 3. 크기도 조절 가능 */}
            <g>
              {COVER_PATHS.map((pathD, index) => (
                <path
                  key={index}
                  d={pathD}
                  fill={ivoryColor}
                  /* 2. 두께 수정: stroke를 제거하여 본래의 얇은 벡터 상태로 복원 */
                  style={{
                    opacity: 0,
                    animation: `fadeIn 0.5s ease-out forwards`,
                    animationDelay: `${(index * 100) + 200}ms`
                  }}
                />
              ))}
            </g>
          </svg>
        </div>

        <div
          ref={photoAnimation.ref}
          className={`relative z-10 flex flex-col flex-1 px-6 md:px-12 py-10 text-white transition-opacity duration-700 ${photoAnimation.animationClass}`}
        >


          {/* Bottom Info & Quote */}
          <div className="absolute bottom-20 md:bottom-24 left-0 right-0 text-center pb-8 z-20 px-8" style={{ ...overlayTextShadow, color: beigeColor }}>
            <p className="text-sm md:text-lg tracking-[0.2em] font-heading uppercase mb-1">
              - Sat, Jun 13th, 2026 -
            </p>
            <div>
              <p className="text-base md:text-xl font-heading mb-1">
                Forever begins with a single step,
              </p>
              <p className="text-base md:text-xl font-heading">
                And love guides us every step of the way.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
