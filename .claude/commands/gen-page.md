# 生成頁面

根據需求生成完整的頁面，包含佈局、元件組合和響應式設計。

## 執行步驟

1. 詢問頁面類型和需求
2. 選擇頁面模板
3. 生成頁面結構
4. 組合所需元件
5. 添加響應式斷點
6. 配置 SEO metadata

## 頁面類型

| 類型 | 說明 |
|------|------|
| `landing` | 行銷著陸頁 |
| `dashboard` | 儀表板頁面 |
| `auth` | 登入/註冊頁 |
| `settings` | 設定頁面 |
| `list` | 列表/表格頁 |
| `detail` | 詳情頁面 |
| `chat` | 聊天介面 |
| `editor` | 編輯器頁面 |

## 頁面規範

- 使用 App Router（Next.js 15）
- Server Components 優先
- 響應式：mobile-first
- 無障礙：WCAG 2.1 AA

## 指令選項

- `--layout <name>` - 指定佈局
- `--with-loading` - 添加 loading.tsx
- `--with-error` - 添加 error.tsx
- `--mobile-only` - 僅手機版

## 範例

```
/gen-page dashboard
/gen-page chat --layout sidebar
/gen-page settings --with-loading --with-error
```
