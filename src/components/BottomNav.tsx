export type Tab = 'calendar' | 'register' | 'completed'

interface Props {
  active: Tab
  onChange: (tab: Tab) => void
  registerTarget?: (key: string) => (el: HTMLElement | null) => void
}

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'calendar', label: '월간 트래커', icon: '📅' },
  { key: 'register', label: '할일 등록', icon: '✏️' },
  { key: 'completed', label: '완료 항목', icon: '✅' },
]

// 온보딩이 스포트라이트로 잡을 수 있도록 탭별 타깃 키를 붙여둠
const TAB_TARGET_KEY: Record<Tab, string> = {
  calendar: 'navCalendar',
  register: 'navRegister',
  completed: 'navCompleted',
}

export default function BottomNav({ active, onChange, registerTarget }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex max-w-md mx-auto">
      {TABS.map(tab => {
        const isActive = active === tab.key
        return (
          <button
            key={tab.key}
            ref={registerTarget?.(TAB_TARGET_KEY[tab.key])}
            onClick={() => onChange(tab.key)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-colors ${
              isActive ? 'text-gray-900' : 'text-gray-300'
            }`}
          >
            <span className="text-lg leading-none">{tab.icon}</span>
            {tab.label}
          </button>
        )
      })}
    </nav>
  )
}
