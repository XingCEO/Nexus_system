# 超級系統 - AI 交接文件

> 最後更新：2026-02-02
> 版本：v0.6.0

## 專案概述

**超級系統** 是一個帶記憶的 AI Agent 編排平台，目標是超越 OpenClaw，成為亞洲市場首選。

### 核心定位
- 「你的 AI 分身 — 能記住一切、自主行動、永不休息的數位員工」

---

## 目前進度

### 已完成 (v0.1.0 - v0.6.0)

| 版本 | 功能 | 狀態 |
|------|------|------|
| v0.1.0 | Monorepo 架構 (Turborepo + pnpm) | ✅ |
| v0.2.0 | 聊天介面 MVP | ✅ |
| v0.3.0 | 記憶系統 | ✅ |
| v0.4.0 | MCP 整合 | ✅ |
| v0.5.0 | Agent 工作流 | ✅ |
| v0.6.0 | 會員系統 + 管理後台 + 用量限制 | ✅ |

### 待開發

| 版本 | 功能 | 優先級 |
|------|------|--------|
| v0.7.0 | 通訊整合 (LINE/Telegram/Discord) | 高 |
| v0.8.0 | 企業版 (SSO/多用戶/審計日誌) | 中 |
| v0.9.0 | 市場生態 (Agent/工作流市場) | 中 |
| v1.0.0 | 正式發布 | - |

---

## 專案結構

```
超級系統/
├── .claude/
│   ├── settings.json              # MCP Servers 配置
│   └── commands/                  # 16 個 Claude Skills
│
├── apps/
│   ├── web/                       # Next.js 15 Web App
│   │   ├── src/app/
│   │   │   ├── page.tsx           # 首頁 (Landing)
│   │   │   ├── app/               # 聊天主應用
│   │   │   ├── admin/             # 管理後台 ⭐ NEW
│   │   │   ├── login/             # 登入頁
│   │   │   ├── register/          # 註冊頁
│   │   │   ├── settings/          # 設定頁
│   │   │   ├── memories/          # 記憶管理頁
│   │   │   ├── mcp/               # MCP 市場頁
│   │   │   ├── workflows/         # 工作流編輯頁
│   │   │   └── api/chat/          # Chat API Route
│   │   ├── src/lib/
│   │   │   ├── auth.ts            # 認證系統 (Supabase + localStorage)
│   │   │   ├── admin.ts           # 管理 API ⭐ NEW
│   │   │   └── usage.ts           # 用量追蹤系統 ⭐ NEW
│   │   └── src/components/
│   │       ├── AuthGuard.tsx      # 認證守衛
│   │       ├── UpgradePrompt.tsx  # 升級提示元件 ⭐ NEW
│   │       ├── chat/              # 聊天元件
│   │       ├── memory/            # 記憶元件
│   │       ├── mcp/               # MCP 元件
│   │       └── workflow/          # 工作流元件
│   │
│   ├── api/                       # Hono API 服務
│   └── desktop/                   # Tauri 2.0 (骨架)
│
├── packages/
│   ├── core/                      # 核心引擎
│   ├── ui/                        # UI 元件庫
│   └── shared/                    # 共用模組
│
└── ...
```

---

## 會員系統 (v0.6.0 新增)

### 會員等級

| 等級 | 名稱 | 每日訊息 | 工作流 | Agent | MCP 工具 | 權限 |
|------|------|----------|--------|-------|----------|------|
| `free` | 免費版 | 50 則 | 1 個 | 1 個 | 3 個 | `['basic']` |
| `pro` | 專業版 | 無限 | 10 個 | 5 個 | 全部 | `['basic', 'workflows', 'agents']` |
| `enterprise` | 企業版 | 無限 | 無限 | 無限 | 全部 | 完整 |
| `internal` | 內部測試 | 無限 | 無限 | 無限 | 全部 | `['admin', 'all']` |

### 測試帳號

| Email | 密碼 | 等級 | 說明 |
|-------|------|------|------|
| `admin@nexus.ai` | `nexus2026` | internal | 管理員，可訪問 /admin |
| `demo@nexus.ai` | `demo123` | pro | 展示帳號 |

### 認證流程

