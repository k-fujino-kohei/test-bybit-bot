import requests
from bs4 import BeautifulSoup
import os
import gzip
import datetime
import urllib.request
import pandas as pd

class BacktestData:
  def __init__(
    self,
    symbol: str = 'BTCUSDT',
    from_date: str = '2022-03-01',
    to_date: str = '2022-03-01',
    download_data_dir: str = './data',
    ) -> None:
      self.symbol = symbol
      self.from_date = from_date
      self.to_date = to_date
      self.download_data_dir = download_data_dir

  def download_data_to_csv(self) -> None:
    data_url = f"https://public.bybit.com/trading/{self.symbol}/"
    res = requests.get(data_url)
    if res.status_code != 200:
        raise Exception(f"requests error {res.status_code} {res.json()}")
    interval = "5S"
    soup = BeautifulSoup(res.text, "lxml")
    for link in soup.find_all("a"):
        name = link.get("href")
        if self.from_date != "" and f"{self.symbol}{self.from_date}.csv.gz" > name:
            continue
        if self.to_date != "" and f"{self.symbol}{self.to_date}.csv.gz" < name:
            continue
        fname = f"{self.download_data_dir}/{name}"
        if os.path.exists(fname):
            continue
        data = urllib.request.urlopen(f"{data_url}{name}").read()
        with open(fname, mode="wb") as f:
            f.write(data)
        print(f"Downloaded {name}")
        json = []
        with gzip.open(fname, mode="rt") as fp:
            for index, line in enumerate(fp.read().split("\n")):
                ary = line.split(",")
                if index == 0:
                    continue
                if len(line) == 0:
                    continue
                json.append(
                    {
                        "time": datetime.datetime.fromtimestamp(
                            int(float(ary[0])), datetime.timezone.utc
                        ),
                        "side": ary[2],
                        "size": float(ary[3]),
                        "price": float(ary[4]),
                    }
                )
        df = pd.DataFrame(json)
        df.index = pd.DatetimeIndex(df["time"])
        df.index.names = ["time"]
        df = (
            df.resample(interval).agg(
                {
                    "price": "ohlc",
                    "size": "sum",
                }
            )
        ).fillna(method="bfill")
        df.columns = ["open", "high", "low", "close", "volume"]
        df.index.astype(str)
        df.to_csv(fname.rstrip('.gzip'))
        os.remove(fname)
