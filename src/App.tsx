import { useEffect, useRef, useState } from 'react'
import { useTodos } from './hooks/useTodos'
import type { Todo, Priority } from './types'
import BottomNav from './components/BottomNav'
import type { Tab } from './components/BottomNav'
import RegisterScreen from './components/RegisterScreen'
import CalendarScreen from './components/CalendarScreen'
import CompletedScreen from './components/CompletedScreen'
import PomodoroTimer from './components/PomodoroTimer'
import OnboardingOverlay from './components/OnboardingOverlay'

const todayStr = () => new Date().toISOString().split('T')[0]

const ONBOARDING_DONE_KEY = 'onboarding_done'

type AdvanceMode = 'anywhere' | 'target' | 'final'
interface OnboardingStepDef {
  key: string | null
  advance: AdvanceMode
  message: string
}

// 온보딩 11단계: 실제 화면 요소를 스포트라이트로 잡고, 실제 조작에 반응해서 진행된다
const ONBOARDING_STEPS: OnboardingStepDef[] = [
  { key: 'titleInput', advance: 'anywhere', message: '일정 이름을 입력해요. 예시로 "테스트"를 넣어봤어요.' },
  { key: 'dateInput', advance: 'anywhere', message: '원하는 날짜를 선택할 수 있어요.' },
  { key: 'durationPicker', advance: 'anywhere', message: '10분 단위로 집중 시간을 정해요. 최소 10분부터예요.' },
  { key: 'priorityPicker', advance: 'anywhere', message: '일정의 우선순위를 골라요.' },
  { key: 'startButton', advance: 'target', message: '눌러서 집중을 시작해요.' },
  { key: 'navCalendar', advance: 'target', message: '한 달간의 몰입 기록을 모아볼 수 있어요.' },
  { key: 'todayCell', advance: 'anywhere', message: '완주한 기록이 별처럼 쌓여있어요.' },
  { key: 'monthlyStats', advance: 'anywhere', message: '당신의 몰입 데이터가 정직하게 쌓입니다.' },
  { key: 'navCompleted', advance: 'target', message: '완주한 일정을 상세히 확인해 보세요.' },
  { key: 'completedItem', advance: 'target', message: '집중한 시간과 쉼의 기록을 볼 수 있어요.' },
  { key: null, advance: 'final', message: '당신의 정직한 몰입을 응원합니다. 시작해볼까요?' },
]

function App() {
  const { todos, addTodo, incrementPause, completeTodo, deleteTodo } = useTodos()
  const [tab, setTab] = useState<Tab>('register')
  const [activeTodo, setActiveTodo] = useState<Todo | null>(null)

  // 할일 등록 폼 상태 (온보딩이 값을 직접 채워야 해서 App으로 끌어올림)
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(todayStr())
  const [durationMinutes, setDurationMinutes] = useState(30)
  const [priority, setPriority] = useState<Priority>('normal')

  const resetForm = () => {
    setTitle('')
    setDate(todayStr())
    setDurationMinutes(30)
    setPriority('normal')
  }

  // 온보딩 상태
  const [onboardingStep, setOnboardingStep] = useState<number | null>(null)
  const [onboardingTodoId, setOnboardingTodoId] = useState<string | null>(null)
  const targetRefs = useRef<Record<string, HTMLElement | null>>({})
  const [, bump] = useState(0)
  const registerTarget = (key: string) => (el: HTMLElement | null) => {
    targetRefs.current[key] = el
    bump(v => v + 1)
  }

  // 처음 방문이면 온보딩 시작
  useEffect(() => {
    if (localStorage.getItem(ONBOARDING_DONE_KEY) !== 'true') {
      setOnboardingStep(0)
    }
  }, [])

  // 단계 진입 시 자동으로 값 채우기(제목/집중시간/우선순위)
  useEffect(() => {
    if (onboardingStep === 0) setTitle('테스트')
    else if (onboardingStep === 2) setDurationMinutes(10)
    else if (onboardingStep === 3) setPriority('normal')
  }, [onboardingStep])

  // "시작" 단계: 실제 타이머 화면이 잠깐 보인 뒤 바로 10분 완료 처리
  useEffect(() => {
    if (onboardingStep === 4 && activeTodo) {
      setOnboardingTodoId(activeTodo.id)
      const timer = setTimeout(() => {
        completeTodo(activeTodo.id)
        setActiveTodo(null)
        setOnboardingStep(5)
      }, 700)
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onboardingStep, activeTodo])

  // "월간 트래커" 탭을 실제로 눌러야 다음 단계로
  useEffect(() => {
    if (onboardingStep === 5 && tab === 'calendar') setOnboardingStep(6)
  }, [onboardingStep, tab])

  // "완료 항목" 탭을 실제로 눌러야 다음 단계로
  useEffect(() => {
    if (onboardingStep === 8 && tab === 'completed') setOnboardingStep(9)
  }, [onboardingStep, tab])

  const handleItemOpen = (id: string) => {
    if (onboardingStep === 9 && id === onboardingTodoId) setOnboardingStep(10)
  }

  const finishOnboarding = () => {
    if (onboardingTodoId) deleteTodo(onboardingTodoId)
    localStorage.setItem(ONBOARDING_DONE_KEY, 'true')
    setOnboardingStep(null)
    setOnboardingTodoId(null)
    setTab('register')
  }

  const handleStart = () => {
    if (!title.trim()) return
    const todo = addTodo({ title: title.trim(), date, durationMinutes, priority })
    setActiveTodo(todo)
    resetForm()
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

  // 뽀모도로 화면: 전체 화면 오버레이로, 탭 이동 없이 독립적으로 표시 (온보딩 오버레이는 안 띄움)
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

  const currentStep = onboardingStep !== null ? ONBOARDING_STEPS[onboardingStep] : null

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto">
      <main>
        {tab === 'calendar' && <CalendarScreen todos={todos} registerTarget={registerTarget} />}
        {tab === 'register' && (
          <RegisterScreen
            title={title}
            onTitleChange={setTitle}
            date={date}
            onDateChange={setDate}
            durationMinutes={durationMinutes}
            onDurationChange={setDurationMinutes}
            priority={priority}
            onPriorityChange={setPriority}
            onStart={handleStart}
            registerTarget={registerTarget}
          />
        )}
        {tab === 'completed' && (
          <CompletedScreen
            todos={todos}
            onDelete={deleteTodo}
            registerTarget={registerTarget}
            onboardingTargetId={onboardingTodoId}
            onItemOpen={handleItemOpen}
          />
        )}
      </main>

      <BottomNav active={tab} onChange={setTab} registerTarget={registerTarget} />

      {currentStep && (
        <OnboardingOverlay
          targetEl={currentStep.key ? targetRefs.current[currentStep.key] : null}
          message={currentStep.message}
          advance={currentStep.advance}
          onAdvance={() =>
            setOnboardingStep(s => (s !== null ? Math.min(s + 1, ONBOARDING_STEPS.length - 1) : s))
          }
          onFinish={finishOnboarding}
          buttonLabel="몰입 시작하기"
        />
      )}
    </div>
  )
}

export default App
