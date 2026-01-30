import { useEffect } from 'react'

export function useScrollLock(lock: boolean) {
    useEffect(() => {
        if (!lock) return

        // 저장된 스타일
        const originalStyle = window.getComputedStyle(document.body).overflow
        const originalPaddingRight = window.getComputedStyle(document.body).paddingRight

        // 스크롤바 너비 계산
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

        // Body 잠금
        document.body.style.overflow = 'hidden'
        if (scrollbarWidth > 0) {
            document.body.style.paddingRight = `${parseInt(originalPaddingRight || '0', 10) + scrollbarWidth}px`
        }

        return () => {
            // 복구
            document.body.style.overflow = originalStyle
            document.body.style.paddingRight = originalPaddingRight
        }
    }, [lock])
}
