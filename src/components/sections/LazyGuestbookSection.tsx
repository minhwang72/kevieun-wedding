import { useState, useEffect, useCallback } from 'react'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import GuestbookSection from './GuestbookSection'
import type { Guestbook } from '@/types'

// API 응답 캐시 (방명록 업데이트용)
interface CacheData {
  data: unknown
  timestamp: number
}

const apiCache = new Map<string, CacheData>()
const CACHE_DURATION = 5 * 60 * 1000 // 5분

// 캐시된 API 호출 함수 (방명록 업데이트용)
const fetchWithCache = async (url: string, forceRefresh = false) => {
  const now = Date.now()
  const cached = apiCache.get(url)

  if (!forceRefresh && cached && now - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000)

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const data = await response.json()
    apiCache.set(url, { data, timestamp: now })
    return data
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Error fetching guestbook: Request timeout')
    } else {
      console.error('Error fetching guestbook:', error)
    }
    throw error
  }
}

// 방명록 로딩 스켈레톤
const GuestbookLoading = () => (
  <section className="w-full min-h-screen flex flex-col justify-center py-12 md:py-16 px-0 font-sans theme-bg-main">
    <div className="w-full">
      <div className="p-6 md:p-8">
        <div className="h-8 bg-gray-200 rounded animate-pulse mb-6 md:mb-8 w-32 mx-auto"></div>
        <div className="flex justify-end mb-6">
          <div className="h-10 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 bg-white rounded-2xl border border-gray-100 shadow-lg">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 pr-2 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </div>
                <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="flex justify-between items-center">
                <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
)

interface LazyGuestbookSectionProps {
  guestbook?: Guestbook[]
}

export default function LazyGuestbookSection({ guestbook: propGuestbook = [] }: LazyGuestbookSectionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [guestbook, setGuestbook] = useState<Guestbook[]>(propGuestbook)

  const { ref, shouldLoad } = useIntersectionObserver({
    rootMargin: '200px',
    threshold: 0.1,
    triggerOnce: true
  })

  // propGuestbook이 변경되면 업데이트
  useEffect(() => {
    setGuestbook(propGuestbook)
  }, [propGuestbook])

  useEffect(() => {
    if (shouldLoad) {
      setIsVisible(true)
    }
  }, [shouldLoad])

  // 방명록 데이터를 다시 가져오는 함수 (캐시 무시)
  const fetchGuestbook = useCallback(async () => {
    try {
      console.log('🔍 [DEBUG] Forcing guestbook refresh')
      // 강제로 최신 데이터 가져오기 (캐시 무시)
      const guestbookData = await fetchWithCache('/api/guestbook', true)

      if (guestbookData && typeof guestbookData === 'object' && 'success' in guestbookData && guestbookData.success) {
        setGuestbook((guestbookData as { data: Guestbook[] }).data || [])
        console.log('✅ [DEBUG] Guestbook updated with fresh data')
      }
    } catch (error) {
      console.error('Error fetching guestbook:', error)
    }
  }, [])

  return (
    <div ref={ref}>
      {isVisible ? (
        <GuestbookSection guestbook={guestbook} onGuestbookUpdate={fetchGuestbook} />
      ) : (
        <GuestbookLoading />
      )}
    </div>
  )
} 