# SimpleLodiFrontend

[Simple LODI](https://github.com/uedayou/simplelodi)のHTMLレンダリングで使用しているソースコードです。
React による シングルページアプリケーション として作成しています。

このアプリは、Simple LODI以外でもRDF(Turtleファイルのみ)をHTMLとして表示することができます。
また、CORSに対応するLODサイトのRDFデータも対応します。

<p align="center">
<img src="https://uedayou.net/simple-lodi-frontend-demo.jpg" width="500px" />
<br />
表示例
</p>

デモサイト:  
<https://uedayou.net/simple-lodi-frontend/>  
`window.uri = "http://uedayou.net/loa/東京都千代田区永田町一丁目1";`を指定しています。  

以下のサイトについて、表示できることを確認しています。

- DBpedia  
<http://dbpedia.org/>

- DBpedia日本語版  
<http://ja.dbpedia.org/>

- Wikidata  
<https://www.wikidata.org/>

- Linked Open Addresses Japan  
<http://uedayou.net/loa/>

- その他Simple LODIで作成されたサイト  
<http://uedayou.net/simplelodi/uedayou>

表示方法は、`index.html` に `window.uri` を定義して、URLを代入してください。

```
<script>
// [DBpedia]
// window.uri = "http://dbpedia.org/resource/Tokyo_Station";
// [DBpedia Japanese]
// window.uri = "http://ja.dbpedia.org/data/東京駅.ttl";
// [Wikidata]
// window.uri = "https://www.wikidata.org/wiki/Special:EntityData/Q283196";
// [Linked Open Addresses Japan]
// window.uri = "http://uedayou.net/loa/東京都千代田区永田町一丁目";
// window.uri = "http://uedayou.net/loa/東京都千代田区";
// [Simple LODI Demo]
window.uri = "http://uedayou.net/simplelodi/uedayou";
</script>
```

DBpedia日本語版, Wikidata については、以下のようにURIを変更してください

#### DBpedia日本語版

```
http://ja.dbpedia.org/recouse/東京駅
```
↓
```
http://ja.dbpedia.org/data/東京駅.ttl
```

#### Wikidata

```
http://www.wikidata.org/entity/Q283196
```
↓
```
https://www.wikidata.org/wiki/Special:EntityData/Q283196
```

## インストール方法

```
$ npm install
```

## ビルド方法

```
$ npm run build
```

## デバッグ

```
$ npm start
```

`src/conf.ts` の `DEBUG_MODE` を `true` にすると [Linked Open Addresses Japan](https://uedayou.net/loa/) を利用して表示を確認することもできます。

```src/conf.ts
// for debug
const DEBUG_MODE: boolean = true;
const DEBUG_REPLACE_URL: string = "https://uedayou.net/loa/";
const DEBUG_REPLACE_HOSTNAME: string | null = null;
```
