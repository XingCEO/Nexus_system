# 設計系統配置

初始化和管理專案的設計系統（Design System）。

## 技術棧（頂配）

- **元件庫**：shadcn/ui（基於 Radix UI）
- **樣式**：Tailwind CSS v4
- **動畫**：Framer Motion
- **圖標**：Lucide Icons + Phosphor Icons
- **Figma**：shadcndesign.com Ultimate Kit

## 執行步驟

1. 安裝設計系統依賴
2. 配置 Tailwind + CSS Variables
3. 建立 Design Tokens（顏色、字體、間距）
4. 初始化 shadcn/ui
5. 建立基礎元件（Button, Input, Card...）

## 設計規範

```
顏色系統：
- Primary: HSL 變數（支援主題切換）
- Semantic: success/warning/error/info
- Neutral: 12 階灰階

字體系統：
- Sans: Inter / Geist Sans
- Mono: JetBrains Mono / Geist Mono
- 中文: Noto Sans TC

間距系統：
- 4px 基準單位
- 0.5, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24...

圓角系統：
- none, sm, md, lg, xl, 2xl, full
```

## 指令選項

- `--minimal` - 最小安裝（僅核心元件）
- `--full` - 完整安裝（所有 shadcn 元件）
- `--with-figma` - 生成 Figma 同步配置

## 範例

```
/design-system
/design-system --full
/design-system --with-figma
```
