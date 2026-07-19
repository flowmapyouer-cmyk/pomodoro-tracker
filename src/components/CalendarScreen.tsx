import { useState } from 'react'
import type { Todo } from '../types'
import { PRIORITY_META } from '../types'

interface Props {
  todos: Todo[]
}

const DAYS_KR = ['일', '월', '화', '수', '목', '금', '토']
const MONTHS_KR = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']

export default function CalendarScreen({ todos }: Props) {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfWeek = new Date(year, month, 1).getDay()

  const completedByDate: Record<string, string[]> = {}
  todos
    .filter(t => t.isCompleted)
    .forEach(t => {
      if (!completedByDate[t.date]) completedByDate[t.date] = []
      if (completedByDate[t.date].length < 5) {
        completedByDate[t.date].push(PRIORITY_META[t.priority].dot)
      }
    })

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  const todayStr = now.toISOString().split('T')[0]

  // 이번 달(화면에 표시 중인 달) 요약: 완료된 일정 기준
  const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`
  const monthCompleted = todos.filter(t => t.isCompleted && t.date.startsWith(monthPrefix))
  const totalMinutes = monthCompleted.reduce((sum, t) => sum + t.durationMinutes, 0)
  const totalPauseCount = monthCompleted.reduce((sum, t) => sum + t.pauseCount, 0)
  const totalHours = Math.floor(totalMinutes / 60)
  const remainingMinutes = totalMinutes % 60

  return (
    <div className="p-5 pb-24">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={prevMonth}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors text-lg"
          >
            ‹
          </button>
          <h2 className="text-sm font-semibold text-gray-800">
            {year}년 {MONTHS_KR[month]}
          </h2>
          <button
            onClick={nextMonth}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors text-lg"
          >
            ›
          </button>
        </div>

        <div className="grid grid-cols-7 mb-1">
          {DAYS_KR.map((d, i) => (
            <div
              key={d}
              className={`text-center text-xs font-medium py-1 ${
                i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-400'
              }`}
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0.5">
          {cells.map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`} className="min-h-[52px]" />
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const dayDots = completedByDate[dateStr] || []
            const isToday = dateStr === todayStr
            const isSun = idx % 7 === 0
            const isSat = idx % 7 === 6

            return (
              <div key={dateStr} className={`min-h-[52px] rounded-xl p-1 ${isToday ? 'bg-blue-50' : ''}`}>
                <span
                  className={`text-xs font-medium block text-center mb-1 ${
                    isToday ? 'text-blue-500 font-bold' : isSun ? 'text-red-400' : isSat ? 'text-blue-400' : 'text-gray-700'
                  }`}
                >
                  {day}
                </span>
                <div className="flex flex-wrap gap-0.5 justify-center">
                  {dayDots.map((dot, i) => (
                    <div key={i} className={`w-2.5 h-2.5 rounded-sm ${dot}`} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl mt-4 shadow-sm border border-gray-100 divide-y divide-gray-50">
        <div className="flex items-center justify-between px-5 py-3.5">
          <span className="text-sm text-gray-500">이번 달 총 집중 시간</span>
          <span className="text-sm font-semibold text-gray-800">
            {totalHours}시간 {remainingMinutes}분
          </span>
        </div>
        <div className="flex items-center justify-between px-5 py-3.5">
          <span className="text-sm text-gray-500">일시 정지 요청 수</span>
          <span className="text-sm font-semibold text-gray-800">{totalPauseCount}건</span>
        </div>
        <div className="flex items-center justify-between px-5 py-3.5">
          <span className="text-sm text-gray-500">완료한 일정 수</span>
          <span className="text-sm font-semibold text-gray-800">{monthCompleted.length}건</span>
        </div>
      </div>
    </div>
  )
}
