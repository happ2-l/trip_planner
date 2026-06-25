/* ===== 여행 기본 데이터 (오프라인 내장) ===== */

window.TRIP = {
  title: "도쿄",
  jp: "東京",
  start: "2026-06-26",
  end: "2026-06-28",
  dateLabel: "6.26 – 6.28",
  sub: "2026 · 2박 3일",
};

/* 환율: 100엔 = 950원 (1엔 = 9.5원). 앱에서 정산 통화 환산에 사용 */
window.FX = { krwPerJpy: 9.5 };

/* 친구 3명 (이름은 앱에서 수정 가능, 색은 고정) */
window.PEOPLE_DEFAULT = {
  m: { name: "민준", color: "#b23b3b", order: 0 },
  s: { name: "서연", color: "#3c5a6e", order: 1 },
  j: { name: "지호", color: "#4f6b4a", order: 2 },
};

/* 일정. d2는 근교 당일치기 = 플랜 전환 가능(daytrip:true) */
window.DAYS = [
  {
    key: "d1", dow: "금", dateKR: "6월 26일", theme: "도착 · 다이칸야마/나카메구로 & 에비스 밤",
    items: [
      { key: "d1-1", time: "10:25", title: "인천공항 출발", jp: "仁川出発", sub: "ICN → 도쿄, 약 2시간 30분 비행", tag: "이동", pid: null },
      { key: "d1-2", time: "12:55", title: "도쿄 도착 · 입국", jp: "東京着", sub: "Visit Japan Web QR 준비 · 수하물 후 신주쿠로", tag: "이동", pid: null },
      { key: "d1-3", time: "14:30", title: "신주쿠 호텔 체크인 · 짐 풀기", jp: "ホテル", sub: "짐 풀고 다이칸야마행 (신주쿠서 ~25분)", tag: "숙소", pid: null },
      { key: "d1-4", time: "15:30", title: "다이칸야마 T-SITE & 콘란샵", jp: "代官山", sub: "숲속 서점 츠타야 + 콘란샵 등 디자인·라이프스타일 편집숍", tag: "쇼핑", pid: "daikanyama" },
      { key: "d1-5", time: "16:45", title: "나카메구로 디자인숍 + 강변", jp: "中目黒", sub: "1LDK·SO 나카메구로, 메구로강 따라 편집숍·스페셜티 커피", tag: "쇼핑", pid: "onelldk" },
      { key: "d1-6", time: "17:45", title: "그린 빈 투 바 초콜릿", jp: "Bean to Bar", sub: "빈투바 초콜릿 디저트 카페에서 한숨 돌리기", tag: "디저트", pid: "greenbeantobar" },
      { key: "d1-7", time: "19:30", title: "저녁 — 요로니쿠 (에비스)", jp: "よろにく", sub: "컬트 와규 야키니쿠. 예약 필수(오픈 즉시 잡기)", tag: "식사", pid: "yoroniku" },
      { key: "d1-8", time: "21:30", title: "바 투어 — 발츠 → 트렌치 → 반텐", jp: "Ebisu Bars", sub: "내추럴와인 서서 한잔 → 칵테일 → 청음 레코드바", tag: "한잔", pid: "waltz" },
    ],
  },
  { key: "d2", dow: "토", dateKR: "6월 27일", daytrip: true },
  {
    key: "d3", dow: "일", dateKR: "6월 28일", theme: "오모테산도 디자인·디저트 & 출국",
    items: [
      { key: "d3-1", time: "09:30", title: "조식 & 체크아웃(짐 보관)", jp: "ホテル", sub: "프런트에 캐리어 맡기기", tag: "숙소", pid: null },
      { key: "d3-2", time: "10:00", title: "코히 마메야 + 오모테산도 플래그십", jp: "表参道", sub: "스페셜티 커피 한 잔 후 Acne·오니츠카·건축 산책", tag: "쇼핑", pid: "koffeemameya" },
      { key: "d3-3", time: "11:00", title: "나나야 마차 젤라토", jp: "茶々", sub: "마차 농도 7단계, No.7는 세계 최고 농도", tag: "디저트", pid: "nanaya" },
      { key: "d3-4", time: "11:45", title: "도큐 푸드쇼 (막판 쇼핑)", jp: "東急フードショー", sub: "시부야역 데파치카 — 디저트·간식·기념품 싹쓸이", tag: "쇼핑", pid: "tokyufoodshow" },
      { key: "d3-5", time: "12:45", title: "가벼운 점심 · 짐 픽업", jp: "ランチ", sub: "공항 가기 전 가볍게", tag: "식사", pid: null },
      { key: "d3-6", time: "13:30", title: "공항으로 출발", jp: "空港へ", sub: "여유 있게 (출발 2시간+ 전)", tag: "이동", pid: null },
      { key: "d3-7", time: "16:50", title: "도쿄 출발", jp: "東京発", sub: "탑승 · 귀국길", tag: "이동", pid: null },
      { key: "d3-8", time: "19:40", title: "인천 도착", jp: "仁川着", sub: "수고했어요!", tag: "이동", pid: null },
    ],
  },
];

