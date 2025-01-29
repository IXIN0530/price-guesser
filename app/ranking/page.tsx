"use client"

import functions from "@/components/functions";
import { globalRankingType } from "@/type";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

export default function Page() {
  //現在表示するランキングのデータ
  const [rankingData, setRankingData] = useState<globalRankingType[]>([]);
  //現在のパラメータ
  const date = new Date();
  //getAll==0...日付文だけ 1...全て取得
  const [params, setParams] = useState<Params>({ date: date, getAll: 1 });
  // 一度取得したデータを保存しておく.
  const [fetchedData, setFetchedData] = useState<FetchedData[]>([]);
  //初回マウント
  const didMount = useRef(false);
  //データの取得中かどうか
  const isFetching = useRef(false);

  const { compareDate } = functions();

  //データがすでに取得されてるかを確認するための関数
  const isFetched = (p: Params) => {
    var isFetched = false;
    fetchedData.forEach(e => {
      //全てのデータが一旦Fetchされた時
      if (e.day == null && p.getAll == 1) {

      }
    });
  }

  const dataFetch = async (params: Params) => {
    isFetching.current = true;
    //paramsの中から送信すべき情報を取得してqueryとして送る
    const query = {
      year: params.date.getFullYear(),
      month: params.date.getMonth() + 1,
      day: params.date.getDate(),
      getAll: params.getAll
    };

    //データの取得に成功
    try {
      //一度もデータを取得していなかった場合、取得しにいく

      const res = await axios.get("/api/database", { params: query });
      isFetching.current = false;
      const res_data: globalRankingType[] = res.data["data"]
      //表示データに格納
      setRankingData(res_data);
      //取得済みのデータに格納
      setFetchedData([...fetchedData, {
        day: params.getAll == 1 ? null : params.date,
        data: res_data,
      }]);

      console.log(res_data);
    }
    catch (error) {
      isFetching.current = false;
      alert(error);
    }
  }
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      dataFetch(params);
    }
  }, [])
  return (
    <div>
      <h1>Ranking</h1>
    </div>
  )
}

type Params = {
  date: Date,
  getAll: number,
}

type FetchedData = {
  // nullの時は今まで全てのデータのこと
  day: Date | null,
  data: globalRankingType[]
}