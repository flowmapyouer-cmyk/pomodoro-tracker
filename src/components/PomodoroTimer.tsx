import { useState, useEffect, useRef } from 'react'
import type { Todo } from '../types'
import { PRIORITY_META } from '../types'
import ExitConfirmModal from './ExitConfirmModal'

interface Props {
  todo: Todo
  onComplete: (id: string) => void
  onDiscard: (id: string) => void
  onPauseCounted: (id: string) => void
}

const RADIUS = 110
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function PomodoroTimer({ todo, onComplete, onDiscard, onPauseCounted }: Props) {
  const totalSeconds = todo.durationMinutes * 60
  const [remaining, setRemaining] = useState(totalSeconds)
  const [isRunning, setIsRunning] = useState(true)
  const [showExitConfirm, setShowExitConfirm] = useState(false)

  const completedRef = useRef(false)

  useEffect(() => {
    if (!isRunning) return
    const timer = setTimeout(() => {
      setRemaining(prev => {
        const next = prev - 1
        if (next <= 0 && !completedRef.current) {
          completedRef.current = true
          onComplete(todo.id)
          return 0
        }
        return next
      })
    }, 1000)
    return () => clearTimeout(timer)
  }, [isRunning, remaining, onComplete, todo.id])

  const progress = (totalSeconds - remaining) / totalSeconds
  const dashOffset = CIRCUMFERENCE * progress
  const minutes = Math.floor(remaining / 60).toString().padStart(2, '0')
  const seconds = (remaining % 60).toString().padStart(2, '0')
  const priorityMeta = PRIORITY_META[todo.priority]

  const togglePause = () => {
    if (isRunning) {
      onPauseCounted(todo.id)
    }
    setIsRunning(prev => !prev)
  }

  // 종료 버튼: 시간이 남아있으면 확인 팝업, 다 됐으면 바로 완료 처리(사실상 자동완료 이후 도달 안 함)
  const handleEndClick = () => {
    if (remaining > 0) {
      setShowExitConfirm(true)
    } else if (!completedRef.current) {
      completedRef.current = true
      onComplete(todo.id)
    }
  }

  const handleExitWithoutSaving = () => {
    setShowExitConfirm(false)
    onDiscard(todo.id)
  }

  const handlePauseFromModal = () => {
    setShowExitConfirm(false)
    if (isRunning) {
      onPauseCounted(todo.id)
      setIsRunning(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <p className="text-sm font-medium text-gray-400 mb-1 tracking-widest uppercase">집중 시간</p>
      <h2 className="text-2xl font-semibold text-gray-800 mb-1 max-w-xs text-center">
        {priorityMeta.emoji} {todo.title}
      </h2>
      <p className="text-xs text-gray-400 mb-8">{priorityMeta.label}</p>

      <div className="relative">
        <svg width="280" height="280" viewBox="0 0 280 280">
          <circle cx="140" cy="140" r={RADIUS} fill="none" stroke="#e5e7eb" strokeWidth="10" />
          <circle
            cx="140"
            cy="140"
            r={RADIUS}
            fill="none"
            stroke="#111827"
            strokeWidth="10"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform="rotate(-90 140 140)"
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-light text-gray-800 tabular-nums tracking-tight">
            {minutes}:{seconds}
          </span>
          <span className="text-xs text-gray-400 mt-1">{isRunning ? '집중 중' : '일시정지'}</span>
        </div>
      </div>

      <div className="flex gap-3 mt-10">
        <button
          onClick={togglePause}
          className="px-8 py-3 bg-white border border-gray-200 rounded-2xl text-gray-600 text-sm
                     font-medium hover:bg-gray-50 transition-colors shadow-sm min-w-[120px]"
        >
          {isRunning ? '⏸ 일시정지' : '▶ 재개'}
        </button>
        <button
          onClick={handleEndClick}
          className="px-8 py-3 bg-gray-900 text-white rounded-2xl text-sm font-medium
                     hover:bg-gray-700 transition-colors shadow-sm min-w-[120px]"
        >
          ✓ 종료
        </button>
      </div>

      <p className="text-xs text-gray-400 mt-6">총 {todo.durationMinutes}분 집중 목표</p>

      {showExitConfirm && (
        <ExitConfirmModal onExitWithoutSaving={handleExitWithoutSaving} onPause={handlePauseFromModal} />
      )}
    </div>
  )
}
