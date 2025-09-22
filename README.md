# Astris — HoyoVerse 攻略サイト（仕様駆動）

SvelteKit + Bits UI + UnoCSS を採用した攻略サイトプロジェクトです。最小構成でセットアップ済みです。

## 技術スタック
- SvelteKit 2
- Bits UI（ヘッドレス UI コンポーネント）
- UnoCSS（原子的ユーティリティ。Tailwind は未使用）

## 開発
```sh
npm i
npm run dev
```

## ビルド
```sh
npm run build
npm run preview
```

---

## 初期仕様（v0）
仕様駆動で段階的に拡張します。以下は最初の到達点です。

### 1. 画面構成
- ホーム（/）
  - プロジェクト概要、主要機能カード、CTA ボタン
- 仕様ページ（/spec）
  - 本仕様の詳細テキスト（後続で実装）

### 2. 機能一覧（最小）
- UI 基盤：Bits UI の導入確認（Button を利用）
- スタイル：UnoCSS のプリセット（presetUno）＋ reset 適用
- テーマカラー：brand.primary, brand.secondary（violet/cyan）

### 3. 情報設計（将来拡張の方向性）
- データモデル（例）
  - Character: id, name, element, weapon, rarity, skills, builds
  - Weapon: id, name, type, rarity, stats
  - Relic/Artifact: id, name, set, rarity, effects
- コンテンツ
  - ガイド記事（Markdown ベース or CMS 連携）
  - ビルドシミュレーター（簡易 → 高度化）

### 4. UI コンポーネント方針
- Bits UI をベースに、UnoCSS で薄く装飾
- 共通コンポーネント例
  - Button, Card, Dialog/Modal, Tabs, Tooltip, Combobox など

### 5. タスク（次のステップ）
- /spec ページ作成と仕様本文の充実
- キャラクター/武器などの型定義（src/lib/schemas）
- データの読み込み方法検討（ローカル JSON → API / CMS）
- ルーティング（/characters, /weapons, /artifacts）と一覧/詳細の雛形

---

## セットアップの実装メモ
- Vite: UnoCSS プラグインを有効化
- CSS: `@unocss/reset/tailwind.css` を利用
- ショートカット例: `btn`, `card`, `container` を `uno.config.ts` に定義
- ホームで Bits UI の Button を試用
