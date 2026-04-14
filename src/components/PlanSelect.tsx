"use client"

export default function PlanSelect() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-3xl w-full">
        {/* ヘッダー */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-bold mb-6">
            デモ期間が終了しました
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-3">
            カラダマップを導入しませんか？
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            検査入力3分。記録・分析・PDF出力まで自動化。<br />
            治療・教育・自分の時間に集中できる環境を作ります。
          </p>
        </div>

        {/* 料金プラン */}
        <p className="text-center text-gray-500 mb-8">院の規模や使い方に合わせて選べる2プラン</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {/* Lite */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <p className="text-sm font-bold text-blue-600 mb-2">Lite プラン</p>
            <p className="text-4xl font-bold text-gray-900 mb-1">
              3,980<span className="text-lg font-normal text-gray-500">円/月</span>
            </p>
            <p className="text-sm text-gray-500 mb-6">初期費用 11,000円（税込）</p>
            <ul className="space-y-3 text-sm text-gray-600">
              {[
                "5段階検査ウィザード",
                "段階的原因特定ロジック",
                "患者用・施術者用PDF出力",
                "テキスト版セルフケア提案",
                "経過比較・改善度トラッキング",
                "患者数無制限",
                "導入サポート付き",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <span className="text-blue-500 flex-shrink-0">✓</span>
                  {t}
                </li>
              ))}
            </ul>
            <a
              href="https://lin.ee/qvChhK3"
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-8 text-center bg-white text-blue-600 font-bold py-3 rounded-xl border-2 border-blue-600 hover:bg-blue-50 transition"
            >
              Liteで始める
            </a>
          </div>

          {/* Pro */}
          <div className="bg-blue-600 rounded-2xl p-8 shadow-lg text-white relative">
            <span className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
              おすすめ
            </span>
            <p className="text-sm font-bold text-blue-200 mb-2">Pro プラン</p>
            <p className="text-4xl font-bold mb-1">
              9,800<span className="text-lg font-normal text-blue-200">円/月</span>
            </p>
            <p className="text-sm text-blue-200 mb-6">初期費用 11,000円（税込）</p>
            <ul className="space-y-3 text-sm text-blue-100">
              {[
                "Liteの全機能",
                "イラスト付きセルフケア提案",
                "詳細な施術プロトコル表示",
                "AI姿勢分析（カメラ撮影）",
                "ダッシュボード・統計分析",
                "優先サポート",
                "新機能の先行アクセス",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <span className="text-yellow-300 flex-shrink-0">✓</span>
                  {t}
                </li>
              ))}
            </ul>
            <a
              href="https://lin.ee/qvChhK3"
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-8 text-center bg-white text-blue-600 font-bold py-3 rounded-xl hover:bg-blue-50 transition"
            >
              Proについて相談する
            </a>
          </div>
        </div>

        {/* 補足 */}
        <div className="text-center space-y-3">
          <p className="text-xs text-gray-400">
            全て税込表示です。最低契約期間：6ヶ月。
          </p>
          <p className="text-xs text-gray-400">
            導入の相談・質問は
            <a href="https://lin.ee/qvChhK3" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline ml-1">
              公式LINE
            </a>
            からお気軽にどうぞ
          </p>
        </div>
      </div>
    </div>
  )
}
