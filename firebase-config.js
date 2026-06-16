/* ============================================================
   실시간 공유 설정 (Firebase) — happ2-l / trip-planner
   세 명이 같은 주소로 접속하면 같은 방(TRIP_ID)에서 공유됩니다.
   apiKey는 비밀이 아니라 식별자라 공개돼도 안전합니다.
   (보안은 Authentication 로그인 + DB 규칙 auth!=null 이 담당)
   ============================================================ */

window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyB_qBIfQshohryFNzVZ1XPxU5IPQOJjY7Q",
  authDomain: "trip-planner-ef802.firebaseapp.com",
  databaseURL: "https://trip-planner-ef802-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "trip-planner-ef802",
  storageBucket: "trip-planner-ef802.firebasestorage.app",
  messagingSenderId: "711164080128",
  appId: "1:711164080128:web:42cba1b1a3ed70a95fe8e5",
};

// 우리만 아는 방 이름 (친구 3명 모두 이 값으로 같은 일정 공유)
window.TRIP_ID = "tokyo2026-happ2-x9f2k7";

// (선택) 구글 플레이스 검색·실사진·평점용 키. 비워두면 무료 OSM 검색 사용.
// 도메인 제한(referrer)을 happ2-l.github.io 로 걸어야 안전합니다.
window.MAPS_API_KEY = "PASTE_MAPS_KEY";
