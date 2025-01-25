"use client"

import { useState } from "react";
import { AnimatePresence, color, motion } from "framer-motion";
import { LocalRankingType } from "@/type";
import functions from "../functions";
type Props = {
  scoreData: LocalRankingType,
  index: number,
  key: number
}
const LRankElement = ({ scoreData, index }: Props) => {
  const { pointColor } = functions()
  const [isClicked, setIsClicked] = useState(false);
  const scores = scoreData.pointDetail;
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
      <motion.div className="grid grid-cols-10  items-center "
      >
        <div className="col-span-1"></div>
        <p className="col-span-1 text-center  text-3xl select-none">
          {addSuffix(index + 1)}
        </p>
        <div className="col-span-3"></div>
        <p className="col-span-4 text-center text-2xl font-bold select-none">{scoreData.score.toFixed(2)}</p>
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
              {scores.length > 0 ?
                <div className="col-span-4   h-full grid grid-rows-2 overflow-x-scroll">
                  <div className="row-span-1 flex justify-center gap-2 font-bold">
                    <p style={{ color: pointColor(scores[0]) }}>{scores[0].toFixed(1)}</p>
                    <p style={{ color: pointColor(scores[1]) }}>{scores[1].toFixed(1)}</p>
                    <p style={{ color: pointColor(scores[2]) }}>{scores[2].toFixed(1)}</p>
                  </div>
                  <div className="row-span-1 flex justify-center gap-2 font-bold">
                    <p style={{ color: pointColor(scores[3]) }}>{scores[3].toFixed(1)}</p>
                    <p style={{ color: pointColor(scores[4]) }}>{scores[4].toFixed(1)}</p>
                  </div>
                </div> : <div></div>}
              <p className="col-span-2 text-center overflow-hidden">{scoreData.date}</p>
              <p className="col-span-2 text-center overflow-hidden">{scoreData.name}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LRankElement;