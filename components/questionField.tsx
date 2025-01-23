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
      <div className="row-span-1 flex justify-center ">
        <Image
          className=" shadow-lg rounded-lg"
          width={500}
          height={500}
          src={data.imageUrls.replace(/\/g\//, "/n/")}
          alt=""
          layout="intrinsic"
          unoptimized />
      </div>
      <div className="row-span-1 grid grid-cols-4">
        <div className="col-span-3 overflow-y-scroll">
          <p className="text-lg whitespace-pre-wrap">
            {convertDescription(data.description)}
          </p>
        </div>
        <div className="col-span-1 overflow-y-scroll">
          <p className="text-sm text-center py-2 font-bold underline">
            Title
          </p>
          <p className="text-lg whitespace-pre-wrap">
            {data.name}
          </p>
        </div>
      </div>
    </div>
  )
}

export default QuestionField;