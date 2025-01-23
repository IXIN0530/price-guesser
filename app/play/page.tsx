"use client"

import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion";
import { Suspense, useEffect, useRef, useState } from "react";
import functions from "@/components/functions";
import axios from "axios";
import { QuestionType } from "@/type";
import QuestionField from "@/components/questionField";
import Loading from "@/components/loading";
type Props = {
  searchParams: { [key: string]: string[] | string[] },
}

function Home() {
  //パラメー
  //問題数
  const howMany = 5;
  //スコア(一旦、%のたしあわせ)
  const [score, setScore] = useState(0);
  const playerName = useSearchParams().get("name");
  const [isFocused, setIsFocused] = useState(false);
  const priceRef = useRef<HTMLInputElement>(null);
  //問題の情報
  const [questions, setQuestions] = useState<QuestionType[]>();
  //今何問目
  const [questionNum, setQuestionNum] = useState(0);
  //初回ロードの確認
  const didMount = useRef(false);
  //問題終了済みか
  const [isFinished, setIsFinished] = useState(false);

  //関数の読み込み
  const { makeQuery, makeQuestions, scoreConvert } = functions();

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
      alert("Please enter a valid number")
      return;
    }
    else {
      //答え合わせ
      const answer = questions![questionNum].price;
      const thisScore = scoreConvert(Number(price), answer);
      const totalScore = score + thisScore;
      priceRef.current!.value = "";
      if (!isFinished) setScore(totalScore);
      alert("You guessed " + price + " yen\nThe answer is " + answer + " yen\nThe score is " + thisScore.toFixed(2));
      //次に問題がある場合、進む。
      if (questionNum < howMany - 1) {
        setQuestionNum(questionNum + 1);
      }
      else {
        //結果発表
        setIsFinished(true);
        alert("Your total score is " + totalScore.toFixed(2))
      }
    }
  }
  useEffect(() => {
    if (!didMount.current) {
      console.log("first load")
      //問題の取得
      fetchItem();

    } else {
      didMount.current = true;
      console.log("loaded")
    }

  }, [])
  return (
    <div className="min-h-[100svh] grid grid-rows-10 max-h-[105svh]">
      <div className="row-span-1 flex flex-col justify-center">
        <p className="text-center text-2xl font-bold">Question {questionNum + 1}</p>
      </div>
      <div className="row-span-5 flex justify-center items-center ">
        {questions && <QuestionField data={questions[questionNum]} />}
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
          ref={priceRef}>
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