import { useState } from 'react'
import { useTodos } from './hooks/useTodos'
import type { Todo } from './types'
import BottomNav from './components/BottomNav'
import type { Tab } from './components/BottomNav'
import RegisterScreen from './components/RegisterScreen'
import CalendarScreen from './components/CalendarScreen'
import CompletedScreen from './components/CompletedScreen'
import PomodoroTimer from './components/PomodoroTimer'

type NewTodoData = Omit<Todo, 'id' | 'isCompleted' | 'pauseCount' | 'createdAt' | 'completedAt'>

function App() {
  const { todos, addTodo, incrementPause, completeTodo, deleteTodo } = useTodos()
  const [tab, setTab] = useState<Tab>('register')
  const [activeTodo, setActiveTodo] = useState<Todo | null>(null)

  const handleStart = (data: NewTodoData) => {
    const todo = addTodo(data)
    setActiveTodo(todo)
  }

  const handleComplete = (id: string) => {
    completeTodo(id)
    setActiveTodo(null)
    setTab('calendar')
  }

  const handleDiscard = (id: string) => {
    deleteTodo(id)
    setActiveTodo(null)
    setTab('register')
  }

  // 뽀모도로 화면: 전체 화면 오버레이로, 탭 이동 없이 독립적으로 표시
  if (activeTodo) {
    return (
      <PomodoroTimer
        todo={activeTodo}
        onComplete={handleComplete}
        onDiscard={handleDiscard}
        onPauseCounted={incrementPause}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto">
      <main>
        {tab === 'calendar' && <CalendarScreen todos={todos} />}
        {tab === 'register' && <RegisterScreen onStart={handleStart} />}
        {tab === 'completed' && <CompletedScreen todos={todos} onDelete={deleteTodo} />}
      </main>

      <BottomNav active={tab} onChange={setTab} />
    </div>
  )
}

export default App
