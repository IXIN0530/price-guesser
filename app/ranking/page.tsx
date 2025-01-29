"use client"

import functions from "@/components/functions";
import { globalRankingType } from "@/type";
import axios from "axios";
import { param } from "framer-motion/m";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import GRankElement from "@/components/ranking/GRankElement";

export default function Page() {
  //現在表示するランキングのデータ
  const [rankingData, setRankingData] = useState<globalRankingType[]>([]);
  //現在のパラメータ
  const date = new Date();
  //getAll==0...日付文だけ 1...全て取得
  const [params, setParams] = useState<Params>({ date: date, getAll: 0 });
  // 一度取得したデータを保存しておく.
  // const [fetchedData, setFetchedData] = useState<FetchedData[]>([]);
  const fetchedData = useRef<FetchedData[]>([])
  //初回マウント
  const didMount = useRef(false);
  //データの取得中かどうか
  const isFetching = useRef(false);

  const { compareDate } = functions();

  //データがすでに取得されてるかを確認するための関数
  const isFetched = (p: Params) => {
    var returnData: FetchedData | null = null;
    const _fetchedData = [...fetchedData.current]
    _fetchedData.forEach(e => {
      //全てのデータが一旦Fetchされた時
      if (e.date == null && p.getAll == 1) {
        returnData = e;
      }
      else if (e.date != null) {
        if (compareDate(e.date, p.date)) {
          // console.log("どちらも" + p.date.getDate())
          returnData = e;
        }
      }
    });
    return returnData;
  }

  //n日進む(戻る)ボタンが押された時の処理
  const changeDate = (num: number) => {
    //新規でインスタンスを作る。
    const nowDate = new Date(params.date);
    //n日進める
    nowDate.setDate(nowDate.getDate() + num);
    //新しいparamとしてdataFetchを呼び出す
    //ただし、前のdatafetchの呼び出しが完了してからに限る
    if (!isFetching.current) {
      //未来に行こうとした場合
      if (nowDate > date) {
        alert("未来のデータは取得できません。")
        return;
      }
      dataFetch({
        date: nowDate,
        getAll: 0
      })
      setParams({
        date: nowDate,
        getAll: 0
      })
    }
    else {
      alert("ただいまデータの取得中です。")
    }
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
      if (isFetched(params) != null) {
        console.log("すでに取得済みでした")
        const temp: FetchedData = isFetched(params)!
        // console.log(temp);
        setRankingData(temp.data);
        isFetching.current = false;
        return;
      }
      const res = await axios.get("/api/database", { params: query });
      isFetching.current = false;
      const res_data: globalRankingType[] = res.data["data"]
      //表示データに格納
      setRankingData(res_data);
      //取得済みデータに格納
      fetchedData.current = [...fetchedData.current,
      {
        date: params.getAll == 1 ? null : params.date,
        data: res_data,
      }
      ]

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
    <div className="min-h-[100svh]  mx-2 relative">
      <div className=" grid grid-rows-11 max-w-[1000px] mx-auto absolute inset-0">
        <div className="row-span-1 my-auto  text-xl flex flex-col justify-center">
          <p className="text-xl text-center font-bold">ランキング</p>
          <p className="text-lg text-center">{params.date.getFullYear() + "年" + params.date.getMonth() + 1 + "月" + params.date.getDate() + "日"}</p>
        </div>
        <div className="row-span-1 flex flex-row justify-center gap-2 my-2">
          <button onClick={() => changeDate(-1)} className="px-3 bg-gradient-to-br from-orange-400 to-orange-300 rounded-lg shadow-lg text-white font-bold text-xl">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button onClick={() => changeDate(1)} className="px-3 bg-gradient-to-br from-orange-400 to-orange-300 rounded-lg shadow-lg text-white font-bold text-xl">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
        <div className=" relative row-span-7 items-center overflow-y-scroll border-2 border-orange-300 bg-gradient-to-br from-orange-100 to-orange-50 ">
          <div className=" absolute inset-0">
            {rankingData.map((score, index) => {
              return (
                <GRankElement scoreData={score} index={index} key={index} />
              )
            })}
          </div>
        </div>
        <div className="row-span-2 my-auto">
          <Link href={"./"} className=" flex flex-row justify-center gap-1 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            <p className="text-xl">Back</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
type Params = {
  date: Date,
  getAll: number,
}

type FetchedData = {
  // nullの時は今まで全てのデータのこと
  date: Date | null,
  data: globalRankingType[]
}