/* ============================================================
   audio.js — 程序化环境声（Web Audio API）
   颂钵 / 林风 / 流水 / 海浪，全部实时合成，无音频文件
   默认静音，仅在用户主动开启后发声（合规：不诱导、不沉迷）
   暴露 window.AudioEngine
   ============================================================ */
(function () {
  'use strict';

  function AudioEngine() {
    this.ctx = null;
    this.master = null;
    this.type = 'off';
    this.nodes = [];
    this.timers = [];
    this.enabled = false;
    this._stopTimer = null;
  }

  AudioEngine.prototype._ensure = function () {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(this.ctx.destination);
  };

  // 生成一段循环白噪声 buffer
  AudioEngine.prototype._noiseBuffer = function (seconds) {
    const ctx = this.ctx;
    const len = ctx.sampleRate * (seconds || 3);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  };

  // 持续的过滤噪声（风/水/浪的基础）
  AudioEngine.prototype._noiseLayer = function (opts) {
    const ctx = this.ctx;
    const src = ctx.createBufferSource();
    src.buffer = this._noiseBuffer(4);
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = opts.filterType || 'lowpass';
    filter.frequency.value = opts.freq || 600;
    filter.Q.value = opts.q || 0.7;
    const gain = ctx.createGain();
    gain.gain.value = opts.gain || 0.1;
    src.connect(filter); filter.connect(gain); gain.connect(this.master);
    src.start();

    // LFO 调制音量（模拟风起伏 / 浪涌）
    let lfo = null, lfoGain = null;
    if (opts.lfoRate) {
      lfo = ctx.createOscillator();
      lfo.frequency.value = opts.lfoRate;
      lfoGain = ctx.createGain();
      lfoGain.gain.value = opts.lfoDepth || 0.05;
      lfo.connect(lfoGain); lfoGain.connect(gain.gain);
      lfo.start();
      this.nodes.push(lfo, lfoGain);
    }
    this.nodes.push(src, filter, gain);
  };

  // 一声颂钵：多个正弦泛音 + 长衰减
  AudioEngine.prototype._bowlHit = function (strength) {
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const base = 174.6; // F3 附近，温厚
    const partials = [1, 2.01, 2.78, 4.07, 5.43];
    const amps = [1, 0.5, 0.32, 0.18, 0.1];
    const dur = 5.5;
    const bus = ctx.createGain();
    bus.gain.value = (strength || 1) * 0.16;
    bus.connect(this.master);
    partials.forEach((p, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = base * p;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(amps[i] * 0.9, now + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + dur * (1 - i * 0.1));
      osc.connect(g); g.connect(bus);
      osc.start(now); osc.stop(now + dur);
    });
  };

  AudioEngine.prototype._clear = function () {
    this.nodes.forEach(n => { try { n.stop && n.stop(); } catch (e) {} try { n.disconnect(); } catch (e) {} });
    this.nodes = [];
    this.timers.forEach(t => clearInterval(t));
    this.timers = [];
  };

  // 切换声音类型；'off' 或 Unknown 都会静音
  AudioEngine.prototype.setType = function (type) {
    this._ensure();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    // 取消上一次 stop() 挂起的延迟清理，避免误清新会话的音频节点
    if (this._stopTimer) { clearTimeout(this._stopTimer); this._stopTimer = null; }
    this._clear();
    this.type = type;

    if (type === 'bowl') {
      this._bowlHit(0.9);
      this.timers.push(setInterval(() => {
        if (this.enabled) this._bowlHit(0.7);
      }, 9000));
    } else if (type === 'forest') {
      this._noiseLayer({ filterType: 'lowpass', freq: 780, gain: 0.09, lfoRate: 0.07, lfoDepth: 0.05 });
      this._noiseLayer({ filterType: 'highpass', freq: 2400, gain: 0.015, lfoRate: 0.13, lfoDepth: 0.01 });
    } else if (type === 'water') {
      this._noiseLayer({ filterType: 'bandpass', freq: 900, q: 0.5, gain: 0.11, lfoRate: 0.21, lfoDepth: 0.045 });
      this._noiseLayer({ filterType: 'lowpass', freq: 400, gain: 0.05, lfoRate: 0.09, lfoDepth: 0.03 });
    } else if (type === 'wave') {
      this._noiseLayer({ filterType: 'lowpass', freq: 620, gain: 0.13, lfoRate: 0.09, lfoDepth: 0.11 });
      this._noiseLayer({ filterType: 'highpass', freq: 1800, gain: 0.02, lfoRate: 0.09, lfoDepth: 0.02 });
    }
    this._applyGain();
  };

  AudioEngine.prototype._applyGain = function () {
    if (!this.master || !this.ctx) return;
    const target = (this.enabled && this.type !== 'off') ? 0.9 : 0;
    this.master.gain.cancelScheduledValues(this.ctx.currentTime);
    this.master.gain.setTargetAtTime(target, this.ctx.currentTime, 0.5);
  };

  AudioEngine.prototype.enable = function () { this.enabled = true; this._applyGain(); };
  AudioEngine.prototype.disable = function () { this.enabled = false; this._applyGain(); };
  AudioEngine.prototype.stop = function () {
    this.enabled = false;
    this._applyGain();
    if (this._stopTimer) clearTimeout(this._stopTimer);
    this._stopTimer = setTimeout(() => {
      this._clear();
      this._stopTimer = null;
    }, 700);
  };

  window.AudioEngine = AudioEngine;
})();
