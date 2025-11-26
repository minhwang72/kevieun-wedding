'use client'

import { useState, useEffect } from 'react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

export default function CountdownSection() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [isPast, setIsPast] = useState(false)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const weddingDate = new Date('2026-04-11T13:00:00+09:00')

    const calculateTimeLeft = () => {
      const now = new Date()
      const difference = weddingDate.getTime() - now.getTime()

      if (difference > 0) {
        setIsPast(false)
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      } else {
        setIsPast(true)
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

  const titleAnimation = useScrollAnimation({ threshold: 0.2, animationDelay: 150 })
  const counterAnimation = useScrollAnimation({ threshold: 0.25, animationDelay: 350 })

  const countdownItems = [
    { value: timeLeft.days, label: 'DAYS' },
    { value: timeLeft.hours, label: 'HOURS' },
    { value: timeLeft.minutes, label: 'MINS' },
    { value: timeLeft.seconds, label: 'SECS' }
  ]

  return (
    <section className="w-full min-h-screen flex flex-col justify-center text-center mb-0 px-4 md:px-8 py-12 md:py-16 bg-[#FDF7FF]">
      <div
        ref={titleAnimation.ref}
        className={`flex items-center justify-center gap-2 mb-6 md:mb-8 transition-all duration-700 ${titleAnimation.animationClass}`}
      >
        <span className="text-gray-700 text-sm md:text-base font-semibold tracking-wide" style={{ fontFamily: 'MaruBuri, -apple-system, BlinkMacSystemFont, system-ui, sans-serif' }}>
          도찬
        </span>
        <svg className="w-4 h-4 md:w-5 md:h-5 text-pink-300" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <span className="text-gray-700 text-sm md:text-base font-semibold tracking-wide" style={{ fontFamily: 'MaruBuri, -apple-system, BlinkMacSystemFont, system-ui, sans-serif' }}>
          은진
        </span>
        <span className="text-gray-600 text-sm md:text-base font-semibold tracking-wide" style={{ fontFamily: 'MaruBuri, -apple-system, BlinkMacSystemFont, system-ui, sans-serif' }}>
          {isPast ? '의 결혼한지' : '의 결혼까지...'}
        </span>
      </div>

      <div
        ref={counterAnimation.ref}
        className={`grid grid-cols-4 gap-4 md:gap-8 max-w-md md:max-w-2xl mx-auto transition-all duration-700 ${counterAnimation.animationClass}`}
      >
        {countdownItems.map(({ value, label }) => (
          <div key={label} className="relative">
            <div className={`flex flex-col items-center transition-all duration-300 ${animate ? 'countdown-fade' : ''}`}>
              <div className="text-2xl md:text-4xl font-semibold text-[#9B6B9E]" style={{ fontFamily: 'MaruBuri, -apple-system, BlinkMacSystemFont, system-ui, sans-serif' }}>
                {value}
              </div>
              <div className="text-[11px] md:text-xs text-[#B3D4FF] mt-1 md:mt-2 tracking-wider font-semibold" style={{ fontFamily: 'MaruBuri, -apple-system, BlinkMacSystemFont, system-ui, sans-serif' }}>
                {label}
              </div>
            </div>
          </div>
        ))}
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
