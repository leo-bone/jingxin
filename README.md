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
- 声音选择：真人正念引导（女声 / 男声，各约 3 分钟）、颂钵、林风、流水、海浪、虫鸣、鸟鸣、生活声。设置页只选择不发声，点击「开始静坐」后才播放。
- Sound options: real-voice mindfulness guidance (female / male, about 3 minutes each), singing bowl, forest wind, flowing water, ocean waves, insects, birds, and everyday life sounds. The setup screen only selects — nothing plays until you tap "Start Sitting."
- 整套完整练习：身体扫描（女声 27′ / 男声 37′）、完整坐禅引导（35′）。这类是**从头到尾的完整引导**，时间充裕时练习；选择后时长自动跟随音频、时长选项置灰，音频播完即自然结束，无需自行计时。
- Full guided practices: Body Scan (female 27′ / male 37′) and a complete Sitting Meditation (35′). These are **complete from start to finish**, for when you have more time. Once selected, the duration automatically follows the audio and the duration options are greyed out; the session ends naturally when the audio finishes — no timer needed.
- 会话中可随时暂停、静音或结束；支持键盘快捷键：空格暂停/继续、Esc 结束（闭眼练习时无需看屏幕）。
- Pause, mute, or end at any time during a session. Keyboard shortcuts are supported: Space to pause/resume, Esc to end (no need to look at the screen with your eyes closed).
- 真人语音引导与屏幕中文引导语互斥：引导播放期间只显示一句静态提示，播完后中文引导语按进度接管，避免中英两套引导同时干扰。手动静音引导时同样交还给文字陪伴。
- Voice guidance and on-screen Chinese prompts are mutually exclusive: while the voice plays, only a single static hint is shown; when it ends, Chinese prompts take over according to progress, avoiding two sets of guidance at once. Manually muting also hands control back to the text.
- 结束后记录今日次数与连续天数，数据只存在浏览器 localStorage。
- After each session, today's count and your streak are recorded — stored only in your browser's localStorage.
- 尊重系统「减少动态效果」设置；引导语使用 `aria-live` 播报。
- Respects the system "reduce motion" setting; guidance text is announced via `aria-live`.
- 明确声明为放松与专注练习工具，不构成医疗诊断或心理治疗。
- Clearly stated to be a tool for relaxation and focus practice, not medical diagnosis or psychotherapy.

## 声音说明 / About the Sounds

### 3 分钟真人正念引导（女声 / 男声） / 3-Minute Real-Voice Guidance (Female / Male)

原先使用的普通话合成语音因听感生硬已弃用，改为**真人引导录音**，来自国际公开的正念音频库 **The Free Mindfulness Project**：
The earlier Mandarin synthesized voice was dropped for sounding too robotic, replaced with **real human guidance recordings** from the international open mindfulness audio library **The Free Mindfulness Project**:

- 女声 `sound=guide3`：*Three Step Breathing Space*，Christina，**2:52**
- Female `sound=guide3`: *Three Step Breathing Space*, Christina, **2:52**
- 男声 `sound=guide3m`：*3 Minute Breathing Space*，Peter，**3:17**
- Male `sound=guide3m`: *3 Minute Breathing Space*, Peter, **3:17**

两者都是「三步呼吸空间」练习：觉察身体与情绪 → 把注意力收到呼吸 → 将觉察扩展至全身。授权为 **CC BY-NC-SA 3.0**，允许非商业再分发，本站为非商业、免费项目，符合授权条件；署名信息见下方授权表与设置页出处链接。
Both are "Three Step Breathing Space" practices: notice the body and emotions → bring attention to the breath → expand awareness to the whole body. Licensed **CC BY-NC-SA 3.0**, which allows non-commercial redistribution; this site is free and non-commercial, so it qualifies. Attribution is in the license table below and the source link on the setup page.

选择超过 3 分钟的静坐时，引导播完后会在界面提示「引导结束，余下时间留给自己」，不会循环朗读；此后由屏幕中文引导语接续陪伴，不留空白。引导全程英文语音主导，屏幕只显示一句「跟着声音，回到呼吸」，不与中文引导语同时滚动。
When you choose a sitting longer than 3 minutes, after the voice ends the screen shows "Guidance finished — the rest is yours" rather than looping. On-screen Chinese prompts then keep you company with no gap. The voice is in English throughout; the screen shows only one line, "Follow the voice, return to the breath," without scrolling Chinese prompts alongside it.

### 整套完整练习（身体扫描 / 完整坐禅） / Full Guided Practices (Body Scan / Sitting Meditation)

为时间充裕、想从头到尾练完一整套的人准备，同样来自 The Free Mindfulness Project，**CC BY-NC-SA 3.0**：
For those with time to practice a full session from beginning to end, also from The Free Mindfulness Project, **CC BY-NC-SA 3.0**:

