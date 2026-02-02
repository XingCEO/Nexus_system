# 圖標管理

管理專案圖標，整合 Lucide Icons 和 Phosphor Icons。

## 圖標庫

| 庫 | 風格 | 用途 |
|----|------|------|
| **Lucide** | 線性、現代 | 主要 UI 圖標 |
| **Phosphor** | 多風格、豐富 | 補充圖標 |
| **Custom** | 自訂 SVG | 品牌圖標 |

## 執行步驟

1. 搜尋/瀏覽可用圖標
2. 安裝所需圖標
3. 生成圖標元件
4. 統一匯出管理

## 圖標元件規範

```typescript
import { LucideIcon } from 'lucide-react'

interface IconProps {
  icon: LucideIcon
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

// 尺寸對應
const sizes = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
}
```

## 指令選項

- `--search <keyword>` - 搜尋圖標
- `--add <names>` - 添加圖標到專案
- `--list` - 列出已使用的圖標
- `--optimize` - 移除未使用的圖標

## 範例

```
/icons --search chat
/icons --add MessageSquare,Send,Bot
/icons --list
/icons --optimize
```
