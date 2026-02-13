# Dota 2 Hero Portraits

## 如何添加英雄头像

### 方法1: 从 Dota 2 游戏文件提取

1. 找到你的 Dota 2 安装目录
2. 导航到 `dota 2 beta/game/dota/resource/flash3/images/heroes/`
3. 复制英雄头像文件到 `assets/heroes/portraits/` 目录

### 方法2: 从官方 Wiki 下载

1. 访问 Dota 2 Wiki: https://dota2.fandom.com/wiki/Heroes
2. 点击每个英雄页面
3. 下载英雄肖像图片
4. 保存为 `{hero_id}.png` 格式

### 方法3: 使用 Dota 2 API

可以从 Steam CDN 下载官方英雄图片：
```
https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/{hero_name}.png
```

## 文件命名规范

所有图片必须按照以下格式命名：

- `alchemist.png`
- `axe.png`
- `bounty_hunter.png`
- `dragon_knight.png`
- `juggernaut.png`
- `lina.png`
- `phantom_assassin.png`
- `pudge.png`
- `sniper.png`
- `zeus.png`

## 推荐图片规格

- 格式: PNG (支持透明背景)
- 尺寸: 256x144 或更高
- 宽高比: 16:9

## 版权说明

Dota 2 及所有相关图像资产均为 Valve Corporation 所有。本项目仅用于教育和个人用途。
