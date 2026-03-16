# Ruby-Jam

Ruby-Jam は、JavaScript上で動作するRubyインタプリタです。Webブラウザの中で非同期でRubyコードを実行し、JavaScript環境から呼び出し可能な機能を提供しています。

## デモ
[Ruby-Jam](https://code4fukui.github.io/Ruby-Jam)でデモを確認できます。

## 機能

- Rubyコードの非同期実行
- 変数、関数、ループ、条件分岐などの基本的なRuby構文のサポート
- JavaScriptの関数をRubyコードから呼び出す機能
- 動作検証のためのユニットテスト

## 必要環境

- JavaScriptランタイム (Webブラウザ、Node.js など)

## 使い方

`execRuby`関数がRubyコードの実行エントリーポイントです。以下のパラメータを受け取ります:

- `src`: 実行するRubyコードを文字列で指定
- `opts` (オプション):
  - `funcs`: Rubyコードから呼び出せるJavaScript関数のオブジェクト
  - `abortctrl`: 実行を中断するためのAbortController
  - `output`: Rubyコードの出力を処理する関数 (例: `console.log`)
  - `debug`: デバッグ出力を有効にするフラグ

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

このプロジェクトはMITライセンスの下にあります。