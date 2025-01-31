"use client"
import { PlayerDataType } from "@/type";
import axios from "axios";
import Link from "next/link";
import { useEffect, useRef } from "react";
function Page() {
  const idRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  //初回マウント
  const didMountRef = useRef(false);
  //ログイン情報の取得中かどうか
  const isLoading = useRef(false);
  //ログインボタンクリック時
  const OnClick = async () => {
    if (idRef.current!.value === "" || passRef.current!.value === "") {
      alert("IDまたはパスワードが未入力です。");
      return;
    }
    //アカウントが存在するか
    //存在する場合、IDとパスワードが一致するか
    const data = {
      playerID: idRef.current!.value,
      password: passRef.current!.value,
    }
    if (isLoading.current) {
      return;
    }
    isLoading.current = true;
    const res = await axios.get("/api/playerDatabase", { params: data });
    isLoading.current = false;
    const resData: PlayerDataType[] = res.data["data"];
    console.log(resData.length);
    //res.dataが空の場合、アカウントが存在しない
    if (resData.length == 0) {
      alert("アカウントが存在しません。");
      return;
    }
    else {
      alert("ログイン成功");
      localStorage.setItem("playerID", data.playerID);
      localStorage.setItem("password", data.password);
    }
  }

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      //直近のログイン履歴がある場合、ログイン
      const playerID = localStorage.getItem("playerID");
      const password = localStorage.getItem("password");
      if (playerID != null && password != null) {
        idRef.current!.value = playerID;
        passRef.current!.value = password;
        alert("ログイン成功");
      }
    }
  }, []);
  return (
    <div className="min-h-[100svh] grid grid-rows-10 mx-2">
      <h1 className="row-span-1 text-center my-auto text-xl font-bold">ログイン</h1>
      <div className="row-span-1"></div>
      <div className="row-span-2 flex flex-row">
        <input className="w-3/4 h-1/3 max-w-[500px] mx-auto my-auto border placeholder-shown:border-orange-600 rounded-lg outline-none text-center placeholder-shown:bg-orange-100 focus:bg-orange-50 focus:border-orange-500 focus:shadow-lg border-emerald-500 bg-lime-50 text-2xl"
          type="text"
          placeholder="ID"
          ref={idRef} />
      </div>
      <div className="row-span-2 flex flex-row">
        <input className="w-3/4 h-1/3 max-w-[500px] mx-auto my-auto border placeholder-shown:border-orange-600 rounded-lg outline-none text-center placeholder-shown:bg-orange-100 focus:bg-orange-50 focus:border-orange-500 focus:shadow-lg border-emerald-500 bg-lime-50 text-2xl"
          type="password"
          placeholder="Password"
          ref={passRef} />
      </div>
      <div className="row-span-2 text-center my-auto">
        <button className=" shadow-lg text-white px-6  py-4 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-300"
          onClick={OnClick}>
          ログイン
        </button>
      </div>
      <div className="row-span-1 flex justify-center">
        <Link href={"login/new"} className=" underline">
          新規アカウント作成
        </Link>
      </div>
      <div className="row-span-1 flex justify-center">
        <Link href={"/"} className="text-xl">
          ＜ Replay
        </Link>
      </div>
    </div>
  );
}

export default Page;