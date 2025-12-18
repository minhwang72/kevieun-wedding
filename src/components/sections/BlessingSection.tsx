'use client'

import { useEffect, useMemo, useState } from 'react'
import SectionHeading from '@/components/SectionHeading'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const defaultContent = [
  '지정된 문구 없음 문구를 작성 및 수정해주세요'
].join('\n')

export default function BlessingSection() {
  const [content, setContent] = useState<string>(defaultContent)
  const [loading, setLoading] = useState(true)

  const lines = useMemo(() => {
    return content
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line, idx, arr) => line !== '' || (line === '' && arr[idx - 1] !== ''))
  }, [content])

  const firstParagraphAnimation = useScrollAnimation({ threshold: 0.3, animationDelay: 200, disabled: loading })

  useEffect(() => {
    let isMounted = true

    const fetchBlessingContent = async () => {
      try {
        const response = await fetch(`/api/blessing?t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        })
        const data = await response.json()
        if (isMounted && data.success && data.data?.content) {
          setContent(data.data.content)
        }
      } catch (error) {
        console.error('Error fetching blessing content:', error)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchBlessingContent()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="w-full min-h-screen flex flex-col justify-center py-12 md:py-16 px-0 font-sans theme-bg-section">
      <div className="max-w-xl mx-auto text-center w-full px-6 md:px-8">
        <SectionHeading
          kicker="Blessing"
          title=""
          size="sm"
        />
        <div className="space-y-6 md:space-y-8 mt-8">
          <div 
            ref={firstParagraphAnimation.ref}
            className={`space-y-3 md:space-y-4 transition-all duration-800 ${firstParagraphAnimation.animationClass}`}
          >
            {lines.map((line, index) => (
              <p key={`${line}-${index}`} className="section-description text-base md:text-lg">
                {line || '\u00A0'}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 