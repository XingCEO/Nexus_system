# 初始化模組

根據用戶提供的模組名稱，建立完整的模組骨架。

## 執行步驟

1. 詢問模組名稱和類型（如未提供）
2. 在 `packages/` 或 `apps/` 目錄下建立模組資料夾
3. 建立以下檔案結構：
   - `src/index.ts` - 模組入口
   - `src/types.ts` - 型別定義
   - `package.json` - 套件配置
   - `tsconfig.json` - TypeScript 配置
   - `README.md` - 模組說明
4. 更新根目錄的 workspace 配置（如需要）

## 模組類型

- `core` - 核心引擎模組（放在 packages/core/）
- `ui` - UI 元件模組（放在 packages/ui/）
- `plugin` - 插件模組（放在 packages/plugins/）
- `app` - 應用程式（放在 apps/）

## 範例

```
/init-module memory-engine core
/init-module chat-widget ui
```
