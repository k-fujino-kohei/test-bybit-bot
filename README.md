# test-bybit-bot
bybitのテスト口座のbot

```
サービスアカウントやAPIKeyなどの個人情報はサンプルなので実際にはリポジトリに含めないようにしてください
```

https://testnet.bybit.com/
`API_KEY: MFaUn93Pa2dXTQm1aR`

APIトークンは適宜変更すること

## 環境変数
開発環境の環境変数は`.env`に記述する。

本番環境は`.env.prod`に記述すること。

## GCEに接続する

GCEに接続する
``` sh
ssh -i ~/.ssh/keys/bybit-api-gce -p 7130 KoheiFujino@34.83.145.156
```

sftpでファイルを転送する
``` sh
sftp -i ~/.ssh/keys/bybit-api-gce -P 7130 KoheiFujino@34.83.145.156
put crawl.js
```

## DB

DBは[supabase](https://app.supabase.io/)を使用している

DBのURL

```
# .env
DB_URL=http://localhost:54321
```

ローカルDBを立ち上げる([ダッシュボード](http://localhost:54325))

``` sh
supabase start
```

## DBのデータをCSVに変換してGoogleDriveにアップロードする

### ローカルで実行する
``` sh
yarn download
```

### CloudFunctionsにデプロイする

``` sh
yarn download:deploy
```

## Usage

### バックテストを実行する

``` sh
yarn backtest
```


### ローカルで実行する

``` sh
yarn debug
```

### デプロイする

``` sh
yarn deploy
```

## Design

### Domains
どこにも依存しない。

型定義、データ取得のインターフェース、テクニカル指標の計算などが置いてある

### Infrastructure
Domainsに依存。

Domainsのインターフェースを実装してデータを取得するロジックがある。

### Usecase
Domainsに依存。

実際にトレードをするロジックがある。

### App
エントリーポイント。

UsecaseにInfrastructureを注入してシステムを動かす。

## Tips

### データの取得元を変更したい
Domainsのインターフェースを実装したInfrastructureを新しく作成する。


### バックテストをしたい

1. データを取得する
取得するデータの日時は`main.py`を編集する。
``` sh
python ./python/main.py
```

2. テストを実行する
テストする期間やロジックを変更する場合は`backtest.ts`を編集する
``` sh
yarn backtest
```
