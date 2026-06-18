/* ===== 도쿄 여행 앱 (와시 디자인) ===== */
(function () {
  "use strict";

  /* ---------- 동기화 계층 (Firebase 실시간 / localStorage 폴백) ---------- */
  var STATE = {}, listeners = [], mode = "local", fbRoot = null;
  var ROOT_PATH = "trips/" + (window.TRIP_ID || "default");
  var LS_KEY = "tokyotrip:" + (window.TRIP_ID || "default");
  var UI_KEY = "tokyotrip:ui:" + (window.TRIP_ID || "default");  // 기기별 화면 상태(탭 등)
  var APP_VER = "v22";

  function emit() { listeners.forEach(function (cb) { cb(STATE); }); }
  function getPath(o, p) { var a = p.split("/"), c = o; for (var i = 0; i < a.length; i++) { if (c == null) return undefined; c = c[a[i]]; } return c; }
  function setPath(o, p, v) { var a = p.split("/"), c = o; for (var i = 0; i < a.length - 1; i++) { if (typeof c[a[i]] !== "object" || c[a[i]] == null) c[a[i]] = {}; c = c[a[i]]; } if (v === null) delete c[a[a.length - 1]]; else c[a[a.length - 1]] = v; }

  var DB = {
    onChange: function (cb) { listeners.push(cb); cb(STATE); },
    get: function (p) { return getPath(STATE, p); },
    set: function (p, v) { if (mode === "firebase") fbRoot.child(p).set(v); else { setPath(STATE, p, v); localStorage.setItem(LS_KEY, JSON.stringify(STATE)); emit(); } },
    push: function (p, v) { if (mode === "firebase") return fbRoot.child(p).push(v).key; var id = "id" + Date.now() + Math.floor(Math.random() * 1000); setPath(STATE, p + "/" + id, v); localStorage.setItem(LS_KEY, JSON.stringify(STATE)); emit(); return id; },
    remove: function (p) { this.set(p, null); },
  };

  function initSync() {
    var cfg = window.FIREBASE_CONFIG || {};
    if (cfg.apiKey && cfg.apiKey.indexOf("PASTE") === -1 && window.firebase) {
      try {
        firebase.initializeApp(cfg);
        mode = "firebase";
        if (firebase.auth) {
          firebase.auth().onAuthStateChanged(function (user) {
            if (user) { hideLogin(); attachDB(); }
            else { fbRoot = null; STATE = {}; emit(); showLogin(); }
          });
        } else { attachDB(); }  // auth SDK 미로드 시(구버전) 그냥 연결
        return;
      } catch (e) { console.warn("Firebase init 실패, 로컬 모드:", e); }
    }
    mode = "local";
    try { STATE = JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch (e) { STATE = {}; }
    seedDefaults(); emit();
  }

  function attachDB() {
    if (fbRoot) return;
    var db = firebase.database();
    fbRoot = db.ref(ROOT_PATH);
    var seededOnce = false;
    fbRoot.on("value", function (s) {
      STATE = s.val() || {};
      if (!seededOnce) { seededOnce = true; seedDefaults(); }  // 첫 스냅샷 로드 후에만 시드 → 삭제 항목 복구 방지
      emit();
    });
  }

  /* ---------- 로그인 게이트 ---------- */
  function showLogin() {
    if (document.getElementById("login")) return;
    var d = document.createElement("div");
    d.id = "login"; d.className = "loginwrap";
    d.innerHTML =
      '<div class="loginbox">' +
        '<div class="loginbrand">도쿄 · 東京</div>' +
        '<div class="loginsub">우리 여행 공유 앱 · 로그인</div>' +
        '<input id="logemail" type="email" placeholder="이메일" autocomplete="username" autocapitalize="off">' +
        '<input id="logpw" type="password" placeholder="비밀번호" autocomplete="current-password">' +
        '<button id="logbtn">로그인</button>' +
        '<div id="logerr" class="logerr"></div>' +
        '<div class="loginhint">친구들과 공유하는 같은 이메일/비밀번호로 로그인하세요.<br>한 번 로그인하면 이 기기엔 계속 유지돼요.</div>' +
      '</div>';
    document.body.appendChild(d);
    var go = function () {
      var em = (d.querySelector("#logemail").value || "").trim(), pw = d.querySelector("#logpw").value || "";
      d.querySelector("#logerr").textContent = "";
      if (!em || !pw) { d.querySelector("#logerr").textContent = "이메일과 비밀번호를 입력하세요."; return; }
      firebase.auth().signInWithEmailAndPassword(em, pw).catch(function (e) {
        d.querySelector("#logerr").textContent = loginErr(e);
      });
    };
    d.querySelector("#logbtn").addEventListener("click", go);
    d.addEventListener("keydown", function (e) { if (e.key === "Enter") go(); });
    d.querySelector("#logemail").focus();
  }
  function hideLogin() { var d = document.getElementById("login"); if (d) d.remove(); }
  function loginErr(e) {
    var c = (e && e.code) || "";
    if (c.indexOf("wrong-password") >= 0 || c.indexOf("user-not-found") >= 0 || c.indexOf("invalid-credential") >= 0 || c.indexOf("invalid-login") >= 0)
      return "이메일 또는 비밀번호가 올바르지 않아요.";
    if (c.indexOf("invalid-email") >= 0) return "이메일 형식을 확인하세요.";
    if (c.indexOf("too-many-requests") >= 0) return "시도가 많아요. 잠시 후 다시 시도하세요.";
    if (c.indexOf("network") >= 0) return "네트워크 연결을 확인하세요.";
    return "로그인 실패: " + (e && e.message ? e.message : c);
  }

  function seedDefaults() {
    if (!DB.get("seededExp")) {
      Object.keys(window.EXPENSES_DEFAULT).forEach(function (k) { DB.set("expenses/" + k, window.EXPENSES_DEFAULT[k]); });
      DB.set("seededExp", true);
    }
    if (!DB.get("seededWish")) {
      var w = { teamlab: { m: true, s: true, j: true }, sensoji: { m: true, s: true }, shibuyasky: { s: true, j: true }, tsukiji: { m: true }, omoide: { m: true, j: true } };
      Object.keys(w).forEach(function (pid) { Object.keys(w[pid]).forEach(function (who) { DB.set("wishes/" + pid + "/" + who, true); }); });
      DB.set("seededWish", true);
    }
  }

  /* ---------- 유틸 ---------- */
  function esc(s) { return (s == null ? "" : "" + s).replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); }
  function fmt(n) { return "¥" + Math.round(n || 0).toLocaleString("en-US"); }
  function fx() { return (window.FX && window.FX.krwPerJpy) || 9.5; }
  function conv(amt, from, to) { amt = +amt || 0; if (from === to) return amt; return from === "JPY" ? amt * fx() : amt / fx(); }
  function fmtC(n, cur) { return (cur === "KRW" ? "₩" : "¥") + Math.round(n || 0).toLocaleString("en-US"); }
  function mapLink(q) { return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q); }
  function rateOf(id) { return (window.RATINGS || {})[id] || null; }
  function num(n) { return (n || 0).toLocaleString("en-US"); }
  function rateHtml(id, cls) {
    var r = rateOf(id); if (!r || r.rating == null) return "";
    var n = r.reviews != null ? ' <span class="rn">(' + num(r.reviews) + ')</span>' : "";
    return '<span class="' + (cls || "rate") + '">★ ' + r.rating + n + "</span>";
  }
  function placeImg(p) {
    if (p && p.img) return p.img;
    if (p && p.custom) return "images/cat/default.jpg";   // 사진 없는 직접추가 장소
    return "images/" + (p && p.id) + ".jpg";              // 큐레이션 장소
  }
  function rateHtmlFor(p, cls) {
    var r = (p && p.rating != null) ? { rating: p.rating, reviews: p.reviews } : rateOf(p && p.id);
    if (!r || r.rating == null) return "";
    var n = r.reviews != null ? ' <span class="rn">(' + num(r.reviews) + ')</span>' : "";
    return '<span class="' + (cls || "rate") + '">★ ' + r.rating + n + "</span>";
  }
  function pick(v, d) { return v != null ? v : d; }
  function $(sel, root) { return (root || document).querySelector(sel); }

  function people() {
    var def = window.PEOPLE_DEFAULT;
    return Object.keys(def).map(function (id) {
      var name = pick(DB.get("people/" + id + "/name"), def[id].name);
      return { id: id, name: (name || "").trim() || "여행자", ini: ((name || "").trim()[0]) || "·", color: def[id].color, order: def[id].order };
    }).sort(function (a, b) { return a.order - b.order; });
  }
  function byId() { var o = {}; window.PLACES.forEach(function (p) { o[p.id] = p; }); return o; }
  function customPlaces() {
    var o = DB.get("uplaces") || {};
    return Object.keys(o).map(function (id) {
      var c = o[id] || {};
      return { id: id, name: c.name || "새 장소", jp: c.jp || "", area: c.area || "", cat: c.cat || "",
        hours: "", note: "", tip: "", mapq: c.mapq || c.name || "", list: c.seg, trip: c.trip || null,
        lat: (c.lat != null ? c.lat : null), lng: (c.lng != null ? c.lng : null),
        img: c.img || null, catimg: c.catimg || null,
        rating: (c.rating != null ? c.rating : null), reviews: (c.reviews != null ? c.reviews : null), custom: true };
    });
  }
  function getPlace(id) {
    var b = byId(); if (b[id]) return b[id];
    var cp = customPlaces();
    for (var i = 0; i < cp.length; i++) if (cp[i].id === id) return cp[i];
    return null;
  }

  /* ---------- 장소 검색 (구글 플레이스 우선, 없으면 OSM/Photon) ---------- */
  var searchTimer = null, lastResults = [], mapsReady = false, mapsDiag = "";
  function hasMapsKey() { var k = window.MAPS_API_KEY; return k && k.indexOf("PASTE") === -1; }
  function engineText() {
    if (!hasMapsKey()) return "⚪ 무료(OSM) 검색 — 구글 키 없음";
    if (mapsReady) return mapsDiag ? ("🟢 구글 검색 · ⚠ " + mapsDiag) : "🟢 구글 지도 검색 연결됨";
    return mapsDiag ? ("⚠ " + mapsDiag + " → 무료 검색 사용") : "🟡 구글 연결 중… (안 되면 무료 검색)";
  }
  function updateEngine() { var el = document.getElementById("plengine"); if (el) el.textContent = engineText(); }
  function loadPlacesLib() {
    google.maps.importLibrary("places").then(function () { mapsReady = true; mapsDiag = ""; updateEngine(); })
      .catch(function (e) { mapsDiag = "Places(New) 로드 실패: " + ((e && e.message) || e); updateEngine(); });
  }
  function initMaps() {
    if (!hasMapsKey()) return;  // 키 없으면 OSM 사용
    window.gm_authFailure = function () { mapsReady = false; mapsDiag = "구글 인증 실패 — ‘Maps JavaScript API’ 미사용 또는 키 도메인제한 확인"; updateEngine(); };
    if (window.google && window.google.maps && window.google.maps.importLibrary) { loadPlacesLib(); return; }
    var s = document.createElement("script");
    s.src = "https://maps.googleapis.com/maps/api/js?key=" + encodeURIComponent(window.MAPS_API_KEY) + "&v=weekly&loading=async&libraries=places";
    s.async = true;
    s.onerror = function () { mapsDiag = "Maps 스크립트 로드 실패(네트워크/차단/키)"; updateEngine(); };
    document.head.appendChild(s);
    // loading=async 는 onload 타이밍이 들쭉날쭉 → importLibrary 가 준비될 때까지 폴링
    var tries = 0;
    (function waitFor() {
      if (window.google && window.google.maps && window.google.maps.importLibrary) { loadPlacesLib(); return; }
      if (tries++ < 120) { setTimeout(waitFor, 100); return; }
      if (!mapsReady && !mapsDiag) { mapsDiag = "Maps 로드 시간초과 — API 사용설정/키 확인"; updateEngine(); }
    })();
  }
  function placeSearch(q) { if (mapsReady) googleAuto(q); else photonSearch(q); }

  function googleAuto(q) {
    var box = document.getElementById("plresults"); if (!box) return;
    box.innerHTML = '<div class="plres plres-info">검색 중…</div>';
    google.maps.importLibrary("places").then(function (lib) {
      var token = new lib.AutocompleteSessionToken();
      return lib.AutocompleteSuggestion.fetchAutocompleteSuggestions({
        input: q, sessionToken: token, locationBias: { center: { lat: 35.68, lng: 139.76 }, radius: 40000 }
      });
    }).then(function (res) {
      var sugg = (res && res.suggestions) || [];
      lastResults = sugg.filter(function (s) { return s.placePrediction; }).map(function (s) {
        var pp = s.placePrediction, sf = pp.structuredFormat || {};
        return { google: true, placeId: pp.placeId,
          name: (sf.mainText && sf.mainText.text) || (pp.text && pp.text.text) || q,
          area: (sf.secondaryText && sf.secondaryText.text) || "" };
      });
      mapsDiag = ""; updateEngine();
      renderResults(q);
    }).catch(function (e) { mapsDiag = "검색 오류: " + ((e && e.message) || e); updateEngine(); console.warn("구글 자동완성 실패 → OSM:", e); photonSearch(q); });
  }
  function addPlaceFromGoogle(r) {
    if (!r || !r.placeId) return;
    var box = document.getElementById("plresults"); if (box) box.innerHTML = '<div class="plres plres-info">불러오는 중…</div>';
    google.maps.importLibrary("places").then(function (lib) {
      var place = new lib.Place({ id: r.placeId });
      return place.fetchFields({ fields: ["displayName", "formattedAddress", "location", "rating", "userRatingCount", "photos", "types"] }).then(function () { return place; });
    }).then(function (place) {
      var photo = (place.photos && place.photos[0]) ? place.photos[0].getURI({ maxWidth: 900 }) : null;
      var ckey = catKeyFromTypes(place.types);
      var rec = { name: (place.displayName || r.name), area: shortArea(r.area || place.formattedAddress || ""),
        cat: catKoFromTypes(place.types), seg: seg,
        mapq: (place.displayName || r.name) + " " + (place.formattedAddress || ""),
        lat: place.location ? place.location.lat() : null, lng: place.location ? place.location.lng() : null,
        rating: (place.rating != null ? place.rating : null), reviews: (place.userRatingCount != null ? place.userRatingCount : null),
        img: photo || ("images/cat/" + ckey + ".jpg"), catimg: "images/cat/" + ckey + ".jpg" };
      if (seg === "trip") rec.trip = tripKey();
      DB.push("uplaces", rec);
    }).catch(function (e) { console.warn("장소 상세 실패 → 이름만 추가:", e); addNameOnly(r.name); });
  }
  function addNameOnly(nm) {
    nm = (nm || "").trim(); if (!nm) return;
    var rec = { name: nm, seg: seg, mapq: nm, img: "images/cat/default.jpg" };
    if (seg === "trip") rec.trip = tripKey();
    DB.push("uplaces", rec);
  }

  function catKo(v) {
    var m = { cafe: "카페", restaurant: "음식점", bar: "바", pub: "펍", fast_food: "음식점", bakery: "베이커리",
      confectionery: "디저트", ice_cream: "디저트", clothes: "패션", boutique: "패션", books: "서점",
      department_store: "백화점", mall: "쇼핑몰", supermarket: "마트", convenience: "편의점", hotel: "호텔",
      attraction: "명소", museum: "박물관", park: "공원", viewpoint: "전망", shop: "상점", hairdresser: "",
      // 구글 장소 타입
      clothing_store: "패션", shoe_store: "패션", book_store: "서점", shopping_mall: "쇼핑몰",
      convenience_store: "편의점", lodging: "호텔", tourist_attraction: "명소", store: "상점",
      meal_takeaway: "음식점", meal_delivery: "음식점", night_club: "바", art_gallery: "갤러리",
      amusement_park: "명소", supermarket_store: "마트" };
    return m[v] || (v || "");
  }
  function catKoFromTypes(types) { types = types || []; for (var i = 0; i < types.length; i++) { var k = catKo(types[i]); if (k && k !== types[i]) return k; } return ""; }
  function shortArea(s) { if (!s) return ""; return ("" + s).split(",").slice(0, 2).join(",").trim(); }
  function catKey(v) {
    var m = { cafe: "cafe", coffee: "cafe", restaurant: "restaurant", food_court: "restaurant", fast_food: "restaurant",
      bar: "bar", pub: "bar", biergarten: "bar", bakery: "bakery", pastry: "bakery",
      confectionery: "dessert", ice_cream: "dessert", clothes: "shopping", boutique: "shopping", shoes: "shopping",
      jewelry: "shopping", bag: "shopping", variety_store: "shopping", mall: "shopping", department_store: "shopping",
      shop: "shopping", marketplace: "shopping", supermarket: "store", convenience: "store", kiosk: "store",
      hotel: "hotel", hostel: "hotel", guest_house: "hotel", attraction: "landmark", museum: "landmark",
      gallery: "landmark", artwork: "landmark", viewpoint: "landmark", monument: "landmark", memorial: "landmark",
      temple: "landmark", shrine: "landmark", place_of_worship: "landmark", park: "park", garden: "park",
      // 구글 장소 타입
      clothing_store: "shopping", shoe_store: "shopping", book_store: "shopping", shopping_mall: "shopping",
      convenience_store: "store", lodging: "hotel", tourist_attraction: "landmark", store: "shopping",
      meal_takeaway: "restaurant", meal_delivery: "restaurant", night_club: "bar", art_gallery: "landmark",
      amusement_park: "landmark" };
    return m[v] || "default";
  }
  function catKeyFromTypes(types) { types = types || []; for (var i = 0; i < types.length; i++) { var k = catKey(types[i]); if (k !== "default") return k; } return "default"; }
  function photonSearch(q) {
    var box = document.getElementById("plresults"); if (!box) return;
    box.innerHTML = '<div class="plres plres-info">검색 중…</div>';
    fetch("https://photon.komoot.io/api/?q=" + encodeURIComponent(q) + "&limit=6&lang=en&lat=35.68&lon=139.76")
      .then(function (r) { return r.json(); })
      .then(function (d) {
        lastResults = (d.features || []).map(function (f) {
          var p = f.properties || {}, c = (f.geometry || {}).coordinates || [];
          return { name: p.name || p.street || q, area: p.district || p.suburb || p.city || p.state || "",
            cat: catKo(p.osm_value), key: catKey(p.osm_value), lat: c[1], lng: c[0], city: p.city || "" };
        });
        renderResults(q);
      })
      .catch(function () { if (box) box.innerHTML = '<div class="plres plres-info">검색 실패 — 잠시 후 다시 시도하거나 그대로 추가하세요</div>'; });
  }
  function renderResults(q) {
    var box = document.getElementById("plresults"); if (!box) return;
    var rows = lastResults.map(function (r, i) {
      var meta = [r.cat, r.area, r.city].filter(Boolean).join(" · ");
      return '<div class="plres" data-ridx="' + i + '"><div class="plres-nm">' + esc(r.name) + '</div>' +
        (meta ? '<div class="plres-meta">' + esc(meta) + '</div>' : "") + '</div>';
    }).join("");
    rows += '<div class="plres plres-manual" data-manual="1">‘' + esc(q) + '’ 그대로 추가</div>';
    box.innerHTML = rows;
  }
  function addPlaceFromResult(r) {
    if (!r) return;
    var rec = { name: r.name, area: r.area || "", cat: r.cat || "", seg: seg, mapq: (r.name + " " + (r.city || r.area || "")).trim(), img: "images/cat/" + (r.key || "default") + ".jpg" };
    if (r.lat != null && r.lng != null) { rec.lat = r.lat; rec.lng = r.lng; }
    if (seg === "trip") rec.trip = tripKey();
    DB.push("uplaces", rec);
  }
  function addPlaceManual() {
    var el = document.getElementById("plsearch"); var q = el ? (el.value || "").trim() : "";
    if (!q) return;
    var rec = { name: q, seg: seg, mapq: q, img: "images/cat/default.jpg" };
    if (seg === "trip") rec.trip = tripKey();
    DB.push("uplaces", rec);
  }

  /* ---------- UI 상태 ---------- */
  var tab = "itin", dayIdx = 0, seg = "shop", selected = null, newPayer = "m", newCur = "JPY";
  function saveUI() { try { localStorage.setItem(UI_KEY, JSON.stringify({ tab: tab, dayIdx: dayIdx, seg: seg })); } catch (e) {} }
  function loadUI() { try { var u = JSON.parse(localStorage.getItem(UI_KEY)); if (u) { if (u.tab) tab = u.tab; if (u.dayIdx != null) dayIdx = u.dayIdx; if (u.seg) seg = u.seg; } } catch (e) {} }
  var armed = null, armedTimer = null;  // 두 번 탭 삭제 확인
  function armOrRun(token, run) {
    if (armed === token) { armed = null; if (armedTimer) clearTimeout(armedTimer); run(); return; }
    armed = token;
    if (armedTimer) clearTimeout(armedTimer);
    armedTimer = setTimeout(function () { if (armed === token) { armed = null; render(); } }, 3000);
    render();
  }

  /* ---------- 렌더 ---------- */
  function render() {
    document.querySelectorAll(".navbtn").forEach(function (b) { b.classList.toggle("on", b.dataset.tab === tab); });
    var html = tab === "itin" ? renderItin() : tab === "map" ? renderMap() : tab === "places" ? renderPlaces() : tab === "budget" ? renderBudget() : renderPrep();
    $("#scroll").innerHTML = html;
    renderSheet();
    if (tab === "map") { ensureMap(); drawPins(); }
  }

  function countdownTxt() {
    var d = new Date(window.TRIP.start + "T00:00:00"), now = new Date(); now.setHours(0, 0, 0, 0);
    var diff = Math.round((d - now) / 86400000);
    return diff > 0 ? "D-" + diff : (diff === 0 ? "D-DAY" : "여행 중");
  }

  /* ===== 일정 ===== */
  function renderItin() {
    var P = people();
    var avatars = P.map(function (p) { return '<div class="av" style="background:' + p.color + '">' + esc(p.ini) + '</div>'; }).join("");
    var top =
      '<div class="topbar"><div class="row">' +
        '<div class="brand"><div class="en">TOKYO TRIP</div><div class="kr">' + esc(window.TRIP.title) + '</div><div class="jp">' + esc(window.TRIP.jp) + '</div></div>' +
        '<div class="tripmeta"><div class="date">6.26<span>–</span>6.28</div><div class="sub">' + esc(window.TRIP.sub) + '</div>' +
          '<div class="cd">' + countdownTxt() + '</div><div class="avatars">' + avatars + '</div></div>' +
      '</div></div>';

    var days = '<div class="dayrow">' + window.DAYS.map(function (d, i) {
      return '<div class="daycard ' + (i === dayIdx ? "on" : "") + '" data-day="' + i + '"><div class="l">' + (i + 1) + '일차</div><div class="d">' + esc(d.dateKR) + ' · ' + esc(d.dow) + '</div></div>';
    }).join("") + '</div>';

    var day = window.DAYS[dayIdx];
    var switcher = "", srcItems = day.items || [], themeText = day.theme || "";
    if (day.daytrip) {
      var active = DB.get("daytrip") || window.DAYTRIPS[0].key, dt = window.DAYTRIPS[0];
      window.DAYTRIPS.forEach(function (d) { if (d.key === active) dt = d; });
      srcItems = dt.items; themeText = dt.theme;
      switcher = '<div class="seg" style="margin:0 22px 14px">' + window.DAYTRIPS.map(function (d) {
        return '<div class="opt ' + (d.key === dt.key ? "on" : "") + '" data-daytrip="' + d.key + '">' + esc(d.label) + '</div>';
      }).join("") + '</div>';
    }
    var theme = '<div class="daytheme"><span class="lab">DAY ' + (dayIdx + 1) + '</span><span class="dot"></span><span class="th">' + esc(themeText) + '</span></div>';

    var items = [];
    srcItems.forEach(function (it) {
      var base = "items/" + it.key;
      if (DB.get(base + "/deleted")) return;
      items.push({ base: base, custom: false, pid: it.pid, jp: it.jp, sub: it.sub, tag: it.tag,
        time: pick(DB.get(base + "/time"), it.time), title: pick(DB.get(base + "/title"), it.title),
        done: !!DB.get(base + "/done"), memo: DB.get(base + "/memo") || "" });
    });
    var custom = DB.get("custom/" + day.key) || {};
    Object.keys(custom).forEach(function (id) {
      var c = custom[id], base = "custom/" + day.key + "/" + id;
      items.push({ base: base, custom: true, pid: null, jp: "", sub: "", tag: "추가", time: c.time || "", title: c.title || "", done: !!c.done, memo: c.memo || "" });
    });
    items.sort(function (a, b) { return (a.time || "").localeCompare(b.time || ""); });

    var tl = items.map(function (it) {
      return '<div class="ev ' + (it.done ? "done" : "") + '">' +
        '<div class="time"><span class="t editable timeedit" data-path="' + it.base + '" data-field="time">' + (esc(it.time) || "—") + '</span></div>' +
        '<div class="rail"><div class="line"></div><div class="node"></div></div>' +
        '<div class="body"><div class="evcard ' + (it.done ? "done" : "") + '">' +
          '<div class="top"><div style="min-width:0">' +
            '<div class="title editable" data-path="' + it.base + '" data-field="title">' + (esc(it.title) || "(제목)") + '</div>' +
            (it.jp ? '<div class="jp">' + esc(it.jp) + '</div>' : '') +
          '</div><div class="tag">' + esc(it.tag) + '</div></div>' +
          (it.sub ? '<div class="sub">' + esc(it.sub) + '</div>' : '') +
          '<div class="acts">' +
            (it.pid ? '<button class="act" data-place="' + it.pid + '">장소 정보 ›</button>' : '') +
            '<button class="act muted" data-toggle="' + it.base + '/done">' + (it.done ? "완료 취소" : "완료 체크") + '</button>' +
            (function () { var a = it.custom ? "del" : "deldef", on = armed === (a + ":" + it.base);
              return '<button class="act muted' + (on ? " armed" : "") + '" data-' + a + '="' + it.base + '" style="margin-left:auto">' + (on ? "삭제 확인" : "삭제") + '</button>'; })() +
          '</div>' +
          '<input class="memo" data-memo="' + it.base + '/memo" value="' + esc(it.memo) + '" placeholder="메모">' +
        '</div></div></div>';
    }).join("");

    var add = '<div class="tl"><div class="addrow"><input class="ti" id="newtime" placeholder="09:00"><input class="tt" id="newtitle" placeholder="새 일정 추가"><button id="addbtn">추가</button></div></div>';

    return '<div class="sec">' + top + days + theme + switcher + '<div class="tl">' + tl + '</div>' + add + '</div>';
  }

  /* ===== 지도 ===== */
  function tripKey() { return DB.get("daytrip") || window.DAYTRIPS[0].key; }
  function mapPlaceList() {
    var out = [], at = tripKey();
    (window.SEGMENTS || []).forEach(function (s) {
      var arr = s.key === "trip"
        ? window.PLACES.filter(function (p) { return p.trip === at && !DB.get("phidden/" + p.id); })
        : window.PLACES.filter(function (p) { return p.list === s.key && !DB.get("phidden/" + p.id); });
      arr.forEach(function (p) { out.push({ p: p, seg: s }); });
      customPlaces().filter(function (c) {
        return c.lat != null && (s.key === "trip" ? (c.list === "trip" && (!c.trip || c.trip === at)) : c.list === s.key);
      }).forEach(function (c) { out.push({ p: c, seg: s }); });
    });
    out.forEach(function (o, i) { o.num = i + 1; });
    return out;
  }

  function renderMap() {
    _mapList = mapPlaceList();
    var listHtml = "", curseg = null;
    _mapList.forEach(function (o) {
      if (o.seg.key !== curseg) { curseg = o.seg.key; listHtml += '<div class="mapgroup">' + esc(o.seg.label) + '</div>'; }
      var rh = rateHtmlFor(o.p, "rate");
      listHtml += '<div class="maprow" data-place="' + o.p.id + '"><div class="n">' + o.num + '</div>' +
        '<div style="flex:1;min-width:0"><div class="nm">' + esc(o.p.name) + '</div>' +
        '<div class="meta">' + esc(o.p.area) + (rh ? ' · ' + rh : "") + '</div></div>' +
        '<div class="arr">›</div></div>';
    });
    return '<div class="sec">' +
      '<div class="sechead"><div class="eyebrow">MAP</div><div class="sectitle"><div class="kr">지도</div><div class="jp">地図</div></div>' +
      '<div class="secdesc">장소 탭의 모든 곳 표시 · 핀/목록 탭하면 상세. ' + esc(window.RATINGS_ASOF || "") + '</div></div>' +
      '<div id="map"></div>' +
      '<a class="maplinkbtn" target="_blank" rel="noopener" href="' + mapLink("東京 観光") + '"><span class="d"></span>구글 지도 앱에서 보기</a>' +
      '<div class="maplist">' + listHtml + '</div></div>';
  }

  /* ===== 장소 ===== */
  function renderPlaces() {
    var P = people();
    var at = tripKey();
    var defaults = window.PLACES.filter(function (p) { return (seg === "trip" ? p.trip === at : p.list === seg) && !DB.get("phidden/" + p.id); });
    var customs = customPlaces().filter(function (c) { return seg === "trip" ? (c.list === "trip" && (!c.trip || c.trip === at)) : c.list === seg; });
    var list = defaults.concat(customs);
    var cards = list.map(function (p) {
      var w = DB.get("wishes/" + p.id) || {};
      var avs = P.filter(function (per) { return w[per.id]; }).map(function (per) { return '<div class="wav" style="background:' + per.color + '">' + esc(per.ini) + '</div>'; }).join("");
      var dtok = p.custom ? ("delplace:" + p.id) : ("hideplace:" + p.id), don = armed === dtok;
      var del = p.custom
        ? '<button class="pdel' + (don ? " armed" : "") + '" data-delplace="' + p.id + '" title="삭제">' + (don ? "삭제?" : "✕") + '</button>'
        : '<button class="pdel' + (don ? " armed" : "") + '" data-hideplace="' + p.id + '" title="숨기기">' + (don ? "숨길까?" : "✕") + '</button>';
      var fb = ' data-fb="' + (p.catimg || "images/cat/default.jpg") + '"';
      return '<div class="pcard" data-place="' + p.id + '"><div class="ph"><img class="phimg" src="' + placeImg(p) + '"' + fb + ' alt="" loading="lazy" onerror="if(this.dataset.fb){this.src=this.dataset.fb;this.removeAttribute(\'data-fb\');}else{this.remove();}"><span>사진</span>' + del + '</div>' +
        '<div class="pb"><div class="nm">' + esc(p.name) + '</div>' + (p.jp ? '<div class="jp">' + esc(p.jp) + '</div>' : '') +
        '<div class="row"><span class="area">' + esc(p.area || "") + '</span>' + (p.cat ? '<span class="ddot"></span><span class="cat">' + esc(p.cat) + '</span>' : "") + '</div>' +
        (rateHtmlFor(p) ? '<div class="prate">' + rateHtmlFor(p) + '</div>' : "") +
        (avs ? '<div class="wish">' + avs + '</div>' : "") +
        '</div></div>';
    }).join("");
    var segs = (window.SEGMENTS || []).map(function (s) {
      return '<div class="opt ' + (seg === s.key ? "on" : "") + '" data-seg="' + s.key + '">' + esc(s.label) + '</div>';
    }).join("");
    var addf = '<div class="placeadd2"><input id="plsearch" placeholder="🔎 가게·장소 검색해서 추가 (예: Fuglen Tokyo)" autocomplete="off"><div class="plengine" id="plengine">' + esc(engineText()) + '</div><div id="plresults" class="plresults"></div></div>';
    return '<div class="sec">' +
      '<div class="sechead"><div class="eyebrow">PLACES</div><div class="sectitle"><div class="kr">가볼 곳</div><div class="jp">名店</div></div></div>' +
      '<div class="seg">' + segs + '</div>' +
      '<div class="grid">' + cards + '</div>' + addf + '</div>';
  }

  /* ===== 정산 ===== */
  function settle(P, paid, share) {
    var bal = P.map(function (p) { return { p: p, net: (paid[p.id] || 0) - share }; });
    var deb = bal.filter(function (b) { return b.net < -1; }).map(function (b) { return { p: b.p, amt: -b.net }; }).sort(function (a, b) { return b.amt - a.amt; });
    var cre = bal.filter(function (b) { return b.net > 1; }).map(function (b) { return { p: b.p, amt: b.net }; }).sort(function (a, b) { return b.amt - a.amt; });
    var res = [], i = 0, j = 0;
    while (i < deb.length && j < cre.length) {
      var amt = Math.min(deb[i].amt, cre[j].amt);
      res.push({ from: deb[i].p, to: cre[j].p, amt: amt });
      deb[i].amt -= amt; cre[j].amt -= amt;
      if (deb[i].amt < 1) i++; if (cre[j].amt < 1) j++;
    }
    return res;
  }

  function renderBudget() {
    var P = people(), pm = {}; P.forEach(function (p) { pm[p.id] = p; });
    var disp = DB.get("budgetCur") || "JPY", other = disp === "JPY" ? "KRW" : "JPY";
    var exp = DB.get("expenses") || {};
    var rows = Object.keys(exp).map(function (k) { return { k: k, e: exp[k] }; });
    var total = rows.reduce(function (a, r) { return a + conv(r.e.amount, r.e.cur || "JPY", disp); }, 0);
    var share = P.length ? total / P.length : 0;
    var paid = {}; P.forEach(function (p) { paid[p.id] = 0; });
    rows.forEach(function (r) { if (paid[r.e.payer] != null) paid[r.e.payer] += conv(r.e.amount, r.e.cur || "JPY", disp); });

    var balances = P.map(function (p) {
      var net = paid[p.id] - share, cls = Math.abs(net) < 1 ? "zero" : (net > 0 ? "plus" : "minus");
      var txt = Math.abs(net) < 1 ? "정산 완료" : (net > 0 ? "받을 금액" : "낼 금액");
      return '<div class="balrow"><div class="av" style="background:' + p.color + '">' + esc(p.ini) + '</div>' +
        '<div><div class="nm editable" data-path="people/' + p.id + '" data-field="name">' + esc(p.name) + '</div><div class="paid">낸 금액 ' + fmtC(paid[p.id], disp) + '</div></div>' +
        '<div class="right"><div class="amt ' + cls + '">' + fmtC(Math.abs(net), disp) + '</div><div class="note">' + txt + '</div></div></div>';
    }).join("");

    var settlements = settle(P, paid, share);
    var setHtml = settlements.length ? settlements.map(function (s) {
      return '<div class="settle"><div class="av" style="background:' + s.from.color + '">' + esc(s.from.ini) + '</div>' +
        '<div class="mid"><span>' + esc(s.from.name) + '</span><span class="arr">→</span><span>' + esc(s.to.name) + '</span></div>' +
        '<div class="amt">' + fmtC(s.amt, disp) + '</div></div>';
    }).join("") : '<div class="hint">정산할 금액이 없어요. 👍</div>';

    var expList = rows.map(function (r) {
      var payer = pm[r.e.payer] || P[0], cur = r.e.cur || "JPY";
      return '<div class="exprow"><div class="av" style="background:' + payer.color + '" data-payer="' + r.k + '">' + esc(payer.ini) + '</div>' +
        '<div style="flex:1;min-width:0"><div class="lbl editable" data-path="expenses/' + r.k + '" data-field="label">' + esc(r.e.label) + '</div><div class="who">' + esc(payer.name) + ' 결제 · 탭하면 변경</div></div>' +
        '<button class="curchip" data-curtoggle="' + r.k + '">' + (cur === "KRW" ? "₩" : "¥") + '</button>' +
        '<div class="amt editable" data-path="expenses/' + r.k + '" data-field="amount">' + fmtC(r.e.amount, cur) + '</div>' +
        '<button class="del' + (armed === "del:expenses/" + r.k ? " armed" : "") + '" data-del="expenses/' + r.k + '">' + (armed === "del:expenses/" + r.k ? "삭제?" : "✕") + '</button></div>';
    }).join("");

    var payerBtns = P.map(function (p) { return '<button class="pbtn ' + (newPayer === p.id ? "on" : "") + '" style="background:' + p.color + '" data-newpayer="' + p.id + '">' + esc(p.ini) + '</button>'; }).join("");
    var newCurBtns = ["JPY", "KRW"].map(function (c) { return '<button class="curbtn ' + (newCur === c ? "on" : "") + '" data-newcur="' + c + '">' + (c === "JPY" ? "¥" : "₩") + '</button>'; }).join("");
    var curToggle = '<div class="seg" style="margin:0 22px 16px">' + ["JPY", "KRW"].map(function (c) {
      return '<div class="opt ' + (disp === c ? "on" : "") + '" data-cur="' + c + '">' + (c === "JPY" ? "¥ 엔" : "₩ 원") + '</div>';
    }).join("") + '</div>';

    return '<div class="sec">' +
      '<div class="sechead"><div class="eyebrow">BUDGET</div><div class="sectitle"><div class="kr">정산</div><div class="jp">精算</div></div></div>' +
      curToggle +
      '<div class="budgetbox"><div class="cap">총 지출</div><div class="total">' + fmtC(total, disp) + '</div>' +
        '<div class="subtotal">≈ ' + fmtC(conv(total, disp, other), other) + '  ·  100엔 = 950원</div>' +
        '<div class="split"><div><div class="k">1인당</div><div class="v">' + fmtC(share, disp) + '</div></div><div><div class="k">인원</div><div class="v">' + P.length + '명</div></div></div></div>' +
      '<div style="padding:26px 22px 0"><div class="subhead">정산 현황</div>' + balances + '</div>' +
      '<div style="padding:26px 22px 0"><div class="subhead">정산 방법</div>' + setHtml + '</div>' +
      '<div style="padding:26px 22px 0"><div class="subhead">지출 내역</div>' + expList +
        '<div class="expadd"><input class="lbl" id="explbl" placeholder="지출 항목"><div class="payer">' + payerBtns + '</div><div class="curpick">' + newCurBtns + '</div><input class="amt" id="expamt" placeholder="금액" inputmode="numeric"><button class="go" id="expadd">추가</button></div>' +
        '<div class="hint">* 금액 탭=수정 · 아바타 탭=결제자 · 통화(¥/₩) 탭=전환. 합계는 표시 통화로 환산(100엔=950원). 실시간 공유.</div>' +
      '</div></div>';
  }

  /* ===== 준비 ===== */
  function renderPrep() {
    var groups = window.CHECKLIST.map(function (g) {
      var items = g.items.map(function (it) {
        var on = !!DB.get("checks/" + it.id);
        return '<div class="chkitem ' + (on ? "on" : "") + '" data-check="' + it.id + '"><div class="box"></div><span class="lab">' + esc(it.label) + '</span></div>';
      }).join("");
      var done = g.items.filter(function (it) { return DB.get("checks/" + it.id); }).length;
      return '<div class="chkgroup"><div class="gh"><div class="l"><span class="title">' + esc(g.title) + '</span><span class="jp">' + esc(g.jp) + '</span></div><span class="pr">' + done + "/" + g.items.length + '</span></div>' + items + '</div>';
    }).join("");

    var info = window.INFO.map(function (c) {
      var rows = c.rows.map(function (r) { return '<div class="irow"><span class="k">' + esc(r[0]) + '</span><span class="v">' + esc(r[1]) + '</span></div>'; }).join("");
      return '<div class="infocard"><div class="ih"><span class="h">' + esc(c.h) + '</span><span class="jp">' + esc(c.jp) + '</span></div>' + rows + '</div>';
    }).join("");

    return '<div class="sec">' +
      '<div class="sechead"><div class="eyebrow">CHECKLIST</div><div class="sectitle"><div class="kr">준비</div><div class="jp">準備</div></div></div>' +
      '<div class="notice"><div class="t">6월 도쿄는 장마철이에요</div><div class="b">비 소식이 잦고 습해요. 접이식 우산과 통풍 잘되는 옷을 꼭 챙기세요.</div></div>' +
      groups +
      '<div style="padding:4px 22px 0"><div class="subhead" style="margin-bottom:12px">여행 정보</div>' + info + '</div>' +
      '<div style="text-align:center;margin-top:18px">' +
        '<button class="logout" data-forceupdate="1">앱 강제 업데이트(캐시 비우기)</button>' +
        (mode === "firebase" ? ' · <button class="logout" data-logout="1">로그아웃</button>' : '') +
        '<div style="font-size:11px;color:var(--muted);margin-top:8px">버전 ' + APP_VER + '</div>' +
      '</div>' +
      '</div>';
  }

  /* ===== 장소 상세 시트 ===== */
  var sheetRenderedId = null;
  function voteChips(p) {
    var P = people(), w = DB.get("wishes/" + p.id) || {};
    return P.map(function (per) {
      var on = !!w[per.id];
      return '<div class="vote ' + (on ? "on" : "") + '" data-vote="' + p.id + ":" + per.id + '" style="' + (on ? "background:" + per.color : "") + '">' +
        '<div class="va" style="background:' + per.color + '">' + esc(per.ini) + '</div><span class="vn">' + esc(per.name) + '</span></div>';
    }).join("");
  }
  function renderSheet() {
    var host = $("#sheet");
    if (!selected) { host.innerHTML = ""; sheetRenderedId = null; document.body.classList.remove("sheet-open"); return; }
    var p = getPlace(selected);
    if (!p) { host.innerHTML = ""; sheetRenderedId = null; document.body.classList.remove("sheet-open"); return; }
    document.body.classList.add("sheet-open");
    // 같은 장소면 투표 칩만 갱신(슬라이드 애니메이션 재생 방지 → 투표 즉각 반응)
    if (sheetRenderedId === selected && host.querySelector(".sheet")) {
      var vc = host.querySelector(".votes"); if (vc) vc.innerHTML = voteChips(p);
      return;
    }
    sheetRenderedId = selected;
    host.innerHTML =
      '<div class="overlay"><div class="scrim" data-close="1"></div>' +
        '<div class="sheet"><div class="grab"><i></i></div><div class="x" data-close="1">✕</div>' +
          '<div class="hero"><img class="heroimg" src="' + placeImg(p) + '" data-fb="' + (p.catimg || "images/cat/default.jpg") + '" alt="" onerror="if(this.dataset.fb){this.src=this.dataset.fb;this.removeAttribute(\'data-fb\');}else{this.remove();}"><span>사진 · PLACEHOLDER</span></div>' +
          '<div class="sb"><div class="name">' + esc(p.name) + '</div><div class="jp">' + esc(p.jp) + '</div>' +
            '<div class="chips"><span class="chip red">' + esc(p.area) + '</span>' + (p.cat ? '<span class="chip gray">' + esc(p.cat) + '</span>' : "") + '</div>' +
            (rateHtmlFor(p) ? '<div class="hours"><b style="color:#a9772e">평점</b><span>' + rateHtmlFor(p) + ' · 구글</span></div>' : '') +
            (p.hours ? '<div class="hours"><b>영업</b><span>' + esc(p.hours) + '</span></div>' : '') +
            '<div class="div"></div>' + (p.note ? '<div class="note">' + esc(p.note) + '</div>' : '') +
            (p.tip ? '<div class="tip"><b>TIP</b><span>' + esc(p.tip) + '</span></div>' : '') +
            '<div class="votetitle">이 코스, 가고 싶어요?</div><div class="votes">' + voteChips(p) + '</div>' +
            '<a class="openmap" target="_blank" rel="noopener" href="' + mapLink(p.mapq || p.name) + '"><span class="d"></span>구글 지도에서 열기</a>' +
          '</div></div></div>';
    var sh = host.querySelector(".sheet"); if (sh) attachSheetDrag(sh);
  }

  /* 시트 열기/닫기 + 뒤로가기(History) + 아래로 스와이프 닫기 */
  function openSheet(id) {
    if (!id) return;
    selected = id;
    try { history.pushState({ sheet: id }, ""); } catch (e) {}
    renderSheet();
  }
  function closeSheet(fromPop) {
    if (!selected) return;
    selected = null; renderSheet();
    if (!fromPop) { try { history.back(); } catch (e) {} }
  }
  window.addEventListener("popstate", function () { if (selected) closeSheet(true); });

  function attachSheetDrag(el) {
    var startY = 0, cur = 0, dragging = false;
    el.addEventListener("touchstart", function (e) {
      if (el.scrollTop > 0) { dragging = false; return; }
      startY = e.touches[0].clientY; cur = 0; dragging = true; el.style.transition = "none";
    }, { passive: true });
    el.addEventListener("touchmove", function (e) {
      if (!dragging) return;
      cur = e.touches[0].clientY - startY;
      if (cur > 0) { e.preventDefault(); el.style.transform = "translateY(" + cur + "px)"; }
    }, { passive: false });
    el.addEventListener("touchend", function () {
      if (!dragging) return; dragging = false; el.style.transition = "";
      if (cur > 110) { el.style.transform = "translateY(100%)"; closeSheet(false); }
      else { el.style.transform = ""; }
      cur = 0;
    });
  }

  /* ---------- Leaflet 지도 ---------- */
  var map = null, markers = [], _mapList = [];
  function ensureMap() {
    if (!window.L) return;
    var c = $("#map"); if (!c) return;
    if (map && map.getContainer() === c) return;   // 같은 컨테이너면 재사용
    if (map) { map.remove(); map = null; markers = []; }
    map = L.map(c, { zoomControl: true }).setView([35.68, 139.76], 11);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "© OpenStreetMap" }).addTo(map);
  }
  function drawPins() {
    if (!map) return;
    markers.forEach(function (m) { map.removeLayer(m); }); markers = [];
    var ml = (_mapList && _mapList.length) ? _mapList : mapPlaceList();
    var pts = [];
    ml.forEach(function (o) {
      var p = o.p; if (p.lat == null) return;
      var icon = L.divIcon({ className: "pin", html: '<div class="pinmark"><span>' + o.num + '</span></div>', iconSize: [27, 27], iconAnchor: [13, 27], popupAnchor: [0, -26] });
      var m = L.marker([p.lat, p.lng], { icon: icon }).addTo(map);
      m.on("click", function () { openSheet(p.id); });
      m.bindTooltip(o.num + ". " + p.name, { direction: "top", offset: [0, -24] });
      markers.push(m);
      if (o.seg.key !== "trip") pts.push([p.lat, p.lng]);  // 도쿄 군집 기준으로 화면 맞춤
    });
    setTimeout(function () { if (map) { map.invalidateSize(); if (pts.length) map.fitBounds(pts, { padding: [30, 30], maxZoom: 14 }); } }, 60);
  }

  /* ---------- 인라인 편집 ---------- */
  function startEdit(span) {
    if (span.classList.contains("editing")) return;
    var path = span.dataset.path, field = span.dataset.field;
    var cur = DB.get(path + "/" + field);
    var raw = cur != null ? cur : span.textContent.replace(/^[—¥]|^\(제목\)$/g, "").replace(/,/g, "").trim();
    span.classList.add("editing");
    var inp = document.createElement("input");
    if (field === "amount") { inp.inputMode = "numeric"; raw = String(+("" + raw).replace(/[^0-9]/g, "") || ""); }
    inp.value = raw;
    span.textContent = ""; span.appendChild(inp); inp.focus(); inp.select();
    var done = false;
    function commit(save) {
      if (done) return; done = true;
      if (save) {
        var val = inp.value.trim();
        if (field === "amount") DB.set(path + "/amount", Number(val.replace(/[^0-9.]/g, "")) || 0);
        else DB.set(path + "/" + field, val);
      } else render();
    }
    inp.addEventListener("blur", function () { commit(true); });
    inp.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); inp.blur(); } else if (e.key === "Escape") { done = true; render(); } });
  }

  /* ---------- 이벤트 ---------- */
  document.addEventListener("click", function (e) {
    var t = e.target;
    var nav = t.closest(".navbtn");
    var ed = t.closest(".editable");
    if (ed) { startEdit(ed); return; }
    if (nav) { armed = null; tab = nav.dataset.tab; selected = null; saveUI(); render(); window.scrollTo(0, 0); return; }
    var dc = t.closest("[data-day]"); if (dc) { armed = null; dayIdx = +dc.dataset.day; saveUI(); render(); return; }
    var sg = t.closest("[data-seg]"); if (sg) { armed = null; seg = sg.dataset.seg; saveUI(); render(); return; }
    var dts = t.closest("[data-daytrip]"); if (dts) { armed = null; DB.set("daytrip", dts.dataset.daytrip); return; }
    var cu = t.closest("[data-cur]"); if (cu) { armed = null; DB.set("budgetCur", cu.dataset.cur); return; }
    if (t.dataset.logout) { if (window.firebase && firebase.auth) firebase.auth().signOut(); return; }
    if (t.dataset.forceupdate) {
      var reload = function () { location.reload(); };
      var p = (navigator.serviceWorker ? navigator.serviceWorker.getRegistrations().then(function (rs) { return Promise.all(rs.map(function (r) { return r.unregister(); })); }) : Promise.resolve());
      p.then(function () { return window.caches ? caches.keys().then(function (ks) { return Promise.all(ks.map(function (k) { return caches.delete(k); })); }) : null; }).then(reload, reload);
      return;
    }
    if (t.closest("[data-close]")) { closeSheet(false); return; }
    if (t.dataset.delplace) { var dpv = t.dataset.delplace; armOrRun("delplace:" + dpv, function () { DB.remove("uplaces/" + dpv); }); return; }
    if (t.dataset.hideplace) { var hpv = t.dataset.hideplace; armOrRun("hideplace:" + hpv, function () { DB.set("phidden/" + hpv, true); }); return; }
    var pl = t.closest("[data-place]"); if (pl) { openSheet(pl.dataset.place); return; }
    var vv = t.closest("[data-vote]"); if (vv) { var v = vv.dataset.vote.split(":"); DB.set("wishes/" + v[0] + "/" + v[1], !DB.get("wishes/" + v[0] + "/" + v[1])); return; }
    if (t.dataset.toggle) { DB.set(t.dataset.toggle, !DB.get(t.dataset.toggle)); return; }
    var cck = t.closest("[data-check]"); if (cck) { DB.set("checks/" + cck.dataset.check, !DB.get("checks/" + cck.dataset.check)); return; }
    if (t.dataset.deldef) { var ddv = t.dataset.deldef; armOrRun("deldef:" + ddv, function () { DB.set(ddv + "/deleted", true); }); return; }
    if (t.dataset.del) { var dv = t.dataset.del; armOrRun("del:" + dv, function () { DB.remove(dv); }); return; }
    if (t.dataset.payer) { cyclePayer(t.dataset.payer); return; }
    if (t.dataset.newpayer) { newPayer = t.dataset.newpayer; render(); return; }
    if (t.dataset.curtoggle) { var ck = t.dataset.curtoggle, cc = DB.get("expenses/" + ck + "/cur") || "JPY"; DB.set("expenses/" + ck + "/cur", cc === "JPY" ? "KRW" : "JPY"); return; }
    if (t.dataset.newcur) { newCur = t.dataset.newcur; render(); return; }
    if (t.id === "addbtn") { var ti = $("#newtime").value.trim(), tt = $("#newtitle").value.trim(); if (tt) DB.push("custom/" + window.DAYS[dayIdx].key, { time: ti, title: tt }); return; }
    if (t.id === "expadd") { var lbl = $("#explbl").value.trim(), amt = Number($("#expamt").value.replace(/[^0-9.]/g, "")) || 0; if (lbl && amt) { DB.push("expenses", { label: lbl, payer: newPayer, amount: amt, cur: newCur }); } return; }
    var pr = t.closest(".plres"); if (pr) { if (pr.dataset.manual) addPlaceManual(); else { var rr = lastResults[+pr.dataset.ridx]; if (rr && rr.google) addPlaceFromGoogle(rr); else addPlaceFromResult(rr); } return; }
  });

  function cyclePayer(k) {
    var P = people(), cur = DB.get("expenses/" + k + "/payer");
    var idx = 0; for (var i = 0; i < P.length; i++) if (P[i].id === cur) { idx = i; break; }
    DB.set("expenses/" + k + "/payer", P[(idx + 1) % P.length].id);
  }

  document.addEventListener("change", function (e) { if (e.target.dataset && e.target.dataset.memo !== undefined) DB.set(e.target.dataset.memo, e.target.value); });
  document.addEventListener("input", function (e) {
    if (e.target.id !== "plsearch") return;
    var q = (e.target.value || "").trim();
    if (searchTimer) clearTimeout(searchTimer);
    if (q.length < 2) { var box = document.getElementById("plresults"); if (box) box.innerHTML = ""; return; }
    searchTimer = setTimeout(function () { placeSearch(q); }, 320);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Enter") return;
    if (e.target.id === "newtitle" || e.target.id === "newtime") $("#addbtn").click();
    if (e.target.id === "explbl" || e.target.id === "expamt") $("#expadd").click();
    if (e.target.id === "plsearch") { e.preventDefault(); addPlaceManual(); }
  });

  /* ---------- 시작 ---------- */
  DB.onChange(function () { render(); });
  loadUI();
  initSync();
  initMaps();
  render();

  if ("serviceWorker" in navigator) window.addEventListener("load", function () {
    navigator.serviceWorker.register("./sw.js", { updateViaCache: "none" }).then(function (reg) {
      reg.update();
      setInterval(function () { reg.update(); }, 60000);  // 1분마다 새 버전 확인
    }).catch(function () {});
    var refreshed = false;
    navigator.serviceWorker.addEventListener("controllerchange", function () {
      if (refreshed) return; refreshed = true; location.reload();  // 새 버전 활성화되면 자동 새로고침
    });
  });
})();