/* 2일차 플랜 전환 (앱 일정 탭에서 탭 한 번). 도쿄 시내 = 자유 일정 / 나머지는 근교 당일치기 */
window.DAYTRIPS = [
  {
    key: "tokyo", label: "도쿄 시내", theme: "태풍 대비 · 도쿄 시내 쇼핑 & 먹거리 (자유 일정 — ＋ 또는 시간 사이를 탭해 채우기)",
    items: [],
  },
  {
    key: "kawagoe", label: "가와고에", theme: "가와고에 코에도 — 사진 & 디저트 (Plan A)",
    items: [
      { key: "kw-1", time: "08:40", title: "신주쿠 출발 (코에도 특급)", jp: "川越へ", sub: "세이부신주쿠선 혼카와고에 ~45분. 가와고에 액세스 티켓 ¥1,800 왕복", tag: "이동", pid: null },
      { key: "kw-2", time: "10:00", title: "다이쇼 로망 거리", jp: "大正浪漫夢通り", sub: "1920년대 레트로 서양식 거리, 이른 시간 한산할 때", tag: "포토", pid: "kw_taisho" },
      { key: "kw-3", time: "10:30", title: "구라즈쿠리 거리 + 토키노카네", jp: "時の鐘", sub: "에도 창고거리 + 종루 인생샷. 11:30 전에 촬영", tag: "포토", pid: "kw_kurazukuri" },
      { key: "kw-4", time: "11:00", title: "고구마 디저트 크롤", jp: "さつまいも", sub: "오사츠안 부채 고구마칩+소프트, 고구마 치즈케이크, 마차 크레페", tag: "디저트", pid: "kw_osatsuan" },
      { key: "kw-5", time: "11:45", title: "카시야 요코초 (과자 골목)", jp: "菓子屋横丁", sub: "쇼와 감성 과자 골목, 센베이·당고·드리블", tag: "포토", pid: "kw_kashiya" },
      { key: "kw-6", time: "13:30", title: "히카와 신사 풍령 터널", jp: "氷川神社", sub: "1,500개 에도 유리 풍령 + 하트 에마. 6/27 풍령축제 개막!", tag: "포토", pid: "kw_hikawa" },
      { key: "kw-7", time: "15:25", title: "신주쿠로 복귀", jp: "新宿へ", sub: "코에도 특급 ~45분, 17:00 전 도착", tag: "이동", pid: null },
      { key: "kw-8", time: "19:00", title: "저녁 — 우카이테이 오모테산도", jp: "うかい亭", sub: "아르누보 룸의 철판야키. 단체도 2~4주 전 예약 가능", tag: "식사", pid: "ukaitei" },
    ],
  },
  {
    key: "kamakura", label: "가마쿠라", theme: "가마쿠라·에노시마 수국 인생샷 (Plan B)",
    items: [
      { key: "km-1", time: "07:30", title: "신주쿠 출발 (쇼난신주쿠라인)", jp: "鎌倉へ", sub: "기타카마쿠라 직통 ~1시간. 토요일은 일찍! 비 오면 수국 더 예쁨", tag: "이동", pid: null },
      { key: "km-2", time: "08:30", title: "메이게쓰인", jp: "明月院", sub: "수국 + '깨달음의 둥근 창' 인생샷. 개문 직후 오픈런", tag: "포토", pid: "meigetsuin" },
      { key: "km-3", time: "10:15", title: "하세데라 수국길", jp: "長谷寺", sub: "언덕 수국길 + 사가미만 바다. 시간지정권 온라인 예매(6/23경)", tag: "포토", pid: "hasedera" },
      { key: "km-4", time: "11:45", title: "점심 — 요리도코로", jp: "由比ガ浜", sub: "에노덴 지나가는 시라스동 맛집(생시라스 제철)", tag: "식사", pid: "yoridokoro" },
      { key: "km-5", time: "12:45", title: "가마쿠라코코마에 건널목", jp: "鎌倉高校前", sub: "슬램덩크 그 건널목 — 바다 + 에노덴 인생샷", tag: "포토", pid: "slamdunk" },
      { key: "km-6", time: "13:30", title: "에노시마 + 씨캔들", jp: "江の島", sub: "섬 산책 + 전망대. 흐려도/노을에도 그림", tag: "포토", pid: "enoshima" },
      { key: "km-7", time: "15:30", title: "쇼난모노레일 → 도쿄 복귀", jp: "東京へ", sub: "오후나 경유, 약 17:00 도착", tag: "이동", pid: null },
      { key: "km-8", time: "19:00", title: "저녁 — 우카이테이 오모테산도", jp: "うかい亭", sub: "아르누보 룸의 철판야키. 2~4주 전 예약 가능", tag: "식사", pid: "ukaitei" },
    ],
  },
  {
    key: "fuji", label: "후지산", theme: "후지산 인생샷 (Plan C · 날씨 도박)",
    items: [
      { key: "fj-1", time: "06:00", title: "신주쿠 출발 (전세차/버스)", jp: "富士山へ", sub: "이른 출발이 핵심 — 6월은 오전 7시 전 후지산 볼 확률 최고", tag: "이동", pid: null },
      { key: "fj-2", time: "08:00", title: "츄레이토 파고다", jp: "忠霊塔", sub: "오층탑 + 후지산 인생샷. 398계단, 오전 맑을 때 직행", tag: "포토", pid: "chureito" },
      { key: "fj-3", time: "09:30", title: "로손 가와구치코", jp: "ローソン", sub: "편의점 위로 솟은 후지산 짤. 가림막 있음·무단횡단 금지", tag: "포토", pid: "lawsonfuji" },
      { key: "fj-4", time: "10:00", title: "오이시 공원 (라벤더)", jp: "大石公園", sub: "라벤더 + 호수 + 후지산. 6월 말 라벤더 개화 피크", tag: "포토", pid: "oishipark" },
      { key: "fj-5", time: "11:00", title: "가와구치코 호반", jp: "河口湖", sub: "바람 없으면 역(逆)후지 반영샷", tag: "포토", pid: "kawaguchiko" },
      { key: "fj-6", time: "12:00", title: "점심 — 호토 후도", jp: "ほうとう不動", sub: "야마나시 명물 호토 누들, 구름 모양 건축물도 포토존", tag: "식사", pid: "hotofudo" },
      { key: "fj-7", time: "13:30", title: "오시노 핫카이", jp: "忍野八海", sub: "맑은 용천 연못 마을 — 흐리거나 비 와도 그림 됨", tag: "포토", pid: "oshino" },
      { key: "fj-8", time: "14:30", title: "도쿄로 복귀", jp: "東京へ", sub: "약 2시간 · 토요일 정체 대비", tag: "이동", pid: null },
      { key: "fj-9", time: "19:00", title: "저녁 — 우카이테이 오모테산도", jp: "うかい亭", sub: "아르누보 룸의 철판야키. 2~4주 전 예약 가능", tag: "식사", pid: "ukaitei" },
    ],
  },
];

