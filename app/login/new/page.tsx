"use client"
import axios from "axios";
import Link from "next/link";
import { useRef } from "react";
export default function Page() {
  const idRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  //データをとっている途中か
  const isLoading = useRef(false);
  const OnClick = async () => {
    //0文字ではないか
    if (idRef.current!.value === "" || passRef.current!.value === "") {
      alert("IDまたはパスワードが未入力です。");
      return;
    }
    //アカウント情報を送信
    const data = {
      playerID: idRef.current!.value,
      password: passRef.current!.value,
      name: localStorage.getItem("PlayerName") || "名無し",
    }
    if (isLoading.current) {
      return;
    }
    isLoading.current = true;
    const res = await axios.post("/api/playerDatabase", data);
    isLoading.current = false;
    const message: string = res.data["message"];
    //何かしらの問題があった場合
    if (message !== "TRUE") {
      alert(message);
      return;
    }
    localStorage.setItem("playerID", data.playerID);
    localStorage.setItem("password", data.password);
    alert("アカウント作成に成功しました。\nログイン処理も完了しました。");
  }
  return (
    <div className="min-h-[100svh] grid grid-rows-10 mx-2">
      <h1 className="row-span-1 text-center my-auto text-xl font-bold">新規アカウント作成</h1>
      <div className="row-span-1"></div>
      <div className="row-span-2 flex flex-row">
        <input className="w-3/4 h-1/3 max-w-[500px] mx-auto my-auto border placeholder-shown:border-orange-600 rounded-lg outline-none text-center placeholder-shown:bg-orange-100 focus:bg-orange-50 focus:border-orange-500 focus:shadow-lg border-emerald-500 bg-lime-50 text-2xl"
          type="text"
          placeholder="ID(20文字以内)"
          maxLength={20}
          ref={idRef} />
      </div>
      <div className="row-span-2 flex flex-row">
        <input className="w-3/4 h-1/3 max-w-[500px] mx-auto my-auto border placeholder-shown:border-orange-600 rounded-lg outline-none text-center placeholder-shown:bg-orange-100 focus:bg-orange-50 focus:border-orange-500 focus:shadow-lg border-emerald-500 bg-lime-50 text-2xl"
          type="text"
          placeholder="password(10文字以内)"
          maxLength={10}
          ref={passRef} />
      </div>
      <div className="row-span-2 text-center my-auto">
        <button className=" shadow-lg text-white px-6  py-4 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-300"
          onClick={OnClick}>
          アカウント作成
        </button>
      </div>
      <div className="row-span-1 flex justify-center">

      </div>
      <div className="row-span-1 flex justify-center">
        <Link href={"/"} className="text-xl">
          ＜ Replay
        </Link>
      </div>
    </div>
  )
}