"use client"
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
const Home = () => {
  //初回マウントの確認
  const didMount = useRef(false);
  const [preScoreArray, setPreScoreArray] = useState<number[]>([]);

  useEffect(() => {
    //初回マウント時
    if (!didMount.current) {
      didMount.current = true;
      const local = localStorage.getItem("preScore");
      //localにスコア情報が存在する時
      if (local != null) {
        const preScoreArray: number[] = JSON.parse(local);
        setPreScoreArray(preScoreArray);
      }
      return;
    }
  }, []);
  return (
    <div className="min-h-[100svh] grid grid-rows-10 mx-2">
      <h1 className="text-center row-span-1 my-auto font-bold text-xl">マイスコア</h1>
      <div className=" gap-2 row-span-7 grid grid-rows-7 items-center overflow-y-scroll border-2 border-orange-300 bg-orange-50">
        {preScoreArray.map((score, index) => {
          return (
            <div className=" row-span-1 flex justify-between items-center border-b-2 border-slate-500  w-full " key={index}>
              <div>　</div>
              <p className="text-center font-bold text-3xl">{index + 1}</p>
              <div>　</div>
              <p className=" text-center text-2xl">{score.toFixed(2)}</p>
              <div>　</div>
            </div>
          )
        })}
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
  )
}

export default Home;