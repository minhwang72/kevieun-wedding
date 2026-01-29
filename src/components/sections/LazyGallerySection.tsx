import { useState, useEffect } from 'react'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import GallerySection from './GallerySection'
import type { Gallery } from '@/types'

// 갤러리 로딩 스켈레톤
const GalleryLoading = () => (
  <section className="w-full min-h-screen flex flex-col justify-center py-12 md:py-16 px-0 font-sans theme-bg-main">
    <div className="max-w-xl mx-auto text-center w-full px-6 md:px-8">
      {/* 제목 스켈레톤 */}
      <div className="h-10 bg-gray-200 rounded animate-pulse mb-12 md:mb-16 w-40 mx-auto"></div>

      {/* 상단 가로선 */}
      <div className="w-full h-px bg-gray-200 mb-6 md:mb-8"></div>

      {/* 갤러리 그리드 스켈레톤 */}
      <div className="grid grid-cols-3 gap-0.5 md:gap-1 mb-6 md:mb-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded"></div>
        ))}
      </div>

      {/* 하단 가로선 */}
      <div className="w-full h-px bg-gray-200"></div>
    </div>
  </section>
)

interface LazyGallerySectionProps {
  gallery?: Gallery[]
}

export default function LazyGallerySection({ gallery: propGallery = [] }: LazyGallerySectionProps) {
  const [isVisible, setIsVisible] = useState(false)

  const { ref, shouldLoad } = useIntersectionObserver({
    rootMargin: '200px',
    threshold: 0.1,
    triggerOnce: true
  })

  useEffect(() => {
    if (shouldLoad) {
      setIsVisible(true)
    }
  }, [shouldLoad])

  return (
    <div ref={ref}>
      {isVisible ? (
        <GallerySection gallery={propGallery} />
      ) : (
        <GalleryLoading />
      )}
    </div>
  )
} 