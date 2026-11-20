/* ============================================================
   scenes.js — 程序化东方山水场景引擎
   零外部素材：五种场景全部由 Canvas 实时绘制
   暴露 window.SceneEngine
   ============================================================ */
(function () {
  'use strict';

  // ---------- 小工具 ----------
  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function rand(a, b) { return a + Math.random() * (b - a); }

  // 一维平滑噪声（用于山脊线）
  function makeNoise(seed) {
    const table = new Float32Array(256);
    let s = seed >>> 0;
    for (let i = 0; i < 256; i++) {
      s = (s * 1664525 + 1013904223) >>> 0;
      table[i] = (s / 4294967296);
    }
    return function (x) {
      const i = Math.floor(x), f = x - i;
      const a = table[((i % 256) + 256) % 256];
      const b = table[(((i + 1) % 256) + 256) % 256];
      const u = f * f * (3 - 2 * f);
      return lerp(a, b, u);
    };
  }

  function linGrad(ctx, x0, y0, x1, y1, stops) {
    const g = ctx.createLinearGradient(x0, y0, x1, y1);
    stops.forEach(s => g.addColorStop(s[0], s[1]));
    return g;
  }
  function radial(ctx, x, y, r, stops) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    stops.forEach(s => g.addColorStop(s[0], s[1]));
    return g;
  }

  // 绘制一条起伏山脊并填充到底部
  function ridge(ctx, w, h, baseY, amp, color, noise, freq, offset) {
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 6) {
      const n = noise(x * freq + offset);
      const n2 = noise(x * freq * 2.3 + offset + 40) * 0.35;
      const y = baseY - (n + n2) * amp;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  // 太阳/月亮光晕
  function orb(ctx, x, y, r, core, glow, ring) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const g = radial(ctx, x, y, r * 5.5, [
      [0, glow], [0.14, glow.replace(/[\d.]+\)$/, '0.22)')], [0.45, 'rgba(255,255,255,0.05)'], [1, 'rgba(255,255,255,0)']
    ]);
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, r * 5.5, 0, Math.PI * 2); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = core;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    if (ring) {
      ctx.strokeStyle = ring; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(x, y, r * 1.28, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.restore();
  }

  // 丁达尔光束
  function lightShafts(ctx, w, h, x, y, color, t, count) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < count; i++) {
      const spread = (i / (count - 1) - 0.5);
      const drift = Math.sin(t * 0.00012 + i) * 18;
      const endX = x + spread * w * 0.9 + drift;
      const alpha = 0.05 + 0.04 * Math.sin(t * 0.0005 + i * 1.7);
      const g = linGrad(ctx, x, y, endX, h, [
        [0, color.replace('ALPHA', alpha.toFixed(3))],
        [1, color.replace('ALPHA', '0')]
      ]);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(x - 8, y);
      ctx.lineTo(x + 8, y);
      ctx.lineTo(endX + 60, h);
      ctx.lineTo(endX - 60, h);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  // ---------- 粒子系统（雾/尘/萤/叶）----------
  function Particles(kind, count) {
    this.kind = kind;
    this.items = [];
    for (let i = 0; i < count; i++) this.items.push(this.spawn(true));
  }
  Particles.prototype.spawn = function (init) {
    const k = this.kind;
    if (k === 'leaf') return { x: rand(0, 1), y: init ? rand(0, 1) : -0.05, s: rand(4, 9), sp: rand(0.012, 0.03), sw: rand(0.4, 1.2), ph: rand(0, 6.28), rot: rand(0, 6.28) };
    if (k === 'mist') return { x: rand(-0.2, 1.2), y: rand(0.45, 0.95), s: rand(60, 190), sp: rand(0.004, 0.012), a: rand(0.03, 0.09) };
    // dust / firefly
    return { x: rand(0, 1), y: rand(0, 1), s: rand(1, 2.6), sp: rand(0.002, 0.008), ph: rand(0, 6.28), a: rand(0.2, 0.7) };
  };
  Particles.prototype.draw = function (ctx, w, h, t, dt, color) {
    const k = this.kind;
    ctx.save();
    for (let i = 0; i < this.items.length; i++) {
      let p = this.items[i];
      if (k === 'leaf') {
        p.y += p.sp * dt * 0.06;
        const px = p.x * w + Math.sin(t * 0.001 * p.sw + p.ph) * 26;
        const py = p.y * h;
        p.rot += dt * 0.001;
        ctx.save();
        ctx.translate(px, py); ctx.rotate(p.rot);
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, -p.s); ctx.quadraticCurveTo(p.s, 0, 0, p.s); ctx.quadraticCurveTo(-p.s, 0, 0, -p.s);
        ctx.fill();
        ctx.restore();
        if (p.y > 1.08) this.items[i] = this.spawn(false);
      } else if (k === 'mist') {
        p.x += p.sp * dt * 0.05;
        const px = p.x * w, py = p.y * h;
        const g = radial(ctx, px, py, p.s, [[0, color], [1, 'rgba(255,255,255,0)']]);
        ctx.globalAlpha = p.a;
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(px, py, p.s, 0, Math.PI * 2); ctx.fill();
        if (p.x > 1.3) this.items[i] = this.spawn(false);
      } else {
        p.y -= p.sp * dt * 0.02;
        const tw = 0.5 + 0.5 * Math.sin(t * 0.002 + p.ph);
        const px = p.x * w + Math.sin(t * 0.0007 + p.ph) * 8;
        ctx.globalAlpha = p.a * tw;
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(px, p.y * h, p.s, 0, Math.PI * 2); ctx.fill();
        if (p.y < -0.05) { p.y = 1.05; p.x = rand(0, 1); }
      }
    }
    ctx.restore();
  };

  // ============================================================
  // 五个场景绘制函数：入参 (ctx, w, h, t, breath)
  // breath: 0..1 呼吸相位，用于画面极轻微的"呼吸"缩放
  // ============================================================

  const S = {};

  // 1) 雾林 · 松间晨雾
  S.forest = (function () {
    const n1 = makeNoise(9), n2 = makeNoise(77);
    return function (ctx, w, h, t, breath) {
      ctx.fillStyle = linGrad(ctx, 0, 0, 0, h, [
        [0, '#cdd9d2'], [0.28, '#aebfb3'], [0.55, '#7e968a'], [0.8, '#4a6659'], [1, '#263b32']
      ]);
      ctx.fillRect(0, 0, w, h);
      // 晨光
      orb(ctx, w * 0.72, h * 0.24, Math.min(w, h) * 0.045, 'rgba(255,248,224,.95)', 'rgba(255,236,180,.55)', null);
      lightShafts(ctx, w, h, w * 0.72, h * 0.24, 'rgba(255,246,214,ALPHA)', t, 5);
      // 远山
      ridge(ctx, w, h, h * 0.5, h * 0.12, 'rgba(120,146,133,.55)', n1, 0.0035, 0);
      ridge(ctx, w, h, h * 0.6, h * 0.1, 'rgba(86,116,102,.7)', n2, 0.0048, 100);
      // 雾带
      for (let i = 0; i < 3; i++) {
        const y = h * (0.5 + i * 0.09);
        ctx.fillStyle = linGrad(ctx, 0, y - 30, 0, y + 50, [
          [0, 'rgba(235,240,232,0)'], [0.5, 'rgba(235,240,232,' + (0.14 - i * 0.03) + ')'], [1, 'rgba(235,240,232,0)']
        ]);
        ctx.fillRect(0, y - 30, w, 80);
      }
      // 松林剪影（近景）
      drawPines(ctx, w, h, t, breath);
      Particles.prototype.draw.call(forestMist, ctx, w, h, t, 16, 'rgba(230,238,230,1)');
      Particles.prototype.draw.call(forestDust, ctx, w, h, t, 16, 'rgba(255,244,206,1)');
    };
    function drawPines(ctx, w, h, t, breath) {
      const layers = [
        { y: 0.82, c: 'rgba(38,59,50,.55)', s: 0.62, off: 0 },
        { y: 0.92, c: 'rgba(26,43,36,.82)', s: 0.9, off: 1.7 },
        { y: 1.04, c: 'rgba(15,28,23,.96)', s: 1.25, off: 3.1 }
      ];
      layers.forEach((L, li) => {
        ctx.fillStyle = L.c;
        const gap = (w / 11) * L.s;
        for (let i = -1; i < 13; i++) {
          const seed = i * 3.7 + li * 13 + L.off;
          const x = i * gap + Math.sin(seed) * gap * 0.35;
          const baseY = h * L.y + 20;
          const treeH = h * (0.2 + (Math.sin(seed * 2.1) * 0.5 + 0.5) * 0.16) * L.s;
          const tw = treeH * 0.19;
          // 树干
          ctx.fillRect(x - 1.5 * L.s, baseY - treeH * 0.32, 3 * L.s, treeH * 0.34);
          // 三层松散的松冠
          for (let k = 0; k < 3; k++) {
            const cy = baseY - treeH * (0.32 + k * 0.24);
            const cw = tw * (1 - k * 0.24);
            ctx.beginPath();
            ctx.moveTo(x, cy - treeH * 0.3);
            ctx.lineTo(x + cw, cy + treeH * 0.12);
            ctx.lineTo(x - cw, cy + treeH * 0.12);
            ctx.closePath(); ctx.fill();
          }
        }
      });
    }
  })();
  const forestMist = new Particles('mist', 12);
  const forestDust = new Particles('dust', 26);

  // 2) 金山 · 日照雪岭
  S.snow = (function () {
    const n = makeNoise(135);
    return function (ctx, w, h, t, breath) {
      ctx.fillStyle = linGrad(ctx, 0, 0, 0, h, [
        [0, '#3d4c66'], [0.32, '#7d7f92'], [0.6, '#d9a97f'], [0.82, '#f0cf9f'], [1, '#f6e2bd']
      ]);
      ctx.fillRect(0, 0, w, h);
      // 朝阳
      orb(ctx, w * 0.26, h * 0.42, Math.min(w, h) * 0.038, 'rgba(255,250,232,1)', 'rgba(255,206,140,.6)', 'rgba(255,240,200,.35)');
      // 远云带
      ctx.fillStyle = 'rgba(240,225,205,.16)';
      for (let i = 0; i < 4; i++) {
        const y = h * (0.3 + i * 0.06);
        ctx.beginPath(); ctx.ellipse(w * (0.2 + i * 0.2), y, w * 0.32, 10 + i * 4, 0, 0, Math.PI * 2); ctx.fill();
      }
      // 主雪峰（多层，山谷分明）
      drawPeak(ctx, w, h, 0.30, 0.46, 0.62, '#8f93a6', '#e8e2dc', n, 1.2);
      drawPeak(ctx, w, h, 0.62, 0.40, 0.70, '#6f7488', '#f3ece2', n, 4.6);
      drawPeak(ctx, w, h, 0.86, 0.5, 0.58, '#5c6176', '#efe7dc', n, 8.9);
      // 前景金光坡
      ridge(ctx, w, h, h * 0.9, h * 0.08, '#c9a274', n, 0.006, 30);
      Particles.prototype.draw.call(snowDust, ctx, w, h, t, 16, 'rgba(255,235,190,1)');
    };
    function drawPeak(ctx, w, h, cx, peakY, spread, rock, snow, noise, seed) {
      const px = w * cx, py = h * peakY, halfW = w * spread * 0.5;
      ctx.beginPath();
      ctx.moveTo(px - halfW, h);
      const steps = 18;
      for (let i = 0; i <= steps; i++) {
        const tt = i / steps;
        const x = px - halfW + tt * halfW * 2;
        const base = py + Math.abs(tt - 0.5) * h * 0.42;
        const jag = (noise(i * 0.9 + seed) - 0.5) * h * 0.035;
        ctx.lineTo(x, base + jag);
      }
      ctx.lineTo(px + halfW, h); ctx.closePath();
      ctx.fillStyle = rock; ctx.fill();
      // 雪线：山顶三角
      ctx.beginPath();
      ctx.moveTo(px, py - h * 0.02);
      ctx.lineTo(px + halfW * 0.42, py + h * 0.2);
      ctx.lineTo(px + halfW * 0.2, py + h * 0.15);
      ctx.lineTo(px + halfW * 0.02, py + h * 0.24);
      ctx.lineTo(px - halfW * 0.18, py + h * 0.14);
      ctx.lineTo(px - halfW * 0.36, py + h * 0.21);
      ctx.closePath();
      ctx.fillStyle = snow; ctx.fill();
      // 阳面金晕
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = radial(ctx, px - halfW * 0.2, py + h * 0.1, halfW * 0.8, [[0, 'rgba(255,214,150,.35)'], [1, 'rgba(255,214,150,0)']]);
      ctx.fillRect(px - halfW, py - 40, halfW * 2, h * 0.5);
      ctx.restore();
    }
  })();
  const snowDust = new Particles('dust', 24);

  // 3) 沧海 · 海上生明
  S.ocean = (function () {
    const n = makeNoise(211);
    return function (ctx, w, h, t, breath) {
      const horizon = h * 0.52;
      ctx.fillStyle = linGrad(ctx, 0, 0, 0, horizon, [
        [0, '#2a4358'], [0.4, '#6a7f8c'], [0.75, '#cfa07c'], [1, '#f0c99a']
      ]);
      ctx.fillRect(0, 0, w, horizon);
      // 月
      orb(ctx, w * 0.68, horizon - h * 0.2, Math.min(w, h) * 0.05, 'rgba(255,252,238,1)', 'rgba(255,240,205,.5)', null);
      // 海面
      ctx.fillStyle = linGrad(ctx, 0, horizon, 0, h, [
        [0, '#b98f74'], [0.25, '#6c7f86'], [0.6, '#3c5766'], [1, '#1d3442']
      ]);
      ctx.fillRect(0, horizon, w, h - horizon);
      // 月光倒影 + 波光
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      for (let i = 0; i < 46; i++) {
        const yy = horizon + (i / 46) * (h - horizon);
        const prog = (i / 46);
        const width = lerp(10, Math.min(w, h) * 0.14, prog);
        const wobble = Math.sin(t * 0.0013 + i * 0.8) * 12;
        const a = (0.05 + 0.16 * Math.abs(Math.sin(i * 1.7 + t * 0.001))) * (1 - prog * 0.4);
        ctx.fillStyle = 'rgba(255,238,200,' + a.toFixed(3) + ')';
        ctx.fillRect(w * 0.68 - width / 2 + wobble, yy, width, lerp(1, 2.6, prog));
      }
      ctx.restore();
      // 远岛
      ridge(ctx, w, horizon + 2, horizon, h * 0.05, 'rgba(30,52,60,.52)', n, 0.004, 60);
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = linGrad(ctx, 0, horizon - 10, 0, horizon + 90, [[0, 'rgba(240,220,200,.12)'], [1, 'rgba(240,220,200,0)']]);
      ctx.fillRect(0, horizon - 10, w, 100);
      ctx.restore();
    };
  })();

  // 4) 古刹 · 庭院深深
  S.temple = (function () {
    const n = makeNoise(318);
    return function (ctx, w, h, t, breath) {
      ctx.fillStyle = linGrad(ctx, 0, 0, 0, h, [
        [0, '#e3d6bd'], [0.35, '#cfb998'], [0.62, '#a98d6d'], [1, '#5b4b3b']
      ]);
      ctx.fillRect(0, 0, w, h);
      orb(ctx, w * 0.5, h * 0.3, Math.min(w, h) * 0.055, 'rgba(255,246,214,.9)', 'rgba(255,222,160,.42)', null);
      lightShafts(ctx, w, h, w * 0.5, h * 0.3, 'rgba(255,238,200,ALPHA)', t, 4);
      // 远山
      ridge(ctx, w, h, h * 0.52, h * 0.1, 'rgba(120,105,84,.4)', n, 0.003, 0);
      // 寺院建筑群剪影
      drawTemple(ctx, w, h);
      // 庭院地面
      ctx.fillStyle = linGrad(ctx, 0, h * 0.82, 0, h, [[0, '#6b5844'], [1, '#3a2f25']]);
      ctx.fillRect(0, h * 0.82, w, h * 0.18);
      // 石阶
      ctx.strokeStyle = 'rgba(30,24,18,.35)'; ctx.lineWidth = 1;
      for (let i = 0; i < 6; i++) {
        const y = h * (0.84 + i * 0.028);
        ctx.beginPath(); ctx.moveTo(w * 0.3 - i * 8, y); ctx.lineTo(w * 0.7 + i * 8, y); ctx.stroke();
      }
      Particles.prototype.draw.call(templeLeaf, ctx, w, h, t, 16, 'rgba(176,122,70,1)');
    };
    function drawTemple(ctx, w, h) {
      const cx = w * 0.5, base = h * 0.84;
      const dark = 'rgba(52,42,32,.9)', roof = 'rgba(40,32,25,.95)';
      // 主殿
      const bw = Math.min(w * 0.44, 420), bh = h * 0.22;
      ctx.fillStyle = dark;
      ctx.fillRect(cx - bw / 2, base - bh, bw, bh);
      // 飞檐屋顶
      ctx.fillStyle = roof;
      ctx.beginPath();
      ctx.moveTo(cx - bw * 0.62, base - bh);
      ctx.quadraticCurveTo(cx - bw * 0.5, base - bh - h * 0.09, cx, base - bh - h * 0.12);
      ctx.quadraticCurveTo(cx + bw * 0.5, base - bh - h * 0.09, cx + bw * 0.62, base - bh);
      ctx.quadraticCurveTo(cx, base - bh + h * 0.02, cx - bw * 0.62, base - bh);
      ctx.fill();
      // 屋脊线
      ctx.strokeStyle = 'rgba(30,24,18,.9)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(cx - bw * 0.62, base - bh); ctx.quadraticCurveTo(cx, base - bh - h * 0.12, cx + bw * 0.62, base - bh); ctx.stroke();
      // 门与窗（透出暖光）
      ctx.fillStyle = 'rgba(255,214,150,.5)';
      ctx.fillRect(cx - bw * 0.08, base - bh * 0.55, bw * 0.16, bh * 0.55);
      ctx.fillStyle = 'rgba(255,214,150,.22)';
      ctx.fillRect(cx - bw * 0.3, base - bh * 0.6, bw * 0.1, bh * 0.35);
      ctx.fillRect(cx + bw * 0.2, base - bh * 0.6, bw * 0.1, bh * 0.35);
      // 塔（侧）
      const tx = cx + bw * 0.72, tbw = bw * 0.16;
      ctx.fillStyle = roof;
      for (let k = 0; k < 4; k++) {
        const ty = base - h * 0.1 - k * h * 0.075;
        const kw = tbw * (1 - k * 0.14);
        ctx.fillRect(tx - kw / 2, ty - h * 0.06, kw, h * 0.06);
        ctx.beginPath();
        ctx.moveTo(tx - kw * 0.7, ty - h * 0.06);
        ctx.lineTo(tx, ty - h * 0.105);
        ctx.lineTo(tx + kw * 0.7, ty - h * 0.06);
        ctx.closePath(); ctx.fill();
      }
      // 灯笼
      ctx.fillStyle = 'rgba(190,90,60,.75)';
      [0.36, 0.64].forEach(p => {
        const lx = cx + bw * (p - 0.5), ly = base - bh * 0.8;
        ctx.beginPath(); ctx.ellipse(lx, ly, 8, 11, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(255,200,120,.5)';
        ctx.beginPath(); ctx.ellipse(lx, ly, 4, 6, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(190,90,60,.75)';
      });
    }
  })();
  const templeLeaf = new Particles('leaf', 14);

  // 5) 山水 · 水墨层峦
  S.river = (function () {
    const n1 = makeNoise(402), n2 = makeNoise(518), n3 = makeNoise(631);
    return function (ctx, w, h, t, breath) {
      ctx.fillStyle = linGrad(ctx, 0, 0, 0, h, [
        [0, '#eae9e1'], [0.4, '#dfe3dc'], [0.7, '#c4cec7'], [1, '#93a59c']
      ]);
      ctx.fillRect(0, 0, w, h);
      orb(ctx, w * 0.78, h * 0.22, Math.min(w, h) * 0.04, 'rgba(255,252,240,.9)', 'rgba(255,240,210,.4)', null);
      // 远近四层水墨山（越远越淡）
      ridge(ctx, w, h, h * 0.46, h * 0.1, 'rgba(150,166,158,.32)', n1, 0.0026, 0);
      ctx.fillStyle = linGrad(ctx, 0, h * 0.5, 0, h * 0.66, [[0, 'rgba(234,236,228,0)'], [0.5, 'rgba(234,236,228,.7)'], [1, 'rgba(234,236,228,0)']]);
      ctx.fillRect(0, h * 0.5, w, h * 0.16);
      ridge(ctx, w, h, h * 0.6, h * 0.13, 'rgba(110,133,122,.5)', n2, 0.0036, 80);
      ridge(ctx, w, h, h * 0.74, h * 0.12, 'rgba(74,98,88,.68)', n3, 0.0044, 160);
      // 江面
      ctx.fillStyle = linGrad(ctx, 0, h * 0.8, 0, h, [[0, 'rgba(150,170,160,.5)'], [1, 'rgba(80,105,94,.75)']]);
      ctx.fillRect(0, h * 0.8, w, h * 0.2);
      // 水纹
      ctx.strokeStyle = 'rgba(245,245,235,.28)'; ctx.lineWidth = 1;
      for (let i = 0; i < 8; i++) {
        const y = h * (0.83 + i * 0.021);
        const xx = (Math.sin(t * 0.0006 + i) * 0.5 + 0.5) * w * 0.3;
        ctx.beginPath(); ctx.moveTo(w * 0.2 + xx, y); ctx.lineTo(w * 0.56 + xx, y); ctx.stroke();
      }
      // 一叶扁舟
      const bx = w * 0.42 + Math.sin(t * 0.0002) * 30, by = h * 0.9;
      ctx.fillStyle = 'rgba(48,62,56,.85)';
      ctx.beginPath(); ctx.moveTo(bx - 22, by); ctx.quadraticCurveTo(bx, by + 9, bx + 22, by); ctx.quadraticCurveTo(bx, by + 3, bx - 22, by); ctx.fill();
      ctx.strokeStyle = 'rgba(48,62,56,.85)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + 1, by - 22); ctx.stroke();
      // 飞鸟
      drawBirds(ctx, w, h, t);
      Particles.prototype.draw.call(riverMist, ctx, w, h, t, 16, 'rgba(240,242,234,1)');
    };
    function drawBirds(ctx, w, h, t) {
      ctx.save(); ctx.strokeStyle = 'rgba(60,76,68,.6)'; ctx.lineWidth = 1.5;
      const baseX = ((t * 0.012) % (w + 200)) - 100;
      for (let i = 0; i < 3; i++) {
        const x = baseX - i * 34, y = h * 0.3 + Math.sin(t * 0.001 + i) * 12 - i * 8;
        const flap = Math.sin(t * 0.006 + i) * 3;
        ctx.beginPath();
        ctx.moveTo(x - 8, y - flap); ctx.quadraticCurveTo(x - 3, y - 4 - flap, x, y);
        ctx.quadraticCurveTo(x + 3, y - 4 - flap, x + 8, y - flap);
        ctx.stroke();
      }
      ctx.restore();
    }
  })();
  const riverMist = new Particles('mist', 8);

  const scenes = { forest: S.forest, snow: S.snow, ocean: S.ocean, temple: S.temple, river: S.river };

  // ============================================================
  // 引擎
  // ============================================================
  // 有真实照片的场景：Canvas 只叠加动态层（光晕/浮尘/雾气）
  const PHOTO_OVERLAY = {
    forest: { dust: 'rgba(255,240,198,1)', mist: 'rgba(220,232,220,1)', glow: 'rgba(255,236,180,' },
    snow:   { dust: 'rgba(255,235,190,1)', mist: 'rgba(235,238,242,1)', glow: 'rgba(255,220,160,' },
    ocean:  { dust: 'rgba(255,240,205,1)', mist: 'rgba(220,232,238,1)', glow: 'rgba(255,225,175,' },
    temple: { dust: 'rgba(255,226,170,1)', mist: 'rgba(232,222,200,1)', glow: 'rgba(255,214,150,' },
    river:  { dust: 'rgba(245,242,220,1)', mist: 'rgba(232,236,228,1)', glow: 'rgba(255,238,200,' },
    space:  { dust: 'rgba(200,220,255,1)', mist: 'rgba(120,150,210,1)', glow: 'rgba(150,185,255,', dustCount: 14, mistCount: 2 },
    mars:   { dust: 'rgba(255,190,150,1)', mist: 'rgba(220,150,120,1)', glow: 'rgba(255,165,120,', dustCount: 40, mistCount: 10 },
    hearth: { dust: 'rgba(255,205,140,1)', mist: 'rgba(255,190,120,1)', glow: 'rgba(255,170,90,', dustCount: 26, mistCount: 4 },
    antarctica: { dust: 'rgba(225,240,255,1)', mist: 'rgba(200,225,245,1)', glow: 'rgba(170,215,255,', dustCount: 18, mistCount: 5 }
  };

  function SceneEngine(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.current = 'forest';
    this.hasPhoto = false;
    this.photoParticles = null;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = 0; this.h = 0;
    this.last = performance.now();
    this.resize();
  }
  SceneEngine.prototype.setScene = function (name, hasPhoto) {
    // 有照片的场景（含太空/火星/炉边/南极）走叠加层，无需程序化绘制函数
    if (!scenes[name] && !PHOTO_OVERLAY[name]) return;
    this.current = name;
    this.hasPhoto = !!hasPhoto;
    if (this.hasPhoto) {
      const cfg = PHOTO_OVERLAY[name] || PHOTO_OVERLAY.forest;
      this.photoParticles = {
        dust: new Particles('dust', cfg.dustCount || 30),
        mist: new Particles('mist', cfg.mistCount || 9),
        cfg: cfg
      };
    } else {
      this.photoParticles = null;
    }
  };
  // 照片模式下的动态叠加渲染
  SceneEngine.prototype._renderOverlay = function (now, dt, breath) {
    const ctx = this.ctx, w = this.w, h = this.h;
    ctx.clearRect(0, 0, w, h);
    const p = this.photoParticles;
    if (!p) return;
    // 呼吸光晕：随吸气扩张、呼气收缩，营造"画面在呼吸"
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const r = Math.min(w, h) * (0.5 + breath * 0.18);
    const g = radial(ctx, w * 0.5, h * 0.45, r, [
      [0, p.cfg.glow + (0.03 + breath * 0.05).toFixed(3) + ')'],
      [0.6, p.cfg.glow + '0.015)'],
      [1, 'rgba(255,255,255,0)']
    ]);
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    ctx.restore();
    // 浮尘与薄雾
    Particles.prototype.draw.call(p.mist, ctx, w, h, now, dt, p.cfg.mist);
    Particles.prototype.draw.call(p.dust, ctx, w, h, now, dt, p.cfg.dust);
  };
  SceneEngine.prototype.resize = function () {
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.floor(this.w * this.dpr);
    this.canvas.height = Math.floor(this.h * this.dpr);
    this.canvas.style.width = this.w + 'px';
    this.canvas.style.height = this.h + 'px';
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  };
  // breath: 0..1；轻微缩放营造"画面也在呼吸"的沉浸感
  SceneEngine.prototype.render = function (now, breath) {
    const dt = Math.min(now - this.last, 60);
    this.last = now;
    const w = this.w, h = this.h;

    if (this.hasPhoto) {
      // 照片模式：动态叠加层 + 对照片施加极轻微的呼吸视差
      this._renderOverlay(now, dt, breath);
      const photo = document.getElementById('scene-photo');
      if (photo) {
        const s = (1.09 + (breath - 0.5) * 0.02).toFixed(4);
        photo.style.transform = 'scale(' + s + ')';
      }
      return;
    }

    // 程序化模式（无照片时回退）
    const ctx = this.ctx;
    const scale = 1 + (breath - 0.5) * 0.018;
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.scale(scale, scale);
    ctx.translate(-w / 2, -h / 2);
    (scenes[this.current] || S.forest)(ctx, w, h, now, breath);
    ctx.restore();
  };

  window.SceneEngine = SceneEngine;
})();