/* 장소 세그먼트 */
window.SEGMENTS = [
  { key: "shop", label: "쇼핑", color: "#3c5a6e" },
  { key: "food", label: "식당", color: "#b23b3b" },
  { key: "bar", label: "술", color: "#8a6d3b" },
  { key: "dessert", label: "디저트", color: "#b5497a" },
];
// trip은 카테고리에서 제외(2일차 근교 일정은 유지) — 색은 혹시 모를 참조용으로 남김
window.SEG_COLOR = { shop: "#3c5a6e", food: "#b23b3b", bar: "#8a6d3b", dessert: "#b5497a", trip: "#4f6b4a" };

/* 장소 큐레이션. list = 도쿄 세그먼트, trip = 근교 플랜 키. pinNum = 도쿄 지도 번호핀 */
window.PLACES = [
  /* ── 쇼핑 (디자인·라이프스타일·럭셔리) ── */
  { id: "daikanyama", name: "다이칸야마 T-SITE", jp: "代官山 蔦屋", area: "다이칸야마", cat: "디자인·서점", hours: "09:00–22:00", note: "클라인 다이섬 설계의 '숲속 도서관' 츠타야. 잡지 거리, 디자인·아트·사진집, 2층 안진 라운지. 이른 아침 한산할 때가 베스트.", tip: "바로 옆 콘란샵에서 어른 취향 홈웨어까지.", list: "shop", pinNum: 1, lat: 35.6485, lng: 139.6995, mapq: "Daikanyama T-Site" },
  { id: "conran", name: "더 콘란샵 다이칸야마", jp: "The Conran Shop", area: "다이칸야마", cat: "홈웨어", hours: "11:00–19:00", note: "아시아 감성으로 에디팅한 콘란샵. 이 동네 최고의 큐레이션 홈·디자인 오브제 쇼핑.", tip: "", list: "shop", lat: 35.6489, lng: 139.7001, mapq: "The Conran Shop Daikanyama" },
  { id: "onelldk", name: "1LDK 나카메구로", jp: "1LDK", area: "나카메구로", cat: "라이프스타일", hours: "12:00–20:00", note: "영향력 있는 1LDK 클러스터의 본점 — 의류·푸드·홈웨어·세라믹. 디자인 오브제와 그릇이 강점.", tip: "근처 SO 나카메구로(편집숍)도 함께.", list: "shop", pinNum: 2, lat: 35.6447, lng: 139.6985, mapq: "1LDK Nakameguro" },
  { id: "sonakameguro", name: "SO 나카메구로", jp: "SO", area: "나카메구로", cat: "컨셉 스토어", hours: "12:00–19:00", note: "60년 된 주택을 개조한 큐레이티드 라이프스타일 복합숍. 자체 제작 + 해외 라벨 + 생활 잡화.", tip: "조용한 주택가 뒷골목, 영업시간 확인.", list: "shop", lat: 35.6440, lng: 139.6975, mapq: "SO Nakameguro" },
  { id: "harakado", name: "하라카도", jp: "ハラカド", area: "하라주쿠", cat: "복합몰", hours: "11:00–21:00", note: "2024년 오픈한 하라주쿠 신상 랜드마크. 75개 숍, 크리에이터 팝업, 잡지 라이브러리, 지하 센토, 루프탑.", tip: "맞은편 오모카도와 함께.", list: "shop", pinNum: 4, lat: 35.6685, lng: 139.7030, mapq: "Harakado Tokyu Plaza Harajuku" },
  { id: "acne", name: "아크네 스튜디오 아오야마", jp: "Acne Studios", area: "아오야마", cat: "플래그십", hours: "11:00–20:00", note: "2025.7 오픈한 3층 신규 플래그십. 맥스 램 가구, 쿠와타 타쿠로 도예, 베누아 라로즈 조명까지 디자인 그 자체.", tip: "오모테산도 건축 산책과 묶기.", list: "shop", lat: 35.6660, lng: 139.7150, mapq: "Acne Studios Aoyama" },
  { id: "onitsuka", name: "오니츠카 타이거 오모테산도", jp: "Onitsuka Tiger", area: "오모테산도", cat: "컨셉 스토어", hours: "11:00–20:00", note: "2025.4 오픈한 'Yellow' 컨셉 스토어. 쇼지·대나무 스크린을 모티프로 한 오감 리테일.", tip: "", list: "shop", lat: 35.6668, lng: 139.7095, mapq: "Onitsuka Tiger Omotesando" },
  { id: "azabudai", name: "아자부다이 힐스", jp: "麻布台ヒルズ", area: "아자부다이", cat: "복합단지", hours: "11:00–20:00", note: "2023년 개장한 도쿄의 간판 단지. 팀랩 보더리스, Pace 갤러리, 디자인 마켓 푸드홀, 압도적 건축. 시부야보다 한산.", tip: "마켓 푸드홀 그라징 추천.", list: "shop", pinNum: 3, lat: 35.6605, lng: 139.7400, mapq: "Azabudai Hills" },
  { id: "ginzasony", name: "긴자 소니파크", jp: "銀座ソニーパーク", area: "긴자", cat: "컨셉 빌딩", hours: "프로그램별 상이", note: "2025.1 재개장한 '상주 매장 없는' 도심 공원형 빌딩. 매달 바뀌는 전시·체험 + 지하 다이닝.", tip: "방문 주 층별 프로그램 미리 체크.", list: "shop", pinNum: 5, lat: 35.6705, lng: 139.7637, mapq: "Ginza Sony Park" },

  /* ── 먹거리 (하이엔드 다이닝 + 술/바) ── */
  { id: "yoroniku", name: "요로니쿠", jp: "よろにく", area: "에비스/아오야마", cat: "와규 야키니쿠", hours: "17:00–23:00", note: "도쿄 컬트 프리미엄 와규 야키니쿠. 샤토브리앙, 실크 로스, 트러플 스키야키 샌드. 약 ¥18,000~25,000.", tip: "최난도 예약 — OMAKASE.in 오픈(약 1달 전) 즉시. 아오야마 분점이 약간 수월.", list: "food", pinNum: 6, lat: 35.6470, lng: 139.7110, mapq: "Yoroniku Aoyama" },
  { id: "ukaitei", name: "우카이테이 오모테산도", jp: "うかい亭", area: "오모테산도", cat: "철판야키", hours: "런치·디너 (시간대 예약)", note: "아르누보풍 방에서 즐기는 극장형 철판야키. ¥18,000~30,000. 영어 응대, 단체도 2~4주 전 예약이 현실적으로 가능.", tip: "공식 사이트/TableCheck 예약.", list: "food", lat: 35.6668, lng: 139.7090, mapq: "Ukai-tei Omotesando" },
  { id: "ushigoro", name: "우시고로 S. 긴자", jp: "牛喰 S.", area: "긴자", cat: "야키니쿠 오마카세", hours: "디너", note: "미쉐린 A5 와규 오마카세 카운터. ¥25,000~30,000. 꽉 차면 우시고로 그룹 일반점(~¥15,000)이 훨씬 수월.", tip: "OMAKASE.in / TableCheck 예약.", list: "food", lat: 35.6717, lng: 139.7640, mapq: "Ushigoro S Ginza" },
  { id: "kappomuroi", name: "갓포 무로이", jp: "割烹 むろい", area: "니시아자부", cat: "갓포(가이세키)", hours: "디너", note: "미쉐린 1스타 부자(父子) 갓포, 제철 해산물 중심. ¥20,000~28,000. 카운터 정통 경험인데도 몇 주 전 예약 가능.", tip: "byFood / Tableall 예약.", list: "food", lat: 35.6590, lng: 139.7230, mapq: "Kappo Muroi Nishiazabu" },
  { id: "sakaishokai", name: "사카이쇼카이", jp: "酒井商会", area: "시부야/신센", cat: "네오 이자카야", hours: "17:00–24:00", note: "편안한 카운터 이자카야. 제철 식재 + 내추럴와인·사케 셀렉션. 합리적 가격의 미식.", tip: "카운터 작음, 예약 권장.", list: "food", lat: 35.6565, lng: 139.6940, mapq: "Sakai Shokai Shibuya" },
  { id: "waltz", name: "와인스탠드 발츠", jp: "Wine Stand Waltz", area: "에비스", cat: "내추럴와인 바", hours: "15:00–23:00", note: "일본 내추럴와인 무브먼트의 상징적 인물 오야마 씨의 서서 마시는 작은 바. 바 투어 오프닝으로 완벽.", tip: "예약 없이 입장, 서서 마심.", list: "bar", lat: 35.6465, lng: 139.7100, mapq: "Wine Stand Waltz Ebisu" },
  { id: "banten", name: "반텐", jp: "番点", area: "에비스", cat: "청음 바", hours: "19:00–늦게", note: "숨은 레코드 바. 하이엔드 사운드 시스템 + 일본풍 칵테일, LP 지참 문화. 2026 청음 바 붐의 핫스팟.", tip: "작음 — DM/전화 예약 권장.", list: "bar", lat: 35.6470, lng: 139.7110, mapq: "Banten Ebisu bar" },
  { id: "bartrench", name: "바 트렌치", jp: "Bar Trench", area: "에비스", cat: "칵테일 바", hours: "18:00–늦게", note: "도쿄 크래프트 칵테일의 개척자. 진지한 한 잔. 작아서 초저녁 워크인이 유리.", tip: "", list: "bar", lat: 35.6468, lng: 139.7105, mapq: "Bar Trench Ebisu" },
  { id: "takk", name: "Takk 신센", jp: "Takk", area: "신센", cat: "청음 바", hours: "18:00–늦게", note: "2024.10 오픈한 신센 리스닝 바. 바이닐 + 위스키·진·내추럴와인. 2층 예약형 프라이빗룸도.", tip: "프라이빗룸 예약 가능.", list: "bar", lat: 35.6565, lng: 139.6930, mapq: "Takk Shinsen bar" },
  { id: "sgclub", name: "SG 클럽", jp: "SG Club", area: "시부야", cat: "칵테일 바", hours: "17:00–02:00", note: "고칸 신고의 멀티 플로어 바. 1층 캐주얼 시그니처, 지하 시가/스피크이지. 세계 베스트 바 단골.", tip: "지하 라운지는 예약 추천.", list: "bar", lat: 35.6635, lng: 139.6970, mapq: "SG Club Shibuya" },
  { id: "tokyufoodshow", name: "도큐 푸드쇼", jp: "東急フードショー", area: "시부야", cat: "데파치카", hours: "10:00–21:00", note: "시부야역 지하의 알짜 데파치카. 미쉐린급 벤또, 장인 페이스트리, 반찬·디저트.", tip: "막판 기념품·디저트·호텔 야식 픽업 최적.", list: "food", lat: 35.6585, lng: 139.7005, mapq: "Tokyu Food Show Shibuya" },

  /* ── 디저트·카페 ── */
  { id: "imdonut", name: "I'm donut?", jp: "生ドーナツ", area: "시부야/오모테산도", cat: "도넛", hours: "11:00–20:00 (조기 매진)", note: "쫀득 '나마(생) 도넛'으로 도넛 열풍을 일으킨 주인공. 시부야점은 글루텐프리 라인도(2025.8).", tip: "줄 길고 일찍 매진 — 오전에.", list: "dessert", pinNum: 7, lat: 35.6593, lng: 139.6995, mapq: "I'm donut Shibuya" },
  { id: "koffeemameya", name: "코히 마메야 오모테산도", jp: "Koffee Mameya", area: "오모테산도", cat: "스페셜티 커피", hours: "10:00–18:00", note: "원두 셀렉션 카운터의 정수. 바리스타와 상담해 고르는 한 잔. 출국일 아침 시작점으로 굿.", tip: "", list: "dessert", pinNum: 8, lat: 35.6662, lng: 139.7110, mapq: "Koffee Mameya Omotesando" },
  { id: "nanaya", name: "나나야 아오야마", jp: "茶々 ななや", area: "아오야마", cat: "마차 젤라토", hours: "11:00–19:00", note: "마차 농도 7단계 젤라토 — No.7은 세계 최고 농도의 쌉쌀함. 마차 덕후 성지.", tip: "좌석 적음, 테이크아웃 위주.", list: "dessert", lat: 35.6660, lng: 139.7120, mapq: "Nanaya Aoyama matcha gelato" },
  { id: "thematcha", name: "더 마차 도쿄", jp: "THE MATCHA TOKYO", area: "오모테산도", cat: "마차 카페", hours: "10:00–19:00", note: "유기농 마차 라떼·소프트크림, 비건 옵션. 미니멀 감성으로 SNS 인기.", tip: "포토제닉 컵, 테이크아웃 중심.", list: "dessert", lat: 35.6691, lng: 139.7065, mapq: "The Matcha Tokyo Omotesando" },
  { id: "vannelli", name: "바넬리 커피", jp: "Vannelli Coffee", area: "오모테산도", cat: "스페셜티 커피", hours: "09:00–19:00", note: "월드 바리스타·라떼아트 챔피언의 이탈리안 스페셜티 커피 플래그십(2026.2 오픈).", tip: "오전 일찍 여는 편.", list: "dessert", lat: 35.6670, lng: 139.7085, mapq: "Vannelli Coffee Omotesando" },
  { id: "initial", name: "INITIAL 오모테산도", jp: "INITIAL", area: "오모테산도", cat: "시메 파르페", hours: "13:00–23:00", note: "'마무리 파르페(시메 파르페)' 트렌드의 선두. 수제 젤라토 10종. 늦게까지.", tip: "저녁엔 예약 추천 — 바 투어 마무리로도.", list: "dessert", lat: 35.6668, lng: 139.7090, mapq: "INITIAL Omotesando parfait" },
  { id: "greenbeantobar", name: "그린 빈 투 바 초콜릿", jp: "green bean to bar", area: "나카메구로", cat: "초콜릿 카페", hours: "11:00–19:00", note: "빈투바 초콜릿 메이커 겸 세련된 디저트 카페. 초콜릿 드링크·플레이팅 디저트. 강변 사색 코스.", tip: "", list: "dessert", lat: 35.6442, lng: 139.6990, mapq: "green bean to bar chocolate Nakameguro" },
  { id: "higashiya", name: "히가시야 긴자", jp: "HIGASHIYA GINZA", area: "긴자", cat: "와가시·차", hours: "11:00–19:00", note: "모던 일본 과자 + 차 살롱. 긴자의 어른스러운 디저트 코스.", tip: "", list: "dessert", lat: 35.6713, lng: 139.7640, mapq: "Higashiya Ginza" },
  { id: "himitsudo", name: "히미츠도", jp: "ひみつ堂", area: "야나카", cat: "카키고리", hours: "10:00–18:00", note: "야나카의 전설적 빙수집. '생멜론 잔마이', 복숭아 등 6월 제철 과일 빙수가 산처럼.", tip: "번호표·긴 줄, 6월 더위엔 필수템.", list: "dessert", lat: 35.7253, lng: 139.7660, mapq: "Himitsudo Yanaka" },

  /* ── 근교 A: 가와고에 ── */
  { id: "kw_taisho", name: "다이쇼 로망 거리", jp: "大正浪漫夢通り", area: "가와고에", cat: "레트로 거리", hours: "상점 대략 10:00–18:00", note: "1920년대 서양식 레트로 파사드와 간판이 늘어선 거리. 구라즈쿠리보다 조용해 이른 아침 사진 명소.", tip: "도착 직후 한산할 때 먼저.", trip: "kawagoe", lat: 35.9135, lng: 139.4830, mapq: "大正浪漫夢通り 川越" },
  { id: "kw_kurazukuri", name: "구라즈쿠리 거리 + 토키노카네", jp: "時の鐘", area: "가와고에", cat: "포토스팟", hours: "24시간 (상점 10:00~)", note: "검은 흙벽의 에도 상인가옥 거리 '코에도'와 상징 종루 토키노카네. 가와고에 시그니처 컷.", tip: "11:30 전·흐린 날 빛이 부드러워 베스트. 근처 마치야 스타벅스도 포토존.", trip: "kawagoe", lat: 35.9155, lng: 139.4836, mapq: "時の鐘 川越" },
  { id: "kw_kashiya", name: "카시야 요코초 (과자 골목)", jp: "菓子屋横丁", area: "가와고에", cat: "포토스팟·먹거리", hours: "상점 대략 10:00–17:00", note: "알록달록한 쇼와 감성 과자 골목. 센베이·당고·막과자 군것질 + 사진.", tip: "정오 전이 덜 붐빔, 골목 좁음.", trip: "kawagoe", lat: 35.9180, lng: 139.4825, mapq: "菓子屋横丁 川越" },
  { id: "kw_hikawa", name: "가와고에 히카와 신사", jp: "氷川神社", area: "가와고에", cat: "풍령·인연", hours: "08:00–18:00 (풍령축제 09:00–20:00)", note: "1,500여 개 에도 유리 풍령 터널 + 하트 에마 + 밤 라이트업 강. 인연(縁)으로 유명. 6/27~9/6 '엔무스비 풍령축제' 개막.", tip: "정오엔 붐빔 — 풍령 터널이 핵심샷, 여유 있게.", trip: "kawagoe", lat: 35.9258, lng: 139.4889, mapq: "川越氷川神社" },
  { id: "kw_osatsuan", name: "코에도 오사츠안", jp: "小江戸おさつ庵", area: "가와고에", cat: "고구마 디저트", hours: "10:00–17:00", note: "부채 모양으로 튀긴 고구마칩 + 고구마 소프트크림. 토키노카네 근처 대표 먹킷리스트 사진 간식.", tip: "줄 설 수 있음.", trip: "kawagoe", lat: 35.9152, lng: 139.4840, mapq: "小江戸おさつ庵" },
  { id: "kw_cheesecake", name: "가와고에 치즈케이크", jp: "川越チーズケーキ", area: "가와고에", cat: "디저트", hours: "10:00–17:00", note: "고구마 '이몬부랑' 몽블랑 치즈케이크. 가와고에 첫 치즈케이크 전문점(2023, 인기).", tip: "이치반가이, 핸드헬드.", trip: "kawagoe", lat: 35.9148, lng: 139.4837, mapq: "川越チーズケーキ" },
  { id: "kw_matcha", name: "마차 아라타", jp: "抹茶あらた", area: "가와고에", cat: "마차 디저트", hours: "10:30–17:30", note: "가와고에 마차 소스 + 차 커스터드의 수제 크레페. 선명한 초록빛, 과자 골목 포토 디저트.", tip: "", trip: "kawagoe", lat: 35.9178, lng: 139.4827, mapq: "抹茶あらた 川越" },

  /* ── 근교 B: 가마쿠라·에노시마 ── */
  { id: "meigetsuin", name: "메이게쓰인", jp: "明月院", area: "기타카마쿠라", cat: "수국 사찰", hours: "6월 08:30–17:00", note: "'아지사이데라'. 온통 파란 '메이게쓰인 블루' 수국길과 '깨달음의 둥근 창(悟りの窓)'이 시그니처 인생샷.", tip: "토요일은 개문 8:30 전 줄. 둥근 창부터 먼저.", trip: "kamakura", lat: 35.3372, lng: 139.5510, mapq: "Meigetsuin Temple Kamakura" },
  { id: "hasedera", name: "하세데라 수국길", jp: "長谷寺", area: "하세", cat: "수국·바다", hours: "08:00–17:00", note: "언덕에 2,500그루 수국길 + 사가미만 바다를 한 프레임에. 흐린 날이 오히려 베스트.", tip: "수국길 시간지정권 온라인 예매(매주 화 10:00, 6/23경).", trip: "kamakura", lat: 35.3120, lng: 139.5340, mapq: "Hasedera Temple Kamakura" },
  { id: "yoridokoro", name: "요리도코로", jp: "より処", area: "이나무라가사키", cat: "시라스동 카페", hours: "07:00–18:00 (소진시 마감)", note: "에노덴이 붉은 벽돌 카페 앞을 지나가는 풍경 + 생/삶은 시라스 정식·드립커피. 동네 최고 포토제닉 식사.", tip: "줄 김 — 오픈런 or 피크 피해서.", trip: "kamakura", lat: 35.3060, lng: 139.5300, mapq: "Yoridokoro Kamakura" },
  { id: "slamdunk", name: "가마쿠라코코마에 건널목", jp: "鎌倉高校前", area: "고시고에", cat: "포토스팟", hours: "24시간", note: "슬램덩크 오프닝의 그 건널목 — 바다 + 에노덴이 한 컷에.", tip: "주말 혼잡, 에노시마 방향 열차를 기다려 촬영.", trip: "kamakura", lat: 35.3068, lng: 139.5010, mapq: "Kamakura Kokomae Station crossing" },
  { id: "enoshima", name: "에노시마 + 씨캔들", jp: "江の島", area: "에노시마", cat: "전망·해안", hours: "씨캔들 09:00–20:00", note: "다리 건너 섬 산책, 사무엘 코킹 가든의 씨캔들 전망대. 흐린 날·노을에도 강한 그림.", tip: "노을 노리면 더 좋음.", trip: "kamakura", lat: 35.2996, lng: 139.4800, mapq: "Enoshima Sea Candle" },
  { id: "oxymoron", name: "옥시모론 코마치", jp: "OXYMORON", area: "가마쿠라 코마치", cat: "카레 카페", hours: "11:00–18:00", note: "디자인 감각의 모던 '에스닉' 카레. 가마쿠라 인기 카페, 코마치도리의 알짜.", tip: "대기 가능 — 시간 여유 있을 때.", trip: "kamakura", lat: 35.3193, lng: 139.5520, mapq: "OXYMORON komachi Kamakura" },

  /* ── 근교 C: 후지산 ── */
  { id: "chureito", name: "츄레이토 파고다", jp: "忠霊塔", area: "후지요시다", cat: "포토스팟", hours: "24시간 (경내 06:00~)", note: "아라쿠라야마 센겐공원의 붉은 오층탑 + 후지산을 한 프레임에. 무료.", tip: "일출~오전 8시! 6월은 이 시간대가 정상 볼 유일한 찬스. 398계단.", trip: "fuji", lat: 35.4002, lng: 138.8004, mapq: "Chureito Pagoda" },
  { id: "lawsonfuji", name: "로손 가와구치코", jp: "ローソン", area: "후지카와구치코", cat: "포토스팟", hours: "24시간", note: "편의점 위로 후지산이 솟은 바이럴 짤.", tip: "2025.8 가림막 설치 — 그 위/옆 촬영, 무단횡단 금지(단속).", trip: "fuji", lat: 35.4970, lng: 138.7660, mapq: "Lawson 富士河口湖町役場前" },
  { id: "oishipark", name: "오이시 공원", jp: "大石公園", area: "가와구치코 북안", cat: "포토스팟", hours: "24시간", note: "라벤더 꽃밭 + 호수 + 후지산. 6월 말 라벤더 자연 개화 피크.", tip: "오전 9:30~11시, 한낮 안개 전에.", trip: "fuji", lat: 35.5230, lng: 138.7560, mapq: "Oishi Park Kawaguchiko" },
  { id: "kawaguchiko", name: "가와구치코 호반", jp: "河口湖", area: "가와구치코", cat: "포토스팟", hours: "24시간", note: "잔잔한 수면에 비치는 역(逆)후지. 맑고 바람 없는 이른 아침이 베스트.", tip: "북안 전망 포인트(가와구치코 대교 부근).", trip: "fuji", lat: 35.5170, lng: 138.7560, mapq: "Lake Kawaguchi north shore" },
  { id: "oshino", name: "오시노 핫카이", jp: "忍野八海", area: "오시노", cat: "포토스팟", hours: "24시간 (상점 09:00~17:00)", note: "맑은 용천 연못 8곳 + 초가지붕 마을 + 후지 배경. 흐리거나 비 와도 그림이 되는 '우천 보험'.", tip: "오후/흐림에도 OK.", trip: "fuji", lat: 35.4595, lng: 138.8330, mapq: "Oshino Hakkai" },
  { id: "hotofudo", name: "호토 후도", jp: "ほうとう不動", area: "가와구치코", cat: "식사", hours: "11:00–19:00", note: "야마나시 명물 '호토'(호박·채소 미소 국물 넓적 면). 비 오는 날 딱. 구름 같은 흰 건축물도 포토존.", tip: "토요일 점심 약간 대기.", trip: "fuji", lat: 35.5010, lng: 138.7670, mapq: "Hoto Fudo Kawaguchiko" },
];

