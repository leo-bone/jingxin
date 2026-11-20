# 栖山 · 在线静心空间

一处不注册、不聊天、不推送、不设任务的在线静心空间。选择一处环境，跟着呼吸，安静坐一会儿。

- 正式站点：<https://jingxin.uichain.org>
- 源码仓库：<https://github.com/leo-bone/jingxin>
- 技术形态：纯静态站，HTML / CSS / 原生 JavaScript，无构建步骤、无后端、无第三方前端依赖

## 功能

- 九处环境：雾林、金山、沧海、古刹、山水、太空、火星、炉边、南极。写实背景图负责真实感与空间氛围，Canvas 负责呼吸光晕、浮尘与薄雾；不同环境配有各自的粒子密度与光色。
- 正念时长：3、5、10、15、20 分钟。
- 呼吸节奏（以放松为目标，遵循「呼气不短于吸气」）：深呼吸（吸 4 / 呼 6）、共振呼吸（吸 5 / 呼 5）、4-7-8（吸 4 / 停 7 / 呼 8）、箱式（吸 4 / 停 4 / 呼 4 / 停 4）。每项附原理说明。
- 声音选择：真人正念引导（女声 / 男声，各约 3 分钟）、颂钵、林风、流水、海浪、虫鸣、鸟鸣、生活声。设置页只选择不发声，点击「开始静坐」后才播放。
- 会话中可随时暂停、静音或结束；结束后记录今日次数与连续天数，数据只存在浏览器 localStorage。
- 尊重系统「减少动态效果」设置；引导语使用 `aria-live` 播报。
- 明确声明为放松与专注练习工具，不构成医疗诊断或心理治疗。

## 声音说明

### 3 分钟真人正念引导（女声 / 男声）

原先使用的普通话合成语音因听感生硬已弃用，改为**真人引导录音**，来自国际公开的正念音频库 **The Free Mindfulness Project**：

- 女声 `sound=guide3`：*Three Step Breathing Space*，Christina，**2:52**
- 男声 `sound=guide3m`：*3 Minute Breathing Space*，Peter，**3:17**

两者都是「三步呼吸空间」练习：觉察身体与情绪 → 把注意力收到呼吸 → 将觉察扩展至全身。授权为 **CC BY-NC-SA 3.0**，允许非商业再分发，本站为非商业、免费项目，符合授权条件；署名信息见下方授权表与设置页出处链接。

选择超过 3 分钟的静坐时，引导播完后会在界面提示「引导结束，余下时间留给自己」，不会循环朗读。

### 关于中文 / 哈佛普通话版

- 核实过哈佛 HUHS 官方的 3 / 4 分钟引导冥想，是电话热线 **Pause 4-calm**，不提供可再分发的音频文件：<https://wellness.huhs.harvard.edu/mindfulness-and-meditation>
- 中文「哈佛正念」课程多为付费或有明确传播限制，不适合作为本站静态资源分发。
- Free Mindfulness Project 的授权清晰、可合法分发，但引导为英语。为兼顾听感与合规，本站采用其真人英语录音，未使用任何来源不明的中文课程音频。

如果后续拿到明确可再分发的中文真人授权，可在 `js/audio.js` 的 `FILES` 中替换 `guide3` / `guide3m` 指向的文件，并在下方授权表补记来源。

### 音频来源与授权

环境声来自 Wikimedia Commons 的公开转码与 Freesound 的公开预览，引导来自 The Free Mindfulness Project 自建音频 CDN；均仅重命名、未在内容上二次剪辑，播放音量在代码中做了平衡。

