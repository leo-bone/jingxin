# 栖山 · 在线静心空间
# Qishan · An Online Space for Stillness

一处不注册、不聊天、不推送、不设任务的在线静心空间。选择一处环境，跟着呼吸，安静坐一会儿。
An online space for stillness — no sign-up, no chat, no push notifications, no tasks. Choose a setting, follow your breath, and sit quietly for a while.

- 正式站点：<https://jingxin.uichain.org>
- Live site: <https://jingxin.uichain.org>
- 源码仓库：<https://github.com/leo-bone/jingxin>
- Source repository: <https://github.com/leo-bone/jingxin>
- 技术形态：纯静态站，HTML / CSS / 原生 JavaScript，无构建步骤、无后端、无第三方前端依赖
- Tech stack: A pure static site built with HTML, CSS, and vanilla JavaScript — no build step, no backend, no third-party frontend dependencies.

## 功能 / Features

- 九处环境：雾林、金山、沧海、古刹、山水、太空、火星、炉边、南极。写实背景图负责真实感与空间氛围，Canvas 负责呼吸光晕、浮尘与薄雾；不同环境配有各自的粒子密度与光色。
- Nine environments: Misty Forest, Golden Mountain, Vast Sea, Ancient Temple, Landscapes, Outer Space, Mars, Fireside, and Antarctica. Photorealistic backgrounds provide realism and a sense of place; Canvas adds breathing halos, floating dust, and mist. Each environment has its own particle density and light palette.
- 正念时长：3、5、10、15、20 分钟。
- Mindfulness durations: 3, 5, 10, 15, and 20 minutes.
- 呼吸节奏（以放松为目标，遵循「呼气不短于吸气」）：深呼吸（吸 4 / 呼 6）、共振呼吸（吸 5 / 呼 5）、4-7-8（吸 4 / 停 7 / 呼 8）、箱式（吸 4 / 停 4 / 呼 4 / 停 4）。每项附原理说明。
- Breathing patterns (aimed at relaxation, following the principle that the exhale is never shorter than the inhale): Deep Breathing (inhale 4 / exhale 6), Resonant Breathing (inhale 5 / exhale 5), 4-7-8 (inhale 4 / hold 7 / exhale 8), and Box Breathing (inhale 4 / hold 4 / exhale 4 / hold 4). Each includes a short explanation of why it works.
- 声音选择：真人正念引导（女声 English 约 3 分钟 / 男声普通话 5 分钟）、颂钵、林风（真实风吹树林）、流水、海浪、蛙声（纯蛙鸣）、鸟鸣、生活声。设置页只选择不发声，点击「开始静坐」后才播放。
- Sound options: real-voice mindfulness guidance (female in English ~3 min / male in Mandarin ~5 min), singing bowl, forest wind (real wind through trees), flowing water, ocean waves, frogs (pure frog chorus), birds, and everyday life sounds. The setup screen only selects — nothing plays until you tap "Start Sitting."
- 整套完整练习：身体扫描（女声 English 27′ / 男声 English 37′ / 中文 4′）、完整坐禅（English 35′ / 中文 17′）。这类是**从头到尾的完整引导**，时间充裕时练习；选择后时长自动跟随音频、时长选项置灰，音频播完即自然结束，无需自行计时。
- Full guided practices: Body Scan (female English 27′ / male English 37′ / Mandarin 4′) and Sitting Meditation (English 35′ / Mandarin 17′). These are **complete from start to finish**, for when you have more time. Once selected, the duration automatically follows the audio and the duration options are greyed out; the session ends naturally when the audio finishes — no timer needed.
- 界面中英文一键切换：右上角 `EN` / `中` 按钮，覆盖所有界面文案、引导语、场景与声音名称、合规声明；选择存本地，下次打开保持上次语言。
- One-tap bilingual UI: the top-right `EN` / `中` button switches every piece of interface text — prompts, scene and sound names, disclaimer. The choice is stored locally and restored next time.
- 会话中可随时暂停、静音或结束；支持键盘快捷键：空格暂停/继续、Esc 结束（闭眼练习时无需看屏幕）。
- Pause, mute, or end at any time during a session. Keyboard shortcuts are supported: Space to pause/resume, Esc to end (no need to look at the screen with your eyes closed).
- 真人语音引导与屏幕中文引导语互斥：引导播放期间只显示一句静态提示，播完后中文引导语按进度接管，避免中英两套引导同时干扰。手动静音引导时同样交还给文字陪伴。
- Voice guidance and on-screen Chinese prompts are mutually exclusive: while the voice plays, only a single static hint is shown; when it ends, Chinese prompts take over according to progress, avoiding two sets of guidance at once. Manually muting also hands control back to the text.
- 结束后记录今日次数与连续天数，数据只存在浏览器 localStorage。
- After each session, today's count and your streak are recorded — stored only in your browser's localStorage.
- 尊重系统「减少动态效果」设置；引导语使用 `aria-live` 播报。
- Respects the system "reduce motion" setting; guidance text is announced via `aria-live`.
- 共坐一场（氛围层原型）：按公共时钟每 30 分钟一轮，同一时段算作同一场；结束后可留一句感想，仅存本机。详见下方「共坐一场」说明。
- Sit together (atmosphere-layer prototype): a shared 30-minute slot on the clock; everyone in the same slot counts as one session. Leave a short reflection afterward, stored only on your device. See "Sit together" below.
- 明确声明为放松与专注练习工具，不构成医疗诊断或心理治疗。
- Clearly stated to be a tool for relaxation and focus practice, not medical diagnosis or psychotherapy.