- 身体扫描·女声 `sound=bodyscanf`：*Body Scan*，Christina，**26:46**。躺着或坐着均可，把觉察依次带到身体各处，培养温和不评判的身体觉知。
- Body Scan · Female `sound=bodyscanf`: *Body Scan*, Christina, **26:46**. Lying down or sitting are both fine; bring awareness successively to each part of the body, cultivating gentle, non-judgmental body awareness.
- 身体扫描·男声 `sound=bodyscanm`：*Body Scan*，Paddy，**37:09**。更长的身体扫描，适合慢慢走完全身。
- Body Scan · Male `sound=bodyscanm`: *Body Scan*, Paddy, **37:09**. A longer body scan, ideal for slowly moving through the whole body.
- 完整坐禅·引导 `sound=sitting`：*Sitting Meditation*，Peter，**34:50**。从呼吸到身体、声音，再到念头与情绪，走一整套 MBSR 风格的正念静坐。
- Sitting Meditation · Guided `sound=sitting`: *Sitting Meditation*, Peter, **34:50**. From breath to body and sounds, then to thoughts and emotions — a complete MBSR-style mindfulness sit.

与 3 分钟短引导的关键区别：**这类音频本身就是完整练习**，所以会话时长直接取录音长度（`FULL_PRACTICE` 中写入的秒数），时钟与进度以音频为准，时长选项自动置灰；整段播完即判定本次圆满并进入结束页。屏幕同样只给一句静态提示，不与中文引导语叠加。手动静音后再开启，音频会重新接管屏幕。
The key difference from the 3-minute short guidance: **these audio files are themselves complete practices**, so the session length is taken directly from the recording (the seconds stored in `FULL_PRACTICE`); the clock and progress follow the audio, and the duration options are automatically greyed out. When the track finishes, the session is complete and moves to the end screen. As before, the screen shows only one static hint and does not overlay Chinese prompts. If you mute and then turn sound back on, the audio retakes the screen.

### 关于中文 / 哈佛普通话版 / About Chinese / Harvard Mandarin Versions

- 核实过哈佛 HUHS 官方的 3 / 4 分钟引导冥想，是电话热线 **Pause 4-calm**，不提供可再分发的音频文件：<https://wellness.huhs.harvard.edu/mindfulness-and-meditation>
- Verified that Harvard HUHS's official 3-/4-minute guided meditation is a phone hotline, **Pause 4-calm**, and does not provide redistributable audio files: <https://wellness.huhs.harvard.edu/mindfulness-and-meditation>
- 中文「哈佛正念」课程多为付费或有明确传播限制，不适合作为本站静态资源分发。
- Most Chinese "Harvard mindfulness" courses are paid or have explicit distribution restrictions, making them unsuitable as static assets for this site.
- Free Mindfulness Project 的授权清晰、可合法分发，但引导为英语。为兼顾听感与合规，本站采用其真人英语录音，未使用任何来源不明的中文课程音频。
- The Free Mindfulness Project has clear licensing and allows legal redistribution, but its guidance is in English. To balance listening quality and compliance, this site uses their real English recordings and does not use any Chinese course audio of unclear provenance.

如果后续拿到明确可再分发的中文真人授权，可在 `js/audio.js` 的 `FILES` 中替换 `guide3` / `guide3m` 指向的文件，并在下方授权表补记来源。
If clearly redistributable Chinese human-voice licensing is obtained later, you can replace the files that `guide3` / `guide3m` point to in `js/audio.js`'s `FILES`, and add the source to the license table below.

### 音频来源与授权 / Audio Sources and Licenses

环境声来自 Wikimedia Commons 的公开转码与 Freesound 的公开预览，引导来自 The Free Mindfulness Project 自建音频 CDN；均仅重命名、未在内容上二次剪辑，播放音量在代码中做了平衡。
Ambient sounds come from public transcodes on Wikimedia Commons and public previews on Freesound; guidance comes from The Free Mindfulness Project's own audio CDN. Files were only renamed, never edited in content; playback volumes are balanced in code.

