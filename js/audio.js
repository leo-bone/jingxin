/* ============================================================
   audio.js — 真人正念引导与环境声
   引导音频来自 The Free Mindfulness Project（CC BY-NC-SA 3.0）
   所有声音文件均在本站 assets/audio/，来源与授权见 README.md
   设置页只选择、不发声；点击「开始静坐」后才播放
   暴露 window.AudioEngine
   ============================================================ */
(function () {
  'use strict';

  var FILES = {
    guide3: 'assets/audio/guide3_female.mp3',      // 女声短引导 · English · Free Mindfulness
    guide3m: 'assets/audio/guide3_cn.mp3',         // 女声短引导 · 普通话 · UCLA Mindful
    bodyscanf: 'assets/audio/bodyscan_female.mp3', // 身体扫描 · 女声 English
    bodyscanm: 'assets/audio/bodyscan_male.mp3',   // 身体扫描 · 男声 English
    bodyscancn: 'assets/audio/bodyscan_cn.mp3',    // 身体扫描 · 女声普通话 · UCLA Mindful
    sitting: 'assets/audio/sitting_full.mp3',      // 完整坐禅 · English
    sittingcn: 'assets/audio/sitting_cn.mp3',      // 完整坐禅 · 女声普通话 · UCLA Mindful
    bowl: 'assets/audio/bowl.mp3',
    forest: 'assets/audio/forest.mp3',             // 林风：风吹树林
    water: 'assets/audio/stream.mp3',
    waves: 'assets/audio/waves.mp3',
    frogs: 'assets/audio/frogs.mp3',               // 蛙声（纯蛙鸣，替换原虫鸣）
    birds: 'assets/audio/birds.mp3',
    life: 'assets/audio/life.mp3'
  };

  var LEVELS = {
    guide3: 0.9,
    guide3m: 0.9,
    bodyscanf: 0.9,
    bodyscanm: 0.9,
    bodyscancn: 0.9,
    sitting: 0.9,
    sittingcn: 0.9,
    bowl: 0.52,
    forest: 0.62,
    water: 0.60,
    waves: 0.58,
    frogs: 0.58,
    birds: 0.52,
    life: 0.42
  };

  // 真人语音引导（含整套完整练习）：有限时长、不循环、播完触发 onGuideEnd
  function isGuide(type) {
    return type === 'guide3' || type === 'guide3m' ||
           type === 'bodyscanf' || type === 'bodyscanm' || type === 'bodyscancn' ||
           type === 'sitting' || type === 'sittingcn';
  }

  function normalize(type) {
    return Object.prototype.hasOwnProperty.call(FILES, type) ? type : 'guide3';
  }

  function AudioEngine(onGuideEnd) {
    this.onGuideEnd = onGuideEnd || null;
    this.type = 'guide3';
    this.enabled = true;
    this.paused = false;
    this.current = null;
    // 显式标记"本场引导音已自然播完"，不依赖 HTMLMediaElement.ended
    // （部分环境/自动播放被拒时 ended 不可靠），供 resume() 判定是否重播
    this.guideFinished = false;
    this._token = 0;
    this._fadeTimer = null;
  }

  AudioEngine.prototype.setType = function (type) {
    this.type = normalize(type);
  };

  AudioEngine.prototype._make = function (type) {
    var self = this;
    var audio = new Audio(FILES[type]);
    audio.preload = 'auto';
    audio.loop = !isGuide(type);
    audio.volume = 0;
    audio.addEventListener('ended', function () {
      if (self.current === audio && isGuide(type)) {
        self.guideFinished = true;
        if (self.onGuideEnd) self.onGuideEnd();
      }
    });
    return audio;
  };

  AudioEngine.prototype._stopFade = function () {
    if (this._fadeTimer) {
      clearInterval(this._fadeTimer);
      this._fadeTimer = null;
    }
  };

  AudioEngine.prototype._crossfade = function (oldEl, newEl, target) {
    var self = this;
    this._stopFade();
    var start = (oldEl && oldEl !== newEl) ? oldEl.volume : 0;
    var t0 = performance.now();
    var duration = 850;

    this._fadeTimer = setInterval(function () {
      var p = Math.min((performance.now() - t0) / duration, 1);
      var eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      if (newEl) newEl.volume = Math.max(0, Math.min(1, eased * target));
      if (oldEl && oldEl !== newEl) oldEl.volume = Math.max(0, start * (1 - eased));
      if (p >= 1) {
        self._stopFade();
        if (oldEl && oldEl !== newEl) {
          try { oldEl.pause(); oldEl.currentTime = 0; } catch (e) {}
        }
      }
    }, 30);
  };

  AudioEngine.prototype._fadeOutPause = function (el) {
    var self = this;
    this._stopFade();
    if (!el) return;
    var start = el.volume;
    var t0 = performance.now();
    var duration = 500;
    this._fadeTimer = setInterval(function () {
      var p = Math.min((performance.now() - t0) / duration, 1);
      el.volume = Math.max(0, start * (1 - p));
      if (p >= 1) {
        self._stopFade();
        try { el.pause(); } catch (e) {}
      }
    }, 30);
  };

  AudioEngine.prototype.play = function () {
    if (!this.enabled) this.enabled = true;
    this.paused = false;
    this.guideFinished = false; // 新一场、新一段音频，重置播完标记

    var token = ++this._token;
    var previous = this.current;
    var audio = this._make(this.type);
    this.current = audio;

    var promise = audio.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {
        if (token === this._token) {
          // 浏览器拒绝自动播放时，保留选择状态，等待用户点右上角声音按钮
          this.current = null;
        }
      }.bind(this));
    }
    this._crossfade(previous, audio, LEVELS[this.type]);
  };

  AudioEngine.prototype.pause = function () {
    this.paused = true;
    this._stopFade();
    if (this.current) {
      try { this.current.pause(); } catch (e) {}
    }
  };

  AudioEngine.prototype.resume = function () {
    this.paused = false;
    if (!this.enabled) this.enabled = true;
    // 引导音频已自然播完时不重播：避免"暂停/恢复"或"静音/恢复"
    // 把整段引导从头再放一遍。此时由屏幕引导语陪伴，声音保持静默即可。
    // guideFinished 由 ended 回调显式置位，current.ended 作为浏览器原生兜底。
    if (this.guideFinished || (this.current && this.current.ended)) return;
    // current 为空（例如上次自动播放被浏览器拒绝）时才重新播放
    if (!this.current) {
      this.play();
      return;
    }
    var promise = this.current.play();
    if (promise && typeof promise.catch === 'function') promise.catch(function () {});
    this._crossfade(null, this.current, LEVELS[this.type]);
  };

  AudioEngine.prototype.disable = function () {
    this.enabled = false;
    this._token++;
    this._fadeOutPause(this.current);
  };

  AudioEngine.prototype.stop = function () {
    this.enabled = false;
    this.paused = false;
    this._token++;
    this._fadeOutPause(this.current);
  };

  // 暴露引导音判断，供 app.js 复用，避免两处清单各自漂移
  AudioEngine.isGuide = isGuide;

  window.AudioEngine = AudioEngine;
})();
