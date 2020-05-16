# SimpleLodiFrontend

[Simple LODI](https://github.com/uedayou/simplelodi)のHTMLレンダリングで使用しているソースコードです。
React による シングルページアプリケーション として作成しています。

このアプリは、Simple LODI以外でもRDF(Turtleファイルのみ)をHTMLとして表示することができます。
また、CORSに対応するLODサイトのRDFデータも対応します。

<div align="center">
<img src="https://uedayou.net/simple-lodi-frontend-demo.jpg" width="500px" />
</div>
<div style="text-align: center;">表示例</div>

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

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
