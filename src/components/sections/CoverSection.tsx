'use client'

import { useState, useEffect } from 'react'
import { COVER_PATHS } from './CoverSectionPaths'

interface CoverSectionProps {
  imageUrl?: string
  isLoading?: boolean
}

export default function CoverSection({ imageUrl: propImageUrl = '', isLoading: propIsLoading = true }: CoverSectionProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [svgAnimationStarted, setSvgAnimationStarted] = useState(false)

  const hasImage = Boolean(propImageUrl)
  const isLoading = propIsLoading || (hasImage && !imageLoaded) // 이미지가 없으면 로딩 상태 아님

  // 이미지가 로드되면 SVG 애니메이션 시작
  useEffect(() => {
    if (hasImage && imageLoaded && !svgAnimationStarted) {
      setSvgAnimationStarted(true)
    }
  }, [hasImage, imageLoaded, svgAnimationStarted])


  const overlayTextShadow = { textShadow: '1px 1px 1px rgba(0,0,0,0.3)' }
  const beigeColor = '#F5F5DC' // 베이지색 (beige)
  const ivoryColor = '#fff0d0' // 아이보리 (ivory)



  return (
    <section className="w-full min-h-screen">
      <div className="relative w-full min-h-screen flex flex-col">
        <div className="absolute inset-0">
          {/* Loading Skeleton */}
          {isLoading && (
            <div className="absolute inset-0 z-20 w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {hasImage ? (
            <img
              src={propImageUrl}
              alt="Wedding Cover"
              className={`w-full h-full object-cover transition-opacity duration-700 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
              onLoad={() => setImageLoaded(true)}
            />
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

        {/* Brush Texture SVG - 이미지 로드 후 애니메이션 시작 */}
        {svgAnimationStarted && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 translate-y-24">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 452 196" className="w-[80%] md:w-[100%]">
              <g>
                {COVER_PATHS.map((pathD, index) => (
                  <path
                    key={index}
                    d={pathD}
                    fill={ivoryColor}
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
        )}

        <div
          className={`relative z-10 flex flex-col flex-1 px-6 md:px-12 py-10 text-white transition-opacity duration-700 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
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