/* 구글 지도 평점/리뷰 수 (2026.6 기준, 실데이터 스냅샷 — 수시 변동) */
window.RATINGS_ASOF = "구글 평점 · 2026.6 기준";
window.RATINGS = {
  daikanyama: { rating: 4.5, reviews: 9647 },
  conran: { rating: null, reviews: null },
  onelldk: { rating: 4.0, reviews: 43 },
  sonakameguro: { rating: 3.4, reviews: 27 },
  harakado: { rating: 4.3, reviews: 1064 },
  acne: { rating: 4.0, reviews: 220 },
  onitsuka: { rating: 4.0, reviews: null },
  azabudai: { rating: 4.2, reviews: null },
  ginzasony: { rating: 4.1, reviews: 2451 },
  yoroniku: { rating: 4.4, reviews: 1558 },
  ukaitei: { rating: 4.6, reviews: 979 },
  ushigoro: { rating: 4.6, reviews: 459 },
  kappomuroi: { rating: 4.8, reviews: 39 },
  sakaishokai: { rating: 4.4, reviews: 205 },
  waltz: { rating: 4.2, reviews: 110 },
  banten: { rating: 3.9, reviews: 55 },
  bartrench: { rating: 4.7, reviews: 895 },
  takk: { rating: 4.8, reviews: 24 },
  sgclub: { rating: 4.5, reviews: 1497 },
  tokyufoodshow: { rating: 4.1, reviews: 1367 },
  imdonut: { rating: 3.9, reviews: 1219 },
  koffeemameya: { rating: 4.6, reviews: 1873 },
  nanaya: { rating: 4.5, reviews: 1121 },
  thematcha: { rating: 4.3, reviews: 1090 },
  vannelli: { rating: 4.3, reviews: 80 },
  initial: { rating: 4.1, reviews: 2134 },
  greenbeantobar: { rating: 4.4, reviews: 2331 },
  higashiya: { rating: 4.3, reviews: 1582 },
  himitsudo: { rating: 3.7, reviews: 7923 },
  kw_taisho: { rating: 4.2, reviews: 2054 },
  kw_kurazukuri: { rating: 4.0, reviews: 33183 },
  kw_kashiya: { rating: 3.9, reviews: 16884 },
  kw_hikawa: { rating: 4.3, reviews: 14050 },
  kw_osatsuan: { rating: 3.5, reviews: 825 },
  kw_cheesecake: { rating: 4.5, reviews: 1537 },
  kw_matcha: { rating: 4.2, reviews: 311 },
  meigetsuin: { rating: 4.3, reviews: 4929 },
  hasedera: { rating: 4.5, reviews: 16058 },
  yoridokoro: { rating: 4.2, reviews: 1630 },
  slamdunk: { rating: 4.4, reviews: 1402 },
  enoshima: { rating: 4.4, reviews: 8575 },
  oxymoron: { rating: 4.3, reviews: 556 },
  chureito: { rating: 4.6, reviews: 10065 },
  lawsonfuji: { rating: 3.8, reviews: 361 },
  oishipark: { rating: 4.5, reviews: 22457 },
  kawaguchiko: { rating: 4.6, reviews: 3409 },
  oshino: { rating: 4.2, reviews: 42893 },
  hotofudo: { rating: 4.0, reviews: 4524 },
};

