'use client'

import SectionHeading from '@/components/SectionHeading'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

export default function BlessingSection() {
  // 스크롤 애니메이션 훅들
  const firstParagraphAnimation = useScrollAnimation({ threshold: 0.3, animationDelay: 200 })
  const secondParagraphAnimation = useScrollAnimation({ threshold: 0.3, animationDelay: 500 })

  return (
    <section className="w-full min-h-screen flex flex-col justify-center py-12 md:py-16 px-0 font-sans bg-[#FFFEFD]">
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
            {[
              '하나님께서 인도하신 만남 속에서',
              '서로의 깊은 존재를 알아가며',
              '가장 진실한 사랑으로 하나 되고자 합니다.'
            ].map((line) => (
              <p key={line} className="section-description text-sm md:text-base">
                {line}
              </p>
            ))}
          </div>
          <div 
            ref={secondParagraphAnimation.ref}
            className={`space-y-3 md:space-y-4 transition-all duration-800 ${secondParagraphAnimation.animationClass}`}
          >
            {[
              '소중한 분들을 모시고',
              '그 첫걸음을 함께 나누고 싶습니다.',
              '축복으로 함께해 주시면 감사하겠습니다.'
            ].map((line) => (
              <p key={line} className="section-description text-sm md:text-base">
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 