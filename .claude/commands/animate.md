# 動畫效果

添加和管理 UI 動畫效果，使用 Framer Motion。

## 執行步驟

1. 確認動畫目標元素
2. 選擇動畫類型
3. 生成動畫代碼
4. 配置動畫參數
5. 優化效能

## 動畫類型

| 類型 | 說明 | 範例 |
|------|------|------|
| `fade` | 淡入淡出 | 頁面轉場 |
| `slide` | 滑動 | 側邊欄、抽屜 |
| `scale` | 縮放 | Modal、卡片 |
| `spring` | 彈性 | 按鈕、互動元素 |
| `stagger` | 交錯 | 列表項目 |
| `scroll` | 滾動觸發 | 著陸頁區塊 |
| `gesture` | 手勢 | 拖拽、滑動 |
| `layout` | 佈局 | 排序、過濾 |

## 預設動畫配置

```typescript
// 標準 easing
const easing = {
  smooth: [0.4, 0, 0.2, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
  snappy: [0.4, 0, 0, 1],
}

// 標準時長
const duration = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
}
```

## 效能考量

- 優先使用 `transform` 和 `opacity`
- 避免觸發 layout reflow
- 使用 `will-change` 提示
- 支援 `prefers-reduced-motion`

## 範例

```
/animate fade --target Modal
/animate stagger --target AgentList
/animate scroll --target LandingSection
```
