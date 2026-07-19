import { defineConfig } from '@apps-in-toss/web-framework/config'

// 앱인토스 콘솔에 등록한 값과 반드시 일치해야 함
// appName은 콘솔에서 한 번 정하면 수정 불가 (콘솔에 'habit-pomodoro'로 등록됨)
export default defineConfig({
  appName: 'habit-pomodoro',
  brand: {
    displayName: '햅삣 뽀모도로',
    primaryColor: '#111827',
    icon: '/icon-600.png',
  },
  permissions: [],
  web: {
    // 실기기로 개발 미리보기 테스트할 땐 이 host를 폰이 접근 가능한 노트북 LAN IP로 바꾸고
    // dev 명령도 --host 0.0.0.0으로 바꿔야 함 (안드로이드 에뮬레이터에서만 10.0.2.2 사용)
    host: 'localhost',
    port: 5173,
    commands: {
      dev: 'npm run dev',
      build: 'npm run build',
    },
  },
  outdir: 'dist',
})
