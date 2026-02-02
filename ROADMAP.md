# 超級系統 開發路線圖

## 願景
打造一個帶記憶的 AI Agent 編排平台，超越 OpenClaw，成為亞洲市場的首選。

---

## Phase 1: MVP 核心 (v0.2.0)
> 目標：能跑的聊天介面 + 基礎 Agent

### 功能
- [ ] 聊天介面（訊息列表、輸入框、串流回應）
- [ ] 多模型切換（Claude / GPT / Ollama）
- [ ] 對話歷史（本地儲存）
- [ ] 基礎設定頁面

### Skills 使用
- `/gen-page chat` - 生成聊天頁面
- `/gen-component ChatMessage` - 訊息元件
- `/gen-component ChatInput` - 輸入元件
- `/gen-component ModelSelector` - 模型選擇器
- `/gen-api /chat POST` - 聊天 API

---

## Phase 2: 記憶系統 (v0.3.0)
> 目標：AI 能記住用戶，跨會話持久化

### 功能
- [ ] 長期記憶儲存（SQLite + Qdrant）
- [ ] 自動記憶提取（從對話中抽取事實）
- [ ] 記憶檢索（語意搜尋）
- [ ] 記憶管理介面（查看/編輯/刪除）

### Skills 使用
- `/init-module memory-store` - 記憶儲存模組
- `/gen-page memories` - 記憶管理頁面
- `/gen-component MemoryCard` - 記憶卡片
- `/gen-api /memories` - 記憶 CRUD API

---

## Phase 3: MCP 整合 (v0.4.0)
> 目標：AI 能使用外部工具

### 功能
- [ ] MCP Client 完整實作
- [ ] MCP Server 市場（一鍵安裝）
- [ ] 工具呼叫 UI（顯示工具執行過程）
- [ ] 自訂 MCP Server 配置

### Skills 使用
- `/gen-page mcp-market` - MCP 市場頁面
- `/gen-component ToolCallDisplay` - 工具呼叫顯示
- `/gen-api /mcp/servers` - MCP Server 管理 API

---

## Phase 4: Agent 工作流 (v0.5.0)
> 目標：多 Agent 協作、視覺化編排

### 功能
- [ ] 工作流編輯器（拖拉式）
- [ ] 多 Agent 協作
- [ ] 條件分支、循環
- [ ] 工作流模板

### Skills 使用
- `/gen-page workflow-editor` - 工作流編輯器
- `/gen-component WorkflowCanvas` - 畫布
- `/gen-component WorkflowNode` - 節點
- `/gen-api /workflows` - 工作流 API

---

## Phase 5: 通訊整合 (v0.6.0)
> 目標：連接真實世界

### 功能
- [ ] LINE 整合
- [ ] Telegram 整合
- [ ] Discord 整合
- [ ] Email 整合
- [ ] 行事曆整合

---

## Phase 6: 企業版 (v0.7.0)
> 目標：B2B 市場

### 功能
- [ ] 多用戶管理
- [ ] SSO (Google/Microsoft)
- [ ] 審計日誌
- [ ] API 限流
- [ ] 私有部署

---

## Phase 7: 市場生態 (v0.8.0)
> 目標：社群驅動

### 功能
- [ ] Agent 市場
- [ ] 工作流模板市場
- [ ] MCP Server 社群
- [ ] 開發者 API

---

## 里程碑

| 日期 | 版本 | 里程碑 |
|------|------|--------|
| Week 1-2 | v0.2.0 | 聊天 MVP 可用 |
| Week 3-4 | v0.3.0 | 記憶系統上線 |
| Week 5-6 | v0.4.0 | MCP 整合完成 |
| Week 7-8 | v0.5.0 | 工作流編輯器 |
| Week 9-10 | v0.6.0 | 通訊整合 |
| Week 11-12 | v0.7.0 | 企業版 Beta |
| Week 13+ | v1.0.0 | 正式發布 |
