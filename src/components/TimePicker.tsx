interface Props {
  totalMinutes: number
  onChange: (minutes: number) => void
}

const MIN_MINUTES = 10
const MAX_MINUTES = 180

// 알람 설정처럼 시/분을 각각 +/- 로 조절하는 피커
export default function TimePicker({ totalMinutes, onChange }: Props) {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  const clamp = (v: number) => Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, v))

  const changeHours = (delta: number) => {
    onChange(clamp((hours + delta) * 60 + minutes))
  }

  const changeMinutes = (delta: number) => {
    onChange(clamp(hours * 60 + minutes + delta))
  }

  const Column = ({
    value,
    unit,
    onUp,
    onDown,
  }: {
    value: number
    unit: string
    onUp: () => void
    onDown: () => void
  }) => (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={onUp}
        className="w-10 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 text-lg"
      >
        ▲
      </button>
      <div className="w-16 text-center">
        <span className="text-3xl font-semibold text-gray-800 tabular-nums">
          {String(value).padStart(2, '0')}
        </span>
        <span className="text-xs text-gray-400 ml-1">{unit}</span>
      </div>
      <button
        type="button"
        onClick={onDown}
        className="w-10 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 text-lg"
      >
        ▼
      </button>
    </div>
  )

  return (
    <div className="flex items-center justify-center gap-6 bg-gray-50 rounded-2xl py-5">
      <Column value={hours} unit="시간" onUp={() => changeHours(1)} onDown={() => changeHours(-1)} />
      <span className="text-2xl text-gray-300 font-light mb-4">:</span>
      <Column
        value={minutes}
        unit="분"
        onUp={() => changeMinutes(10)}
        onDown={() => changeMinutes(-10)}
      />
    </div>
  )
}
