"use client"
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import functions from "@/components/functions";
import axios from "axios";
export default function Home() {
  //nameにフォーカスしているかどうか
  const [isFocused, setIsFocused] = useState(false);
  //inputのref
  const nameRef = useRef<HTMLInputElement>(null);
  //初回マウント
  const didMount = useRef(false);
  const router = useRouter();
  const { convertOldData } = functions();
  //PlayButtonが押された
  const OnClick = () => {
    //名前が未入力の場合、ランダムにIDを生成
    if (nameRef.current!.value === "") {
      // router.push("/play?name=" + Math.random().toString(36).slice(-8));
      localStorage.setItem("PlayerName", Math.random().toString(36).slice(-8));
      return;
    }
    //名前を保存
    localStorage.setItem("PlayerName", nameRef.current!.value);
    // router.push("/play?name=" + nameRef.current!.value);
    return;
  }
  //過去に使っていた名前の取得
  useEffect(() => {
    //初回マウント時
    if (!didMount.current) {
      didMount.current = true;
      if (localStorage.getItem("PlayerName") !== null) {
        nameRef.current!.value = localStorage.getItem("PlayerName")!;
        // localStorage.removeItem("preScore");
        // localStorage.setItem("preScore", JSON.stringify([499, 400, 400, 400, 400, 400, 400]));
        test();
      }
      //未ログイン状態の時、促す
      if (localStorage.getItem("playerID") === null) {
        alert("ただいまゲスト状態です。\nログインすることで自身のランキング情報を保存できます。")
      }
      //旧データを変換
      convertOldData();
      return;
    }
  }, [])

  const test = async () => {
    // axios.get("/api/playerDatabase/batchUpdate");
  }
  return (
    <div className="min-h-[100svh] grid grid-rows-10">
      <div className="row-span-6 flex justify-center items-center">
        <Image
          className="h-full w-3/5 max-w-[500px]"
          src="/MainIcon.png"
          alt=""
          width={1000}
          height={0}
          layout="intrinsic"
          unoptimized />
      </div>
      <div className=" row-span-2 flex flex-row">
        <motion.input className=" w-3/4 h-1/3 max-w-[500px] mx-auto
          my-auto border placeholder-shown:border-orange-600 rounded-lg outline-none text-center placeholder-shown:bg-orange-100 focus:bg-orange-50 focus:border-orange-500
          focus:shadow-lg border-emerald-500 bg-lime-50 text-2xl" type="text"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Enter your name"
          animate={{
            scale: isFocused ? 1.01 : 1,
          }}
          transition={{ duration: 0.3, type: "spring", ease: "easeInOut", stiffness: 1000 }}
          ref={nameRef}
        >
        </motion.input>
      </div>
      <div className="row-span-1 flex flex-row">
        <motion.button className="w-1/3 bg-gradient-to-br from-emerald-400 to-emerald-300 my-2 mx-auto max-w-[400px] rounded-xl
        shadow-xl text-white text-xl font-bold relative"
          whileTap={{ scale: 0.9, boxShadow: "0px 0px 0px 0px", translateY: 7 }}
          transition={{ type: "spring", duration: 0.3, stiffness: 500 }}
          onClick={OnClick}>
          <Link href={"/play"} className=" absolute inset-1  flex flex-col justify-center">Play</Link>
        </motion.button>
      </div>
      <div className="bg-gray-0 row-span-1 my-auto flex justify-center gap-10">
        {/* <Link href={"/rules"} className=" underline text-sm">
          点数の計算方式
        </Link> */}
        <Link href={"/login"} className=" underline text-sm">
          ログイン関連
        </Link>
        <Link href={"/localRanking"} className=" underline text-sm">
          Myランキング
        </Link>
        <Link href={"/ranking"} className=" underline text-sm">
          世界ランキング
        </Link>
      </div>

    </div>
  );
}

