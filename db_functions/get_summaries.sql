DROP TYPE IF EXISTS type_get_summaries CASCADE;
CREATE TYPE type_get_summaries AS (
  ts TIMESTAMPTZ
  ,open float
  ,high float
  ,low float
  ,close float
  ,sell_volume float
  ,buy_volume float
  ,oi float
  ,sell_liq_size float
  ,buy_liq_size float
);

CREATE OR REPLACE FUNCTION public.get_summaries (
  p_from_datetime TIMESTAMPTZ
  ,p_to_datetime TIMESTAMPTZ
  ,p_unit TEXT
  ,p_gen_interval INTERVAL
)
RETURNS SETOF type_get_summaries AS $FUNCTION$
begin
return QUERY
select
ts
-- closeがnullのときはnullではない前回の値を取得する
,coalesce(open, max(open) over (partition by open_count), 0::float) open
,coalesce(high, max(high) over (partition by high_count), 0::float) high
,coalesce(low, max(low) over (partition by high_count), 0::float) low
,coalesce(close, max(close) over (partition by open_count), 0::float) close
,sell_volume
,buy_volume
-- oiがnullのときはnullではない前回の値を取得する
,coalesce(oi, max(oi) over (partition by oi_count), 0::float) oi
,sell_liq_size
,buy_liq_size
from (
  select
  distinct
  ts
  ,hl.high
  ,count(hl.high) over (order by ts) as high_count
  ,hl.low
  ,oc.open
  ,count(oc.open) over (order by ts) as open_count
  ,oc.close
  ,coalesce(buy_sell_volume.sell_volume, 0::float) sell_volume
  ,coalesce(buy_sell_volume.buy_volume, 0::float) buy_volume
  ,open_interest.oi oi
  ,count(open_interest.oi) over (order by ts) as oi_count
  ,coalesce(liq.sell_liq_size, 0::float) sell_liq_size
  ,coalesce(liq.buy_liq_size, 0::float) buy_liq_size
  from
  generate_series(date_trunc(p_unit, p_from_datetime), date_trunc(p_unit, p_to_datetime), p_gen_interval) as ts
  left outer join (
    select
      sum(case when side = 'Sell' then size end) sell_volume
      ,sum(case when side = 'Buy' then size end) buy_volume
      ,date_trunc(p_unit, timestamp) AS time
    from
      trade
    where
      timestamp BETWEEN p_from_datetime AND p_to_datetime
    group by
      date_trunc(p_unit, timestamp)
    order by
      time
  ) as buy_sell_volume
    on buy_sell_volume.time = ts
  left outer join (
    select
      max(price) as high
      ,min(price) as low
      ,date_trunc(p_unit, timestamp) AS time
    from
      trade
    where
      timestamp BETWEEN p_from_datetime AND p_to_datetime
    group by
      date_trunc(p_unit, timestamp)
    order by
      time
  ) as hl
    on hl.time = ts
  left outer join (
    select distinct
      first_value(price) over (partition by row_number) as open
      ,last_value(price) over (partition by row_number) as close
      ,date_trunc(p_unit, timestamp) time
    from (
      select
        price
        ,max(timestamp) over(partition by date_trunc(p_unit, timestamp)) row_number
        ,timestamp
      from
        trade
      where
        timestamp BETWEEN p_from_datetime AND p_to_datetime
      order by
        timestamp
    ) as pre_oc
  ) as oc
    on oc.time = ts
  left outer join (
    select
      last_value(value) over (order by date_trunc(p_unit, oi.timestamp)) as oi
      ,date_trunc(p_unit, oi.timestamp) as time
    from
      oi
    where
      timestamp BETWEEN p_from_datetime AND p_to_datetime
    group by
      value
      ,time
    order by
      time
  ) as open_interest
    on open_interest.time = ts
  left outer join (
    select
      sum(case when side = 'Sell' then qty end) over (partition by date_trunc(p_unit, timestamp)) sell_liq_size
      ,sum(case when side = 'Buy' then qty end) over (partition by date_trunc(p_unit, timestamp)) buy_liq_size
      ,date_trunc(p_unit, timestamp) AS time
    from
      liquidation
    where
      timestamp BETWEEN p_from_datetime AND p_to_datetime
  ) as liq
    on liq.time = ts
  where
      ts BETWEEN p_from_datetime AND p_to_datetime
  order by
    ts
) as t1
;

END;
$FUNCTION$ LANGUAGE plpgsql;
