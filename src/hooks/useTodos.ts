import { useEffect, useState } from 'react'
import type { Todo } from '../types'

// 미리보기 단계: 로컬 저장소로 동작. 실제 배포 시 Supabase + 토스 로그인으로 교체 예정.
const STORAGE_KEY = 'habit_pomodoro_todos_v2'

function loadTodos(): Todo[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as Todo[]
  } catch {
    return []
  }
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => loadTodos())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const addTodo = (data: Omit<Todo, 'id' | 'isCompleted' | 'pauseCount' | 'createdAt' | 'completedAt'>) => {
    const todo: Todo = {
      ...data,
      id: crypto.randomUUID(),
      isCompleted: false,
      pauseCount: 0,
      createdAt: new Date().toISOString(),
      completedAt: null,
    }
    setTodos(prev => [todo, ...prev])
    return todo
  }

  const incrementPause = (id: string) => {
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, pauseCount: t.pauseCount + 1 } : t)))
  }

  const completeTodo = (id: string) => {
    setTodos(prev =>
      prev.map(t =>
        t.id === id ? { ...t, isCompleted: true, completedAt: new Date().toISOString() } : t
      )
    )
  }

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  return { todos, addTodo, incrementPause, completeTodo, deleteTodo }
}
