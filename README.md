# 栖山 · 在线静心空间

一处不注册、不聊天、不推送、不设任务的在线静心空间。选择一处山水，跟着呼吸，安静坐一会儿。

- 正式站点：<https://jingxin.uichain.org>
- 源码仓库：<https://github.com/leo-bone/jingxin>
- 技术形态：纯静态站，HTML / CSS / 原生 JavaScript，无构建步骤、无后端、无第三方前端依赖

## 功能

- 五处场景：雾林、金山、沧海、古刹、山水。写实背景图负责真实感，Canvas 负责呼吸光晕、浮尘与薄雾。
- 正念时长：3、5、10、15、20 分钟。
- 呼吸节奏：舒缓（吸 4 / 停 2 / 呼 6）、箱式（吸 4 / 停 4 / 呼 4 / 停 4）。
- 声音选择：3 分钟普通话正念引导、颂钵、林风、流水、海浪、虫鸣、鸟鸣、生活声。设置页只选择不发声，点击「开始静坐」后才播放。
- 会话中可随时暂停、静音或结束；结束后记录今日次数与连续天数，数据只存在浏览器 localStorage。
- 尊重系统「减少动态效果」设置；引导语使用 `aria-live` 播报。
- 明确声明为放松与专注练习工具，不构成医疗诊断或心理治疗。

## 声音说明

### 3 分钟普通话正念引导

`sound=guide3` 是本项目的原创引导音轨，时长约 3 分 01 秒。文案见 [assets/audio/guide3.txt](assets/audio/guide3.txt)，由 Apple `Ting-Ting` 普通话语音在本地合成，项目不引入任何第三方课程录音的版权风险。

选择超过 3 分钟的静坐时，引导结束后会在界面提示「引导结束，余下时间留给自己」，不会循环朗读。

### 关于「哈佛女生普通话版」

没有把来源不明的哈佛/中文课程音频直接放进仓库。核实结果：

- 哈佛 HUHS 官方提供 3 / 4 分钟引导冥想的电话热线 **Pause 4-calm**，但不提供可再分发的音频文件：<https://wellness.huhs.harvard.edu/mindfulness-and-meditation>
- 国际公开、授权清晰的正念音频库 Free Mindfulness Project 有 3 分钟呼吸练习，但为英语，且采用 CC BY-NC-SA：<https://www.freemindfulness.org/download>
- 中文「哈佛正念」课程多为付费或有明确传播限制，不适合作为本站静态资源分发。

如果后续拿到明确可再分发的原始授权，可在 `js/audio.js` 的 `FILES` 中替换 `guide3` 指向的文件，并在下方授权表补记来源。

### 音频来源与授权

音频文件来自 Wikimedia Commons 的公开转码与 Freesound 的公开预览，仅重命名、未在内容上二次剪辑；播放音量在代码中按场景做了平衡。

| 选项 | 本地文件 | 内容 | 作者 / 来源 | 授权 |
| --- | --- | --- | --- | --- |
| 3分钟正念引导 | `assets/audio/guide3.m4a` | 本项目原创普通话引导 | [引导文案](assets/audio/guide3.txt)，Apple Ting-Ting 本地合成 | 原创 |
| 颂钵 | `assets/audio/bowl.mp3` | 31 秒铜钵长音，适合循环 | [Tibetan singing bowl for meditation](https://freesound.org/s/436935)，franciscoguerrero | CC0 1.0 |
| 林风 | `assets/audio/forest.mp3` | 德国林间夏夜环境声 | [Waidachswald Oberschefflenz Abend](https://commons.wikimedia.org/wiki/File:Waidachswald_Oberschefflenz_Abend_20250616_2005.ogg)，Evillan | CC0 1.0 |
| 流水 | `assets/audio/stream.mp3` | 近场溪流声 | [Soft stream flowing water](https://commons.wikimedia.org/wiki/File:433589_jackthemurray_stream-river-water-up-close.wav)，jackthemurray | CC0 1.0 |
| 海浪 | `assets/audio/waves.mp3` | 波罗的海岸边浪声与碎石回落 | [Oceanwavescrushing.ogg](https://commons.wikimedia.org/wiki/File:Oceanwavescrushing.ogg)，Luftrum | CC BY 3.0 |
| 虫鸣 | `assets/audio/insects.mp3` | 夏夜池塘虫鸣与蛙声，田野录音 | [Frogs:crickets night ambient 1](https://freesound.org/people/SimonLustyk/sounds/873359)，SimonLustyk | CC0 1.0 |
| 鸟鸣 | `assets/audio/birds.mp3` | 芬兰森林乌鸫鸣唱，维基百科精选声音 | [Turdus merula 2.ogg](https://commons.wikimedia.org/wiki/File:Turdus_merula_2.ogg)，Oona Räisänen (Mysid) | Public domain |
| 生活声 | `assets/audio/life.mp3` | 咖啡馆人声、咖啡机与餐具轻响 | [Cafe ambient sound](https://freesound.org/people/evsecrets/sounds/332271/)，evsecrets | CC0 1.0 |

CC BY 3.0 条款：<https://creativecommons.org/licenses/by/3.0/>。CC0 1.0 条款：<https://creativecommons.org/publicdomain/zero/1.0/>。

背景照片为 AI 生成的写实场景，仅用于视觉氛围，不代表真实地点。

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
    └── audio/
        ├── guide3.m4a guide3.txt
        └── bowl.mp3 forest.mp3 stream.mp3 waves.mp3
            insects.mp3 birds.mp3 life.mp3
```

## 部署

当前生产部署为 Cloudflare Pages 项目 `jingxin`，绑定 `jingxin.uichain.org`。源码在 GitHub 仓库 `leo-bone/jingxin`，站点为纯静态文件，没有构建产物。

更新流程：

1. 本地修改并验证。
2. `git add . && git commit -m "描述" && git push`。
3. 将仓库根目录文件上传到 Cloudflare Pages 生产部署。

使用 Cloudflare Pages Direct Upload API 时，manifest 的 key 必须以 `/` 开头，例如 `/index.html`、`/assets/audio/guide3.m4a`；缺少前导斜杠会导致部署后 404。

## 重新生成引导音频

```bash
cd assets/audio
say -v Ting-Ting -r 162 -f guide3.txt -o guide3.aiff
afconvert -f m4af -d aac -b 64000 -q 127 guide3.aiff guide3.m4a
rm guide3.aiff
```

## 隐私与合规

- 无账号、无聊天、无推送、无任务、无在线人数。
- 本地记录仅含日期与当日静坐次数，保存在用户浏览器。
- 声音默认由用户点击「开始静坐」后触发，可随时静音。
- 页面固定提示：栖山是放松与专注的练习工具，不构成医疗诊断或心理治疗；持续心理困扰可拨打 12356。