/* 준비물 체크리스트 (그룹) */
window.CHECKLIST = [
  { title: "필수 서류", jp: "書類", items: [
    { id: "passport", label: "여권 (유효기간 6개월 이상)" },
    { id: "eticket", label: "항공권 e-티켓" },
    { id: "vjw", label: "Visit Japan Web QR" },
    { id: "insurance", label: "여행자 보험" },
  ]},
  { title: "결제 · 통신", jp: "決済", items: [
    { id: "cash", label: "엔화 현금 (작은 바·카페 현금만 많음)" },
    { id: "card", label: "해외 결제 가능한 카드" },
    { id: "suica", label: "Suica / PASMO (모바일 등록)" },
    { id: "wifi", label: "포켓와이파이 / eSIM" },
  ]},
  { title: "예약 필요", jp: "予約", items: [
    { id: "yoroniku", label: "요로니쿠 (야키니쿠, 약 1달 전 OMAKASE.in)" },
    { id: "ukaitei", label: "우카이테이 철판 (2~4주 전)" },
    { id: "daytrip", label: "근교 교통/티켓 (가와고에 액세스 등)" },
    { id: "bars", label: "반텐/사카이쇼카이 등 좌석 예약" },
  ]},
  { title: "장마 · 근교 대비", jp: "梅雨", items: [
    { id: "umbrella", label: "접이식 우산 · 투명우산(사진 소품)" },
    { id: "shoes", label: "계단·산책 편한 신발" },
    { id: "battery", label: "보조 배터리 · 멀티 어댑터(A타입)" },
    { id: "fan", label: "휴대용 손선풍기" },
  ]},
];

