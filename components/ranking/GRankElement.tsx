"use client"

import { useState } from "react";
import { AnimatePresence, color, motion } from "framer-motion";
import { globalRankingType, LocalRankingType } from "@/type";
import functions from "../functions";
type Props = {
  scoreData: globalRankingType,
  index: number,
  key: number
}
const GRankElement = ({ scoreData, index }: Props) => {
  const { pointColor } = functions()
  const [isClicked, setIsClicked] = useState(false);
  //スコア情報、プレイヤーの名前の文字列を整形する関数
  const formatScore = (detail: string) => {
    const scoreArray = detail.split(",");
    return { scoreDetail: scoreArray.slice(0, 5).map(e => Number(e)), name: scoreArray[5] }
  }
  //Playerのスコア情報と名前
  const { scoreDetail, name } = formatScore(scoreData.scoreDetail!);
  //後ろにth,st,nd,rdをつける関数
  const addSuffix = (num: number) => {
    if (num == 1) return num + "st";
    else if (num == 2) return num + "nd";
    else if (num == 3) return num + "rd";
    else return num + "th";
  }
  return (
    <div className="flex py-4 justify-center gap-5 flex-col border-b-2 border-slate-500"
      onClick={() => setIsClicked(!isClicked)}
      style={{ gridRow: !isClicked ? "span 1" : "span 2" }}>
      <motion.div className="grid grid-cols-11  items-center "
      >
        <div className="col-span-1"></div>
        <p className="col-span-1 text-center  text-3xl select-none ">
          {addSuffix(index + 1)}
        </p>
        <div className="col-span-2"></div>
        <p className="col-span-3 text-center text-2xl font-bold select-none">{scoreData.score!.toFixed(2)}</p>
        <div className="col-span-3 select-none overflow-x-scroll ">
          <p className="text-center overflow-x-scroll whitespace-nowrap">
            {name}
          </p>
        </div>
        <div className="col-span-1 mx-auto">
          <motion.svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6"
            initial={{ rotate: 0, opacity: 1 }}
            animate={{ rotate: isClicked ? 90 : 0 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5" />
          </motion.svg>
        </div>
      </motion.div>
      <AnimatePresence>
        {isClicked && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, transition: { duration: 0 } }}
            transition={{ duration: 0.3 }}
            className=" flex flex-col justify-center mx-2">
            <div className="grid grid-cols-10 items-center h-full ">
              <p className="font-bold text-2xl col-span-2 ">score:</p>
              {scoreDetail.length > 0 ?
                <div className="col-span-4   h-full grid grid-rows-2 overflow-x-scroll">
                  <div className="row-span-1 flex justify-center gap-2 font-bold">
                    <p style={{ color: pointColor(scoreDetail[0]) }}>{scoreDetail[0].toFixed(1)}</p>
                    <p style={{ color: pointColor(scoreDetail[1]) }}>{scoreDetail[1].toFixed(1)}</p>
                    <p style={{ color: pointColor(scoreDetail[2]) }}>{scoreDetail[2].toFixed(1)}</p>
                  </div>
                  <div className="row-span-1 flex justify-center gap-2 font-bold">
                    <p style={{ color: pointColor(scoreDetail[3]) }}>{scoreDetail[3].toFixed(1)}</p>
                    <p style={{ color: pointColor(scoreDetail[4]) }}>{scoreDetail[4].toFixed(1)}</p>
                  </div>
                </div> : <div></div>}
              <p className="col-span-3 text-center overflow-hidden">{scoreData.year + "/" + scoreData.month + "/" + scoreData.day}</p>
              <p className="col-span-1 text-center overflow-hidden"></p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default GRankElement;