<div align="center">

<img src="https://raw.githubusercontent.com/XingCEO/Nexus_system/main/docs/assets/logo.svg" alt="Nexus Logo" width="120" height="120" />

# Nexus

### 🚀 帶記憶的 AI Agent 編排平台

**你的 AI 分身 — 能記住一切、自主行動、永不休息的數位員工**

[![Version](https://img.shields.io/badge/version-0.6.0-blue.svg)](https://github.com/XingCEO/Nexus_system/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Tauri](https://img.shields.io/badge/Tauri-2.0-FFC131?logo=tauri&logoColor=white)](https://tauri.app/)

[功能特色](#-功能特色) • [快速開始](#-快速開始) • [技術棧](#-技術棧) • [專案架構](#-專案架構) • [開發路線圖](#-開發路線圖)

</div>

---

## ✨ 功能特色

<table>
<tr>
<td width="50%">

### 🧠 永久記憶系統
跨會話記住所有用戶資訊與偏好，讓 AI 真正「認識」你

</td>
<td width="50%">

### 🤖 多 Agent 協作
團隊合作完成複雜任務，每個 Agent 專精不同領域

</td>
</tr>
<tr>
<td width="50%">

### 🔌 MCP 工具市場
即插即用的工具生態系統，GitHub、Slack、Notion 一鍵整合

</td>
<td width="50%">

### 🎯 視覺化工作流
拖拽式建立自動化流程，無需程式碼

</td>
</tr>
<tr>
<td width="50%">

### 👥 會員分級系統
免費版 / 專業版 / 企業版 多層級權限管理

</td>
<td width="50%">

### 🌙 本地優先架構
數據不出境，完整隱私保護

</td>
</tr>
</table>

## 🚀 快速開始

### 環境需求

- **Node.js** 20+
- **pnpm** 9+
- **Bun** 1.0+ (API 服務)

### 安裝

```bash
# 複製專案
git clone https://github.com/XingCEO/Nexus_system.git
cd nexus

# 安裝依賴
pnpm install

# 啟動開發環境
pnpm dev
```

### 指令

| 指令 | 說明 |
|------|------|
| `pnpm dev` | 啟動開發環境 |
| `pnpm build` | 建置生產版本 |
| `pnpm test` | 執行測試 |
| `pnpm lint` | 程式碼檢查 |

## 🛠 技術棧

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-0055FF?style=for-the-badge&logo=framer&logoColor=white)

![Hono](https://img.shields.io/badge/Hono-4.0-E36002?style=for-the-badge&logo=hono&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-1.0-FBF0DF?style=for-the-badge&logo=bun&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-Auth-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

![Tauri](https://img.shields.io/badge/Tauri-2.0-FFC131?style=for-the-badge&logo=tauri&logoColor=white)
![Rust](https://img.shields.io/badge/Rust-2024-000000?style=for-the-badge&logo=rust&logoColor=white)
![Turborepo](https://img.shields.io/badge/Turborepo-2.0-EF4444?style=for-the-badge&logo=turborepo&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-9.0-F69220?style=for-the-badge&logo=pnpm&logoColor=white)

</div>

| 層級 | 技術 |
|------|------|
| **前端框架** | Next.js 15 (App Router), React 19, Framer Motion |
| **樣式系統** | Tailwind CSS, shadcn/ui, Radix UI, Lucide Icons |
| **後端服務** | Hono (Bun runtime), Zod validation |
| **認證系統** | Supabase Auth |
| **資料庫** | SQLite (本地), Qdrant (向量搜尋) |
| **桌面應用** | Tauri 2.0 (Rust) |
| **建置工具** | Turborepo, pnpm workspaces, TypeScript 5.7 |

## 📁 專案架構

```
nexus/
├── 📱 apps/
│   ├── web/                 # Next.js 15 Web 應用
│   │   ├── src/app/         # App Router 頁面
│   │   │   ├── app/         # 聊天介面
│   │   │   ├── admin/       # 管理後台
│   │   │   ├── workflows/   # 工作流編輯器
│   │   │   ├── memories/    # 記憶管理
│   │   │   └── mcp/         # MCP 工具市場
│   │   ├── src/lib/         # 核心邏輯 (auth, usage, admin)
│   │   └── src/components/  # React 元件
│   ├── api/                 # Hono API 服務
│   └── desktop/             # Tauri 桌面應用
│
├── 📦 packages/
│   ├── core/                # 核心引擎 (Memory, Agent, MCP)
│   ├── ui/                  # UI 元件庫
│   └── shared/              # 共用型別與工具
│
└── ⚙️ .claude/
    └── commands/            # 16 個 Claude Skills
```

## 🗺 開發路線圖

| 版本 | 功能 | 狀態 |
|------|------|------|
| v0.1.0 | Monorepo 架構 | ✅ 完成 |
| v0.2.0 | 聊天介面 MVP | ✅ 完成 |
| v0.3.0 | 記憶系統 | ✅ 完成 |
| v0.4.0 | MCP 整合 | ✅ 完成 |
| v0.5.0 | Agent 工作流 | ✅ 完成 |
| v0.6.0 | 會員系統 + 管理後台 | ✅ 完成 |
| v0.7.0 | 通訊整合 (LINE/Telegram/Discord) | 🚧 開發中 |
| v0.8.0 | 企業版 (SSO/審計日誌) | 📋 規劃中 |
| v0.9.0 | Agent 市場 | 📋 規劃中 |
| v1.0.0 | 正式發布 | 🎯 目標 |

## 👥 會員等級

| 等級 | 每日訊息 | 工作流 | Agent | MCP 工具 |
|------|----------|--------|-------|----------|
| 🆓 免費版 | 50 則 | 1 個 | 1 個 | 3 個 |
| ⭐ 專業版 | 無限 | 10 個 | 5 個 | 全部 |
| 🏢 企業版 | 無限 | 無限 | 無限 | 全部 |

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

1. Fork 此專案
2. 建立功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交變更 (`git commit -m 'Add amazing feature'`)
4. 推送分支 (`git push origin feature/amazing-feature`)
5. 開啟 Pull Request

## 📄 授權

本專案採用 [MIT 授權](LICENSE)。

---

<div align="center">

**[⬆ 回到頂部](#nexus)**

Made with ❤️ in Taiwan

</div>
