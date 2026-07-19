interface Props {
  onExitWithoutSaving: () => void
  onPause: () => void
}

export default function ExitConfirmModal({ onExitWithoutSaving, onPause }: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 px-4 pb-4 sm:pb-0">
      <div className="bg-white rounded-2xl p-6 w-full max-w-xs shadow-xl">
        <h3 className="text-base font-semibold text-gray-800 mb-2">잠시 숨을 고를 시간인가요?</h3>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          타이머를 일시정지해 두고 나중에 이어할 수 있어요.
          <br />
          지금 일정을 완전히 종료하시겠어요?
        </p>
        <div className="flex gap-2">
          <button
            onClick={onExitWithoutSaving}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            그냥 종료할게요
          </button>
          <button
            onClick={onPause}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-gray-900 text-white hover:bg-gray-700 transition-colors"
          >
            일시정지할게요
          </button>
        </div>
      </div>
    </div>
  )
}
