# 建置專案

執行完整的專案建置流程。

## 執行步驟

1. 清理舊的建置產物
2. 執行型別檢查
3. 執行 lint 檢查
4. 編譯 TypeScript
5. 打包應用程式（Vite / Turbopack）
6. 輸出建置報告

## 建置目標

- `web` - Web 應用程式
- `desktop` - 桌面應用程式（Tauri）
- `api` - API 服務
- `all` - 所有目標（預設）

## 指令選項

- `--prod` - 生產環境建置（預設）
- `--dev` - 開發環境建置
- `--analyze` - 分析 bundle 大小
- `--skip-checks` - 跳過型別和 lint 檢查

## 輸出

```
## 建置報告

✅ 型別檢查通過
✅ Lint 檢查通過
✅ 編譯完成

📦 產物大小：
- web: 1.2 MB (gzip: 380 KB)
- desktop: 45 MB
```

## 範例

```
/build
/build web --analyze
/build desktop --dev
```
