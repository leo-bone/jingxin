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
    sound: 'guide3',      // 用户选择的声音；始终是有效类型，不被静音改写
    muted: false,         // 会话内静音，独立于声音选择（避免状态污染）
    guideEnded: false,
    guideActive: false,  // 真人引导正在主导（此时不再滚动中文引导语，避免中英打架）
    _doneShort: false,   // 结束页是否用"片刻"文案，供语言切换时重建
    _reflectionNoteSaved: false, // 结束页提示当前是否为"已留下"状态
    // 会话运行态
    running: false,
    paused: false,
    elapsed: 0,        // 已过秒数
    lastTick: 0,
    breathElapsed: 0,  // 当前呼吸循环内已过秒数
  };

  const t = (key, vars) => window.I18n ? I18n.t(key, vars) : key;

  // 呼吸节奏定义（秒）——以放松为目标，遵循"呼气≥吸气"原则
  // phases 用语义 key（inhale/exhale/hold），显示时经 i18n 翻译
  const BREATH = {
    calm:   { phases: [['inhale', 4], ['exhale', 6]], cycle: 10 },
    cohere: { phases: [['inhale', 5], ['exhale', 5]], cycle: 10 },
    relax:  { phases: [['inhale', 4], ['hold', 7], ['exhale', 8]], cycle: 19 },
    box:    { phases: [['inhale', 4], ['hold', 4], ['exhale', 4], ['hold', 4]], cycle: 16 }
  };

  // 整套完整练习：音频本身即从头到尾的完整引导，时长随录音，播完即结束
  // 时长由 mutagen 读取的真实秒数写入，界面进度与计时以音频为准
  const FULL_PRACTICE = {
    bodyscanf:  { sec: 26 * 60 + 46 },
    bodyscanm:  { sec: 37 * 60 + 9 },
    bodyscancn: { sec: 4 * 60 + 9 },
    sitting:    { sec: 34 * 60 + 50 },
    sittingcn:  { sec: 17 * 60 + 28 }
  };
  function isFullPractice(s) { return Object.prototype.hasOwnProperty.call(FULL_PRACTICE, s); }
  // 当前会话总秒数：完整练习取录音时长，静坐取所选时长
  function sessionTotal() {
    return isFullPractice(state.sound) ? FULL_PRACTICE[state.sound].sec : state.minutes * 60;
  }

  // 是否为真人语音引导（3 分钟短引导 + 整套完整练习）：均由音频主导屏幕
  // 复用 audio.js 的清单，避免两处各写一份导致漂移
  function isGuideSound(s) {
    return window.AudioEngine && AudioEngine.isGuide
      ? AudioEngine.isGuide(s)
      : (s === 'guide3' || s === 'guide3m' || isFullPractice(s));
  }

  // 按会话时长抽取引导语序列：短时少句避免切换过密，长时铺满完整脉络
  function guidanceFor(minutes) {
    const GUIDANCE = window.I18n ? I18n.guidance() : [];
    // 至少返回一句，避免字典异常时 endGuidanceMode() 把 undefined 写进屏幕
    if (!GUIDANCE.length) return [t('guidance.init')];
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
    // 整套完整练习播完：练习即圆满，按完整时长正常结算
    if (state._fullPractice) {
      finishSession(true);
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

  // 声音标签走 i18n：key 为 sound.<type>，与字典一致
  function soundLabel(type) { return t('sound.' + type); }

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
  // 把视觉选中态同步成 aria-pressed，让读屏用户能感知当前选项
  const PRESSABLE = '#duration-row .chip, #breath-row .chip, #sound-row .chip, #full-row .chip, #scene-grid .scene-card';
  function syncPressed() {
    $$(PRESSABLE).forEach(c =>
      c.setAttribute('aria-pressed', c.classList.contains('is-selected') ? 'true' : 'false'));
  }

  function bindChips(rowSel, key, transform) {
    $$(rowSel + ' .chip').forEach(chip => {
      chip.addEventListener('click', () => {
        $$(rowSel + ' .chip').forEach(c => c.classList.remove('is-selected'));
        chip.classList.add('is-selected');
        const val = chip.dataset[key];
        state[({ scene: 'scene', min: 'minutes', breath: 'breath', sound: 'sound' })[key]] = transform ? transform(val) : val;
        if (key === 'scene') applyScene(val);
        syncPressed();
      });
    });
  }

  // 时长说明：普通静坐显示常用时长，整套练习显示"随音频"
  // 抽成函数供语言切换时重建，避免被静态 data-i18n 冲回默认值
  function refreshDurationNote() {
    const locked = isFullPractice(state.sound);
    $('#duration-row').classList.toggle('is-locked', locked);
    $('#duration-note').textContent = locked ? t('field.duration.locked') : t('field.duration.note');
  }

  // 声音 / 整套练习共用：两组 chip 互斥，选择只记忆、不预播放
  function selectSound(val) {
    state.sound = val;
    audio.setType(val);
    $$('#sound-row .chip, #full-row .chip').forEach(c =>
      c.classList.toggle('is-selected', c.dataset.sound === val));
    refreshDurationNote();
    updateSoundIcon();
    updateSoundStatus();
    syncPressed();
  }
  // 场景卡片单独绑定（非 chip 结构）
  $$('#scene-grid .scene-card').forEach(card => {
    card.addEventListener('click', () => {
      $$('#scene-grid .scene-card').forEach(c => c.classList.remove('is-selected'));
      card.classList.add('is-selected');
      state.scene = card.dataset.scene;
      applyScene(state.scene);
      syncPressed();
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
      if (note) note.textContent = t('breathNote.' + chip.dataset.breath);
    });
  });

  function updateSoundIcon() {
    const btn = $('#btn-sound');
    $('#sound-icon').textContent = state.muted ? t('sound.icon.off') : t('sound.icon.on');
    // aria-label 描述"点下去会发生什么"，aria-pressed 描述"当前是否处于静音"
    btn.setAttribute('aria-label', state.muted ? t('sound.on') : t('sound.mute'));
    btn.setAttribute('aria-pressed', state.muted ? 'true' : 'false');
  }

  function updateSoundStatus() {
    if (state.muted) {
      $('#sound-status').textContent = t('sound.off');
    } else if (isGuideSound(state.sound) && state.guideEnded) {
      $('#sound-status').textContent = t('sound.ended');
    } else {
      $('#sound-status').textContent = soundLabel(state.sound);
    }
  }

  // ---------- 共坐一场（氛围层，纯前端） ----------
  // 设置页卡片：每秒刷新本场倒计时与演示人数
  function refreshGatherCard() {
    const snap = Gather.snapshot();
    $('#gather-session').textContent = t('gather.session', { a: snap.startLabel, b: snap.endLabel });
    $('#gather-seats').textContent = t('gather.seats', { n: snap.seats });
    $('#gather-count').textContent = t('gather.remain', { t: snap.remain });
  }
  // 会话页顶部：显示本场人数与同一场提示
  function updateCoText() {
    if (state._gatherSnap) {
      $('#co-text').textContent = t('gather.co', { n: state._gatherSnap.seats });
    } else {
      $('#co-text').textContent = t('gather.co.plain');
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
      const dt = new Date(r.at);
      meta.textContent = t('reflection.you') + ' · ' + String(dt.getHours()).padStart(2, '0') + ':' + String(dt.getMinutes()).padStart(2, '0');
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
  // 包装一层：避免 addEventListener 把 Event 对象当作 finishSession 的入参
  $('#btn-finish').addEventListener('click', () => finishSession(false));
  $('#btn-end-from-pause').addEventListener('click', () => finishSession(false));
  $('#btn-again').addEventListener('click', () => { show('setup'); });
  $('#btn-home').addEventListener('click', () => {
    // 回到开头时把场景选择一并复位，避免设置页选中卡片与实际背景不一致
    state.scene = 'forest';
    $$('#scene-grid .scene-card').forEach(c => c.classList.toggle('is-selected', c.dataset.scene === 'forest'));
    syncPressed();
    show('intro');
    applyScene('forest');
  });
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
    state._reflectionNoteSaved = true;
    const note = $('#reflection-note');
    if (note) {
      note.textContent = t('reflection.saved');
      setTimeout(() => {
        state._reflectionNoteSaved = false;
        note.textContent = t('reflection.note');
      }, 2600);
    }
  }
  $('#reflection-send').addEventListener('click', submitReflection);
  $('#reflection-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); submitReflection(); }
  });

  // 静音是"会话内的临时状态"，与用户选的声音彼此独立：
  // 不再把 state.sound 改写成 'off'，避免结束 / 再坐时丢掉声音选择或残留静音。
  $('#btn-sound').addEventListener('click', () => {
    state.muted = !state.muted;
    if (state.muted) {
      audio.disable();
      // 手动静音真人引导时，把引导话语权交还给屏幕，避免静默到底
      if (state.guideActive) endGuidanceMode();
    } else if (state.running && !state.paused) {
      // 引导已自然播完：本场语音已经退场，不再重启声音，
      // 由屏幕引导语陪伴余下时间（audio.resume 也会因 guideFinished 而拒绝重播）。
      const guideDone = isGuideSound(state.sound) && state.guideEnded;
      if (!guideDone) {
        audio.resume();
        // 恢复真人引导：让音频重新接管屏幕，避免与中文引导语同时滚动
        if (isGuideSound(state.sound)) {
          state.guideActive = true;
          const hint = (state.sound === 'sitting' || state.sound === 'sittingcn') ? t('hint.sitting')
            : isFullPractice(state.sound) ? t('hint.body')
            : t('hint.breath');
          setGuidance(hint, true);
        }
      }
    }
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
    state._fullPractice = full;       // 锁定会话类型，避免中途改动声音选择后判定漂移
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
    state.guideActive = isGuideSound(state.sound) && !state.muted;
    // 真人引导主导时，屏幕只给一句静态提示，让位给语音；否则用引导语陪伴
    const guideHint = full
      ? ((state.sound === 'sitting' || state.sound === 'sittingcn') ? t('hint.sitting') : t('hint.body'))
      : t('hint.breath');
    setGuidance(state.guideActive ? guideHint : (state._guidanceSeq[0] || t('guidance.init')), true);
    updateSoundIcon();
    updateSoundStatus();

    // 用户点击「开始静坐」后才播放，设置页不预发声
    if (!state.muted) {
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
    if (!state.muted) audio.resume();
    $('#pause-overlay').classList.remove('is-active');
  }

  // completed=true 表示"正常走完"（计时到点 / 整套练习音频播完），
  // 按会话总时长结算；false 表示用户提前结束，按实际已坐时间结算。
  // 参数用严格 === true 判断，避免误把 DOM Event 当成完成标记。
  function finishSession(completed) {
    if (!state.running) return; // 防止音频结束与计时到点同帧重复结算
    const finished = completed === true;
    state.running = false;
    state.paused = false;
    state.guideActive = false;
    state.muted = false;   // 静音只属于这一场，不带到下一次静坐
    $('#pause-overlay').classList.remove('is-active');
    audio.stop();

    const rec = saveSession();
    const effective = finished ? (state._sessionTotal || sessionTotal()) : state.elapsed;
    const mins = Math.max(1, Math.round(effective / 60));
    state._doneShort = effective < 30;
    $('#stat-minutes').textContent = mins;
    $('#stat-total').textContent = todayCount(rec);
    $('#stat-streak').textContent = streak(rec);
    $('#done-sub').textContent = state._doneShort ? t('done.sub.short') : t('done.sub.long');
    state._reflectionNoteSaved = false;
    // 清空上一场输入框，渲染本场留言
    const input = $('#reflection-input');
    if (input) input.value = '';
    renderReflections();
    updateSoundIcon();
    updateSoundStatus();
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
        if (label === 'inhale') scale = p;           // 0 -> 1 扩张
        else if (label === 'exhale') scale = 1 - p;  // 1 -> 0 收缩
        else {
          // 停留：紧接吸气后保持最大，紧接呼气后保持最小
          const prev = cfg.phases[(i - 1 + cfg.phases.length) % cfg.phases.length][0];
          scale = (prev === 'inhale') ? 1 : 0;
        }
        return { label, p, scale, remain: Math.ceil(dur - t) };
      }
      t -= dur;
    }
    return { label: 'exhale', p: 1, scale: 0, remain: 0 };
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
    const labelText = t('phase.' + info.label);
    if (label.textContent !== labelText) label.textContent = labelText;
    $('#breath-count').textContent = info.remain > 0 ? String(info.remain) : '';
  }

  // ---------- 主渲染循环 ----------
  // 非会话页的背景只需极轻微动感，降频渲染可显著降低 GPU / 电量占用；
  // 会话页保持满帧以维持呼吸圆环的顺滑。计时始终按真实帧推进，不受节流影响。
  let lastRender = 0;
  const IDLE_FRAME = reduceMotion ? 200 : 50; // 减少动态约 5fps，普通约 20fps
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

      if (state.elapsed >= total) finishSession(true);
    } else if (state.paused) {
      const cfg = BREATH[state.breath];
      const info = breathInfo(state.breathElapsed, cfg);
      breath = info.scale;
    }

    const sessionActive = state.running || $('#screen-session').classList.contains('is-active');
    if (sessionActive || now - lastRender >= IDLE_FRAME) {
      sceneEngine.render(now, reduceMotion ? 0.5 : breath);
      lastRender = now;
    }
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
      finishSession(false);
    }
  });

  // ---------- 语言切换：切换后重刷所有动态文案 ----------
  // applyStatic() 只负责静态 data-i18n，会把被 JS 改写过的节点冲回默认值，
  // 因此所有运行时文案都必须在这里逐项重建，否则出现中英混杂或状态回退。
  function refreshDynamic() {
    updateSoundIcon();
    updateSoundStatus();
    updateCoText();
    refreshDurationNote();            // 整套练习锁定时长说明（BUG-2）
    if (window.Gather) refreshGatherCard();
    // 呼吸原理说明跟随当前选中的呼吸法
    const breathNote = $('#breath-note');
    if (breathNote) breathNote.textContent = t('breathNote.' + state.breath);
    // 正在会话中：重建引导语序列并刷新当前显示，避免中英混杂
    if (state.running) {
      // 暂停时 loop 不刷新相位文字，语言切换后需立即同步
      const info = breathInfo(state.breathElapsed, BREATH[state.breath]);
      $('#breath-label').textContent = t('phase.' + info.label);
      state._guidanceSeq = guidanceFor(state.minutes);
      if (state.guideActive) {
        const full = state._fullPractice;
        const hint = full
          ? ((state.sound === 'sitting' || state.sound === 'sittingcn') ? t('hint.sitting') : t('hint.body'))
          : t('hint.breath');
        setGuidance(hint, true);
      } else {
        const seq = state._guidanceSeq;
        const total = state._sessionTotal || sessionTotal();
        const gi = Math.min(Math.floor(Math.min(state.elapsed / total, 1) * seq.length), seq.length - 1);
        state._guidanceIndex = gi;
        if (seq[gi]) setGuidance(seq[gi], true);
      }
    }
    // 结束页：重建动态结束语、留言提示与留言列表里的"你"
    if ($('#screen-done').classList.contains('is-active')) {
      $('#done-sub').textContent = state._doneShort ? t('done.sub.short') : t('done.sub.long');
      const rNote = $('#reflection-note');
      if (rNote) rNote.textContent = state._reflectionNoteSaved ? t('reflection.saved') : t('reflection.note');
      renderReflections();
    }
  }

  $('#btn-lang').addEventListener('click', () => {
    I18n.setLang(I18n.lang() === 'zh' ? 'en' : 'zh');
  });
  if (window.I18n) {
    I18n.init();
    I18n.onChange(refreshDynamic);
  }

  // ---------- 初始化 ----------
  window.addEventListener('resize', () => sceneEngine.resize());
  document.addEventListener('visibilitychange', () => {
    // 切到后台时暂停会话，避免计时漂移
    if (document.hidden && state.running && !state.paused) pauseSession();
  });

  preloadPhotos();
  applyScene('forest');
  show('intro');
  syncPressed();
  refreshDurationNote();
  updateSoundIcon();
  updateSoundStatus();
  if (window.Gather) refreshGatherCard();
  requestAnimationFrame(loop);
})();