/* 정산 기본 지출 (앱에서 추가/수정/삭제 가능) */
window.EXPENSES_DEFAULT = {
  e1: { label: "신주쿠 호텔 2박", payer: "m", amount: 60000 },
  e2: { label: "요로니쿠 야키니쿠 ×3", payer: "s", amount: 60000 },
  e3: { label: "우카이테이 철판 ×3", payer: "j", amount: 66000 },
  e4: { label: "근교 교통 ×3", payer: "m", amount: 9000 },
  e5: { label: "에비스 바 투어", payer: "s", amount: 15000 },
  e6: { label: "디저트·카페 호핑", payer: "j", amount: 7000 },
  e7: { label: "Suica 충전 · 시내 교통", payer: "m", amount: 9000 },
};

/* 준비 탭 정보 카드 */
window.INFO = [
  { h: "항공편", jp: "航空便", rows: [
    ["가는 편", "6.26 · ICN 10:25 → 도쿄 12:55"],
    ["오는 편", "6.28 · 도쿄 16:50 → ICN 19:40"],
  ]},
  { h: "근교 (2일차)", jp: "小旅行", rows: [
    ["기본 Plan A", "가와고에 — 신주쿠서 코에도특급 ~45분"],
    ["전환", "일정 탭에서 가마쿠라·후지산으로 스위치"],
    ["가와고에", "6/27 히카와신사 풍령축제 개막 · 고구마 디저트"],
    ["꿀팁", "비 와도 OK · 투명우산은 사진 소품"],
  ]},
  { h: "교통", jp: "交通", rows: [
    ["Suica · PASMO", "모바일 등록 추천"],
    ["시내 이동", "도쿄메트로/JR · 도보+전철 위주"],
  ]},
  { h: "긴급", jp: "緊急", rows: [
    ["주일 한국대사관", "03-3452-7611"],
    ["일본 긴급", "경찰 110 · 구급 119"],
  ]},
];

/* 나리타공항 → 신주쿠 가는 법 (준비 탭에 정리) */
window.AIRPORT_TIPS = [
  { name: "N'EX (나리타 익스프레스)", time: "약 80분", price: "¥3,250", best: true, note: "JR 직통, 신주쿠까지 환승 없음. 좌석 지정 + 큰 짐 보관대. 짐 많을 때 가장 편하고 무난한 1순위." },
  { name: "리무진 버스", time: "약 90~120분", price: "¥3,600", note: "신주쿠 주요 호텔·버스터미널 앞 직통. 캐리어는 짐칸에, 앉아서 편하게. 단 도로 정체 영향 받음." },
  { name: "스카이라이너 + JR 환승", time: "약 75~90분", price: "~¥2,800", note: "닛포리까지 41분(최속) → JR 야마노테선으로 신주쿠. 가장 빠를 수 있으나 환승·계단 있어 짐 적을 때." },
  { name: "게이세이 액세스특급 + 환승", time: "약 100분+", price: "~¥1,300", note: "최저가. 환승 많고 느림 — 짐 적고 절약이 최우선일 때만." },
];
