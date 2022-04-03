# test-bybit-bot
bybitのテスト口座のbot

https://testnet.bybit.com/
`API_KEY: MFaUn93Pa2dXTQm1aR`

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