from backtestData import BacktestData

BacktestData(
  symbol='BTCUSDT',
  from_date='2022-03-11',
  to_date='2022-03-31',
  download_data_dir='../backtest_data'
).download_data_to_csv()