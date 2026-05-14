# Ruby-Jam

Ruby-Jam は、Webアプリケーションに組み込むことができる JavaScript ベースの Ruby インタプリタです。

## 機能

- Ruby コードの非同期実行
- 変数、関数、ループ、条件分岐などの基本的な Ruby 構文と構造のサポート
- JavaScript 環境から Ruby コード内で呼び出せる関数を渡す機能
- インタプリタの動作を検証するためのユニットテストを同梱

## 要件

- モダンWebブラウザや Node.js などの JavaScript ランタイム

## 使い方

`execRuby` 関数は Ruby コードを実行するための主要なエントリポイントです。以下のパラメータを受け取ります:

- `src`: 実行する Ruby コードの文字列。
- `opts` (オプション):
  - `funcs`: Ruby コードから呼び出せる JavaScript 関数を含むオブジェクト。
  - `abortctrl`: 実行を中断するための `AbortController` インスタンス。
  - `output`: Ruby コードからの出力を処理する関数（例: `console.log`）。
  - `debug`: デバッグ出力を有効にする boolean フラグ。

使用例:

```javascript
import { execRuby } from "./execRuby.js";

const funcs = {
  myFunction: (arg) => console.log(`Called with argument: ${arg}`),
};

const output = (s) => console.log(s);

const result = await execRuby(`
  myFunction("hello")
  puts "Ruby code executed successfully!"
`, { funcs, output });
```

## ライセンス

MIT License — 詳細は [LICENSE](LICENSE) を参照してください。
