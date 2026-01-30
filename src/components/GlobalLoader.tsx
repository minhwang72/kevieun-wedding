'use client'

import { useEffect, useState } from 'react'
import { useScrollLock } from '@/hooks/useScrollLock'

interface GlobalLoaderProps {
    isLoading: boolean
    minimumLoadingTime?: number // 최소 로딩 시간 (ms)
}

export default function GlobalLoader({ isLoading, minimumLoadingTime = 1500 }: GlobalLoaderProps) {
    const [shouldRender, setShouldRender] = useState(true)
    const [progress, setProgress] = useState(0)
    const [complete, setComplete] = useState(false)
    const [fadeOut, setFadeOut] = useState(false)

    // 스크롤 잠금 훅 사용
    useScrollLock(shouldRender)

    useEffect(() => {
        // 로딩 시작 시 진행률 애니메이션
        const startTime = Date.now()
        let animationFrame: number

        const animate = () => {
            const elapsed = Date.now() - startTime
            const calculatedProgress = Math.min((elapsed / minimumLoadingTime) * 100, 99) // 99%까지만 자동 진행

            if (isLoading) {
                setProgress(calculatedProgress)
                animationFrame = requestAnimationFrame(animate)
            } else {
                // 로딩이 끝났으면 100%로 마무리
                setProgress(100)
                setTimeout(() => setComplete(true), 200) // 100% 도달 후 잠시 대기
            }
        }

        animationFrame = requestAnimationFrame(animate)

        return () => cancelAnimationFrame(animationFrame)
    }, [isLoading, minimumLoadingTime])

    useEffect(() => {
        if (complete) {
            // 완료 상태가 되면 페이드아웃 시작
            setFadeOut(true)

            // 페이드아웃 애니메이션 시간(500ms) 후 언마운트
            const timer = setTimeout(() => {
                setShouldRender(false)
            }, 500)

            return () => clearTimeout(timer)
        }
    }, [complete])

    if (!shouldRender) return null

    return (
        <div
            className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#FFFEF9] transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'
                }`}
        >
            <div className="w-full max-w-[280px] flex flex-col items-center gap-6 p-6">
                {/* 심플한 아이콘 또는 로고 영역 */}
                <div className="w-16 h-16 rounded-2xl bg-[#8B6F47]/20 flex items-center justify-center mb-2 animate-bounce-slow">
                    <svg className="w-8 h-8 text-[#8B6F47]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </div>

                <div className="text-center space-y-2">
                    <h2 className="text-[#5A4B41] font-heading text-xl tracking-widest">
                        임희근 <span className="text-[#8B6F47] text-xs align-middle">♥</span> 이은혜
                    </h2>
                    <p className="text-[#5A4B41]/60 text-sm tracking-widest uppercase font-light">
                        June 13, 2026
                    </p>
                </div>

                {/* 다운로드 스타일 프로그레스 바 */}
                <div className="w-full space-y-2 mt-4">
                    <div className="flex justify-between text-xs text-[#5A4B41]/80 font-mono">
                        <span>INVITATION LOADING...</span>
                        <span>{Math.floor(progress)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#F5F5F0] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#8B6F47] transition-all duration-100 ease-linear rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <p className="text-[#5A4B41]/40 text-xs mt-4 animate-pulse">
                    잠시만 기다려주세요
                </p>
            </div>
        </div>
    )
}
