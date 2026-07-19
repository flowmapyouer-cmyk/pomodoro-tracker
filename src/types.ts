export type Priority = 'urgent' | 'normal' | 'low'

export interface Todo {
  id: string
  title: string
  date: string // YYYY-MM-DD
  durationMinutes: number // 10분 단위, 최소 10분
  priority: Priority
  isCompleted: boolean
  pauseCount: number
  createdAt: string
  completedAt: string | null
}

export const PRIORITY_META: Record<Priority, { label: string; emoji: string; dot: string }> = {
  urgent: { label: '긴급', emoji: '🔴', dot: 'bg-red-400' },
  normal: { label: '보통', emoji: '🟡', dot: 'bg-yellow-400' },
  low: { label: '낮음', emoji: '🟢', dot: 'bg-green-400' },
}
