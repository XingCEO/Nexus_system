# 執行測試

執行專案測試並生成覆蓋率報告。

## 執行步驟

1. 檢測專案使用的測試框架（Vitest / Jest / Bun）
2. 執行測試命令
3. 分析測試結果
4. 如有失敗，提供修復建議

## 測試類型

- `unit` - 單元測試（預設）
- `integration` - 整合測試
- `e2e` - 端對端測試
- `all` - 所有測試

## 指令選項

- `--coverage` - 生成覆蓋率報告
- `--watch` - 監聽模式
- `--filter <pattern>` - 篩選特定測試
- `--update-snapshots` - 更新快照

## 範例

```
/test
/test --coverage
/test unit --filter memory
/test e2e
```
