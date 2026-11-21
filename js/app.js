/* ============================================================
   app.js — 主逻辑
   屏幕流转 / 设置 / 正念会话 / 呼吸引导 / 计时 / 记录
   ============================================================ */
(function () {
  'use strict';

  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  // 尊重系统"减少动态效果"设置：晕动症用户关闭呼吸视差与光晕扩张
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- 状态 ----------
  const state = {
    scene: 'forest',
    minutes: 10,
    breath: 'calm',
    sound: 'guide3',
    lastSound: 'guide3',
    guideEnded: false,
    guideActive: false,  // 真人引导正在主导（此时不再滚动中文引导语，避免中英打架）
    // 会话运行态
    running: false,
    paused: false,
    elapsed: 0,        // 已过秒数
    lastTick: 0,
    breathElapsed: 0,  // 当前呼吸循环内已过秒数
  };

  // 呼吸节奏定义（秒）——以放松为目标，遵循"呼气≥吸气"原则
  // calm   深呼吸：呼气长于吸气，激活副交感神经，最通用的放松法
  // cohere 共振呼吸：5-5 约每分钟6次，接近 HRV 共振频率，稳定心率
  // relax  4-7-8：经典助眠放松法（Dr. Andrew Weil），长呼气+停顿
  // box    箱式呼吸：4-4-4-4，偏稳定专注，同样有助镇定
  const BREATH = {
    calm:   { phases: [['吸气', 4], ['呼气', 6]], cycle: 10 },
    cohere: { phases: [['吸气', 5], ['呼气', 5]], cycle: 10 },
    relax:  { phases: [['吸气', 4], ['停留', 7], ['呼气', 8]], cycle: 19 },
    box:    { phases: [['吸气', 4], ['停留', 4], ['呼气', 4], ['停留', 4]], cycle: 16 }
  };

  const BREATH_NOTES = {
    calm: '深呼吸：呼气长于吸气，可激活副交感神经，让心率放缓、身体放松。',
    cohere: '共振呼吸：约每分钟 6 次，接近心率变异性的共振频率，有助稳定与平和。',
    relax: '4-7-8 呼吸：经典的助眠放松法，用较长的呼气与停顿带走紧张；若憋气不适，可缩短停留。',
    box: '箱式呼吸：四段等长，常用于稳定情绪、集中注意，呼吸不适时可改选深呼吸。'
  };

  // 正念引导语：一条完整的练习脉络（按会话进度分配）
  const GUIDANCE = [
    '轻轻闭上眼睛，让身体安稳地坐着',
    '把注意力，温柔地放在呼吸上',
    '感受空气，怎样进来，又怎样离开',
    '不必刻意，只是知道——我正在呼吸',
    '从额头，到眉眼，慢慢放松',
    '松开肩膀，让双手安静地放着',
    '觉察身体与坐垫接触的地方',
    '念头来了，就让它来；看见它，再回到呼吸',
    '不追问，不评判，只是看着它走',
    '把这份觉察，轻轻扩展到全身',
    '听见远处的声音，也知道自己的呼吸',
    '此刻，你什么都不必做',
    '再坐一会儿，和自己的安静待在一起',
    '慢慢地，让呼吸把你带回此刻',
    '感受这一次，属于你的宁静'
  ];

  // 整套完整练习：音频本身即从头到尾的完整引导，时长随录音，播完即结束
  // 时长由 mutagen 读取的真实秒数写入，界面进度与计时以音频为准
  const FULL_PRACTICE = {
    bodyscanf: { sec: 26 * 60 + 46, label: '身体扫描·女声' },
    bodyscanm: { sec: 37 * 60 + 9,  label: '身体扫描·男声' },
    sitting:   { sec: 34 * 60 + 50, label: '完整坐禅·引导' }
  };
  function isFullPractice(s) { return Object.prototype.hasOwnProperty.call(FULL_PRACTICE, s); }
  // 当前会话总秒数：完整练习取录音时长，静坐取所选时长
  function sessionTotal() {
    return isFullPractice(state.sound) ? FULL_PRACTICE[state.sound].sec : state.minutes * 60;
  }

  // 是否为真人语音引导（3 分钟短引导 + 整套完整练习）：均由音频主导屏幕
  function isGuideSound(s) {
    return s === 'guide3' || s === 'guide3m' || isFullPractice(s);
  }

  // 按会话时长抽取引导语序列：短时少句避免切换过密，长时铺满完整脉络
  function guidanceFor(minutes) {
    const counts = { 3: 6, 5: 8, 10: 12, 15: 15, 20: 15 };
    const n = counts[minutes] || 12;
    if (n >= GUIDANCE.length) return GUIDANCE.slice();
    const out = [];
    for (let i = 0; i < n; i++) {
      out.push(GUIDANCE[Math.round(i * (GUIDANCE.length - 1) / (n - 1))]);
    }
    return out;
  }

  // ---------- 引擎实例 ----------
  const sceneEngine = new SceneEngine($('#scene'));
  const audio = new AudioEngine(function () {
    // 整套完整练习播完：练习即圆满，直接结束本次
    if (state._fullPractice) {
      finishSession();
      return;
    }
    // 3 分钟短引导播完：语音退场，中文引导语接管余下的静坐时间
    state.guideEnded = true;
    endGuidanceMode();
    updateSoundStatus();
  });

  // 场景 → 真实照片（写实环境；无图场景自动回退程序化绘制）
  const PHOTOS = {
    forest: 'assets/forest.jpg',
    snow:   'assets/snow.jpg',
    ocean:  'assets/ocean.jpg',
    temple: 'assets/temple.jpg',
    river:  'assets/river.jpg',
    space:  'assets/space.jpg',
    mars:   'assets/mars.jpg',
    hearth: 'assets/hearth.jpg',
    antarctica: 'assets/antarctica.jpg'
  };

  const SOUND_LABELS = {
    guide3: '正念引导·女声',
    guide3m: '正念引导·男声',
    bodyscanf: '身体扫描·女声 · 27分钟',
    bodyscanm: '身体扫描·男声 · 37分钟',
    sitting: '完整坐禅·引导 · 35分钟',
    bowl: '颂钵',
    forest: '林风',
    water: '流水',
    waves: '海浪',
    insects: '虫鸣',
    birds: '鸟鸣',
    life: '生活声'
  };

  // 预加载全部照片到浏览器缓存，切换时零等待、零闪烁
  const photoCache = {};
  let sceneToken = 0; // 异步竞态防护：只接受最后一次切换请求
  function preloadPhotos() {
    Object.keys(PHOTOS).forEach(k => {
      const img = new Image();
      img.src = PHOTOS[k];
      photoCache[k] = img;
    });
  }

  // 切换场景背景：有照片则显示照片，否则回退程序化绘制
  function applyScene(name) {
    const photo = $('#scene-photo');
    const src = PHOTOS[name];
    const token = ++sceneToken;
    if (src) {
      const show = () => {
        if (token !== sceneToken) return; // 已有更新的切换请求，丢弃本次结果
        photo.src = src;
        photo.classList.add('is-visible');
        sceneEngine.setScene(name, true);
      };
      const img = photoCache[name];
      if (img && img.complete && img.naturalWidth > 0) {
        show(); // 已缓存：立即切换
      } else if (img) {
        img.addEventListener('load', show, { once: true });
        img.addEventListener('error', () => {
          if (token !== sceneToken) return;
          photo.classList.remove('is-visible');
          sceneEngine.setScene(name, false);
        }, { once: true });
      } else {
        photo.classList.remove('is-visible');
        sceneEngine.setScene(name, false);
      }
    } else {
      photo.classList.remove('is-visible');
      photo.src = '';
      sceneEngine.setScene(name, false);
    }
  }

  // ---------- 屏幕切换 ----------
  const screens = ['intro', 'setup', 'session', 'done'];
  function show(name) {
    screens.forEach(s => $('#screen-' + s).classList.toggle('is-active', s === name));
    const isPanel = (name === 'setup' || name === 'done');
    document.body.classList.toggle('mode-panel', isPanel);
    document.body.classList.toggle('mode-session', name === 'session');
  }

  // ---------- 记录（本地）----------
  const REC_KEY = 'qishan_records_v1';
  function loadRecords() {
    try { return JSON.parse(localStorage.getItem(REC_KEY)) || { days: {} }; }
    catch (e) { return { days: {} }; }
  }
  function dateKey(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function saveSession() {
    const rec = loadRecords();
    const k = dateKey(new Date());
    rec.days[k] = (rec.days[k] || 0) + 1;
    try { localStorage.setItem(REC_KEY, JSON.stringify(rec)); } catch (e) {}
    return rec;
  }
  function todayCount(rec) { return (rec && rec.days[dateKey(new Date())]) || 0; }
  function streak(rec) {
    if (!rec) return 1;
    let count = 0;
    const d = new Date();
    for (let i = 0; i < 400; i++) {
      const k = dateKey(d);
      if (rec.days[k]) { count++; d.setDate(d.getDate() - 1); }
      else { if (i === 0) { d.setDate(d.getDate() - 1); continue; } break; }
    }
    return Math.max(count, 1);
  }

  // ---------- 设置交互 ----------
  function bindChips(rowSel, key, transform) {
    $$(rowSel + ' .chip').forEach(chip => {
      chip.addEventListener('click', () => {
        $$(rowSel + ' .chip').forEach(c => c.classList.remove('is-selected'));
        chip.classList.add('is-selected');
        const val = chip.dataset[key];
        state[({ scene: 'scene', min: 'minutes', breath: 'breath', sound: 'sound' })[key]] = transform ? transform(val) : val;
        if (key === 'scene') applyScene(val);
      });
    });
  }

  // 声音 / 整套练习共用：两组 chip 互斥，选择只记忆、不预播放
  function selectSound(val) {
    state.sound = val;
    audio.setType(val);
    state.lastSound = val;
    $$('#sound-row .chip, #full-row .chip').forEach(c =>
      c.classList.toggle('is-selected', c.dataset.sound === val));
    // 整套练习时长随音频，置灰时长选择避免误解
    const full = isFullPractice(val);
    $('#duration-row').classList.toggle('is-locked', full);
    $('#duration-note').textContent = full ? '整套练习时长随音频，无需另选' : '正念练习常用时长';
    updateSoundIcon();
    updateSoundStatus();
  }
  // 场景卡片单独绑定（非 chip 结构）
  $$('#scene-grid .scene-card').forEach(card => {
    card.addEventListener('click', () => {
      $$('#scene-grid .scene-card').forEach(c => c.classList.remove('is-selected'));
      card.classList.add('is-selected');
      state.scene = card.dataset.scene;
      applyScene(state.scene);
    });
  });
  bindChips('#duration-row', 'min', v => parseInt(v, 10));
  bindChips('#breath-row', 'breath', null);
  $$('#sound-row .chip, #full-row .chip').forEach(chip => {
    chip.addEventListener('click', () => selectSound(chip.dataset.sound));
  });

  // 呼吸节奏切换时更新原理说明
  $$('#breath-row .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const note = $('#breath-note');
      if (note) note.textContent = BREATH_NOTES[chip.dataset.breath] || '';
    });
  });

  function updateSoundIcon() {
    $('#sound-icon').textContent = (state.sound === 'off') ? '静' : '声';
    $('#btn-sound').setAttribute('aria-label', state.sound === 'off' ? '开启声音' : '静音');
  }

  function updateSoundStatus() {
    if (state.sound === 'off') {
      $('#sound-status').textContent = '已静音';
    } else if ((state.sound === 'guide3' || state.sound === 'guide3m') && state.guideEnded) {
      $('#sound-status').textContent = '引导结束，余下时间留给自己';
    } else {
      $('#sound-status').textContent = SOUND_LABELS[state.sound] || '声音';
    }
  }

  // ---------- 共坐一场（氛围层，纯前端） ----------
  // 设置页卡片：每秒刷新本场倒计时与演示人数
  function refreshGatherCard() {
    const snap = Gather.snapshot();
    $('#gather-session').textContent = '本场 ' + snap.startLabel + '–' + snap.endLabel;
    $('#gather-seats').textContent = snap.seats + ' 人在坐';
    $('#gather-count').textContent = '距本场结束 ' + snap.remain;
  }
  // 会话页顶部：显示本场人数与同一场提示
  function updateCoText() {
    if (state._gatherSnap) {
      $('#co-text').textContent =
        '本场 ' + state._gatherSnap.seats + ' 人同坐 · 不必言语';
    }
  }
  setInterval(() => {
    if ($('#screen-setup').classList.contains('is-active')) refreshGatherCard();
  }, 1000);

  // 结束页：渲染本场留言（只来自本机）
  function renderReflections() {
    const list = $('#reflection-list');
    if (!list || !window.Gather) return;
    const key = state._gatherKey || Gather.snapshot().key;
    const rows = Gather.listReflections(key);
    list.innerHTML = '';
    rows.slice().reverse().forEach(r => {
      const item = document.createElement('div');
      item.className = 'reflection-item';
      const meta = document.createElement('span');
      meta.className = 'reflection-meta';
      const t = new Date(r.at);
      meta.textContent = '你 · ' + String(t.getHours()).padStart(2, '0') + ':' + String(t.getMinutes()).padStart(2, '0');
      item.appendChild(document.createTextNode(r.text));
      item.appendChild(meta);
      list.appendChild(item);
    });
  }

  // ---------- 屏幕按钮 ----------
  $('#btn-enter').addEventListener('click', () => show('setup'));
  $('#btn-back').addEventListener('click', () => show('intro'));
  $('#btn-start').addEventListener('click', startSession);
  $('#btn-pause').addEventListener('click', pauseSession);
  $('#btn-resume').addEventListener('click', resumeSession);
  $('#btn-finish').addEventListener('click', finishSession);
  $('#btn-end-from-pause').addEventListener('click', finishSession);
  $('#btn-again').addEventListener('click', () => { show('setup'); });
  $('#btn-home').addEventListener('click', () => { show('intro'); applyScene('forest'); });
  // 坐后一句：只写本机，写入后重渲染，并给一句轻反馈
  function submitReflection() {
    if (!window.Gather) return;
    const input = $('#reflection-input');
    const text = input ? input.value.trim() : '';
    if (!text) return;
    const key = state._gatherKey || Gather.snapshot().key;
    Gather.addReflection(key, text);
    input.value = '';
    renderReflections();
    const note = $('#reflection-note');
    if (note) {
      const old = note.textContent;
      note.textContent = '已留下，只在这台设备上。';
      setTimeout(() => { note.textContent = old; }, 2600);
    }
  }
  $('#reflection-send').addEventListener('click', submitReflection);
  $('#reflection-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); submitReflection(); }
  });

  $('#btn-sound').addEventListener('click', () => {
    if (state.sound === 'off') {
      state.sound = state.lastSound || 'guide3';
      audio.setType(state.sound);
      if (state.running && !state.paused) {
        audio.resume();
        // 恢复真人引导：让音频重新接管屏幕，避免与中文引导语同时滚动
        if (isGuideSound(state.sound)) {
          state.guideActive = true;
          state.guideEnded = false;
          const hint = state.sound === 'sitting' ? '跟着声音，走完这一坐'
            : isFullPractice(state.sound) ? '跟着声音，觉察身体'
            : '跟着声音，回到呼吸';
          setGuidance(hint, true);
        }
      }
    } else {
      state.lastSound = state.sound;
      state.sound = 'off';
      audio.disable();
      // 手动静音真人引导时，把引导话语权交还给屏幕，避免静默到底
      if (state.guideActive) endGuidanceMode();
    }
    $$('#sound-row .chip, #full-row .chip').forEach(c => c.classList.toggle('is-selected', c.dataset.sound === state.sound));
    updateSoundIcon();
    updateSoundStatus();
  });

  // ---------- 会话控制 ----------
  function fmt(sec) {
    sec = Math.max(0, Math.ceil(sec));
    const m = Math.floor(sec / 60), s = sec % 60;
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }

  function startSession() {
    // 完整练习时长以录音为准（忽略时长 chip）；普通静坐用所选时长
    const full = isFullPractice(state.sound);
    const total = sessionTotal();
    state._fullPractice = full;       // 锁定会话类型，避免中途静音 sound→off 后判定漂移
    state._sessionTotal = total;      // 锁定会话总时长，静音/结束都按此走
    // 锁定本场共坐：会话跨过整点也不换场
    state._gatherSnap = window.Gather ? Gather.snapshot() : null;
    state._gatherKey = state._gatherSnap ? state._gatherSnap.key : null;
    state.running = true;
    state.paused = false;
    state.elapsed = 0;
    state.breathElapsed = 0;
    state.lastTick = performance.now();
    state._guidanceSeq = guidanceFor(state.minutes);
    state._guidanceIndex = 0; // 第一句已在下方立即显示，避免首帧重复触发淡入

    // 清理上一会话可能残留的引导语定时器，避免覆盖本次首句
    if (guidanceTimer) { clearTimeout(guidanceTimer); guidanceTimer = null; }
    const gEl = $('#guidance');
    gEl.classList.remove('fade');

    $('#time-total').textContent = '/ ' + fmt(total);
    $('#time-left').textContent = fmt(total);
    $('#progress-fill').style.width = '0%';
    $('#pause-overlay').classList.remove('is-active');
    state.guideEnded = false;
    state.guideActive = isGuideSound(state.sound) && state.sound !== 'off';
    // 真人引导主导时，屏幕只给一句静态提示，让位给语音；否则用中文引导语陪伴
    const guideHint = full
      ? (state.sound === 'sitting' ? '跟着声音，走完这一坐' : '跟着声音，觉察身体')
      : '跟着声音，回到呼吸';
    setGuidance(state.guideActive ? guideHint : state._guidanceSeq[0], true);
    updateSoundIcon();
    updateSoundStatus();

    // 用户点击「开始静坐」后才播放，设置页不预发声
    if (state.sound !== 'off') {
      audio.setType(state.sound);
      audio.play();
    } else {
      audio.stop();
    }

    updateCoText();
    show('session');
  }

  function pauseSession() {
    if (!state.running || state.paused) return;
    state.paused = true;
    audio.pause();
    $('#pause-overlay').classList.add('is-active');
  }
  function resumeSession() {
    if (!state.paused) return;
    state.paused = false;
    state.lastTick = performance.now();
    if (state.sound !== 'off') audio.resume();
    $('#pause-overlay').classList.remove('is-active');
  }

  function finishSession() {
    if (!state.running) return; // 防止音频结束与计时到点同帧重复结算
    state.running = false;
    state.paused = false;
    state.guideActive = false;
    $('#pause-overlay').classList.remove('is-active');
    audio.stop();

    const rec = saveSession();
    const mins = Math.max(1, Math.round(state.elapsed / 60));
    $('#stat-minutes').textContent = mins;
    $('#stat-total').textContent = todayCount(rec);
    $('#stat-streak').textContent = streak(rec);
    $('#done-sub').textContent = state.elapsed < 30
      ? '哪怕只是片刻，你也停下来过了。'
      : '谢谢你，留了这段时间给自己。';
    // 清空上一场输入框，渲染本场留言
    const input = $('#reflection-input');
    if (input) input.value = '';
    renderReflections();
    show('done');
  }

  // 真人引导退场后，中文引导语从当前进度自然接管，填补余下的静坐时间
  function endGuidanceMode() {
    if (!state.guideActive) return;
    state.guideActive = false;
    if (!state.running) return;
    const seq = state._guidanceSeq;
    const total = state._sessionTotal || sessionTotal();
    const ratio = Math.min(state.elapsed / total, 1);
    const gi = Math.min(Math.floor(ratio * seq.length), seq.length - 1);
    state._guidanceIndex = gi;
    setGuidance(seq[gi], false);
  }

  let guidanceTimer = null;
  function setGuidance(text, immediate) {
    const el = $('#guidance');
    if (guidanceTimer) clearTimeout(guidanceTimer);
    if (immediate) { el.textContent = text; el.classList.remove('fade'); return; }
    el.classList.add('fade');
    guidanceTimer = setTimeout(() => {
      el.textContent = text;
      el.classList.remove('fade');
    }, 900);
  }

  // ---------- 呼吸引导 ----------
  function breathInfo(elapsed, cfg) {
    let t = elapsed % cfg.cycle;
    for (let i = 0; i < cfg.phases.length; i++) {
      const [label, dur] = cfg.phases[i];
      if (t < dur) {
        const p = t / dur;
        // 返回当前相位、进度、以及整体缩放值 0..1
        let scale;
        if (label === '吸气') scale = p;           // 0 -> 1 扩张
        else if (label === '呼气') scale = 1 - p;   // 1 -> 0 收缩
        else {
          // 停留：紧接吸气后保持最大，紧接呼气后保持最小
          const prev = cfg.phases[(i - 1 + cfg.phases.length) % cfg.phases.length][0];
          scale = (prev === '吸气') ? 1 : 0;
        }
        return { label, p, scale, remain: Math.ceil(dur - t) };
      }
      t -= dur;
    }
    return { label: '呼气', p: 1, scale: 0, remain: 0 };
  }

  function updateBreathUI(info) {
    if (reduceMotion) {
      // 减少动态：圆环保持恒定大小，仅用文字与数字引导呼吸
      $('#breath-ring').style.transform = 'scale(0.88)';
      $('#breath-halo').style.transform = 'scale(1)';
      $('#breath-halo').style.opacity = '0.5';
    } else {
      // 圆环缩放：小 0.62 -> 大 1.06
      const s = 0.62 + info.scale * 0.44;
      $('#breath-ring').style.transform = 'scale(' + s.toFixed(3) + ')';
      $('#breath-halo').style.transform = 'scale(' + (0.8 + info.scale * 0.55).toFixed(3) + ')';
      $('#breath-halo').style.opacity = (0.5 + info.scale * 0.5).toFixed(3);
    }
    const label = $('#breath-label');
    if (label.textContent !== info.label) label.textContent = info.label;
    $('#breath-count').textContent = info.remain > 0 ? String(info.remain) : '';
  }

  // ---------- 主渲染循环 ----------
  function loop(now) {
    const dt = Math.min(now - state.lastTick, 100);
    state.lastTick = now;

    let breath = 0.5;

    if (state.running && !state.paused) {
      state.elapsed += dt / 1000;
      state.breathElapsed += dt / 1000;
      const total = state._sessionTotal || sessionTotal();
      const cfg = BREATH[state.breath];
      const info = breathInfo(state.breathElapsed, cfg);
      breath = info.scale;
      updateBreathUI(info);

      // 进度与时间
      const ratio = Math.min(state.elapsed / total, 1);
      $('#progress-fill').style.width = (ratio * 100).toFixed(2) + '%';
      $('#time-left').textContent = fmt(total - state.elapsed);

      // 阶段引导语：真人语音主导时不滚动中文引导语，避免两套引导打架
      if (!state.guideActive) {
        const seq = state._guidanceSeq;
        const gi = Math.min(Math.floor(ratio * seq.length), seq.length - 1);
        if (gi !== state._guidanceIndex) {
          state._guidanceIndex = gi;
          setGuidance(seq[gi], false);
        }
      }

      if (state.elapsed >= total) finishSession();
    } else if (state.paused) {
      const cfg = BREATH[state.breath];
      const info = breathInfo(state.breathElapsed, cfg);
      breath = info.scale;
    }

    sceneEngine.render(now, reduceMotion ? 0.5 : breath);
    requestAnimationFrame(loop);
  }

  // ---------- 键盘快捷键（静心时常闭眼，空格暂停/继续，Esc 结束）----------
  document.addEventListener('keydown', (e) => {
    if (!state.running) return;
    // 焦点在按钮上时交给原生行为，避免空格既触发按钮又触发快捷键
    const onButton = document.activeElement && document.activeElement.tagName === 'BUTTON';
    if (e.code === 'Space' && !onButton) {
      e.preventDefault();
      if (state.paused) resumeSession(); else pauseSession();
    } else if (e.code === 'Escape') {
      e.preventDefault();
      finishSession();
    }
  });

  // ---------- 初始化 ----------
  window.addEventListener('resize', () => sceneEngine.resize());
  document.addEventListener('visibilitychange', () => {
    // 切到后台时暂停会话，避免计时漂移
    if (document.hidden && state.running && !state.paused) pauseSession();
  });

  preloadPhotos();
  applyScene('forest');
  show('intro');
  updateSoundIcon();
  updateSoundStatus();
  if (window.Gather) refreshGatherCard();
  requestAnimationFrame(loop);
})();
