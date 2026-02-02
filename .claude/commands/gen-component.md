# 生成 React 元件

根據用戶需求生成 React 元件，包含完整的檔案結構。

## 執行步驟

1. 詢問元件名稱和用途（如未提供）
2. 確認元件位置（預設：`packages/ui/src/components/`）
3. 建立以下檔案：
   - `ComponentName/index.tsx` - 元件主體
   - `ComponentName/ComponentName.tsx` - 元件實作
   - `ComponentName/ComponentName.test.tsx` - 單元測試
   - `ComponentName/ComponentName.stories.tsx` - Storybook 故事（可選）
4. 更新 barrel export（index.ts）

## 元件規範

- 使用 TypeScript + React 18+
- 使用 Tailwind CSS 樣式
- 使用 Radix UI 作為無障礙基礎（如適用）
- Props 使用 interface 定義並 export
- 支援 className 覆寫（使用 cn utility）

## 範例

```
/gen-component Button
/gen-component ChatMessage --with-stories
/gen-component AgentCard --path apps/web/src/components
```
