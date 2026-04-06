# React + Vite + TypeScript Bootstrap

React 19、Vite 6、TypeScript（厳密モード）を使用した最新のボートストラップリポジトリです。

## 技術スタック

- **React** 19.0.0
- **Vite** 6.2.0
- **TypeScript** 5.7.3（厳密モード）
- **Biome** 1.9.4（Linter/Formatter）
- **Vitest** 3.2.2（ユニットテスト）
- **Node.js** v24

## セットアップ

### 前提条件

- Node.js v24（.nvmrc で指定）
- npm / yarn / pnpm

### インストール

```bash
npm install
```

nvm を使用している場合：

```bash
nvm use
npm install
```

## npm Scripts

- **`npm run dev`** - 開発サーバーを起動（ホットリロード対応）
- **`npm run build`** - 本番用にビルド
- **`npm run typecheck`** - TypeScript の型チェック
- **`npm run lint`** - コード品質をチェック（Biome）
- **`npm run lint:fix`** - コードを自動修正（Biome）
- **`npm run test`** - ユニットテストを実行
- **`npm run test:coverage`** - テストカバレッジレポートを生成

## プロジェクト構造

```
src/
├── main.tsx          # アプリケーションのエントリーポイント
├── App.tsx           # ルートコンポーネント
├── App.css           - アプリケーションのスタイル
├── App.test.tsx      # テストサンプル
└── index.css         # グローバルスタイル

index.html           # HTML テンプレート
vite.config.ts       # Vite 設定
vitest.config.ts     # Vitest 設定
tsconfig.json        # TypeScript 設定（厳密モード）
biome.json          # Biome 設定
package.json        # プロジェクト依存関係
.nvmrc              # Node.js バージョン指定
```

## TypeScript 厳密モード設定

以下のコンパイラオプションが有効になっています：

- `strict: true` - すべての厳密な型チェックオプション
- `noUncheckedIndexedAccess: true` - インデックスアクセスの型安全性
- `noImplicitOverride: true` - メソッドのオーバーライド時に明示的な `override` キーワード
- `noPropertyAccessFromIndexSignature: true` - インデックスシグネチャ由来のプロパティアクセス禁止

## Biome 設定

自動的にコードのフォーマットと品質チェックが行われます：

- **インデント**: 2 スペース
- **改行コード**: LF
- **引用符**: シングルクォート
- **セミコロン**: 常に付与

## 開発ワークフロー

1. **開発サーバーを起動**

```bash
npm run dev
```

2. **コードを記述**

3. **型チェック**

```bash
npm run typecheck
```

4. **Linter を実行**

```bash
npm run lint
npm run lint:fix  # 自動修正
```

5. **テストを実行**

```bash
npm run test
```

6. **本番用にビルド**

```bash
npm run build
```

## ライセンス

MIT
Agentic Coding
