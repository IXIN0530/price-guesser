import { QuestionType } from "@/type";
import functions from "./functions";
import Image from "next/image";

type Props = {
  data: QuestionType
}
const QuestionField = ({ data }: Props) => {
  //functionを取得
  const { convertDescription } = functions();
  if (!data) return null;
  return (
    <div className="gap-1 border border-sky-500 w-4/5 bg-sky-100 max-w-[600px] rounded-lg shadow-lg grid grid-rows-2 h-full p-1">
      <div className="row-span-1 flex justify-center">
        <Image
          className=" shadow-lg rounded-lg"
          width={500}
          height={500}
          src={data.imageUrls.replace(/\/g\//, "/n/")}
          alt=""
          layout="intrinsic"
          unoptimized />
      </div>
      <div className="row-span-1 flex justify-center overflow-y-scroll">
        <p className="text-lg whitespace-pre-wrap">{convertDescription(data.description)}</p>
      </div>
    </div>
  )
}

export default QuestionField;