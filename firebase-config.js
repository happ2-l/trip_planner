/* ============================================================
   실시간 공유 설정 (Firebase Realtime Database)
   ------------------------------------------------------------
   ※ 아래 값을 채우기 전에도 앱은 정상 동작합니다.
     (단, 공유 없이 "이 기기에만" 저장됩니다 = 오프라인 모드)

   친구들과 실시간 공유하려면 README.md 의 "실시간 공유 설정"
   순서대로 진행한 뒤, 아래 값을 본인 프로젝트 값으로 교체하세요.
   세 명 모두 같은 파일(같은 값)을 쓰면 같은 "방"에 들어갑니다.
   ============================================================ */

window.FIREBASE_CONFIG = {
  apiKey: "PASTE_YOUR_API_KEY",
  authDomain: "PASTE.firebaseapp.com",
  databaseURL: "https://PASTE-default-rtdb.firebaseio.com",
  projectId: "PASTE",
  appId: "PASTE",
};

// 같은 값이면 같은 일정을 공유합니다. 우리끼리만 아는 값으로 바꿔도 OK.
window.TRIP_ID = "tokyo-2026-06-우리팀";
