# 生成 API 路由

根據用戶需求生成 API 端點，包含完整的型別定義和驗證。

## 執行步驟

1. 詢問 API 路徑和 HTTP 方法（如未提供）
2. 確認 API 位置（預設：`apps/api/src/routes/`）
3. 建立以下檔案：
   - `routeName.ts` - 路由處理器
   - `routeName.schema.ts` - Zod 驗證 schema
   - `routeName.test.ts` - API 測試
4. 更新路由註冊（如需要）

## API 規範

- 使用 Hono 框架
- 使用 Zod 進行請求/回應驗證
- 統一錯誤處理格式
- 自動生成 OpenAPI 文檔註解

## 回應格式

```typescript
// 成功
{ success: true, data: T }

// 錯誤
{ success: false, error: { code: string, message: string } }
```

## 範例

```
/gen-api /agents GET
/gen-api /agents/:id/memory POST
/gen-api /workflows/:id/execute POST
```
