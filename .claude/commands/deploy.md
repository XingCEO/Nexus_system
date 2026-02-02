# 部署應用

將應用程式部署到指定環境。

## 執行步驟

1. 確認部署環境和目標
2. 執行建置（如未建置）
3. 執行部署前檢查
4. 部署到目標平台
5. 執行健康檢查
6. 輸出部署報告

## 部署環境

- `dev` - 開發環境
- `staging` - 預發布環境
- `prod` - 生產環境（需額外確認）

## 部署目標

- `vercel` - Vercel（Web 前端）
- `fly` - Fly.io（API 服務）
- `cloudflare` - Cloudflare Workers
- `docker` - Docker 容器
- `tauri` - 桌面應用發布

## 指令選項

- `--skip-build` - 跳過建置步驟
- `--force` - 強制部署（跳過確認）
- `--rollback` - 回滾到上一版本

## 安全檢查

部署到 `prod` 環境時會額外確認：
- 是否已通過所有測試
- 是否已完成 code review
- 是否已更新版本號

## 範例

```
/deploy dev
/deploy staging
/deploy prod vercel
/deploy --rollback prod
```
