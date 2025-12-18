'use client'

import { useEffect, useMemo, useState } from 'react'
import SectionHeading from '@/components/SectionHeading'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const defaultContent = [
  '지정된 문구 없음 문구를 작성 및 수정해주세요'
].join('\n')

interface ContactPerson {
  id: number
  side: 'groom' | 'bride'
  name: string
  relationship: 'person' | 'father' | 'mother' | 'brother' | 'sister' | 'other'
  phone?: string
}

export default function BlessingSection() {
  const [content, setContent] = useState<string>(defaultContent)
  const [loading, setLoading] = useState(true)
  const [contacts, setContacts] = useState<ContactPerson[]>([])

  const lines = useMemo(() => {
    return content
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line, idx, arr) => line !== '' || (line === '' && arr[idx - 1] !== ''))
  }, [content])

  const firstParagraphAnimation = useScrollAnimation({ threshold: 0.3, animationDelay: 200, disabled: loading })
  const parentsAnimation = useScrollAnimation({ threshold: 0.3, animationDelay: 400, disabled: loading })

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

    const fetchContacts = async () => {
      try {
        const response = await fetch(`/api/contacts?t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        })
        const data = await response.json()
        if (isMounted && data.success && data.data) {
          setContacts(data.data)
        }
      } catch (error) {
        console.error('Error fetching contacts:', error)
      }
    }

    fetchBlessingContent()
    fetchContacts()

    return () => {
      isMounted = false
    }
  }, [])

  // 부모 정보 포맷팅
  const getParentInfo = (side: 'groom' | 'bride') => {
    const sideContacts = contacts.filter(contact => contact.side === side)
    const father = sideContacts.find(c => c.relationship === 'father')
    const mother = sideContacts.find(c => c.relationship === 'mother')
    const person = sideContacts.find(c => c.relationship === 'person')
    
    if (!person) return null
    
    const parentNames = []
    if (father) parentNames.push(father.name)
    if (mother) parentNames.push(mother.name)
    
    if (parentNames.length === 0) return null
    
    const relationship = side === 'groom' ? '아들' : '딸'
    return {
      parents: parentNames.join(' · '),
      relationship,
      name: person.name
    }
  }

  const groomInfo = getParentInfo('groom')
  const brideInfo = getParentInfo('bride')

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

          {/* 구분선 */}
          <div className="flex justify-center my-6 md:my-8">
            <div className="w-12 h-px bg-gray-300"></div>
          </div>

          {/* 부모 정보 */}
          {(groomInfo || brideInfo) && (
            <div 
              ref={parentsAnimation.ref}
              className={`space-y-4 md:space-y-5 transition-all duration-800 ${parentsAnimation.animationClass}`}
            >
              {groomInfo && (
                <div className="text-center">
                  <p className="section-description text-base md:text-lg">
                    {groomInfo.parents}의 {groomInfo.relationship} {groomInfo.name}
                  </p>
                </div>
              )}
              {brideInfo && (
                <div className="text-center">
                  <p className="section-description text-base md:text-lg">
                    {brideInfo.parents}의 {brideInfo.relationship} {brideInfo.name}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
} 