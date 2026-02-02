# 響應式設計

檢查和優化元件/頁面的響應式設計。

## 斷點系統（Tailwind 預設）

| 斷點 | 寬度 | 裝置 |
|------|------|------|
| `sm` | 640px | 大手機 |
| `md` | 768px | 平板 |
| `lg` | 1024px | 筆電 |
| `xl` | 1280px | 桌面 |
| `2xl` | 1536px | 大螢幕 |

## 執行步驟

1. 分析目標元件/頁面
2. 檢查各斷點呈現
3. 識別響應式問題
4. 生成修復建議
5. 套用優化

## 響應式策略

- **Mobile-first**：從手機開始設計
- **Container Queries**：元件級響應式
- **Fluid Typography**：流動字體大小
- **Flexible Grid**：彈性網格佈局

## 常見檢查項目

- [ ] 文字是否過小/過大
- [ ] 按鈕/連結是否可點擊（touch target）
- [ ] 圖片是否正確縮放
- [ ] 橫向滾動問題
- [ ] 間距是否合理
- [ ] 導航是否可用

## 指令選項

- `--check <path>` - 檢查特定檔案
- `--breakpoint <bp>` - 專注特定斷點
- `--fix` - 自動修復簡單問題

## 範例

```
/responsive --check src/app/page.tsx
/responsive --breakpoint sm
/responsive --fix
```
