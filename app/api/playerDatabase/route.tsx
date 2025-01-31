import supabase from "@/components/supabase/supabase";
import { PlayerDataType } from "@/type";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const playerID = searchParams.get("playerID");
  const password = searchParams.get("password");

  //player情報があるかをIDで検索
  try {
    const res = await supabase
      .from("playerData")
      .select("*")
      .eq("playerID", playerID || "")
      .eq("password", password || "");

    console.log(res);
    const resData: PlayerDataType[] = res.data || [];
    return NextResponse.json({ data: resData });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ data: "none" });
  }
}

export const POST = async (req: NextRequest) => {
  const body: any = await req.json();
  const { playerID, password, name } = body;

  //すでにそのIDが存在するか
  try {
    const res = await supabase
      .from("playerData")
      .select("*")
      .eq("playerID", playerID || "");

    const resData: PlayerDataType[] = res.data || [];
    //すでにIDが存在する場合
    if (resData.length > 0) {
      return NextResponse.json({ message: "IDがすでに存在します。" });
    }
    //IDが存在しない場合、新規作成
    const data = {
      playerID: playerID || "",
      password: password || "",
      goldNum: 0,
      silverNum: 0,
      bronzeNum: 0,
      name: name || "名無し",
    }
    const res2 = await supabase
      .from("playerData")
      .insert(data);
    return NextResponse.json({ message: "TRUE" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "none" });
  }
}