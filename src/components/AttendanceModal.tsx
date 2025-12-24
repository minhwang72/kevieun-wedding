'use client'

import { useState, FormEvent, useRef, useEffect } from 'react'

interface AttendanceModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AttendanceModal({ isOpen, onClose }: AttendanceModalProps) {
  const [formData, setFormData] = useState({
    side: 'groom' as 'groom' | 'bride',
    attendance: 'yes' as 'yes' | 'no',
    meal: 'pending' as 'yes' | 'no' | 'pending',
    name: '',
    companions: 0,
    phone_last4: ''
  })
  const [hasCompanions, setHasCompanions] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  // 모달이 닫힐 때 폼 초기화
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        side: 'groom',
        attendance: 'yes',
        meal: 'pending',
        name: '',
        companions: 0,
        phone_last4: ''
      })
      setHasCompanions(false)
      setError(null)
      setSuccess(false)
    }
  }, [isOpen])

  // 동행인원 토글
  useEffect(() => {
    if (!hasCompanions) {
      setFormData(prev => ({ ...prev, companions: 0 }))
    } else if (formData.companions === 0) {
      setFormData(prev => ({ ...prev, companions: 1 }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCompanions])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // 유효성 검사
      if (!formData.name.trim()) {
        setError('성함을 입력해주세요.')
        setLoading(false)
        return
      }

      if (!formData.phone_last4 || formData.phone_last4.length !== 4 || !/^\d{4}$/.test(formData.phone_last4)) {
        setError('휴대폰 뒷자리 4자리를 정확히 입력해주세요.')
        setLoading(false)
        return
      }

      if (formData.companions < 0) {
        setError('동행인원은 0명 이상이어야 합니다.')
        setLoading(false)
        return
      }

      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.error || '등록에 실패했습니다.')
        setLoading(false)
        return
      }

      // 성공
      setSuccess(true)
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (err) {
      console.error('Error submitting attendance:', err)
      setError('등록 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4)
    setFormData(prev => ({ ...prev, phone_last4: value }))
  }

  const handleCompanionsIncrement = () => {
    setFormData(prev => ({ ...prev, companions: prev.companions + 1 }))
  }

  const handleCompanionsDecrement = () => {
    if (formData.companions > 1) {
      setFormData(prev => ({ ...prev, companions: prev.companions - 1 }))
    } else {
      setHasCompanions(false)
      setFormData(prev => ({ ...prev, companions: 0 }))
    }
  }

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 flex items-start md:items-center justify-center z-[9999] p-4 animate-modal-fade-in overflow-y-auto"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
      onClick={handleBackgroundClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg p-4 md:p-6 w-full max-w-md font-sans max-h-[90vh] overflow-y-auto animate-modal-slide-up shadow-lg"
      >
        <div className="mb-4">
          <h3 className="text-base md:text-lg font-medium text-gray-900">참석의사 등록</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* 성공 메시지 */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md text-sm">
              참석의사가 성공적으로 등록되었습니다.
            </div>
          )}

          {/* 에러 메시지 */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* 신랑/신부 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              하객 구분 <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              <label className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  name="side"
                  value="groom"
                  checked={formData.side === 'groom'}
                  onChange={(e) => setFormData(prev => ({ ...prev, side: e.target.value as 'groom' | 'bride' }))}
                  className="sr-only"
                />
                <div className={`px-4 py-3 rounded-md border-2 text-center transition-all text-sm md:text-base ${
                  formData.side === 'groom'
                    ? 'border-gray-800 bg-gray-50 font-medium'
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  신랑 하객
                </div>
              </label>
              <label className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  name="side"
                  value="bride"
                  checked={formData.side === 'bride'}
                  onChange={(e) => setFormData(prev => ({ ...prev, side: e.target.value as 'groom' | 'bride' }))}
                  className="sr-only"
                />
                <div className={`px-4 py-3 rounded-md border-2 text-center transition-all text-sm md:text-base ${
                  formData.side === 'bride'
                    ? 'border-gray-800 bg-gray-50 font-medium'
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  신부 하객
                </div>
              </label>
            </div>
          </div>

          {/* 성함 */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              성함 <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent text-sm md:text-base placeholder-gray-400"
              placeholder="성함을 입력해주세요"
              required
            />
          </div>

          {/* 휴대폰 뒷자리 */}
          <div>
            <label htmlFor="phone_last4" className="block text-sm font-medium text-gray-700 mb-2">
              휴대폰 뒷자리 4자리 <span className="text-red-500">*</span>
            </label>
            <input
              id="phone_last4"
              type="text"
              value={formData.phone_last4}
              onChange={handlePhoneChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent text-sm md:text-base placeholder-gray-400"
              placeholder="예: 1234"
              maxLength={4}
              required
            />
            <p className="mt-1 text-xs text-gray-500">동명이인 확인을 위해 필요합니다.</p>
          </div>

          {/* 참석 여부 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              참석 여부 <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              <label className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  name="attendance"
                  value="yes"
                  checked={formData.attendance === 'yes'}
                  onChange={(e) => setFormData(prev => ({ ...prev, attendance: e.target.value as 'yes' | 'no' }))}
                  className="sr-only"
                />
                <div className={`px-4 py-3 rounded-md border-2 text-center transition-all text-sm md:text-base ${
                  formData.attendance === 'yes'
                    ? 'border-gray-800 bg-gray-50 font-medium'
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  참석
                </div>
              </label>
              <label className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  name="attendance"
                  value="no"
                  checked={formData.attendance === 'no'}
                  onChange={(e) => setFormData(prev => ({ ...prev, attendance: e.target.value as 'yes' | 'no' }))}
                  className="sr-only"
                />
                <div className={`px-4 py-3 rounded-md border-2 text-center transition-all text-sm md:text-base ${
                  formData.attendance === 'no'
                    ? 'border-gray-800 bg-gray-50 font-medium'
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  불참
                </div>
              </label>
            </div>
          </div>

          {/* 식사 여부 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              식사 여부 <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              <label className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  name="meal"
                  value="yes"
                  checked={formData.meal === 'yes'}
                  onChange={(e) => setFormData(prev => ({ ...prev, meal: e.target.value as 'yes' | 'no' | 'pending' }))}
                  className="sr-only"
                />
                <div className={`px-4 py-3 rounded-md border-2 text-center transition-all text-sm md:text-base ${
                  formData.meal === 'yes'
                    ? 'border-gray-800 bg-gray-50 font-medium'
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  식사
                </div>
              </label>
              <label className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  name="meal"
                  value="no"
                  checked={formData.meal === 'no'}
                  onChange={(e) => setFormData(prev => ({ ...prev, meal: e.target.value as 'yes' | 'no' | 'pending' }))}
                  className="sr-only"
                />
                <div className={`px-4 py-3 rounded-md border-2 text-center transition-all text-sm md:text-base ${
                  formData.meal === 'no'
                    ? 'border-gray-800 bg-gray-50 font-medium'
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  식사 안함
                </div>
              </label>
              <label className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  name="meal"
                  value="pending"
                  checked={formData.meal === 'pending'}
                  onChange={(e) => setFormData(prev => ({ ...prev, meal: e.target.value as 'yes' | 'no' | 'pending' }))}
                  className="sr-only"
                />
                <div className={`px-4 py-3 rounded-md border-2 text-center transition-all text-sm md:text-base ${
                  formData.meal === 'pending'
                    ? 'border-gray-800 bg-gray-50 font-medium'
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  미정
                </div>
              </label>
            </div>
          </div>

          {/* 동행인원 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              추가 동행인원
            </label>
            <div className="space-y-3">
              {/* 동행인원 여부 버튼 */}
              <div className="flex gap-3">
                <label className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="hasCompanions"
                    checked={!hasCompanions}
                    onChange={() => setHasCompanions(false)}
                    className="sr-only"
                  />
                  <div className={`px-4 py-3 rounded-md border-2 text-center transition-all text-sm md:text-base ${
                    !hasCompanions
                      ? 'border-gray-800 bg-gray-50 font-medium'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    없음
                  </div>
                </label>
                <label className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="hasCompanions"
                    checked={hasCompanions}
                    onChange={() => setHasCompanions(true)}
                    className="sr-only"
                  />
                  <div className={`px-4 py-3 rounded-md border-2 text-center transition-all text-sm md:text-base ${
                    hasCompanions
                      ? 'border-gray-800 bg-gray-50 font-medium'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    있음
                  </div>
                </label>
              </div>

              {/* 동행인원 수 조절 (있음 선택 시에만 표시) */}
              {hasCompanions && (
                <div className="flex items-center gap-3 bg-gray-50 rounded-md p-3">
                  <button
                    type="button"
                    onClick={handleCompanionsDecrement}
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-md bg-white hover:bg-gray-100 transition-colors text-gray-700 font-medium"
                    aria-label="동행인원 감소"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <div className="flex-1 text-center">
                    <span className="text-lg font-medium text-gray-900">{formData.companions}</span>
                    <span className="text-sm text-gray-600 ml-1">명</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCompanionsIncrement}
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-md bg-white hover:bg-gray-100 transition-colors text-gray-700 font-medium"
                    aria-label="동행인원 증가"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500">본인을 제외한 동행인원 수를 입력해주세요.</p>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 text-sm md:text-base text-gray-700 bg-gray-200 rounded-md transition-colors hover:bg-gray-300"
              disabled={loading}
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 text-sm md:text-base theme-button rounded-md transition-colors"
              disabled={loading || success}
            >
              {loading ? '등록 중...' : success ? '등록 완료' : '체크 완료'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