## 声音说明 / About the Sounds

### 真人正念短引导（女声 English / 男声普通话） / Real-Voice Short Guidance (Female English / Male Mandarin)

两段都是**真人引导录音**，来自两个授权清晰的公开来源；原先的普通话合成语音因听感生硬已弃用。
Both are **real human guidance recordings** from two sources with clear licensing; the earlier Mandarin synthesized voice was dropped for sounding too robotic.

- 女声 English `sound=guide3`：*Three Step Breathing Space*，Christina，**2:52**，[The Free Mindfulness Project](https://www.freemindfulness.org/download)，**CC BY-NC-SA 3.0**
- Female English `sound=guide3`: *Three Step Breathing Space*, Christina, **2:52**, The Free Mindfulness Project, CC BY-NC-SA 3.0
- 男声普通话 `sound=guide3m`：*Breathing Meditation*，UCLA Mindful（Jingjing Zhu 译），**5:33**，[UCLA Mindful](https://www.uclahealth.org/uclamindful/guided-meditations)，**CC BY-NC-ND 4.0**
- Male Mandarin `sound=guide3m`: *Breathing Meditation*, UCLA Mindful (translated by Jingjing Zhu), **5:33**, UCLA Mindful, CC BY-NC-ND 4.0

两者都是呼吸觉察类练习：觉察身体 → 把注意力收到呼吸 → 将觉察扩展至全身。两个授权都允许非商业原样再分发，本站为非商业、免费项目，符合授权条件；署名见下方授权表。CC BY-NC-ND 禁止改编，本站仅重命名、不剪辑内容。
Both are breath-awareness practices: notice the body → bring attention to the breath → expand awareness. Both licenses permit non-commercial verbatim redistribution; this free, non-commercial site qualifies. Attribution is in the license table below. CC BY-NC-ND forbids derivatives — this site only renames files and never edits content.

选择超过引导长度的静坐时，引导播完后界面提示「引导结束，余下时间留给自己」，不循环朗读；此后由屏幕引导语按当前界面语言接续陪伴，不留空白。引导播放期间屏幕只显示一句静态提示，不与引导语同时滚动。
For sittings longer than the guidance, after it ends the screen shows "Guidance finished — the rest is yours" without looping; on-screen prompts then continue in the current interface language with no gap. During playback only one static hint is shown, never scrolling alongside the prompts.

### 整套完整练习（身体扫描 / 完整坐禅） / Full Guided Practices (Body Scan / Sitting Meditation)

为时间充裕、想从头到尾练完一整套的人准备。英语三项来自 The Free Mindfulness Project（**CC BY-NC-SA 3.0**），中文两项来自 UCLA Mindful（**CC BY-NC-ND 4.0**，普通话真人朗读）：
For those with time to practice a full session from beginning to end. The three English tracks are from The Free Mindfulness Project (**CC BY-NC-SA 3.0**); the two Chinese tracks are from UCLA Mindful (**CC BY-NC-ND 4.0**, real Mandarin voice):

- 身体扫描·女声 `sound=bodyscanf`：*Body Scan*，Christina，**26:46**。躺着或坐着均可，把觉察依次带到身体各处，培养温和不评判的身体觉知。
- Body Scan · Female `sound=bodyscanf`: *Body Scan*, Christina, **26:46**. Lying down or sitting are both fine; bring awareness successively to each part of the body, cultivating gentle, non-judgmental body awareness.
- 身体扫描·男声 `sound=bodyscanm`：*Body Scan*，Paddy，**37:09**。更长的身体扫描，适合慢慢走完全身。
- Body Scan · Male `sound=bodyscanm`: *Body Scan*, Paddy, **37:09**. A longer body scan, ideal for slowly moving through the whole body.
- 身体扫描·中文 `sound=bodyscancn`：*Short Body Scan*，UCLA Mindful，**4:09**。普通话短身体扫描，适合快速把觉察带回身体。
- Body Scan · Mandarin `sound=bodyscancn`: *Short Body Scan*, UCLA Mindful, **4:09**. A short Mandarin body scan to quickly bring awareness back to the body.
- 完整坐禅·引导 `sound=sitting`：*Sitting Meditation*，Peter，**34:50**。从呼吸到身体、声音，再到念头与情绪，走一整套 MBSR 风格的正念静坐。
- Sitting Meditation · Guided `sound=sitting`: *Sitting Meditation*, Peter, **34:50**. From breath to body and sounds, then to thoughts and emotions — a complete MBSR-style mindfulness sit.
- 完整坐禅·中文 `sound=sittingcn`：*Complete Meditation Instructions*，UCLA Mindful，**17:28**。普通话完整练习，最适合中文用户从头练完一整套。
- Sitting Meditation · Mandarin `sound=sittingcn`: *Complete Meditation Instructions*, UCLA Mindful, **17:28**. A complete Mandarin practice — the best option for Chinese speakers to finish a full sit.

与 3 分钟短引导的关键区别：**这类音频本身就是完整练习**，所以会话时长直接取录音长度（`FULL_PRACTICE` 中写入的秒数），时钟与进度以音频为准，时长选项自动置灰；整段播完即判定本次圆满并进入结束页。屏幕同样只给一句静态提示，不与中文引导语叠加。手动静音后再开启，音频会重新接管屏幕。
The key difference from the 3-minute short guidance: **these audio files are themselves complete practices**, so the session length is taken directly from the recording (the seconds stored in `FULL_PRACTICE`); the clock and progress follow the audio, and the duration options are automatically greyed out. When the track finishes, the session is complete and moves to the end screen. As before, the screen shows only one static hint and does not overlay Chinese prompts. If you mute and then turn sound back on, the audio retakes the screen.

### 关于中文 / 哈佛普通话版 / About Chinese / Harvard Mandarin Versions

- 核实过哈佛 HUHS 官方的 3 / 4 分钟引导冥想，是电话热线 **Pause 4-calm**，不提供可再分发的音频文件：<https://wellness.huhs.harvard.edu/mindfulness-and-meditation>
- Verified that Harvard HUHS's official 3-/4-minute guided meditation is a phone hotline, **Pause 4-calm**, and does not provide redistributable audio files: <https://wellness.huhs.harvard.edu/mindfulness-and-meditation>
- 中文「哈佛正念」课程多为付费或有明确传播限制，不适合作为本站静态资源分发。
- Most Chinese "Harvard mindfulness" courses are paid or have explicit distribution restrictions, making them unsuitable as static assets for this site.
- **已找到合规的普通话真人来源**：[UCLA Mindful](https://www.uclahealth.org/uclamindful/guided-meditations) 的多语言引导由 The Regents of the University of California 以 **CC BY-NC-ND 4.0** 发布，含男声普通话短引导、身体扫描、完整坐禅。本站以非商业、不改编（仅重命名）方式使用，符合授权。
- **A compliant Mandarin human-voice source was found**: [UCLA Mindful](https://www.uclahealth.org/uclamindful/guided-meditations) multilingual meditations are published by The Regents of the University of California under **CC BY-NC-ND 4.0**, including a male Mandarin short guidance, body scan, and complete sitting. This site uses them non-commercially and unmodified (renamed only), which the license permits.
- 女声真人普通话引导暂未找到可合法再分发的公开来源，因此女声选项保留英语真人录音；界面已清楚标注语言，用户可自选。
- No legally redistributable public female Mandarin recording was found, so the female option keeps the English human voice; the interface clearly labels the language so users can choose.
- 澳洲 NSW 卫生部的多语言正念页面无明确再分发授权，未采用；来源不明的中文课程音频一律不使用。
- The NSW Health multilingual mindfulness page has no explicit redistribution license and was not used; Chinese audio of unclear provenance is never used.

### 音频来源与授权 / Audio Sources and Licenses

环境声来自 Wikimedia Commons 的公开转码与 Freesound 的公开预览；英语引导来自 The Free Mindfulness Project 音频 CDN，普通话引导来自 UCLA Mindful 音频 CDN。所有文件均仅重命名或从 OGG 机械转码为 MP3，未在内容上二次剪辑，播放音量在代码中做了平衡。
Ambient sounds come from public transcodes on Wikimedia Commons and public previews on Freesound; English guidance comes from The Free Mindfulness Project's audio CDN, Mandarin guidance from UCLA Mindful's audio CDN. All files were only renamed or mechanically transcoded from OGG to MP3, never edited in content; playback volumes are balanced in code.

| 选项 Option | 本地文件 File | 内容 Content | 作者 / 来源 Author / Source | 授权 License |
| --- | --- | --- | --- | --- |
| 正念引导·女声 Guided · Female | `assets/audio/guide3_female.mp3` | Three Step Breathing Space，2:52 | [The Free Mindfulness Project](https://www.freemindfulness.org/download)，Christina | CC BY-NC-SA 3.0 |
| 正念引导·男声（普通话）Guided · Male (Mandarin) | `assets/audio/guide3_cn.mp3` | Breathing Meditation，5:33 | [UCLA Mindful](https://www.uclahealth.org/uclamindful/guided-meditations)，The Regents of the University of California | CC BY-NC-ND 4.0 |
| 身体扫描·女声 Body Scan · Female | `assets/audio/bodyscan_female.mp3` | Body Scan，26:46 | [The Free Mindfulness Project](https://player.freemindfulness.org)，Christina | CC BY-NC-SA 3.0 |
| 身体扫描·男声 Body Scan · Male | `assets/audio/bodyscan_male.mp3` | Body Scan，37:09 | [The Free Mindfulness Project](https://player.freemindfulness.org)，Paddy | CC BY-NC-SA 3.0 |
| 身体扫描·中文 Body Scan · Mandarin | `assets/audio/bodyscan_cn.mp3` | Short Body Scan，4:09 | [UCLA Mindful](https://www.uclahealth.org/uclamindful/guided-meditations)，The Regents of the University of California | CC BY-NC-ND 4.0 |
| 完整坐禅·引导 Sitting Meditation | `assets/audio/sitting_full.mp3` | Sitting Meditation，34:50 | [The Free Mindfulness Project](https://player.freemindfulness.org)，Peter | CC BY-NC-SA 3.0 |
| 完整坐禅·中文 Sitting · Mandarin | `assets/audio/sitting_cn.mp3` | Complete Meditation Instructions，17:28 | [UCLA Mindful](https://www.uclahealth.org/uclamindful/guided-meditations)，The Regents of the University of California | CC BY-NC-ND 4.0 |
| 颂钵 Singing bowl | `assets/audio/bowl.mp3` | 31 秒铜钵长音，适合循环 / 31s bowl tone, loopable | [Tibetan singing bowl for meditation](https://freesound.org/s/436935)，franciscoguerrero | CC0 1.0 |
| 林风 Forest wind | `assets/audio/forest.mp3` | 真实风吹树林 52 秒 / Real wind through a forest, 52s | [Wind in forest (Gravity Sound)](https://commons.wikimedia.org/wiki/File:Wind_in_forest_(Gravity_Sound).wav)，Gravity Sound | CC BY 4.0 |
| 流水 Flowing water | `assets/audio/stream.mp3` | 近场溪流声 / Close-up stream sound | [Soft stream flowing water](https://commons.wikimedia.org/wiki/File:433589_jackthemurray_stream-river-water-up-close.wav)，jackthemurray | CC0 1.0 |
| 海浪 Ocean waves | `assets/audio/waves.mp3` | 波罗的海岸边浪声与碎石回落 / Baltic shore waves and rolling pebbles | [Oceanwavescrushing.ogg](https://commons.wikimedia.org/wiki/File:Oceanwavescrushing.ogg)，Luftrum | CC BY 3.0 |
| 蛙声 Frogs | `assets/audio/frogs.mp3` | 夜间蛙鸣合唱 2 分钟 / Frog calling chorus at night, 2 min | [Frogs croak calling chorus at night](https://commons.wikimedia.org/wiki/File:Frogs_croak_calling_chorus_at_night.ogg)，JogiAsad | CC BY-SA 4.0 |
| 鸟鸣 Birds | `assets/audio/birds.mp3` | 芬兰森林乌鸫鸣唱，维基百科精选声音 / Finnish forest blackbird song, Wikipedia featured sound | [Turdus merula 2.ogg](https://commons.wikimedia.org/wiki/File:Turdus_merula_2.ogg)，Oona Räisänen (Mysid) | Public domain |
| 生活声 Everyday life | `assets/audio/life.mp3` | 咖啡馆人声、咖啡机与餐具轻响 / Café chatter, coffee machine, and soft crockery | [Cafe ambient sound](https://freesound.org/people/evsecrets/sounds/332271/)，evsecrets | CC0 1.0 |

CC BY-NC-SA 3.0：<https://creativecommons.org/licenses/by-nc-sa/3.0/>。CC BY-NC-ND 4.0：<https://creativecommons.org/licenses/by-nc-nd/4.0/>。CC BY 4.0：<https://creativecommons.org/licenses/by/4.0/>。CC BY-SA 4.0：<https://creativecommons.org/licenses/by-sa/4.0/>。CC BY 3.0：<https://creativecommons.org/licenses/by/3.0/>。CC0 1.0：<https://creativecommons.org/publicdomain/zero/1.0/>。
CC BY-NC-SA 3.0: <https://creativecommons.org/licenses/by-nc-sa/3.0/>. CC BY-NC-ND 4.0: <https://creativecommons.org/licenses/by-nc-nd/4.0/>. CC BY 4.0: <https://creativecommons.org/licenses/by/4.0/>. CC BY-SA 4.0: <https://creativecommons.org/licenses/by-sa/4.0/>. CC BY 3.0: <https://creativecommons.org/licenses/by/3.0/>. CC0 1.0: <https://creativecommons.org/publicdomain/zero/1.0/>.

### 场景照片 / Scene Photos

九处环境背景均为 AI 生成的写实场景，仅用于视觉氛围，不代表真实地点；四张新增场景图右下角的生成标记已用图像擦除彻底抹去（不再依赖裁切），任意屏幕比例下都不会露出。各环境的 Canvas 动态层参数见 `js/scenes.js` 的 `PHOTO_OVERLAY`：太空、南极粒子更稀疏以突出空旷，火星偏赤色浮尘，炉边偏暖金光晕。
All nine environment backgrounds are AI-generated photorealistic scenes, used only for visual atmosphere and not representing real places; the generation marks in the bottom-right corner of the four added scenes have been fully removed with image erasing (no longer relying on cropping), so they never show at any screen ratio. Canvas overlay parameters for each environment are in `PHOTO_OVERLAY` in `js/scenes.js`: space and Antarctica use sparser particles to emphasize emptiness, Mars has reddish dust, and the fireside has a warm golden glow.

## 共坐一场 / Sit together

一个**氛围层原型**，目标是让人感到"此刻并非独自一人"，而不是真正的社交网络。所有逻辑都在浏览器里，没有后端、没有账号、没有任何数据上传。
An **atmosphere-layer prototype** — the goal is to make you feel "not alone right now," not to build a social network. All logic runs in the browser: no backend, no accounts, no data uploaded anywhere.

- **场次是真实的**：以本地公共时钟为锚点，每 30 分钟一轮（整点 / 半点）。同一时段进入的人算作同一场，倒计时和进度都按真实时钟计算。`js/gather.js` 的 `sessionAt()` 负责切场。
- **人数是演示值**：没有后端就取不到真实并发，所以"N 人在坐"是由场次 key 做确定性哈希生成的稳定数字（8–42），同一时刻所有人看到的都相同。它**不是真实在线人数**，仅用于氛围。若日后接入后端，替换 `seatsFor()` 即可显示真实并发。
- **坐后一句**：结束页可写一句感想（≤60 字），只存 `localStorage`，按场次 key 分组，跨场不混，最多保留最近 20 条。不上传、别人看不到、刷新后仍在；清理浏览器数据即消失。
- **主动保持克制**：没有注册、没有实时聊天、没有私聊或关注，避免把一个安静的冥想站变成社交产品，也规避用户生成内容带来的审核与合规负担。
- **Sessions are real**: anchored to the local clock, one slot every 30 minutes (on the hour and half-hour). Everyone entering within the same slot counts as one session; countdown and progress follow the real clock. `sessionAt()` in `js/gather.js` handles slot switching.
- **The headcount is a demo value**: without a backend there is no real concurrency, so "N sitting" is a stable number (8–42) generated by a deterministic hash of the slot key — identical for everyone at the same moment. It is **not a real online count**, only atmosphere. If a backend is added later, replace `seatsFor()` to show real concurrency.
- **A reflection afterward**: the done screen lets you write one line (≤60 chars), stored only in `localStorage`, grouped by slot key, never mixed across slots, keeping the latest 20. Nothing is uploaded, no one else can see it, it survives refresh, and disappears if you clear browser data.
- **Deliberately restrained**: no sign-up, no live chat, no DMs or follows — avoiding turning a quiet meditation site into a social product, and avoiding the moderation and compliance burden of user-generated content.

## 本地运行 / Run Locally

```bash
cd jingxin
python3 -m http.server 8000
```

浏览器打开 <http://localhost:8000>。如果直接双击 `index.html` 以 `file://` 打开，页面可显示，但浏览器可能阻止音频自动播放。
Open <http://localhost:8000> in your browser. If you double-click `index.html` to open it via `file://`, the page displays, but the browser may block audio autoplay.

## 目录结构 / Directory Structure

```text
jingxin/
├── index.html              # 四屏结构：开场 / 设置 / 静心中 / 结束 | Four screens: intro / setup / session / done
├── favicon.svg
├── css/style.css           # 东方禅意视觉、响应式、减少动态效果 | Eastern Zen visuals, responsive, reduced motion
├── js/
│   ├── app.js              # 会话状态、计时、呼吸与引导语 | Session state, timing, breathing, guidance
│   ├── audio.js            # 真实录音播放、淡入淡出、静音与暂停 | Audio playback, crossfade, mute, pause
│   ├── gather.js           # 共坐场次、演示人数、本机留言 | Shared slots, demo headcount, local reflections
│   ├── i18n.js             # 中英文界面字典与切换 | Bilingual UI dictionary and switching
│   └── scenes.js           # Canvas 动态叠加与无图回退 | Canvas overlays and no-photo fallback
└── assets/
    ├── forest.jpg snow.jpg ocean.jpg temple.jpg river.jpg
    ├── space.jpg mars.jpg hearth.jpg antarctica.jpg
    └── audio/
        ├── guide3_female.mp3 guide3_cn.mp3
        ├── bodyscan_female.mp3 bodyscan_male.mp3 bodyscan_cn.mp3
        ├── sitting_full.mp3 sitting_cn.mp3
        └── bowl.mp3 forest.mp3 stream.mp3 waves.mp3
            frogs.mp3 birds.mp3 life.mp3
```

## 部署 / Deployment

当前生产部署为 Cloudflare Pages 项目 `jingxin`，绑定 `jingxin.uichain.org`。源码在 GitHub 仓库 `leo-bone/jingxin`，站点为纯静态文件，没有构建产物。
The current production deployment is the Cloudflare Pages project `jingxin`, bound to `jingxin.uichain.org`. Source is in the GitHub repository `leo-bone/jingxin`; the site is purely static files with no build output.

更新流程 / Update workflow：

1. 本地修改并验证。/ Edit and verify locally.
2. `git add . && git commit -m "描述 / message" && git push`。
3. 将仓库根目录文件上传到 Cloudflare Pages 生产部署。/ Upload the repository root files to the Cloudflare Pages production deployment.

使用 Cloudflare Pages Direct Upload API 时，manifest 的 key 必须以 `/` 开头，例如 `/index.html`、`/assets/audio/guide3_female.mp3`；缺少前导斜杠会导致部署后 404。
When using the Cloudflare Pages Direct Upload API, manifest keys must start with `/`, e.g. `/index.html`, `/assets/audio/guide3_female.mp3`; omitting the leading slash causes 404s after deployment.

## 隐私与合规 / Privacy and Compliance

- 无账号、无聊天、无推送、无任务、无在线人数。
- No accounts, no chat, no push notifications, no tasks, no online presence count.
- 本地记录仅含日期与当日静坐次数，保存在用户浏览器。
- Local records contain only the date and the day's sitting count, stored in the user's browser.
- 声音默认由用户点击「开始静坐」后触发，可随时静音。
- Sound starts only after the user taps "Start Sitting" and can be muted at any time.
- 页面固定提示：栖山是放松与专注的练习工具，不构成医疗诊断或心理治疗；持续心理困扰可拨打 12356。
- Fixed notice on the page: Qishan is a tool for relaxation and focus practice, not medical diagnosis or psychotherapy; for ongoing psychological distress, call the helpline at 12356.
