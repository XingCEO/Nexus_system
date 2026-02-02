# 主題配置

管理應用程式的主題系統，支援亮色/暗色模式和自訂主題。

## 執行步驟

1. 分析當前主題配置
2. 生成/更新 CSS Variables
3. 配置 next-themes
4. 更新 Tailwind 配置
5. 生成主題預覽

## 主題模式

- `light` - 亮色模式
- `dark` - 暗色模式
- `system` - 跟隨系統
- `custom` - 自訂主題

## 預設主題

| 主題名稱 | 風格 |
|----------|------|
| `default` | shadcn 預設 |
| `neutral` | 中性灰階 |
| `zinc` | 冷色調 |
| `slate` | 專業商務 |
| `stone` | 暖色調 |
| `rose` | 柔和粉色 |
| `blue` | 科技藍 |
| `green` | 自然綠 |
| `orange` | 活力橘 |
| `violet` | 優雅紫 |

## CSS Variables 結構

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  /* ... */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... */
}
```

## 指令選項

- `--preset <name>` - 使用預設主題
- `--generate` - 從品牌色生成完整主題
- `--export` - 匯出主題配置

## 範例

```
/theme --preset zinc
/theme --generate #6366f1
/theme dark --preset neutral
```
