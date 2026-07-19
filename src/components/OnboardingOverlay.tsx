import { useLayoutEffect, useState } from 'react'

interface Props {
  targetEl: HTMLElement | null
  message: string
  advance: 'anywhere' | 'target' | 'final'
  onAdvance?: () => void
  onFinish?: () => void
  buttonLabel?: string
}

const PADDING = 8

function useTargetRect(el: HTMLElement | null) {
  const [rect, setRect] = useState<DOMRect | null>(null)

  useLayoutEffect(() => {
    if (!el) {
      setRect(null)
      return
    }
    const update = () => setRect(el.getBoundingClientRect())
    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [el])

  return rect
}

export default function OnboardingOverlay({ targetEl, message, advance, onAdvance, onFinish, buttonLabel }: Props) {
  const rect = useTargetRect(advance === 'final' ? null : targetEl)

  // 최종 단계: 스포트라이트 없이 전체 딤 + 중앙 카피 + 버튼
  if (advance === 'final') {
    return (
      <div className="fixed inset-0 z-[100] bg-black/72 flex items-center justify-center px-8">
        <div className="max-w-xs text-center">
          <p className="text-white text-base font-medium leading-relaxed mb-8">{message}</p>
          <button
            onClick={onFinish}
            className="bg-white text-gray-900 px-8 py-3 rounded-2xl text-sm font-semibold hover:bg-gray-100 transition-colors"
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    )
  }

  if (!rect) return null

  const holeX = rect.left - PADDING
  const holeY = rect.top - PADDING
  const holeW = rect.width + PADDING * 2
  const holeH = rect.height + PADDING * 2
  const vw = window.innerWidth
  const vh = window.innerHeight

  // 말풍선을 hole 아래/위 중 공간이 더 넓은 쪽에 배치
  const spaceBelow = vh - (holeY + holeH)
  const placeBelow = spaceBelow > 140 || holeY < 140
  const bubbleTop = placeBelow ? holeY + holeH + 14 : undefined
  const bubbleBottom = placeBelow ? undefined : vh - holeY + 14

  return (
    <div className="fixed inset-0 z-[100]" aria-live="polite">
      {/* 시각적 스포트라이트(구멍) — 클릭은 안 막음 */}
      <div
        className="absolute rounded-2xl pointer-events-none transition-all duration-200"
        style={{
          left: holeX,
          top: holeY,
          width: holeW,
          height: holeH,
          boxShadow: '0 0 0 9999px rgba(0,0,0,0.62)',
          outline: '2px solid rgba(255,255,255,0.9)',
          outlineOffset: 2,
        }}
      />

      {advance === 'anywhere' ? (
        // 어디를 눌러도 다음으로: 화면 전체를 클릭 레이어로
        <button
          aria-label="다음으로"
          onClick={onAdvance}
          className="absolute inset-0 w-full h-full cursor-pointer"
        />
      ) : (
        // 실제 타깃만 눌러야 진행: hole 부분만 뚫린 4개 밴드로 나머지를 막음
        <>
          <div className="absolute left-0 right-0" style={{ top: 0, height: Math.max(holeY, 0) }} />
          <div
            className="absolute left-0 right-0"
            style={{ top: holeY + holeH, height: Math.max(vh - (holeY + holeH), 0) }}
          />
          <div
            className="absolute"
            style={{ left: 0, top: holeY, width: Math.max(holeX, 0), height: holeH }}
          />
          <div
            className="absolute"
            style={{ left: holeX + holeW, top: holeY, width: Math.max(vw - (holeX + holeW), 0), height: holeH }}
          />
        </>
      )}

      {/* 말풍선 */}
      <div
        className="absolute px-4"
        style={{
          left: 0,
          right: 0,
          top: bubbleTop,
          bottom: bubbleBottom,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          className="bg-gray-900 text-white text-sm font-medium rounded-2xl px-4 py-3 max-w-[280px] text-center shadow-xl pointer-events-none"
          style={{ whiteSpace: 'pre-line' }}
        >
          {message}
        </div>
      </div>
    </div>
  )
}
