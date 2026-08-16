# CICADA 1145

致敬 [Cicada 3301](https://en.wikipedia.org/wiki/Cicada_3301) 与 KinitoPET 的 ARG 解谜网页游戏。

纯 HTML / CSS / JavaScript，零依赖、零构建、完全离线。不需要服务器，不需要联网。

## 如何游玩

1. 点击页面右上角 **Code → Download ZIP**（或 `git clone`）
2. 解压后双击打开 `index.html`（Chrome / Edge / Firefox 均可）
3. 游戏全程在本地运行

会用到：BASE64、凯撒密码、键盘偏移、隐写术、哈希，以及一点点 PowerShell / Python
（用于最后的"身份验证"——那是验证身份，不是破解，正如原版 Cicada 的 PGP）。

## 注意

- 档案里有假情报，解密出的内容未必是真的；信任错误的信息会被标记
- 部分内容只在特定系统时间显现（请保持好奇心）
- 请勿剧透，尊重后来者

## 目录

```
index.html        入口
door.html         大门（结局分叉点）
end.html          终点
badend.html       被标记的一刻
files/            档案：readme / 格言 / 伪造档案 / 时钟 / 翅膀 / 验证脚本
assets/           样式与脚本
```

祝你好运。我们只相信验证过的真理。