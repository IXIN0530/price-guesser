"use client"

import { useState } from "react";
import { motion } from "framer-motion";
type Props = {
  score: number,
  index: number,
  key: number
}
const LRankElement = ({ score, index }: Props) => {
  const [isClicked, setIsClicked] = useState(false);
  return (
    <motion.div className="grid grid-cols-10 row-span-1 items-center border-b-2 border-slate-500"
      onClick={() => setIsClicked(!isClicked)}
      animate={{ gridRow: isClicked ? "span 2" : "span 1" }}
      transition={{ duration: 0.5 }}>
      <div className="col-span-1"></div>
      <p className="col-span-1 text-center font-bold text-3xl">{index + 1}</p>
      <div className="col-span-3"></div>
      <p className="col-span-5 text-center text-2xl">{score.toFixed(2)}</p>
    </motion.div>
  )
}

export default LRankElement;