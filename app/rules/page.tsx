import Link from "next/link";
const Page = () => {
  return (
    <div className="min-h-[100svh] flex flex-col justify-center gap-4 mx-2 text-sm items-center">
      {/* 点数方式の説明を書く */}
      <p className="">
        このゲームは、ランダムな商品の値段(円)を当てるゲームです。商品の「画像」、「説明」が与えられるので、その商品の値段を予想してください。
      </p>
      <p>
        予想した値段と実際の値段の比率によって、点数が決まります。つまり予想が外れるほど点数は下がります。
      </p>
      <p>
        点数は、x＞0として、正解の値段に対する予想値段の比率がx、または1/xのとき、「100/(2^(x-1))」で定義されています。
      </p>
      <p>
        例えば、予想が正解の3倍、または1/3倍の時、点数はどちらも25点です。
      </p>

      <p>
        計5回、500点満点でのプレイとなります！今後、ランキング機能、対戦機能も実装していく予定なのでぜひお楽しみください！
      </p>

      <Link href={"../"} className="underline">戻る</Link>
    </div>
  )
}

export default Page;