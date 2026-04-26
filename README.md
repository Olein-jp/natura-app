# Natura Tools

Natura Tools は、クライミングの「ツアー」形式の課題記録を行うための小さな Web アプリです。級、課題範囲、上限トライ数、制限時間を設定し、各課題の完登・未完登とトライ数を記録できます。

現在は「ツアー管理サービス」を中心に構成されています。

## 主な機能

- 級ごとの課題セットを選択
  - `7~8Q 20課題`
  - `5~6Q 25課題`
  - `4Q 30課題`
  - `3Q 30課題`
  - `2Q 30課題`
- 取り組む課題の選択
  - 全課題
  - 指定範囲
  - 指定した課題のみ
  - ランダム抽出
- ツアー記録
  - 残り時間のカウントダウン
  - 課題ごとのトライ数の増減
  - 完登・未完登の記録
  - 未入力課題がある場合の確認ダイアログ
- 結果表示
  - 完登数、未完登数、未入力数
  - 合計トライ数
  - 経過時間、残り時間
  - 課題別の結果一覧
- 履歴管理
  - ブラウザの `localStorage` にツアー履歴を保存
  - 過去の履歴の一覧・詳細表示
  - 履歴の削除

## 技術構成

- React 19
- TypeScript
- Vite
- CSS によるスタイリング

状態管理は React の `useState` を中心にしたシンプルな構成です。ツアー履歴は外部 API やデータベースではなく、ブラウザの `localStorage` に保存されます。

## セットアップ

```bash
npm install
```

## 開発サーバーの起動

```bash
npm run dev
```

Vite の開発サーバーが起動します。表示されたローカル URL をブラウザで開いて確認してください。

## ビルド

```bash
npm run build
```

TypeScript のビルドチェックを行ったあと、Vite で本番用ファイルを生成します。

## ビルド結果のプレビュー

```bash
npm run preview
```

`npm run build` で生成した本番ビルドをローカルで確認できます。

## ディレクトリ構成

```text
.
├── index.html
├── package.json
├── src
│   ├── App.tsx
│   ├── main.tsx
│   ├── styles.css
│   ├── types.ts
│   ├── components
│   │   ├── AppHeader.tsx
│   │   └── StatPill.tsx
│   └── features
│       ├── history
│       │   ├── HistoryPage.tsx
│       │   └── historyStorage.ts
│       ├── home
│       │   └── HomePage.tsx
│       └── tour
│           ├── TourRecordPage.tsx
│           ├── TourResultPage.tsx
│           ├── TourSetupPage.tsx
│           └── problemData.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

## 主要ファイル

- `src/App.tsx`
  - 画面遷移、ツアー設定、結果、履歴の状態を管理するアプリ全体の中心です。
- `src/features/home/HomePage.tsx`
  - トップ画面です。現在はツアー管理サービスへの入口を表示します。
- `src/features/tour/TourSetupPage.tsx`
  - ツアー開始前の設定画面です。級、課題選択方法、上限トライ数、制限時間を設定します。
- `src/features/tour/TourRecordPage.tsx`
  - ツアー中の記録画面です。タイマーを進めながら、課題ごとのトライ数と結果を入力します。
- `src/features/tour/TourResultPage.tsx`
  - ツアー終了後の結果画面です。集計値と課題別結果を表示します。
- `src/features/history/HistoryPage.tsx`
  - 保存済みツアー履歴の一覧と詳細を表示します。
- `src/features/history/historyStorage.ts`
  - `localStorage` への保存・読み込みを担当します。
- `src/features/tour/problemData.ts`
  - 級ごとの課題数と表示色を定義します。
- `src/types.ts`
  - 級、課題状態、ツアー設定、履歴などの共通型を定義します。

## 画面の流れ

1. トップ画面で「ツアー管理サービス」を選択します。
2. ツアー設定画面で、級、課題、上限トライ数、制限時間を設定します。
3. 記録画面で、各課題のトライ数と完登・未完登を入力します。
4. ツアー終了後、結果画面で集計と課題別結果を確認します。
5. 保存された結果は履歴画面から確認・削除できます。

## データ保存について

ツアー履歴はブラウザの `localStorage` に、キー `natura-tour-histories` で保存されます。

そのため、同じブラウザ・同じ端末では履歴が残りますが、別の端末や別のブラウザには共有されません。ブラウザのサイトデータを削除した場合、履歴も削除されます。

## 補足

このプロジェクトはまだシンプルなフロントエンドアプリです。今後機能を広げる場合は、ユーザー管理、クラウド保存、集計グラフ、課題データの外部管理などを追加しやすい構成にしていくとよさそうです。
