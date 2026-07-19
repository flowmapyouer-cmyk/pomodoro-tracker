import type { Priority } from '../types'
import { PRIORITY_META } from '../types'

interface Props {
  value: Priority
  onChange: (p: Priority) => void
}

const ORDER: Priority[] = ['urgent', 'normal', 'low']

export default function PriorityPicker({ value, onChange }: Props) {
  return (
    <div className="flex gap-2">
      {ORDER.map(p => {
        const meta = PRIORITY_META[p]
        const selected = value === p
        return (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1 ${
              selected ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            <span>{meta.emoji}</span>
            <span>{meta.label}</span>
          </button>
        )
      })}
    </div>
  )
}
