# 版本發布

執行版本發布流程，包含版本號更新、Changelog 生成、Git Tag。

## 執行步驟

1. 檢查當前分支狀態（確保乾淨）
2. 分析 commits 確定版本類型
3. 更新 package.json 版本號
4. 生成 CHANGELOG.md
5. 建立 Git commit 和 tag
6. 推送到遠端（可選）

## 版本類型

- `patch` - 修復 bug（1.0.0 → 1.0.1）
- `minor` - 新功能（1.0.0 → 1.1.0）
- `major` - 破壞性變更（1.0.0 → 2.0.0）
- `auto` - 根據 commits 自動判斷（預設）

## Commit 規範（Conventional Commits）

- `feat:` → minor
- `fix:` → patch
- `BREAKING CHANGE:` → major

## 指令選項

- `--dry-run` - 預覽但不執行
- `--push` - 發布後自動推送
- `--prerelease <tag>` - 預發布版本（alpha, beta, rc）

## 範例

```
/release
/release minor
/release --dry-run
/release major --push
/release --prerelease beta
```