| 选项 | 本地文件 | 内容 | 作者 / 来源 | 授权 |
| --- | --- | --- | --- | --- |
| 正念引导·女声 | `assets/audio/guide3_female.mp3` | Three Step Breathing Space，2:52 | [The Free Mindfulness Project](https://www.freemindfulness.org/download)，Christina | CC BY-NC-SA 3.0 |
| 正念引导·男声 | `assets/audio/guide3_male.mp3` | 3 Minute Breathing Space，3:17 | [The Free Mindfulness Project](https://www.freemindfulness.org/download)，Peter | CC BY-NC-SA 3.0 |
| 颂钵 | `assets/audio/bowl.mp3` | 31 秒铜钵长音，适合循环 | [Tibetan singing bowl for meditation](https://freesound.org/s/436935)，franciscoguerrero | CC0 1.0 |
| 林风 | `assets/audio/forest.mp3` | 德国林间夏夜环境声 | [Waidachswald Oberschefflenz Abend](https://commons.wikimedia.org/wiki/File:Waidachswald_Oberschefflenz_Abend_20250616_2005.ogg)，Evillan | CC0 1.0 |
| 流水 | `assets/audio/stream.mp3` | 近场溪流声 | [Soft stream flowing water](https://commons.wikimedia.org/wiki/File:433589_jackthemurray_stream-river-water-up-close.wav)，jackthemurray | CC0 1.0 |
| 海浪 | `assets/audio/waves.mp3` | 波罗的海岸边浪声与碎石回落 | [Oceanwavescrushing.ogg](https://commons.wikimedia.org/wiki/File:Oceanwavescrushing.ogg)，Luftrum | CC BY 3.0 |
| 虫鸣 | `assets/audio/insects.mp3` | 夏夜池塘虫鸣与蛙声，田野录音 | [Frogs:crickets night ambient 1](https://freesound.org/people/SimonLustyk/sounds/873359)，SimonLustyk | CC0 1.0 |
| 鸟鸣 | `assets/audio/birds.mp3` | 芬兰森林乌鸫鸣唱，维基百科精选声音 | [Turdus merula 2.ogg](https://commons.wikimedia.org/wiki/File:Turdus_merula_2.ogg)，Oona Räisänen (Mysid) | Public domain |
| 生活声 | `assets/audio/life.mp3` | 咖啡馆人声、咖啡机与餐具轻响 | [Cafe ambient sound](https://freesound.org/people/evsecrets/sounds/332271/)，evsecrets | CC0 1.0 |

CC BY-NC-SA 3.0 条款：<https://creativecommons.org/licenses/by-nc-sa/3.0/>。CC BY 3.0 条款：<https://creativecommons.org/licenses/by/3.0/>。CC0 1.0 条款：<https://creativecommons.org/publicdomain/zero/1.0/>。

### 场景照片

九处环境背景均为 AI 生成的写实场景，仅用于视觉氛围，不代表真实地点；画面右下角的生成标记已通过裁切去除。各环境的 Canvas 动态层参数见 `js/scenes.js` 的 `PHOTO_OVERLAY`：太空、南极粒子更稀疏以突出空旷，火星偏赤色浮尘，炉边偏暖金光晕。

## 本地运行

```bash
cd jingxin
python3 -m http.server 8000
```

浏览器打开 <http://localhost:8000>。如果直接双击 `index.html` 以 `file://` 打开，页面可显示，但浏览器可能阻止音频自动播放。

## 目录结构

```text
jingxin/
├── index.html              # 四屏结构：开场 / 设置 / 静心中 / 结束
├── favicon.svg
├── css/style.css           # 东方禅意视觉、响应式、减少动态效果
├── js/
│   ├── app.js              # 会话状态、计时、呼吸与引导语
│   ├── audio.js            # 真实录音播放、淡入淡出、静音与暂停
│   └── scenes.js           # Canvas 动态叠加与无图回退
└── assets/
    ├── forest.jpg snow.jpg ocean.jpg temple.jpg river.jpg
    ├── space.jpg mars.jpg hearth.jpg antarctica.jpg
    └── audio/
        ├── guide3_female.mp3 guide3_male.mp3
        └── bowl.mp3 forest.mp3 stream.mp3 waves.mp3
            insects.mp3 birds.mp3 life.mp3
```

## 部署

当前生产部署为 Cloudflare Pages 项目 `jingxin`，绑定 `jingxin.uichain.org`。源码在 GitHub 仓库 `leo-bone/jingxin`，站点为纯静态文件，没有构建产物。

更新流程：

1. 本地修改并验证。
2. `git add . && git commit -m "描述" && git push`。
3. 将仓库根目录文件上传到 Cloudflare Pages 生产部署。

使用 Cloudflare Pages Direct Upload API 时，manifest 的 key 必须以 `/` 开头，例如 `/index.html`、`/assets/audio/guide3_female.mp3`；缺少前导斜杠会导致部署后 404。

## 隐私与合规

- 无账号、无聊天、无推送、无任务、无在线人数。
- 本地记录仅含日期与当日静坐次数，保存在用户浏览器。
- 声音默认由用户点击「开始静坐」后触发，可随时静音。
- 页面固定提示：栖山是放松与专注的练习工具，不构成医疗诊断或心理治疗；持续心理困扰可拨打 12356。
