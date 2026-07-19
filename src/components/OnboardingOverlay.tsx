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
const BUBBLE_MARGIN = 14
const EST_BUBBLE_HEIGHT = 96 // 말풍선 예상 높이(2~3줄 기준) — 화면 밖으로 안 나가게 클램프할 때 씀

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
  const vh = window.innerHeight

  // 말풍선을 hole 아래/위 중 공간이 더 넓은 쪽에 배치하고, 화면 밖으로 안 나가게 클램프
  const spaceBelow = vh - (holeY + holeH)
  const placeBelow = spaceBelow > holeY
  let bubbleTop = placeBelow ? holeY + holeH + BUBBLE_MARGIN : holeY - BUBBLE_MARGIN - EST_BUBBLE_HEIGHT
  bubbleTop = Math.min(Math.max(bubbleTop, 12), Math.max(12, vh - EST_BUBBLE_HEIGHT - 12))

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none" aria-live="polite">
      {/* 시각적 스포트라이트(구멍) — 클릭은 전부 실제 화면으로 통과시킴 */}
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

      {advance === 'anywhere' && (
        // 어디를 눌러도 다음으로: 화면 전체를 클릭 레이어로
        <button
          aria-label="다음으로"
          onClick={onAdvance}
          className="absolute inset-0 w-full h-full cursor-pointer pointer-events-auto"
        />
      )}
      {/* advance === 'target'일 땐 클릭을 막는 레이어를 아예 두지 않는다.
          구멍 위치 계산이 기기마다 살짝 어긋나도 실제 버튼이 항상 눌리도록,
          스포트라이트는 순수 시각 효과로만 두고 상호작용은 막지 않는다. */}

      {/* 말풍선 */}
      <div
        className="absolute left-0 right-0 flex justify-center px-4 pointer-events-none"
        style={{ top: bubbleTop }}
      >
        <div
          className="bg-gray-900 text-white text-sm font-medium rounded-2xl px-4 py-3 text-center shadow-xl"
          style={{
            whiteSpace: 'pre-line',
            wordBreak: 'keep-all',
            overflowWrap: 'break-word',
            maxWidth: 'min(320px, calc(100vw - 48px))',
          }}
        >
          {message}
        </div>
      </div>
    </div>
  )
}