| 选项 Option | 本地文件 File | 内容 Content | 作者 / 来源 Author / Source | 授权 License |
| --- | --- | --- | --- | --- |
| 正念引导·女声 Guided · Female | `assets/audio/guide3_female.mp3` | Three Step Breathing Space，2:52 | [The Free Mindfulness Project](https://www.freemindfulness.org/download)，Christina | CC BY-NC-SA 3.0 |
| 正念引导·男声 Guided · Male | `assets/audio/guide3_male.mp3` | 3 Minute Breathing Space，3:17 | [The Free Mindfulness Project](https://www.freemindfulness.org/download)，Peter | CC BY-NC-SA 3.0 |
| 身体扫描·女声 Body Scan · Female | `assets/audio/bodyscan_female.mp3` | Body Scan，26:46 | [The Free Mindfulness Project](https://player.freemindfulness.org)，Christina | CC BY-NC-SA 3.0 |
| 身体扫描·男声 Body Scan · Male | `assets/audio/bodyscan_male.mp3` | Body Scan，37:09 | [The Free Mindfulness Project](https://player.freemindfulness.org)，Paddy | CC BY-NC-SA 3.0 |
| 完整坐禅·引导 Sitting Meditation | `assets/audio/sitting_full.mp3` | Sitting Meditation，34:50 | [The Free Mindfulness Project](https://player.freemindfulness.org)，Peter | CC BY-NC-SA 3.0 |
| 颂钵 Singing bowl | `assets/audio/bowl.mp3` | 31 秒铜钵长音，适合循环 / 31s bowl tone, loopable | [Tibetan singing bowl for meditation](https://freesound.org/s/436935)，franciscoguerrero | CC0 1.0 |
| 林风 Forest wind | `assets/audio/forest.mp3` | 德国林间夏夜环境声 / German woodland summer-night ambience | [Waidachswald Oberschefflenz Abend](https://commons.wikimedia.org/wiki/File:Waidachswald_Oberschefflenz_Abend_20250616_2005.ogg)，Evillan | CC0 1.0 |
| 流水 Flowing water | `assets/audio/stream.mp3` | 近场溪流声 / Close-up stream sound | [Soft stream flowing water](https://commons.wikimedia.org/wiki/File:433589_jackthemurray_stream-river-water-up-close.wav)，jackthemurray | CC0 1.0 |
| 海浪 Ocean waves | `assets/audio/waves.mp3` | 波罗的海岸边浪声与碎石回落 / Baltic shore waves and rolling pebbles | [Oceanwavescrushing.ogg](https://commons.wikimedia.org/wiki/File:Oceanwavescrushing.ogg)，Luftrum | CC BY 3.0 |
| 虫鸣 Insects | `assets/audio/insects.mp3` | 夏夜池塘虫鸣与蛙声，田野录音 / Summer-night pond insects and frogs, field recording | [Frogs:crickets night ambient 1](https://freesound.org/people/SimonLustyk/sounds/873359)，SimonLustyk | CC0 1.0 |
| 鸟鸣 Birds | `assets/audio/birds.mp3` | 芬兰森林乌鸫鸣唱，维基百科精选声音 / Finnish forest blackbird song, Wikipedia featured sound | [Turdus merula 2.ogg](https://commons.wikimedia.org/wiki/File:Turdus_merula_2.ogg)，Oona Räisänen (Mysid) | Public domain |
| 生活声 Everyday life | `assets/audio/life.mp3` | 咖啡馆人声、咖啡机与餐具轻响 / Café chatter, coffee machine, and soft crockery | [Cafe ambient sound](https://freesound.org/people/evsecrets/sounds/332271/)，evsecrets | CC0 1.0 |

CC BY-NC-SA 3.0 条款：<https://creativecommons.org/licenses/by-nc-sa/3.0/>。CC BY 3.0 条款：<https://creativecommons.org/licenses/by/3.0/>。CC0 1.0 条款：<https://creativecommons.org/publicdomain/zero/1.0/>。
CC BY-NC-SA 3.0 terms: <https://creativecommons.org/licenses/by-nc-sa/3.0/>. CC BY 3.0 terms: <https://creativecommons.org/licenses/by/3.0/>. CC0 1.0 terms: <https://creativecommons.org/publicdomain/zero/1.0/>.

### 场景照片 / Scene Photos

九处环境背景均为 AI 生成的写实场景，仅用于视觉氛围，不代表真实地点；四张新增场景图右下角的生成标记已用图像擦除彻底抹去（不再依赖裁切），任意屏幕比例下都不会露出。各环境的 Canvas 动态层参数见 `js/scenes.js` 的 `PHOTO_OVERLAY`：太空、南极粒子更稀疏以突出空旷，火星偏赤色浮尘，炉边偏暖金光晕。
All nine environment backgrounds are AI-generated photorealistic scenes, used only for visual atmosphere and not representing real places; the generation marks in the bottom-right corner of the four added scenes have been fully removed with image erasing (no longer relying on cropping), so they never show at any screen ratio. Canvas overlay parameters for each environment are in `PHOTO_OVERLAY` in `js/scenes.js`: space and Antarctica use sparser particles to emphasize emptiness, Mars has reddish dust, and the fireside has a warm golden glow.

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
│   └── scenes.js           # Canvas 动态叠加与无图回退 | Canvas overlays and no-photo fallback
└── assets/
    ├── forest.jpg snow.jpg ocean.jpg temple.jpg river.jpg
    ├── space.jpg mars.jpg hearth.jpg antarctica.jpg
    └── audio/
        ├── guide3_female.mp3 guide3_male.mp3
        ├── bodyscan_female.mp3 bodyscan_male.mp3 sitting_full.mp3
        └── bowl.mp3 forest.mp3 stream.mp3 waves.mp3
            insects.mp3 birds.mp3 life.mp3
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