```typescript
// 登入
import { signIn, signOut, getCurrentUser, hasPermission } from '@/lib/auth'

const { success, user } = await signIn(email, password)

// 權限檢查
if (hasPermission(user, 'admin')) {
  // 可訪問管理後台
}

// 登出
await signOut()
```

### 用量追蹤

```typescript
import { checkMessageLimit, incrementMessageCount, getUsageSummary } from '@/lib/usage'

// 檢查限制
const result = checkMessageLimit(user)
if (!result.allowed) {
  // 顯示升級提示
}

// 增加計數
incrementMessageCount()

// 取得完整用量摘要
const summary = getUsageSummary(user)
```

---

## 管理後台 (/admin)

### 功能

1. **總覽面板**
   - 會員總數統計
   - 今日新增會員數
   - 付費會員數
   - 各等級分佈圖

2. **會員管理**
   - 會員列表（搜尋/篩選）
   - 變更會員等級
   - 設定到期日
   - 刪除帳號

### 權限控制

- 僅 `internal` 等級或擁有 `admin` 權限可訪問
- 使用 `AuthGuard` + `hasPermission('admin')` 檢查
- 無權限自動重導向到 `/app`

---

## 技術棧

| 層級 | 技術 |
|------|------|
| **前端** | Next.js 15, React 19, Tailwind CSS, Framer Motion |
| **後端** | Hono (Bun), Zod |
| **認證** | Supabase Auth (生產) / localStorage (開發) |
| **桌面** | Tauri 2.0 (Rust) |
| **資料庫** | SQLite, Qdrant (向量) |
| **UI** | shadcn/ui, Radix UI, Lucide Icons |
| **工具** | Turborepo, pnpm, TypeScript 5.7 |

---

## 頁面路由

| 路徑 | 功能 | 權限 |
|------|------|------|
| `/` | Landing Page | 公開 |
| `/login` | 登入 | 公開 |
| `/register` | 註冊 | 公開 |
| `/app` | 聊天介面 | 需登入 |
| `/memories` | 記憶管理 | 需登入 |
| `/mcp` | MCP 工具市場 | 需登入 |
| `/workflows` | 工作流編輯器 | 需登入 |
| `/settings` | 設定 | 需登入 |
| `/admin` | 管理後台 | 需 admin 權限 |

---

## 重要檔案 (v0.6.0)

| 檔案 | 說明 |
|------|------|
| `src/lib/auth.ts` | 認證系統（登入/註冊/權限檢查） |
| `src/lib/admin.ts` | 管理 API（用戶列表/更新/刪除） |
| `src/lib/usage.ts` | 用量追蹤系統（限制檢查） |
| `src/app/admin/page.tsx` | 管理後台頁面 |
| `src/components/AuthGuard.tsx` | 認證守衛元件 |
| `src/components/UpgradePrompt.tsx` | 升級提示元件 |
| `src/middleware.ts` | 路由保護中間件 |

---

## 啟動指令

```bash
# 安裝依賴
cd /Users/xuser/Documents/超級系統
pnpm install

# 開發模式
pnpm dev

# 建置
pnpm build

# 測試
pnpm test
```

---

## 待完成事項

### 高優先級
1. [ ] 整合真實 LLM API (Claude/OpenAI)
2. [ ] 實作向量資料庫 (Qdrant) 整合
3. [ ] 完善 MCP Server 實際連接
4. [ ] 工作流執行與 Agent/MCP 整合
5. [ ] Supabase 生產環境配置

### 中優先級
1. [ ] 通訊整合 (LINE/Telegram)
2. [ ] 付款系統整合 (Stripe)
3. [ ] 桌面應用 (Tauri) 完善

### 低優先級
1. [ ] Agent 市場
2. [ ] 工作流模板市場
3. [ ] 企業版功能 (SSO/審計)

---

## 交接須知

1. **認證系統雙模式** — Supabase (生產) + localStorage (開發)
2. **用量追蹤儲存於 localStorage** — key: `nexus_usage`
3. **測試帳號不可持久化修改** — 設計如此
4. **API 目前為模擬資料** — 需整合真實 LLM 和資料庫
5. **桌面應用建置有無限迴圈問題** — Tauri 配置需修復

---

*此文件由 Claude 自動生成，用於 AI 交接*
