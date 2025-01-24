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
    <div className="flex py-4 justify-center gap-5 flex-col border-b-2 border-slate-500"
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
            className=" flex flex-col justify-center">
            <div className="grid grid-cols-10 items-center h-full ">
              <p className="font-bold text-2xl col-span-2 ">Points:</p>
              <div className="col-span-4  h-full grid grid-rows-2 grid-cols-5  overflow-y-scroll">
                {scoreData.pointDetail.map((point, index) => {
                  if (index == 0 || index == 1)
                    return (
                      <p key={index} className="text-xl my-auto font-bold row-span-1 col-span-2 text-left"
                        style={{ color: pointColor(point) }}>
                        {point.toFixed(1)}
                      </p>
                    )
                  else if (index == 2)
                    return (
                      <p key={index} className="text-xl my-auto font-bold col-span-1 row-span-1"
                        style={{ color: pointColor(point) }}>
                        {point.toFixed(1)}
                        <br></br>
                      </p>
                    )
                  else if (index == 3)
                    return (
                      <p key={index} className="text-xl my-auto font-bold col-span-3 row-span-1 text-center"
                        style={{ color: pointColor(point) }}>
                        {point.toFixed(1)}
                      </p>
                    )
                  else
                    return (
                      <p key={index} className="text-xl my-auto font-bold col-span-2 row-span-1 text-left"
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