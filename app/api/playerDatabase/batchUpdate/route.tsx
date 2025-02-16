import supabase from "@/components/supabase/supabase"
import axios from "axios"
import { NextRequest, NextResponse } from "next/server";
import { toZonedTime } from "date-fns-tz";
import functions from "@/components/functions";
import { globalRankingType } from "@/type";
//いつの分のバッチまで反映したかを調べる
export const GET = async (req: NextRequest) => {
  const { compareDate } = functions();
  try {
    //金銀銅の中で一番更新された履歴が古いものを最終更新日とする
    const res =
      await supabase
        .from("playerData")
        .select("*")
        .eq("playerID", "developer")
        .eq("password", "batchUpdater")
        .order("goldNum", { ascending: true })
        .order("silverNum", { ascending: true })
        .order("bronzeNum", { ascending: true });

    const resData = res.data || [];
    //昨日のバッチを配布したかを確認
    if (resData.length != 0) {
      const today = toZonedTime(new Date(), "Asia/Tokyo");
      const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
      //昨日すでに配布しているなら、終わり
      if (resData[0].goldNum == yesterday.getFullYear() && resData[0].silverNum == yesterday.getMonth() + 1 && resData[0].bronzeNum == yesterday.getDate()) {
        return NextResponse.json({ data: "already done" });
      }
      var latest = new Date(resData[0].goldNum!, resData[0].silverNum! - 1, resData[0].bronzeNum!);

      //以下のようにend内でメダルを更新する
      var giveMedalObj: giveMedalType = {
        gold: {},
        silver: {},
        bronze: {},
      }

      //latestの次の日から、yesterdayまでを取得して、更新する
      //待つべき非同期処理の数を(日数)*3にする
      var _latest = new Date(latest);
      var numAsync = 0;
      while (!compareDate(_latest, yesterday)) {
        _latest.setDate(_latest.getDate() + 1);
        numAsync += 3;
      }
      //end()が実行された回数
      var counter = 0;

      while (!compareDate(latest, yesterday)) {
        latest.setDate(latest.getDate() + 1);
        const _latest = new Date(latest);
        //この下に処理を書く
        console.log(latest.getDate());
        const res2 = await supabase
          .from("scoreData")
          .select("*")
          .eq("year", latest.getFullYear())
          .eq("month", latest.getMonth() + 1)
          .eq("day", latest.getDate())
          .order("score", { ascending: false });
        var resData2 = res2.data || [];
        //resData2.lengthが3に満たない場合、ダミーデータを追加
        while (resData2.length < 3) {
          resData2.push({
            playerID: "dammy",
            score: 0,
            year: 0,
            month: 0,
            day: 0,
            id: 0,
            goldNum: 0,
            silverNum: 0,
            bronzeNum: 0,
            scoreDetail: ""
          })
        }
        //上位3人に金銀銅を配布
        resData2.forEach(async (e: globalRankingType, index: number) => {
          //latest==yesterdayかつ、最後のデータの場合、end()を呼ぶ
          const noneDataFunc = () => {
            end();
          }

          //dammyだったら即座にend()を呼ぶ
          if (e.playerID == "dammy" && index < 3) {
            numAsync--;
            end();
            return;
          }

          //金の人がいれば取得
          if (index == 0) {
            // 金の人のgoldNumを1増やす
            // 待つべき非同期処理の数を増やす
            console.log(`gold score is: ${e.score}`);
            const res3 = await supabase
              .from("playerData")
              .select("goldNum")
              .eq("playerID", e.playerID || "");
            //金の人がGuestだった場合、何もしない
            // console.log(res3.data);
            if (res3.data?.length == 0 || res3.data == null) {
              numAsync--;
              noneDataFunc();
              return;
            }
            //すでにリストに追加済みの場合、1増やす
            giveMedalObj.gold[e.playerID!]
              ? giveMedalObj.gold[e.playerID!] += 1
              : giveMedalObj.gold[e.playerID!] = res3.data[0].goldNum! + 1;

            // 待つべき非同期処理の数を減らす
            numAsync--;
            end();
          }
          //銀の人がいれば取得
          else if (index == 1) {
            console.log(`silver score is: ${e.score}`);
            const res3 =
              await supabase
                .from("playerData")
                .select("silverNum")
                .eq("playerID", e.playerID || "");
            //銀の人がGuestだった場合、何もしない

            if (res3.data?.length == 0 || res3.data == null) {
              numAsync--;
              noneDataFunc();
              return;
            }
            //すでにリストに追加済みの場合、1増やす
            giveMedalObj.silver[e.playerID!]
              ? giveMedalObj.silver[e.playerID!] += 1
              : giveMedalObj.silver[e.playerID!] = res3.data[0].silverNum! + 1;


            numAsync--;
            console.log("ログイン済み発見" + e.playerID + ":" + numAsync);
            end();
          }
          //銅の人がいれば取得
          else if (index == 2) {
            console.log(`bronze score is: ${e.score}`);
            const res3 =
              await supabase
                .from("playerData")
                .select("bronzeNum")
                .eq("playerID", e.playerID || "");
            //銅の人がGuestだった場合、何もしない
            if (res3.data?.length == 0 || res3.data == null) {
              numAsync--;
              noneDataFunc();
              return;
            }
            //すでにリストに追加済みの場合、1増やす
            giveMedalObj.bronze[e.playerID!]
              ? giveMedalObj.bronze[e.playerID!] += 1
              : giveMedalObj.bronze[e.playerID!] = res3.data[0].bronzeNum! + 1;

            numAsync--;
            end();
          }


        })
      }

      //並列的に各メダルの更新日を最新にするための関数
      async function updateMedalDate(medal: string) {
        await supabase
          .from("playerData")
          .update({ goldNum: latest.getFullYear(), silverNum: latest.getMonth() + 1, bronzeNum: latest.getDate() })
          .eq("playerID", "developer")
          .eq("name", medal);
      }

      //非同期関数が全て終わおわったら実行される。
      async function end() {
        if (numAsync == 0 && counter == 0) {
          // console.log("end");
          counter++;
          console.log(giveMedalObj);
          //メダルを配布
          //ラグですでに配布されている可能性があるので、goldの最終更新がlatestと一致していないかを
          //調べてから更新する

          var isGoldUpdated = false;
          const res = await supabase
            .from("playerData")
            .select("goldNum,silverNum,bronzeNum")
            .eq("playerID", "developer")
            .eq("name", "G");
          //もしもlatestがすでにDatabaseに反映済みだった場合
          if (latest.getFullYear() == res.data![0].goldNum
            && latest.getMonth() == res.data![0].silverNum
            && latest.getDate() == res.data![0].bronzeNum) {
            isGoldUpdated = true;
          }
          for (const [key, value] of Object.entries(giveMedalObj.gold)) {
            //すでに更新済みでない場合のみ、Goldの数を更新
            if (!isGoldUpdated) {
              //最終更新日時の更新
              updateMedalDate("G")
              //playerDataの更新
              await supabase
                .from("playerData")
                .update({ goldNum: value })
                .eq("playerID", key);
              //ランキングデータ上のメダルも更新
              await supabase
                .from("scoreData")
                .update({ goldNum: value })
                .eq("playerID", key);
            }
          }

          var isSilverUpdated = false;
          const resSil = await supabase
            .from("playerData")
            .select("goldNum,silverNum,bronzeNum")
            .eq("playerID", "developer")
            .eq("name", "S");
          //もしもlatestがすでにDatabaseに反映済みだった場合
          if (latest.getFullYear() == resSil.data![0].goldNum
            && latest.getMonth() == resSil.data![0].silverNum
            && latest.getDate() == resSil.data![0].bronzeNum) {
            isSilverUpdated = true;
          }
          for (const [key, value] of Object.entries(giveMedalObj.silver)) {
            if (!isSilverUpdated) {
              //最終更新日時の更新
              updateMedalDate("S")
              //playerDataの更新
              await supabase
                .from("playerData")
                .update({ silverNum: value })
                .eq("playerID", key);
              //ランキングデータ上のメダルも更新
              await supabase
                .from("scoreData")
                .update({ silverNum: value })
                .eq("playerID", key);
            }
          }

          var isBroUpdated = false;
          const resBro = await supabase
            .from("playerData")
            .select("goldNum,silverNum,bronzeNum")
            .eq("playerID", "developer")
            .eq("name", "G");
          //もしもlatestがすでにDatabaseに反映済みだった場合
          if (latest.getFullYear() == resBro.data![0].goldNum
            && latest.getMonth() == resBro.data![0].silverNum
            && latest.getDate() == resBro.data![0].bronzeNum) {
            isBroUpdated = true;
          }
          for (const [key, value] of Object.entries(giveMedalObj.bronze)) {
            if (!isBroUpdated) {
              updateMedalDate("B")
              await supabase
                .from("playerData")
                .update({ bronzeNum: value })
                .eq("playerID", key);
              //ランキングデータ上のメダルも更新
              await supabase
                .from("scoreData")
                .update({ bronzeNum: value })
                .eq("playerID", key);
            }
          }
          //最新の日付を記録
          // await supabase
          //   .from("playerData")
          //   .update({ goldNum: latest.getFullYear(), silverNum: latest.getMonth() + 1, bronzeNum: latest.getDate() })
          //   .eq("playerID", "developer");
          //insertもしておく
          // await supabase
          //   .from("playerData")
          //   .insert({ playerID: "developer", password: "batchUpdater", goldNum: latest.getFullYear(), silverNum: latest.getMonth() + 1, bronzeNum: latest.getDate(), name: "batch" });
          console.log("success!");
          return;
        }
      }
    }

    return NextResponse.json({ data: "OK" });
  }
  catch (error) {
    console.log(error);
    return NextResponse.json({ data: "none" });
  }
}

interface Dictionary {
  [key: string]: number;
}

type giveMedalType = {
  gold: Dictionary,
  silver: Dictionary,
  bronze: Dictionary,
}
