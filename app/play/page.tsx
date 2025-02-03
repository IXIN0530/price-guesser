"use client"

import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion";
import { Suspense, useEffect, useRef, useState } from "react";
import functions from "@/components/functions";
import axios from "axios";
import { globalRankingType, LocalRankingType, PlayerDataType, QuestionType } from "@/type";
import QuestionField from "@/components/questionField";
import Loading from "@/components/loading";
import { div, pre } from "framer-motion/m";
import Link from "next/link";
type Props = {
  searchParams: { [key: string]: string[] | string[] },
}

function Home() {
  //パラメー
  //問題数
  const howMany = 5;
  //スコア(一旦、%のたしあわせ)
  const [score, setScore] = useState(0);
  //スコア履歴
  const [scoreArray, setScoreArray] = useState<number[]>([]);
  //プレイヤー名
  const playerName = useSearchParams().get("name");
  const [isFocused, setIsFocused] = useState(false);
  //priceInputのref
  const priceRef = useRef<HTMLInputElement>(null);
  //タイトルのref
  const titleRef = useRef<HTMLDivElement>(null);
  //説明文のref
  const descriptionRef = useRef<HTMLDivElement>(null);
  //問題の情報
  const [questions, setQuestions] = useState<QuestionType[]>();
  //今何問目
  const [questionNum, setQuestionNum] = useState(0);
  //初回ロードの確認
  const didMount = useRef(false);
  //問題終了済みか
  const [isFinished, setIsFinished] = useState(false);

  //関数の読み込み
  const { makeQuery,
    makeQuestions,
    scoreConvert,
    makeLocalRanking,
    makeGlobalRanking } = functions();

  //商品情報をランダムに取得
  const fetchItem = async () => {
    const query = makeQuery();
    //データを送る
    try {
      //一分間に1回のアクセス制限
      //1分に一回のみのアクセス
      var day = new Date();
      const time = [day.getHours(), day.getMinutes()];
      const preTime = localStorage.getItem("TIME");
      if (preTime == null) localStorage.setItem("TIME", JSON.stringify(time));
      else {
        const preTImeArray = JSON.parse(preTime)
        if (preTImeArray[0] == time[0] && preTImeArray[1] == time[1]) {
          throw new Error("1分間に1回のアクセス制限を超えています。")
        }
      }
      //データ取得
      const testRes = await axios.get("/api/proxy/");
      localStorage.setItem("TIME", JSON.stringify(time))
      console.log(JSON.stringify(time))
      if (testRes.status !== 200) {
        throw new Error("Something went wrong. status:" + testRes.status);
      }
      //受け取ったJsonをファイルに保存
      //受け取った商品情報 Jsonから変換
      const data = await testRes.data;
      //問題に整形
      const questions = makeQuestions(data, howMany);
      setQuestions(questions);
      console.log(questions);
      // console.log(questions);
    } catch (e) {
      alert(e);
    }
  }

  //ポストするための非同期関数
  const postData = async (data: globalRankingType) => {
    try {
      const res = await axios.post("/api/database", data);
    }
    catch (e) {
      alert(e);
    }
  }

  const saveData = (score: number) => {
    //今までのプレイ回数
    const playTime = localStorage.getItem("playTime");
    if (playTime == null) localStorage.setItem("playTime", "1");
    else localStorage.setItem("playTime", (Number(playTime) + 1).toString())

    //スコアアブジェクトの生成
    const thisScoreData = makeLocalRanking(score, scoreArray);
    //グローバルに関しても生成
    const globalRankingData = makeGlobalRanking(score, scoreArray);
    //サーバーにアップロード
    postData(globalRankingData);
    //一旦ローカルに保存
    const preData = localStorage.getItem("preScore");
    if (preData == null) {
      localStorage.setItem("preScore", JSON.stringify([thisScoreData]));
      setScoreArray([]);
    }
    //過去のデータがある場合、ソートして新たに保存
    else {
      var preDataArray: LocalRankingType[];
      try {
        preDataArray = JSON.parse(preData);
      }
      catch (e) {
        alert("過去のデータタイプと現在のデータタイプが競合しています。\n過去のデータを削除しますが、もし嫌ならタスクキルしてください。");
        localStorage.removeItem("preScore");
        return;
      }
      //差し込み
      for (var i = 0; i < preDataArray.length; i++) {
        if (score >= preDataArray[i].score) {
          preDataArray.splice(i, 0, thisScoreData);
          break;
        }
        //最低スコアだった場合
        else if (i == preDataArray.length - 1) {
          preDataArray.push(thisScoreData);
          break;
        }
      }
      localStorage.setItem("preScore", JSON.stringify(preDataArray));
      setScoreArray([]);
    }
  }

  //Enterキーが押された時にOnClickを実行する
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      OnClick();
    }
  }

  //GuessButtonをクリックしたとき
  const OnClick = () => {
    //まだ問題が始まっていない場合
    if (!questions) {
      alert("Please wait a moment")
      return;
    }
    //入力された値が不適切だったら
    const price = priceRef.current!.value;
    if (price == "" || Number(price) <= 0) {
      if (isFinished) {
        alert("Your total score is " + score.toFixed(2))
        return;
      }
      alert("Please enter a valid number")
      return;
    }
    else {
      //答え合わせ
      const answer = questions![questionNum].price;
      const thisScore = scoreConvert(Number(price), answer);
      const totalScore = score + thisScore;
      priceRef.current!.value = "";
      //スコア更新
      setScoreArray([...scoreArray, thisScore]);
      if (!isFinished) setScore(totalScore);
      alert("You guessed " + price + " yen\nThe answer is " + answer + " yen\nThe score is " + thisScore.toFixed(2));
      //次に問題がある場合、進む。
      if (questionNum < howMany - 1) {
        titleRef.current!.scrollTop = 0;
        descriptionRef.current!.scrollTop = 0;
        setQuestionNum(questionNum + 1);
      }
      else {
        //結果発表
        if (!isFinished) {
          saveData(totalScore);
          alert("Your total score is " + totalScore.toFixed(2))
        }
        else alert("Your total score is " + score.toFixed(2))
        setIsFinished(true);
      }
    }
  }
  //最新のメダル取得情報を取得 メダル情報の更新
  const getMedal = async () => {
    try {

      const data = {
        playerID: localStorage.getItem("playerID") || "",
        password: localStorage.getItem("password") || ""
      }
      const res = await axios.get("/api/playerDatabase", { params: data });
      const resData: PlayerDataType[] = res.data["data"];
      //未ログイン状態
      if (resData.length == 0) {
        return;
      }
      //メダルの情報を取得し、localに保存
      localStorage.setItem("goldNum", resData[0].goldNum!.toString());
      localStorage.setItem("silverNum", resData[0].silverNum!.toString());
      localStorage.setItem("bronzeNum", resData[0].bronzeNum!.toString());
      //ランキングデータの更新
      await axios.get("/api/playerDatabase/batchUpdate");
    }
    catch (e) {
      alert(e);
    }
  }
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      console.log("first load")
      //問題の取得
      fetchItem();
      getMedal();
    } else {
      console.log("loaded")
    }

  }, [])
  return (
    <div className="min-h-[100svh] grid grid-rows-10 max-h-[105svh]">
      <div className="row-span-1 flex flex-col justify-center">
        <p className="text-center text-2xl font-bold">Question {questionNum + 1}</p>
      </div>
      <div className="row-span-5 flex justify-center items-center ">
        {questions && <QuestionField data={questions[questionNum]} titleRef={titleRef} descriptionRef={descriptionRef} />}
        {!questions && <Loading />}
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
          ref={priceRef}
          onKeyDown={handleKeyDown}>
        </motion.input>
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
      <div className="row-span-1 flex flex-col justify-between items-center">
        {isFinished &&
          <Link href={"./"} className="my-1 flex flex-row justify-center gap-1 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            <p className="text-xl">Replay</p>
          </Link>}
      </div>

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