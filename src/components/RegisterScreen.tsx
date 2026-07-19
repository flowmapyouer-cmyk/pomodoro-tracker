import type { Priority } from '../types'
import TimePicker from './TimePicker'
import PriorityPicker from './PriorityPicker'

interface Props {
  title: string
  onTitleChange: (v: string) => void
  date: string
  onDateChange: (v: string) => void
  durationMinutes: number
  onDurationChange: (v: number) => void
  priority: Priority
  onPriorityChange: (v: Priority) => void
  onStart: () => void
  registerTarget?: (key: string) => (el: HTMLElement | null) => void
}

export default function RegisterScreen({
  title,
  onTitleChange,
  date,
  onDateChange,
  durationMinutes,
  onDurationChange,
  priority,
  onPriorityChange,
  onStart,
  registerTarget,
}: Props) {
  const ref = (key: string) => registerTarget?.(key)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onStart()
  }

  return (
    <form onSubmit={handleSubmit} className="p-5 pb-24">
      <h2 className="text-base font-semibold text-gray-800 mb-4">새 일정 추가</h2>

      <input
        ref={ref('titleInput')}
        type="text"
        value={title}
        onChange={e => onTitleChange(e.target.value)}
        placeholder="일정 이름을 입력하세요"
        required
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700
                   placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 mb-4"
      />

      <input
        ref={ref('dateInput')}
        type="date"
        value={date}
        onChange={e => onDateChange(e.target.value)}
        required
        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700
                   focus:outline-none focus:ring-2 focus:ring-blue-100 mb-4"
      />

      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        집중 시간 (최소 10분)
      </p>
      <div ref={ref('durationPicker')} className="mb-4">
        <TimePicker totalMinutes={durationMinutes} onChange={onDurationChange} />
      </div>

      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        우선순위
      </p>
      <div ref={ref('priorityPicker')} className="mb-5">
        <PriorityPicker value={priority} onChange={onPriorityChange} />
      </div>

      <button
        ref={ref('startButton')}
        type="submit"
        className="w-full bg-gray-900 text-white py-2.5 rounded-xl text-sm font-medium
                   hover:bg-gray-700 active:bg-gray-800 transition-colors"
      >
        ▶ 시작
      </button>
    </form>
  )
}
