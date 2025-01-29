"use client"
import LRankElement from "@/components/ranking/LRankElement";
import { LocalRankingType } from "@/type";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
const Home = () => {
  //初回マウントの確認
  const didMount = useRef(false);
  const [preScoreArray, setPreScoreArray] = useState<LocalRankingType[]>([]);


  useEffect(() => {
    //初回マウント時
    if (!didMount.current) {
      didMount.current = true;
      const local = localStorage.getItem("preScore");
      //localにスコア情報が存在する時
      if (local != null) {
        try {
          const preScoreArray: LocalRankingType[] = JSON.parse(local);
          console.log(preScoreArray);
          if (typeof preScoreArray === "string") throw new Error("データが壊れています。");
          setPreScoreArray(preScoreArray);
        }
        catch (e) {
          alert("過去のデータタイプと現在のデータタイプが競合しています。\n過去のデータを削除しますが、もし嫌ならタスクキルしてください。");
          localStorage.removeItem("preScore");
        }
      }
      return;
    }
  }, []);
  return (
    <div className="min-h-[100svh]  mx-2 relative">
      <div className=" grid grid-rows-10 max-w-[1000px] mx-auto absolute inset-0">
        <h1 className="text-center row-span-1 my-auto font-bold text-xl">マイスコア</h1>
        <div className=" relative row-span-7 items-center overflow-y-scroll border-2 border-orange-300 bg-gradient-to-br from-orange-100 to-orange-50 ">
          <div className=" absolute inset-0">
            {preScoreArray.map((score, index) => {
              return (
                <LRankElement scoreData={score} index={index} key={index} />
              )
            })}
          </div>
        </div>
        <div className="row-span-2 my-auto">
          <Link href={"./"} className=" flex flex-row justify-center gap-1 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            <p className="text-xl">Replay</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home;