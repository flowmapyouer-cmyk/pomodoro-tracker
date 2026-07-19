import { useState } from 'react'
import type { Priority, Todo } from '../types'
import TimePicker from './TimePicker'
import PriorityPicker from './PriorityPicker'

type NewTodoData = Omit<Todo, 'id' | 'isCompleted' | 'pauseCount' | 'createdAt' | 'completedAt'>

interface Props {
  onStart: (data: NewTodoData) => void
}

export default function RegisterScreen({ onStart }: Props) {
  const today = new Date().toISOString().split('T')[0]

  const [title, setTitle] = useState('')
  const [date, setDate] = useState(today)
  const [durationMinutes, setDurationMinutes] = useState(30)
  const [priority, setPriority] = useState<Priority>('normal')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onStart({ title: title.trim(), date, durationMinutes, priority })
    setTitle('')
    setDate(today)
    setDurationMinutes(30)
    setPriority('normal')
  }

  return (
    <form onSubmit={handleSubmit} className="p-5 pb-24">
      <h2 className="text-base font-semibold text-gray-800 mb-4">새 일정 추가</h2>

      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="일정 이름을 입력하세요"
        required
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700
                   placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 mb-4"
      />

      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        required
        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700
                   focus:outline-none focus:ring-2 focus:ring-blue-100 mb-4"
      />

      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        집중 시간 (최소 10분)
      </p>
      <div className="mb-4">
        <TimePicker totalMinutes={durationMinutes} onChange={setDurationMinutes} />
      </div>

      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        우선순위
      </p>
      <div className="mb-5">
        <PriorityPicker value={priority} onChange={setPriority} />
      </div>

      <button
        type="submit"
        className="w-full bg-gray-900 text-white py-2.5 rounded-xl text-sm font-medium
                   hover:bg-gray-700 active:bg-gray-800 transition-colors"
      >
        ▶ 시작
      </button>
    </form>
  )
}
