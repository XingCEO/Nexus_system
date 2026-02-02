# 型別檢查

執行 TypeScript 型別檢查並報告錯誤。

## 執行步驟

1. 執行 `tsc --noEmit` 或 `bun check`
2. 收集所有型別錯誤
3. 按嚴重程度分類
4. 提供修復建議

## 指令選項

- `--fix` - 嘗試自動修復簡單問題
- `--strict` - 使用更嚴格的檢查規則
- `--path <dir>` - 只檢查特定目錄

## 輸出格式

```
## 型別檢查報告

總計：X 個錯誤，Y 個警告

### 錯誤列表
1. [檔案:行號] 錯誤訊息
   建議修復：...
```

## 範例

```
/typecheck
/typecheck --fix
/typecheck --path packages/core
```
