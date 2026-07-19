import { useMemo, useState } from 'react'
import type { Todo } from '../types'
import { PRIORITY_META } from '../types'

interface Props {
  todos: Todo[]
  onDelete: (id: string) => void
}

type SortOrder = 'latest' | 'oldest'

export default function CompletedScreen({ todos, onDelete }: Props) {
  const [sortOrder, setSortOrder] = useState<SortOrder>('latest')
  const [openId, setOpenId] = useState<string | null>(null)

  const completed = useMemo(() => {
    const list = todos.filter(t => t.isCompleted)
    return [...list].sort((a, b) => {
      const aTime = new Date(a.completedAt ?? a.createdAt).getTime()
      const bTime = new Date(b.completedAt ?? b.createdAt).getTime()
      return sortOrder === 'latest' ? bTime - aTime : aTime - bTime
    })
  }, [todos, sortOrder])

  return (
    <div className="p-5 pb-24">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-800">완료 항목</h2>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => setSortOrder('latest')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              sortOrder === 'latest' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400'
            }`}
          >
            최신순
          </button>
          <button
            onClick={() => setSortOrder('oldest')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              sortOrder === 'oldest' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400'
            }`}
          >
            오래된순
          </button>
        </div>
      </div>

      {completed.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 text-center">
          <p className="text-gray-300 text-2xl mb-2">✅</p>
          <p className="text-gray-400 text-sm">아직 완료한 항목이 없습니다</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
          {completed.map(todo => {
            const meta = PRIORITY_META[todo.priority]
            const isOpen = openId === todo.id
            return (
              <div key={todo.id}>
                <button
                  onClick={() => setOpenId(isOpen ? null : todo.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                >
                  <span>{meta.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-400 truncate line-through">
                      {todo.title}
                    </p>
                    <p className="text-xs text-gray-300 mt-0.5">{todo.date}</p>
                  </div>
                  <span className={`text-gray-300 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    ⌄
                  </span>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 bg-gray-50/60 text-sm text-gray-600 space-y-1.5">
                    <div className="flex justify-between pt-3">
                      <span className="text-gray-400">할일 이름</span>
                      <span className="font-medium text-gray-700">{todo.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">집중한 시간</span>
                      <span className="font-medium text-gray-700">{todo.durationMinutes}분</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">일시정지한 횟수</span>
                      <span className="font-medium text-gray-700">{todo.pauseCount}회</span>
                    </div>
                    <button
                      onClick={() => onDelete(todo.id)}
                      className="w-full mt-2 py-2 rounded-lg text-xs font-medium text-red-400 bg-red-50 hover:bg-red-100 transition-colors"
                    >
                      이 항목 삭제
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
