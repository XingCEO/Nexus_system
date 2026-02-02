# Changelog

本專案的所有重要變更都會記錄在此檔案中。

格式基於 [Keep a Changelog](https://keepachangelog.com/zh-TW/1.0.0/)，
版本號遵循 [Semantic Versioning](https://semver.org/lang/zh-TW/)。

## [Unreleased]

### 計劃中
- 通訊整合 (LINE/Telegram/Discord)
- 企業版功能 (SSO/審計日誌)
- Agent 市場生態

---

## [0.5.0] - 2025-02-02

### 新增
- 🔄 **工作流引擎**
  - `WorkflowEngine` - 工作流執行引擎（DAG 拓撲排序）
  - `WorkflowExecutor` - 節點執行器（並行/超時控制）
  - `NodeRegistry` - 節點類型註冊表
  - 8 種內建節點類型

- 🎨 **視覺化編輯器**
  - `/workflows` 頁面 - 拖拉式工作流編輯
  - `WorkflowCanvas` - 畫布（縮放/平移/連線）
  - `WorkflowSidebar` - 節點面板（分類/拖拽）
  - `WorkflowNode` - 節點元件（連接點/拖拽）
  - `WorkflowNodePanel` - 節點配置面板

- 🔧 **工作流 API**
  - `GET /api/workflows` - 列表
  - `POST /api/workflows` - 建立
  - `PATCH /api/workflows/:id` - 更新
  - `DELETE /api/workflows/:id` - 刪除
  - `POST /api/workflows/:id/execute` - 執行
  - `GET /api/workflows/:id/executions` - 執行歷史

### 節點類型
| 類型 | 說明 |
|------|------|
| `trigger` | 觸發器（手動/定時/Webhook） |
| `agent` | AI 代理（呼叫 LLM） |
| `tool` | 工具（呼叫 MCP） |
| `condition` | 條件分支 |
| `loop` | 迴圈遍歷 |
| `parallel` | 並行執行 |
| `transform` | 資料轉換 |
| `output` | 輸出節點 |

---

## [0.4.0] - 2025-02-02

### 新增
- 🔌 **MCP 核心模組**
  - `MCPClient` - 統一管理多個 MCP Server 連接
  - `MCPServerManager` - Server 生命週期管理
  - `StdioTransport` - 本地 Server 通訊（JSON-RPC over stdio）
  - `SSETransport` - 遠端 Server 通訊（Server-Sent Events）

- 🛒 **MCP 工具市場**
  - `/mcp` 頁面 - 工具市場與已安裝管理
  - `MCPMarketplace` - 瀏覽、搜尋、分類過濾
  - `MCPServerCard` - 工具卡片（安裝/卸載）
  - `MCPInstalledList` - 已安裝工具管理（啟動/停止/配置）

- 🔧 **MCP API**
  - `GET /api/mcp/marketplace` - 市場列表
  - `GET /api/mcp/installed` - 已安裝列表
  - `POST /api/mcp/install/:id` - 安裝工具
  - `DELETE /api/mcp/uninstall/:name` - 卸載工具
  - `GET /api/mcp/:name/tools` - 取得工具列表
  - `POST /api/mcp/:name/tools/:tool/call` - 呼叫工具

### 支援的 MCP Server 類型
- `system` - 系統工具（Filesystem）
- `dev` - 開發工具（GitHub）
- `database` - 資料庫（PostgreSQL）
- `automation` - 自動化（Puppeteer）
- `communication` - 通訊（Slack, Gmail）
- `productivity` - 生產力（Notion, Calendar）

---

## [0.3.0] - 2025-02-02

### 新增
- 🧠 **記憶系統核心**
  - `MemoryManager` - 記憶管理器（存取、搜尋、自動提取）
  - `MemoryStore` 介面 - 可擴展的儲存抽象
  - `SQLiteMemoryStore` - 本地 SQLite 儲存實作
  - `VectorMemoryStore` - 向量資料庫儲存（語意搜尋）
  - `LLMMemoryExtractor` - 使用 LLM 自動提取記憶

- 🎨 **記憶管理介面**
  - `/memories` 頁面 - 記憶列表與管理
  - `MemoryCard` - 記憶卡片（編輯/刪除）
  - `MemoryFilters` - 按類型過濾（事實/偏好/經驗/關係）
  - `MemoryHeader` - 搜尋與新增功能

- 🔌 **記憶 API**
  - `GET /api/memories` - 取得記憶列表
  - `GET /api/memories/search` - 語意搜尋
  - `POST /api/memories` - 新增記憶
  - `PATCH /api/memories/:id` - 更新記憶
  - `DELETE /api/memories/:id` - 刪除記憶

### 記憶類型
- `fact` - 事實（用戶的客觀資訊）
- `preference` - 偏好（喜好與習慣）
- `experience` - 經驗（過往經歷）
- `relationship` - 關係（人物關係）

---

## [0.2.0] - 2025-02-02

### 新增
- 💬 **聊天介面 MVP**
  - `Chat` 主元件（訊息列表 + 輸入框）
  - `ChatMessage` 訊息泡泡（支援用戶/AI 區分）
  - `ChatInput` 輸入框（支援多行、Shift+Enter）
  - `ChatHeader` 頂部導航（主題切換、清除對話）
  - `useChat` Hook（聊天邏輯封裝）
  - `/api/chat` API Route

- 🌙 **主題系統**
  - 亮色/暗色模式切換
  - CSS Variables 設計系統
  - next-themes 整合

---

## [0.1.0] - 2025-02-02

### 新增
- 🏗️ **Monorepo 架構**
  - Turborepo + pnpm workspace 配置
  - apps/web (Next.js 15)
  - apps/api (Hono + Bun)
  - apps/desktop (Tauri 2.0)

- 📦 **Core Package** (`@super/core`)
  - MemoryManager 類別與介面定義
  - AgentRuntime 類別與串流支援
  - MCPClient 基礎架構

- 🎨 **UI Package** (`@super/ui`)
  - Button 元件 (多種 variants)
  - Input 元件
  - Card 元件組

- 🔧 **Shared Package** (`@super/shared`)
  - Zod schemas (Agent, Memory, Message, Workflow)
  - 工具函數 (cn, generateId, formatDate, etc.)

- 🤖 **Claude Skills** (16 個)
  - 開發流程：`/init-module`, `/gen-component`, `/gen-api`
  - 測試品質：`/test`, `/review`, `/typecheck`
  - 部署發布：`/build`, `/release`, `/deploy`
  - UI/UX：`/design-system`, `/gen-page`, `/theme`, `/animate`, `/icons`, `/responsive`, `/a11y`

- 🔌 **MCP Servers 配置**
  - filesystem, github, memory, puppeteer, postgres

### 技術決策
- 選用 React 19 + Next.js 15 (App Router)
- 選用 Hono 作為 API 框架（輕量、快速）
- 選用 Tauri 2.0 取代 Electron（更輕量）
- 選用 shadcn/ui + Radix 作為 UI 基礎

---

## 版本規劃

| 版本 | 目標 | 狀態 |
|------|------|------|
| 0.1.0 | Monorepo 架構 | ✅ 完成 |
| 0.2.0 | 聊天介面 MVP | 🚧 進行中 |
| 0.3.0 | 記憶系統 | 📋 計劃中 |
| 0.4.0 | MCP 整合 | 📋 計劃中 |
| 0.5.0 | Agent 工作流 | 📋 計劃中 |
| 0.6.0 | 通訊整合 (LINE/Telegram) | 📋 計劃中 |
| 0.7.0 | 企業版功能 | 📋 計劃中 |
| 1.0.0 | 正式發布 | 📋 計劃中 |
