'use client'

import { useState, useEffect } from 'react'

interface AttendancePopupProps {
    onOpenAttendanceModal: () => void
}

export default function AttendancePopup({ onOpenAttendanceModal }: AttendancePopupProps) {
    const [isVisible, setIsVisible] = useState(false)
    const [shouldRender, setShouldRender] = useState(false)

    useEffect(() => {
        // 로컬 스토리지 확인 (오늘 하루 보지 않기)
        const hiddenUntil = localStorage.getItem('attendance_popup_hidden_until')
        if (hiddenUntil && new Date().getTime() < parseInt(hiddenUntil)) {
            return
        }

        setShouldRender(true)

        const handleScroll = () => {
            // 커버 섹션을 지나면 팝업 표시 (대략 800px)
            const scrollPosition = window.scrollY
            const triggerPosition = window.innerHeight * 0.8

            if (scrollPosition > triggerPosition) {
                setIsVisible(true)
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleDoNotShowToday = () => {
        const tomorrow = new Date()
        tomorrow.setHours(tomorrow.getHours() + 24)
        localStorage.setItem('attendance_popup_hidden_until', tomorrow.getTime().toString())
        setIsVisible(false)
    }

    const handleClose = () => {
        setIsVisible(false)
    }

    const handleAction = () => {
        // 참석 여부 전달 누르면 오늘 하루 안 보기와 동일하게 처리
        handleDoNotShowToday()
        // 메인 모달 열기
        onOpenAttendanceModal()
    }

    if (!shouldRender) return null

    return (
        <>
            {isVisible && (
                <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4 animate-modal-fade-in pointer-events-none">
                    {/* 배경 오버레이 - 팝업 주변 클릭 시 닫기 가능하도록 */}
                    <div
                        className="absolute inset-0 bg-black/40 pointer-events-auto"
                        onClick={handleClose}
                    ></div>

                    {/* 팝업 본문 */}
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden relative pointer-events-auto animate-modal-slide-up font-sans">
                        {/* 닫기 버튼 */}
                        <button
                            onClick={handleClose}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 p-1"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="p-8 pb-6 text-center">
                            <h3 className="text-xl font-heading font-medium text-gray-900 mb-6">
                                참석 여부 전달
                            </h3>

                            <div className="space-y-2 text-gray-600 text-sm leading-relaxed mb-8">
                                <p>소중한 시간을 내어 결혼식에</p>
                                <p>참석해주시는 모든 분들께 감사드립니다.</p>
                                <p>원활한 예식 진행을 위해</p>
                                <p>참석 여부를 회신해 주시면</p>
                                <p>더욱 감사하겠습니다.</p>
                            </div>

                            {/* 구분선 및 웨딩 정보 */}
                            <div className="border-t border-dashed border-gray-200 py-6 space-y-3 text-left">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    <p className="text-sm text-gray-600">
                                        신랑 <span className="text-gray-900 font-medium">임희근</span>,
                                        신부 <span className="text-gray-900 font-medium">이은혜</span>
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-sm text-gray-600">2026년 6월 13일 토요일 오후 1시</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <p className="text-sm text-gray-600">정동제일교회 2층 본당</p>
                                </div>
                            </div>

                            {/* 버튼 */}
                            <button
                                onClick={handleAction}
                                className="w-full theme-button py-3.5 rounded text-sm md:text-base mb-4"
                            >
                                참석 여부 전달
                            </button>

                            {/* 오늘 하루 보지 않기 */}
                            <button
                                onClick={handleDoNotShowToday}
                                className="flex items-center justify-center gap-2 text-gray-400 hover:text-gray-600 text-xs md:text-sm mx-auto transition-colors"
                                type="button"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>오늘 하루 보지 않기</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
