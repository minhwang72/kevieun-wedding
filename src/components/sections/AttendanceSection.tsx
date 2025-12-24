'use client'

import { useState } from 'react'
import SectionHeading from '@/components/SectionHeading'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import AttendanceModal from '@/components/AttendanceModal'

export default function AttendanceSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const titleAnimation = useScrollAnimation({ threshold: 0.4, animationDelay: 200 })
  const contentAnimation = useScrollAnimation({ threshold: 0.3, animationDelay: 400 })

  return (
    <>
      <section className="w-full py-16 md:py-20 px-0 font-sans bg-white">
        <div className="max-w-xl mx-auto text-center w-full px-8">
          <div 
            ref={titleAnimation.ref}
            className={`transition-all duration-800 ${titleAnimation.animationClass}`}
          >
            <SectionHeading
              kicker="RSVP"
              title="참석의사"
              size="sm"
            />
          </div>
          
          <div 
            ref={contentAnimation.ref}
            className={`mt-8 transition-all duration-800 ${contentAnimation.animationClass}`}
          >
            <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-8">
              축하의 마음으로 참석해주시는 모든 분들을 귀하게 모실 수 있도록<br />
              참석의사를 꼭 전달 부탁드립니다.
            </p>
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="theme-button px-8 py-3 rounded-lg font-medium text-sm md:text-base transition-all hover:scale-105"
            >
              참석의사 체크하기
            </button>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <AttendanceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  )
}

