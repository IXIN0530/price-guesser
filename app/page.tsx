"use client"
import Image from "next/image";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
export default function Home() {
  //nameにフォーカスしているかどうか
  const [isFocused, setIsFocused] = useState(false);
  //inputのref
  const nameRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  //PlayButtonが押された
  const OnClick = () => {
    //名前が未入力の場合、ランダムにIDを生成
    if (nameRef.current!.value === "") {
      router.push("/play?name=" + Math.random().toString(36).slice(-8));
      return;
    }
    router.push("/play?name=" + nameRef.current!.value);
    return;
  }
  return (
    <div className="min-h-[100svh] grid grid-rows-10">
      <div className="row-span-6 flex justify-center items-center">
        <Image
          className="h-full w-3/5 max-w-[500px]"
          src={"/MainIcon.png"}
          alt=""
          width={1000}
          height={0}
          layout="intrinsic" />
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
        shadow-xl text-white text-xl font-bold"
          whileTap={{ scale: 0.9, boxShadow: "0px 0px 0px 0px", translateY: 7 }}
          transition={{ type: "spring", duration: 0.3, stiffness: 500 }}
          onClick={OnClick}>
          Play
        </motion.button>
      </div>
      <div className="bg-gray-0 row-span-1"></div>

    </div>
  );
}

