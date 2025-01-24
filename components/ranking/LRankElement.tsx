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
        <p className="col-span-1 text-center  text-3xl">
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
            className=" flex flex-col justify-center">
            <div className="grid grid-cols-10 items-center h-full ">
              <p className="font-bold text-2xl col-span-2 ">score:</p>
              <div className="col-span-4   h-full grid grid-rows-2 grid-cols-7  overflow-y-scroll">
                {scoreData.pointDetail.map((point, index) => {
                  if (index == 0 || index == 1)
                    return (
                      <div key={index} className="text-lg my-auto font-bold row-span-1 col-span-2 text-right grid grid-cols-2"
                        style={{ color: pointColor(point) }}>
                        <div className=""></div>
                        <p className="text-center">
                          {point.toFixed(1)}
                        </p>
                      </div>
                    )
                  else if (index == 2)
                    return (
                      <p key={index} className="text-lg my-auto font-bold col-span-3 row-span-1 text-right "
                        style={{ color: pointColor(point) }}>
                        {point.toFixed(1)}
                        <br></br>
                      </p>
                    )
                  else if (index == 3)
                    return (
                      <p key={index} className="text-lg my-auto font-bold col-span-3 row-span-1 text-center"
                        style={{ color: pointColor(point) }}>
                        {point.toFixed(1)}
                      </p>
                    )
                  else
                    return (
                      <p key={index} className="text-lg my-auto font-bold col-span-2 row-span-1 text-left"
                        style={{ color: pointColor(point) }}>
                        {point.toFixed(1)}
                      </p>
                    )

                })}
              </div>
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