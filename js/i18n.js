/* ============================================================
   i18n.js — 界面中英文切换
   · 所有文案集中在 DICT，t(key, vars) 取当前语言字符串
   · applyStatic() 刷新带 data-i18n / data-i18n-html 等属性的静态节点
   · 语言选择存 localStorage，切换后触发 onChange 回调刷新动态文案
   暴露 window.I18n
   ============================================================ */
(function () {
  'use strict';

  var KEY = 'qishan_lang_v1';
  var lang = 'zh';

  var DICT = {
    zh: {
      'meta.title': '栖山 · 留一段时间给自己安静',
      'meta.desc': '栖山——一处无需注册、不说话的在线静心空间。择一处环境，跟着呼吸，安静坐一会儿。',
      'lang.aria': '切换到英文',

      'intro.brand': '栖山',
      'intro.title': '留一段时间<span class="dot">，</span><br>给自己安静',
      'intro.sub': '一处不注册、不说话的在线静心空间。<br>择一处环境，跟着呼吸，坐一会儿就好。',
      'intro.enter': '进入栖山',
      'intro.hint': '无需下载 · 无需登录 · 免费',

      'setup.title': '择一处风景',
      'setup.sub': '选一个你喜欢的地方，安顿此刻的心',
      'field.environment': '环境',
      'field.environment.note': '静心时置身其中的空间',
      'field.duration': '时长',
      'field.duration.note': '正念练习常用时长',
      'field.duration.locked': '整套练习时长随音频，无需另选',
      'field.breath': '呼吸节奏',
      'field.breath.note': '呼气比吸气长，身体更易放松',
      'field.sound': '声音',
      'field.sound.note': '选择后，开始静坐时播放；可随时静音',
      'field.full': '整套练习',
      'field.full.note': '从始至终的完整引导，时间充裕时练习',
      'field.full.note2': '身体扫描躺着或坐着均可，把觉察依次带到身体各处；完整坐禅从呼吸、身体到声音与念头，走一整套正念练习。选择后时长自动跟随音频，无需另设。',
      'field.gather': '共坐一场',
      'field.gather.note': '与同一时段的人，一起开始、一起结束',
      'gather.credit': '场次按公共时钟每 30 分钟一轮（整点 / 半点），同一时段的人算作同一场。此刻的人数为氛围演示值，非真实在线人数；留言只保存在你的浏览器，不上传。',
      'gather.session': '本场 {a}–{b}',
      'gather.seats': '{n} 人在坐',
      'gather.remain': '距本场结束 {t}',
      'gather.co': '本场 {n} 人同坐 · 不必言语',

      'scene.forest.name': '雾林', 'scene.forest.desc': '松间晨雾',
      'scene.snow.name': '金山', 'scene.snow.desc': '日照雪岭',
      'scene.ocean.name': '沧海', 'scene.ocean.desc': '海上生明',
      'scene.temple.name': '古刹', 'scene.temple.desc': '庭院深深',
      'scene.river.name': '山水', 'scene.river.desc': '水墨层峦',
      'scene.space.name': '太空', 'scene.space.desc': '地轨晨曦',
      'scene.mars.name': '火星', 'scene.mars.desc': '赤色荒原',
      'scene.hearth.name': '炉边', 'scene.hearth.desc': '松火夜坐',
      'scene.antarctica.name': '南极', 'scene.antarctica.desc': '极光冰原',

      'duration.3': '3 分钟', 'duration.5': '5 分钟', 'duration.10': '10 分钟',
      'duration.15': '15 分钟', 'duration.20': '20 分钟',

      'breathLabel.calm': '深呼吸 · 吸4 呼6',
      'breathLabel.cohere': '共振 · 吸5 呼5',
      'breathLabel.relax': '4-7-8 · 吸4 停7 呼8',
      'breathLabel.box': '箱式 · 吸4 停4 呼4 停4',
      'breathNote.calm': '深呼吸：呼气长于吸气，可激活副交感神经，让心率放缓、身体放松。',
      'breathNote.cohere': '共振呼吸：约每分钟 6 次，接近心率变异性的共振频率，有助稳定与平和。',
      'breathNote.relax': '4-7-8 呼吸：经典的助眠放松法，用较长的呼气与停顿带走紧张；若憋气不适，可缩短停留。',
      'breathNote.box': '箱式呼吸：四段等长，常用于稳定情绪、集中注意，呼吸不适时可改选深呼吸。',
      'phase.inhale': '吸气', 'phase.exhale': '呼气', 'phase.hold': '停留',

      'sound.guide3': '正念引导·女声 英语',
      'sound.guide3m': '正念引导·男声 中文',
      'sound.bowl': '颂钵',
      'sound.forest': '林风',
      'sound.water': '流水',
      'sound.waves': '海浪',
      'sound.frogs': '蛙声',
      'sound.birds': '鸟鸣',
      'sound.life': '生活声',
      'sound.bodyscanf': '身体扫描·女声 · 27′',
      'sound.bodyscanm': '身体扫描·男声 · 37′',
      'sound.bodyscancn': '身体扫描·女声 中文 · 4′',
      'sound.sitting': '完整坐禅·引导 · 35′',
      'sound.sittingcn': '完整坐禅·女声 中文 · 17′',
      'sound.credit': '引导为真人录音：英语来自 The Free Mindfulness Project（CC BY-NC-SA 3.0），普通话引导与中文整套练习来自 UCLA Mindful（CC BY-NC-ND 4.0）；环境声为真实田野录音。完整出处与授权见项目说明。',
      'sound.off': '已静音',
      'sound.ended': '引导结束，余下时间留给自己',
      'sound.on': '开启声音', 'sound.mute': '静音',
      'sound.icon.on': '声', 'sound.icon.off': '静',

      'hint.breath': '跟着声音，回到呼吸',
      'hint.body': '跟着声音，觉察身体',
      'hint.sitting': '跟着声音，走完这一坐',

      'btn.back': '返回', 'btn.pause': '暂停',
      'gather.co.plain': '与众人同坐，不必言语',
      'btn.start': '开始静坐',
      'btn.finish': '结束本次',
      'btn.again': '再坐一会',
      'btn.home': '回到开头',
      'btn.resume': '继续静坐',
      'pause.title': '已暂停',
      'pause.hint': '空格键 暂停 / 继续 · Esc 结束',

      'breath.ready': '准备好了吗',
      'guidance.init': '轻轻闭上眼睛，把注意力带到呼吸上',

      'done.title': '坐完了，很好',
      'done.sub.short': '哪怕只是片刻，你也停下来过了。',
      'done.sub.long': '谢谢你，留了这段时间给自己。',
      'stat.unit.min': '分钟', 'stat.unit.times': '次', 'stat.unit.days': '天',
      'stat.this': '本次静坐', 'stat.today': '今天累计', 'stat.streak': '连续坚持',
      'done.quote': '“安静不是没有声音，<br>而是心不再追着声音跑。”',
      'reflection.label': '留一句话给这一场（可选）',
      'reflection.ph': '此刻，你想说点什么…',
      'reflection.send': '留下',
      'reflection.note': '只保存在你自己的浏览器里，不上传、别人看不到。',
      'reflection.saved': '已留下，只在这台设备上。',
      'reflection.you': '你',
      'disclaimer': '栖山是放松与专注的练习工具，不构成医疗诊断或心理治疗。若你正经历持续的心理困扰，请及时寻求专业帮助（可拨打心理援助热线 12356）。',

      'guidance.0': '轻轻闭上眼睛，让身体安稳地坐着',
      'guidance.1': '把注意力，温柔地放在呼吸上',
      'guidance.2': '感受空气，怎样进来，又怎样离开',
      'guidance.3': '不必刻意，只是知道——我正在呼吸',
      'guidance.4': '从额头，到眉眼，慢慢放松',
      'guidance.5': '松开肩膀，让双手安静地放着',
      'guidance.6': '觉察身体与坐垫接触的地方',
      'guidance.7': '念头来了，就让它来；看见它，再回到呼吸',
      'guidance.8': '不追问，不评判，只是看着它走',
      'guidance.9': '把这份觉察，轻轻扩展到全身',
      'guidance.10': '听见远处的声音，也知道自己的呼吸',
      'guidance.11': '此刻，你什么都不必做',
      'guidance.12': '再坐一会儿，和自己的安静待在一起',
      'guidance.13': '慢慢地，让呼吸把你带回此刻',
      'guidance.14': '感受这一次，属于你的宁静'
    },
    en: {
      'meta.title': 'Qishan · A quiet moment for yourself',
      'meta.desc': 'Qishan — a quiet space to sit online. No sign-up, no talking. Choose a place, follow your breath, and just sit for a while.',
      'lang.aria': 'Switch to Chinese',

      'intro.brand': 'Qishan',
      'intro.title': 'A little time<span class="dot">,</span><br>just for quiet',
      'intro.sub': 'A quiet place to sit online — no sign-up, no talking.<br>Choose a scene, follow your breath, and rest a while.',
      'intro.enter': 'Enter Qishan',
      'intro.hint': 'No download · No login · Free',

      'setup.title': 'Choose a place',
      'setup.sub': 'Pick somewhere you like, and settle your mind here',
      'field.environment': 'Environment',
      'field.environment.note': 'The space you sit in',
      'field.duration': 'Duration',
      'field.duration.note': 'Common mindfulness lengths',
      'field.duration.locked': 'Full practices follow the audio length',
      'field.breath': 'Breathing',
      'field.breath.note': 'A longer exhale than inhale helps the body relax',
      'field.sound': 'Sound',
      'field.sound.note': 'Plays when you start; mute anytime',
      'field.full': 'Full practices',
      'field.full.note': 'Guided from beginning to end, when you have time',
      'field.full.note2': 'Body scan works lying down or sitting — awareness moves through the body in turn. Sitting meditation guides you through breath, body, sound and thoughts, a complete practice. Duration follows the audio automatically.',
      'field.gather': 'Sit together',
      'field.gather.note': 'Begin and end with others in the same slot',
      'gather.credit': 'Sessions run every 30 minutes on the shared clock (on the hour / half hour); everyone in the same slot is one session. The headcount shown is a demo value, not real online users; reflections stay in your browser only.',
      'gather.session': 'This slot {a}–{b}',
      'gather.seats': '{n} sitting',
      'gather.remain': '{t} left in this slot',
      'gather.co': '{n} sitting together · no words needed',

      'scene.forest.name': 'Misty Forest', 'scene.forest.desc': 'Morning mist among pines',
      'scene.snow.name': 'Golden Peak', 'scene.snow.desc': 'Sunlit snowy ridge',
      'scene.ocean.name': 'Open Sea', 'scene.ocean.desc': 'Moonrise over the sea',
      'scene.temple.name': 'Ancient Temple', 'scene.temple.desc': 'Deep quiet courtyards',
      'scene.river.name': 'Landscape', 'scene.river.desc': 'Ink-wash mountains',
      'scene.space.name': 'Space', 'scene.space.desc': 'Dawn from orbit',
      'scene.mars.name': 'Mars', 'scene.mars.desc': 'Red wilderness',
      'scene.hearth.name': 'By the Hearth', 'scene.hearth.desc': 'Sitting by a pine fire',
      'scene.antarctica.name': 'Antarctica', 'scene.antarctica.desc': 'Aurora over the ice',

      'duration.3': '3 min', 'duration.5': '5 min', 'duration.10': '10 min',
      'duration.15': '15 min', 'duration.20': '20 min',

      'breathLabel.calm': 'Deep breathing · in 4 out 6',
      'breathLabel.cohere': 'Resonant · in 5 out 5',
      'breathLabel.relax': '4-7-8 · in 4 hold 7 out 8',
      'breathLabel.box': 'Box · in 4 hold 4 out 4 hold 4',
      'breathNote.calm': 'Deep breathing: a longer exhale than inhale activates the parasympathetic nervous system, slowing the heart and relaxing the body.',
      'breathNote.cohere': 'Resonant breathing: about 6 breaths a minute, near the heart-rate-variability resonance frequency, supporting steadiness and calm.',
      'breathNote.relax': '4-7-8 breathing: a classic sleep aid; a longer exhale and pause release tension. Shorten the hold if it feels uncomfortable.',
      'breathNote.box': 'Box breathing: four equal stages, often used to steady emotions and focus. Switch to deep breathing if it feels uncomfortable.',
      'phase.inhale': 'Breathe in', 'phase.exhale': 'Breathe out', 'phase.hold': 'Hold',

      'sound.guide3': 'Guidance · Female (English)',
      'sound.guide3m': 'Guidance · Male (Mandarin)',
      'sound.bowl': 'Singing bowl',
      'sound.forest': 'Forest wind',
      'sound.water': 'Flowing water',
      'sound.waves': 'Ocean waves',
      'sound.frogs': 'Frogs',
      'sound.birds': 'Birdsong',
      'sound.life': 'Everyday life',
      'sound.bodyscanf': 'Body Scan · Female · 27′',
      'sound.bodyscanm': 'Body Scan · Male · 37′',
      'sound.bodyscancn': 'Body Scan · Female Mandarin · 4′',
      'sound.sitting': 'Sitting Meditation · Guided · 35′',
      'sound.sittingcn': 'Sitting Meditation · Female Mandarin · 17′',
      'sound.credit': 'Guidance is real voice: English from The Free Mindfulness Project (CC BY-NC-SA 3.0); Mandarin guidance and Chinese full practices from UCLA Mindful (CC BY-NC-ND 4.0). Ambient sounds are real field recordings. Full source and licenses are in the project notes.',
      'sound.off': 'Muted',
      'sound.ended': 'Guidance ended — the rest is yours',
      'sound.on': 'Turn sound on', 'sound.mute': 'Mute',
      'sound.icon.on': 'ON', 'sound.icon.off': 'OFF',

      'hint.breath': 'Follow the voice, return to the breath',
      'hint.body': 'Follow the voice, notice the body',
      'hint.sitting': 'Follow the voice, complete this sit',

      'btn.back': 'Back', 'btn.pause': 'Pause',
      'gather.co.plain': 'Sitting together, no words needed',
      'btn.start': 'Begin sitting',
      'btn.finish': 'End session',
      'btn.again': 'Sit again',
      'btn.home': 'Back to start',
      'btn.resume': 'Continue sitting',
      'pause.title': 'Paused',
      'pause.hint': 'Space to pause / resume · Esc to end',

      'breath.ready': 'Ready?',
      'guidance.init': 'Gently close your eyes and bring attention to the breath',

      'done.title': 'Well done',
      'done.sub.short': 'Even a brief pause is a pause you took.',
      'done.sub.long': 'Thank you for making this time for yourself.',
      'stat.unit.min': 'min', 'stat.unit.times': 'times', 'stat.unit.days': 'days',
      'stat.this': 'This sit', 'stat.today': 'Today', 'stat.streak': 'Streak',
      'done.quote': '“Quiet is not the absence of sound,<br>but a mind that stops chasing it.”',
      'reflection.label': 'Leave a line for this session (optional)',
      'reflection.ph': 'What would you like to say…',
      'reflection.send': 'Leave',
      'reflection.note': 'Saved only in your browser — not uploaded, unseen by others.',
      'reflection.saved': 'Saved, on this device only.',
      'reflection.you': 'You',
      'disclaimer': 'Qishan is a tool for relaxation and focus practice, not medical diagnosis or psychotherapy. If you are going through ongoing distress, please seek professional help (mental health support hotline 12356 in China).',

      'guidance.0': 'Gently close your eyes, let the body sit steadily',
      'guidance.1': 'Place your attention kindly on the breath',
      'guidance.2': 'Feel how the air comes in, and flows out',
      'guidance.3': 'No need to try — just know that you are breathing',
      'guidance.4': 'From the forehead, to the eyes, slowly soften',
      'guidance.5': 'Release the shoulders, let the hands rest quietly',
      'guidance.6': 'Notice where the body meets the cushion',
      'guidance.7': 'A thought comes — let it come; see it, return to the breath',
      'guidance.8': "Don't chase, don't judge, just watch it pass",
      'guidance.9': 'Let this awareness gently spread through the whole body',
      'guidance.10': 'Hear distant sounds, and know your own breathing',
      'guidance.11': 'In this moment, you need do nothing at all',
      'guidance.12': 'Sit a little longer, stay with your own quiet',
      'guidance.13': 'Slowly, let the breath bring you back to now',
      'guidance.14': 'Feel this moment of stillness, yours alone'
    }
  };

  var listeners = [];

  function t(key, vars) {
    var d = DICT[lang] || DICT.zh;
    var s = Object.prototype.hasOwnProperty.call(d, key) ? d[key] : (DICT.zh[key] || key);
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        s = s.split('{' + k + '}').join(String(vars[k]));
      });
    }
    return s;
  }

  function applyStatic() {
    function each(sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); }
    each('[data-i18n]', function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    each('[data-i18n-html]', function (el) { el.innerHTML = t(el.getAttribute('data-i18n-html')); });
    each('[data-i18n-ph]', function (el) { el.setAttribute('placeholder', t(el.getAttribute('data-i18n-ph'))); });
    each('[data-i18n-title]', function (el) { el.setAttribute('title', t(el.getAttribute('data-i18n-title'))); });
    each('[data-i18n-aria]', function (el) { el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria'))); });
    document.documentElement.lang = (lang === 'zh') ? 'zh-CN' : 'en';
    document.title = t('meta.title');
    var md = document.querySelector('meta[name="description"]'); if (md) md.content = t('meta.desc');
    var ot = document.querySelector('meta[property="og:title"]'); if (ot) ot.content = t('meta.title');
    var od = document.querySelector('meta[property="og:description"]'); if (od) od.content = t('meta.desc');
    var btn = document.getElementById('btn-lang'); if (btn) btn.textContent = (lang === 'zh') ? 'EN' : '中';
  }

  function setLang(next) {
    lang = (next === 'en') ? 'en' : 'zh';
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    applyStatic();
    listeners.forEach(function (cb) { try { cb(lang); } catch (e) {} });
  }

  function init() {
    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) {}
    if (saved === 'en' || saved === 'zh') lang = saved;
    else if (navigator.language && /^en\b/i.test(navigator.language)) lang = 'en';
    applyStatic();
  }

  window.I18n = {
    t: t,
    init: init,
    setLang: setLang,
    apply: applyStatic,
    lang: function () { return lang; },
    onChange: function (cb) { listeners.push(cb); },
    guidance: function () {
      var out = [];
      for (var i = 0; i < 15; i++) out.push(t('guidance.' + i));
      return out;
    }
  };
})();
