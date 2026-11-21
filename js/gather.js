/* ============================================================
   gather.js — 共坐一场（氛围层原型，纯前端）
   · 场次以公共时钟为锚点，每 30 分钟一轮（整点 / 半点）
   · 人数为确定性演示值（同一场所有人看到同一个数），非真实并发
   · 坐后一句只存 localStorage，按场次分组，跨场不混；不联网、不上传
   暴露 window.Gather
   ============================================================ */
(function () {
  'use strict';

  var SLOT_MIN = 30;              // 每场 30 分钟
  var SLOT_MS = SLOT_MIN * 60 * 1000;
  var REF_KEY = 'qishan_reflections_v1';

  // 场次对象：start/end 时间戳、key、序号
  function sessionAt(ts) {
    var d = new Date(ts);
    var slotIndex = Math.floor(d.getMinutes() / SLOT_MIN);
    var start = new Date(d);
    start.setMinutes(slotIndex * SLOT_MIN, 0, 0);
    var startMs = start.getTime();
    var endMs = startMs + SLOT_MS;
    // key 用本地日期+时段，保证同一场稳定
    var key = start.getFullYear() + '-' +
      String(start.getMonth() + 1).padStart(2, '0') + '-' +
      String(start.getDate()).padStart(2, '0') + '-' +
      String(start.getHours()).padStart(2, '0') + '-' +
      String(start.getMinutes()).padStart(2, '0');
    return { key: key, start: startMs, end: endMs };
  }

  // 确定性人数：场次 key 的字符串哈希 → 8..42。同一场恒定，非真实人数。
  function seatsFor(key) {
    var h = 2166136261;
    for (var i = 0; i < key.length; i++) {
      h ^= key.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    h = (h >>> 0) % 35;
    return 8 + h;
  }

  function fmt(sec) {
    sec = Math.max(0, Math.ceil(sec));
    var m = Math.floor(sec / 60), s = sec % 60;
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }

  // 本场状态快照：用于设置页卡片与会话页提示
  function snapshot(ts) {
    var s = sessionAt(ts == null ? Date.now() : ts);
    return {
      key: s.key,
      seats: seatsFor(s.key),
      remain: fmt((s.end - (ts == null ? Date.now() : ts)) / 1000),
      startLabel: pad2(new Date(s.start).getHours()) + ':' + pad2(new Date(s.start).getMinutes()),
      endLabel: pad2(new Date(s.end).getHours()) + ':' + pad2(new Date(s.end).getMinutes())
    };
  }
  function pad2(n) { return String(n).padStart(2, '0'); }

  // ---------- 坐后一句：本地存储 ----------
  function loadAll() {
    try { return JSON.parse(localStorage.getItem(REF_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function listReflections(key) {
    var all = loadAll();
    return Array.isArray(all[key]) ? all[key] : [];
  }
  function addReflection(key, text) {
    text = String(text || '').trim().slice(0, 60);
    if (!text) return listReflections(key);
    var all = loadAll();
    if (!Array.isArray(all[key])) all[key] = [];
    // 最多留 20 条本机记录
    all[key].push({ text: text, at: Date.now() });
    if (all[key].length > 20) all[key] = all[key].slice(-20);
    try { localStorage.setItem(REF_KEY, JSON.stringify(all)); } catch (e) {}
    return all[key];
  }

  window.Gather = {
    sessionAt: sessionAt,
    seatsFor: seatsFor,
    snapshot: snapshot,
    fmt: fmt,
    listReflections: listReflections,
    addReflection: addReflection
  };
})();
