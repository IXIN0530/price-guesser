"use client"

import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion";
import { Suspense, useEffect, useRef, useState } from "react";
import functions from "@/components/functions";
import api from "@/components/api";
import test from "node:test";
import axios from "axios";
type Props = {
  searchParams: { [key: string]: string[] | string[] },
}

function Home() {
  //パラメー
  const playerName = useSearchParams().get("name");
  const [isFocused, setIsFocused] = useState(false);
  const nameRef = useRef(null);
  //初回ロードの確認
  const didMount = useRef(false);

  //関数の読み込み
  const { makeQuery } = functions();

  //商品情報をランダムに取得
  const fetchItem = async () => {
    const query = makeQuery();
    //データを送る
    try {
      // const response = await fetch("/play/proxy/", { method: "GET" });
      const testRes = await axios.get("/api/proxy/");
      if (testRes.status !== 200) {
        throw new Error("Something went wrong");
      }
      const data = await testRes.data;
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  }

  const OnClick = () => {
    fetchItem();
  }
  useEffect(() => {
    if (didMount.current) {
      console.log("loaded")

    } else {
      didMount.current = true;
      console.log("first load")
    }
  }, [])
  return (
    <div className="min-h-[100svh] grid grid-rows-10">
      <div className="row-span-1 flex flex-col justify-center">
        <p className="text-center text-2xl font-bold">Question 1</p>
      </div>
      <div className="row-span-5 bg-sky-100">

      </div>
      <div className="flex flex-row row-span-2">
        <motion.input className=" w-3/4 h-1/3 max-w-[500px] mx-auto
          my-auto border placeholder-shown:border-orange-600 rounded-lg outline-none text-center placeholder-shown:bg-orange-100 focus:bg-orange-50 focus:border-orange-500
          focus:shadow-lg border-emerald-500 bg-lime-50 text-2xl" type="number"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Guess the price (¥)"
          animate={{
            scale: isFocused ? 1.01 : 1,
          }}
          transition={{ duration: 0.3, type: "spring", ease: "easeInOut", stiffness: 1000 }}
          ref={nameRef}>
        </motion.input>
        <p>a</p>
      </div>
      <div className="row-span-1  flex flex-row">
        <motion.button className="w-1/3 bg-gradient-to-br from-emerald-400 to-emerald-300 my-2 mx-auto max-w-[400px] rounded-xl
        shadow-xl text-white text-xl font-bold"
          whileTap={{ scale: 0.9, boxShadow: "0px 0px 0px 0px", translateY: 7 }}
          transition={{ type: "spring", duration: 0.3, stiffness: 500 }}
          onClick={OnClick}>
          Guess
        </motion.button>
      </div>
      <div className="row-span-1"></div>

    </div>
  )
}

export default function HomeWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Home />
    </Suspense>
  )
}