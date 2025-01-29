import { Database } from "./types/supabase";

export type QuestionType = {
    description: string;
    price: number;
    imageUrls: string;
    name: string;
}

export type LocalRankingType = {
    score: number;
    name: string;
    date: string;
    pointDetail: number[];
}

export type globalRankingType = Database["public"]["Tables"]["scoreData"]["Row"]