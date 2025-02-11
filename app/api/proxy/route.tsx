import api from "@/components/api";
import functions from "@/components/functions";
import axios from "axios";
import { error } from "console";
import { param } from "framer-motion/m";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export const GET = async () => {
  const { makeQuery } = functions();
  const query = makeQuery();
  console.log(query)

  try {
    const response = await axios.get(`https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch`, { params: query });
    const data = response.data
    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'CSVデータの取得に失敗しました' }, { status: 500 })
  }

}