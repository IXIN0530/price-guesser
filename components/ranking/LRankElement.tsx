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
  return (
    <div className="h-full flex justify-center gap-5 flex-col  row-span-1 border-b-2 border-slate-500"
      onClick={() => setIsClicked(!isClicked)}
      style={{ gridRow: !isClicked ? "span 1" : "span 2" }}>
      <motion.div className="grid grid-cols-10  items-center "
      >
        <div className="col-span-1"></div>
        <p className="col-span-1 text-center  text-3xl">{index + 1}</p>
        <div className="col-span-3"></div>
        <p className="col-span-5 text-center text-2xl font-bold select-none">{scoreData.score.toFixed(2)}</p>
      </motion.div>
      <AnimatePresence>
        {isClicked && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, transition: { duration: 0 } }}
            transition={{ duration: 0.3 }}
            className=" h-1/2 flex flex-col justify-center">
            <div className="grid grid-cols-10 items-center ">
              <p className="font-bold text-2xl col-span-2 ">Points:</p>
              <div className="col-span-4 flex justify-between mx-2 gap-2 overflow-scroll">
                {scoreData.pointDetail.map((point, index) => {
                  return (
                    <p key={index} className="text-lg my-auto font-bold"
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