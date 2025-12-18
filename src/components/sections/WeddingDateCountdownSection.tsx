'use client'

import { useState, useEffect } from 'react'
import SectionHeading from '@/components/SectionHeading'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

export default function WeddingDateCountdownSection() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [animate, setAnimate] = useState(false)

  // 스크롤 애니메이션 훅들
  const titleAnimation = useScrollAnimation({ threshold: 0.4, animationDelay: 200 })
  const calendarAnimation = useScrollAnimation({ threshold: 0.3, animationDelay: 400 })
  const countdownAnimation = useScrollAnimation({ threshold: 0.25, animationDelay: 600 })

  // 카운트다운 계산
  useEffect(() => {
    const weddingDate = new Date('2026-06-13T13:00:00+09:00')

    const calculateTimeLeft = () => {
      const now = new Date()
      const difference = weddingDate.getTime() - now.getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      } else {
        const elapsed = Math.abs(difference)
        setTimeLeft({
          days: Math.floor(elapsed / (1000 * 60 * 60 * 24)),
          hours: Math.floor((elapsed / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((elapsed / 1000 / 60) % 60),
          seconds: Math.floor((elapsed / 1000) % 60)
        })
      }

      setAnimate(true)
      setTimeout(() => setAnimate(false), 300)
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [])

  // 2026년 6월 달력 생성
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month - 1, 1).getDay()
  }

  const year = 2026
  const month = 6
  const daysInMonth = getDaysInMonth(year, month)
  const firstDayOfMonth = getFirstDayOfMonth(year, month)
  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  // 달력 배열 생성
  const calendarDays: Array<{ day: number; isWeddingDay: boolean } | null> = []
  
  // 첫 번째 주의 빈 공간 채우기
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null)
  }
  
  // 날짜 채우기
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      day,
      isWeddingDay: day === 13 // 06월 13일이 결혼식 날
    })
  }

  const getDayClass = (dayInfo: { day: number; isWeddingDay: boolean } | null) => {
    if (!dayInfo) return 'h-10 md:h-12 w-full text-center flex items-center justify-center text-sm md:text-base text-gray-300'
    
    // 실제 날짜를 기반으로 요일 계산
    const actualDate = new Date(year, month - 1, dayInfo.day)
    const dayOfWeek = actualDate.getDay()
    const weekendClass = dayOfWeek === 0 || dayOfWeek === 6 ? 'text-gray-600' : 'text-gray-700'
    
    if (dayInfo.isWeddingDay) {
      return `h-10 md:h-12 w-full text-center flex items-center justify-center text-sm md:text-base relative ${weekendClass}`
    }
    
    return `h-10 md:h-12 w-full text-center flex items-center justify-center text-sm md:text-base transition-colors rounded ${weekendClass}`
  }

  const countdownItems = [
    { value: timeLeft.days, label: 'DAYS' },
    { value: timeLeft.hours, label: 'HOURS' },
    { value: timeLeft.minutes, label: 'MINS' },
    { value: timeLeft.seconds, label: 'SECS' }
  ]

  return (
    <section 
      className="w-full min-h-screen flex flex-col justify-center py-12 md:py-16 px-0 font-heading"
      style={{ backgroundColor: 'var(--theme-date-countdown-bg, #F5F5F5)' }}
    >
      <div className="max-w-xl mx-auto text-center w-full px-6 md:px-8">
        {/* 제목: June 13, 2026 / 토요일 오후 1시 */}
        <div ref={titleAnimation.ref} className={`transition-all duration-800 ${titleAnimation.animationClass}`}>
          <SectionHeading
            kicker="Schedule"
            title="June 13, 2026"
            description="토요일 오후 1시"
            size="md"
          />
        </div>

        {/* 상단 가로선 */}
        <div className="w-full h-px bg-gray-200 mb-6 md:mb-8"></div>

        {/* 달력 전체 */}
        <div 
          ref={calendarAnimation.ref}
          className={`transition-all duration-800 ${calendarAnimation.animationClass}`}
        >
          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 gap-2 md:gap-3 mb-4 md:mb-6">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-[0.7rem] md:text-xs font-heading text-gray-600 tracking-[0.35em] py-2 md:py-3"
              >
                {day}
              </div>
            ))}
          </div>

          {/* 달력 */}
          <div className="grid grid-cols-7 gap-2 md:gap-3">
            {calendarDays.map((dayInfo, dayIndex) => (
              <div key={dayIndex} className={getDayClass(dayInfo)}>
                {dayInfo?.isWeddingDay ? (
                  <>
                    {/* 강조 원 배경 */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="w-8 md:w-10 h-8 md:h-10 rounded-full shadow-sm"
                        style={{ backgroundColor: 'var(--theme-accent-secondary)' }}
                      ></div>
                    </div>
                    {/* 흰색 숫자 */}
                    <span className="relative z-10 text-white font-medium font-heading">
                      {dayInfo.day}
                    </span>
                  </>
                ) : (
                  <span className="font-heading">{dayInfo?.day || ''}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 하단 가로선 */}
        <div className="w-full h-px bg-gray-200 mt-6 md:mt-8 mb-8 md:mb-10"></div>

        {/* 카운트다운 */}
        <div
          ref={countdownAnimation.ref}
          className={`transition-all duration-700 ${countdownAnimation.animationClass}`}
        >
          <div className="flex items-center justify-center gap-2 md:gap-3 max-w-md md:max-w-2xl mx-auto flex-nowrap">
            {countdownItems.map(({ value, label }, index) => (
              <div key={label} className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                <div className="relative">
                  <div 
                    className={`flex flex-col items-center justify-center gap-2 md:gap-3 transition-all duration-300 ${animate ? 'countdown-fade' : ''} rounded-lg px-3 md:px-4 py-4 md:py-5 w-16 md:w-20`}
                    style={{ backgroundColor: 'var(--theme-date-countdown-box-bg, #E8E8E8)' }}
                  >
                    <div className="text-[1.9rem] md:text-[2.8rem] font-heading text-gray-900 tracking-[0.3em] leading-[1.3]">
                      {value}
                    </div>
                    <div className="text-[10px] md:text-[0.7rem] text-gray-500 tracking-[0.5em] uppercase font-heading">
                      {label}
                    </div>
                  </div>
                </div>
                {index < countdownItems.length - 1 && (
                  <span className="text-[1.5rem] md:text-[2rem] font-heading text-gray-600 flex-shrink-0">:</span>
                )}
              </div>
            ))}
          </div>

          {/* 희근 하트 은혜 의 결혼식이 몇일 남았습니다 */}
          <div className="mt-8 md:mt-10 text-center">
            <p className="text-sm md:text-base font-heading text-gray-700">
              <span>희근</span>
              <svg className="inline-block w-4 h-4 md:w-5 md:h-5 mx-2 theme-text-accent" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span>은혜</span>
              <span>의 결혼식이 </span>
              <span className="font-semibold">{timeLeft.days}일</span>
              <span> 남았습니다</span>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes countdownFade {
          0% {
            opacity: 0.3;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .countdown-fade {
          animation: countdownFade 0.3s ease-out;
        }
      `}</style>
    </section>
  )
}

