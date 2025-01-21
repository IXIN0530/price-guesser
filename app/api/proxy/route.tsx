import api from "@/components/api";
import functions from "@/components/functions";
import axios from "axios";
import { param } from "framer-motion/m";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export const GET = async () => {
  const { makeQuery } = functions();
  const query = makeQuery();

  try {
    const response = await axios.get(`https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch`, { params: query });
    const data = response.data
    return NextResponse.json(data)
  } catch (error) {
    console.error('CSVデータの取得に失敗しました', error)
    return NextResponse.json({ error: 'CSVデータの取得に失敗しました' }, { status: 500 })
  }

}