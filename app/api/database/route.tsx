import supabase from "@/components/supabase/supabase";
import { globalRankingType } from "@/type";
import { data } from "framer-motion/m";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, res: NextResponse) => {
  //クエリを取得
  const { searchParams } = new URL(req.url);
  const year = Number(searchParams.get("year"));
  const month = Number(searchParams.get("month"));
  const day = Number(searchParams.get("day"));
  //0でその日のランキングデータを取得
  //1で全てのランキングデータを取得
  const getAll = searchParams.get("getAll");
  try {
    //条件に合うランキングデータを取得する
    if (getAll === "0") {
      const res =
        await supabase
          .from("scoreData")
          .select("*")
          .eq("year", year)
          .eq("month", month)
          .eq("day", day)
          .order("score", { ascending: false });
      // console.log(res);
      const returnData: globalRankingType[] = res.data || []
      return NextResponse.json({ data: returnData });
    }
    else {
      const res =
        await supabase
          .from("scoreData")
          .select("*")
          .order("score", { ascending: false });
      const returnData: globalRankingType[] = res.data || []
      return NextResponse.json({ data: returnData });
    }
  }
  catch (error) {
    console.log(error);
    //エラーの内容を返す
    return NextResponse.json({ message: error });
  }

}


export const POST = async () => {
  const tempData = {
    year: 2021,
    month: 1,
    day: 1,
    scoreDetail: '1,2,3',
    score: 6,
  }
}