/* ============================================================
   audio.js — 真实录音与原创普通话引导音轨
   所有声音文件均在本站 assets/audio/，来源与授权见 README.md
   设置页只选择、不发声；点击「开始静坐」后才播放
   暴露 window.AudioEngine
   ============================================================ */
(function () {
  'use strict';

  var FILES = {
    guide3: 'assets/audio/guide3.m4a',
    bowl: 'assets/audio/bowl.mp3',
    forest: 'assets/audio/forest.mp3',
    water: 'assets/audio/stream.mp3',
    waves: 'assets/audio/waves.mp3',
    insects: 'assets/audio/insects.mp3',
    birds: 'assets/audio/birds.mp3',
    life: 'assets/audio/life.mp3'
  };

  var LEVELS = {
    guide3: 0.88,
    bowl: 0.52,
    forest: 0.62,
    water: 0.60,
    waves: 0.58,
    insects: 0.58,
    birds: 0.52,
    life: 0.42
  };

  function normalize(type) {
    return Object.prototype.hasOwnProperty.call(FILES, type) ? type : 'guide3';
  }

  function AudioEngine(onGuideEnd) {
    this.onGuideEnd = onGuideEnd || null;
    this.type = 'guide3';
    this.enabled = true;
    this.paused = false;
    this.current = null;
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
    audio.loop = (type !== 'guide3');
    audio.volume = 0;
    audio.addEventListener('ended', function () {
      if (self.current === audio && type === 'guide3' && self.onGuideEnd) {
        self.onGuideEnd();
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
    if (!this.current || this.current.ended) {
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

  window.AudioEngine = AudioEngine;
})();
