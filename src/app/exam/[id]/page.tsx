"use client";

import { use } from "react";
import Link from "next/link";
import { CLINIC, EXAMS } from "@/lib/mock-data";

const LANDMARK_LABELS: Record<string, string> = {
  mastoid: "乳様突起",
  scapula: "肩甲下角",
  iliac: "腸骨稜",
};

function landmarkDisplay(val: number) {
  if (val === -1) return { text: "左が高い", color: "text-blue-600", bg: "bg-blue-50" };
  if (val === 1) return { text: "右が高い", color: "text-orange-600", bg: "bg-orange-50" };
  return { text: "均等", color: "text-green-600", bg: "bg-green-50" };
}

function DiagnosisIcon({ type }: { type: string }) {
  if (type === "success")
    return <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xl font-bold">&#10003;</div>;
  if (type === "warning")
    return <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-xl font-bold">!</div>;
  return <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl font-bold">i</div>;
}

function diagnosisColor(type: string) {
  if (type === "success") return { border: "border-green-200", bg: "bg-green-50" };
  if (type === "warning") return { border: "border-orange-200", bg: "bg-orange-50" };
  return { border: "border-blue-200", bg: "bg-blue-50" };
}

export default function ExamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const exam = EXAMS.find((e) => e.id === id);

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">検査データが見つかりません</p>
          <Link href="/" className="text-[var(--accent)] hover:underline">ダッシュボードに戻る</Link>
        </div>
      </div>
    );
  }

  const dc = diagnosisColor(exam.diagnosis.icon);

  return (
    <div className="min-h-screen">
      {/* デモバナー */}
      <div className="bg-amber-500 text-white text-center py-2 px-4 text-sm font-bold">
        これはデモ画面です。実際のデータではありません。
      </div>

      {/* ヘッダー */}
      <header
        className="text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40"
        style={{ backgroundColor: CLINIC.themeColor }}
      >
        <Link href="/exam/history" className="text-white/70 hover:text-white text-sm">
          ← 検査履歴
        </Link>
        <h1 className="font-bold">検査結果</h1>
        <span className="bg-white/20 px-3 py-1 rounded-lg text-xs">デモモード</span>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* 患者情報カード */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-black text-[var(--primary)]">{exam.patientName}</h2>
                <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {exam.visitType}
                </span>
              </div>
              <p className="text-xs text-gray-400">{exam.examDate}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">痛み（NRS）</p>
              <p className="text-xl font-black" style={{ color: exam.painLevel >= 7 ? "var(--danger)" : exam.painLevel >= 4 ? "var(--warning)" : "var(--success)" }}>
                {exam.painLevel}<span className="text-sm text-gray-400">/10</span>
              </p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">主訴</p>
            <p className="text-sm font-medium">{exam.chiefComplaint}</p>
          </div>
        </div>

        {/* 診断結果 */}
        <div className={`rounded-2xl p-6 border-2 ${dc.border} ${dc.bg}`}>
          <div className="flex items-start gap-4">
            <DiagnosisIcon type={exam.diagnosis.icon} />
            <div className="flex-1">
              <h3 className="font-black text-[var(--primary)] mb-1">{exam.diagnosis.label}</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{exam.diagnosis.summary}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-white/70 rounded-xl p-3">
              <p className="text-[10px] text-gray-500 mb-0.5">施術対象部位</p>
              <p className="text-xs font-bold text-[var(--primary)]">{exam.diagnosis.treatmentArea}</p>
            </div>
            <div className="bg-white/70 rounded-xl p-3">
              <p className="text-[10px] text-gray-500 mb-0.5">重心バランス</p>
              <p className="text-xs font-bold text-[var(--primary)]">{exam.diagnosis.weightBalance}</p>
            </div>
          </div>
        </div>

        {/* ランドマーク検査データ */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-[var(--primary)] mb-4">検査データ</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">ランドマーク</th>
                  <th className="text-center py-2 px-3 text-gray-500 font-medium">立位</th>
                  <th className="text-center py-2 px-3 text-gray-500 font-medium">座位</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(exam.landmarks.standing).map((key) => {
                  const standVal = exam.landmarks.standing[key as keyof typeof exam.landmarks.standing];
                  const seatVal = exam.landmarks.seated[key as keyof typeof exam.landmarks.seated];
                  const standD = landmarkDisplay(standVal);
                  const seatD = landmarkDisplay(seatVal);
                  return (
                    <tr key={key} className="border-b border-gray-50">
                      <td className="py-3 px-3 font-medium text-[var(--primary)]">
                        {LANDMARK_LABELS[key] || key}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${standD.bg} ${standD.color}`}>
                          {standD.text}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${seatD.bg} ${seatD.color}`}>
                          {seatD.text}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 人体図（簡易SVG） */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-[var(--primary)] mb-4">姿勢分析図</h3>
          <div className="flex justify-center">
            <svg viewBox="0 0 200 300" className="w-48 h-72">
              {/* 体のアウトライン */}
              <ellipse cx="100" cy="40" rx="25" ry="30" fill="none" stroke="#ccc" strokeWidth="2" />
              <line x1="100" y1="70" x2="100" y2="180" stroke="#ccc" strokeWidth="2" />
              <line x1="100" y1="90" x2="50" y2="140" stroke="#ccc" strokeWidth="2" />
              <line x1="100" y1="90" x2="150" y2="140" stroke="#ccc" strokeWidth="2" />
              <line x1="100" y1="180" x2="70" y2="280" stroke="#ccc" strokeWidth="2" />
              <line x1="100" y1="180" x2="130" y2="280" stroke="#ccc" strokeWidth="2" />

              {/* 乳様突起マーカー */}
              <circle
                cx={100 + exam.landmarks.standing.mastoid * 8}
                cy="35"
                r="6"
                fill={exam.landmarks.standing.mastoid === 0 ? "#4CAF50" : "#FF9800"}
                opacity="0.8"
              />
              <text x="165" y="38" fontSize="8" fill="#666">乳様突起</text>

              {/* 肩甲下角マーカー */}
              <circle
                cx={100 + exam.landmarks.standing.scapula * 8}
                cy="100"
                r="6"
                fill={exam.landmarks.standing.scapula === 0 ? "#4CAF50" : "#FF9800"}
                opacity="0.8"
              />
              <text x="165" y="103" fontSize="8" fill="#666">肩甲下角</text>

              {/* 腸骨稜マーカー */}
              <circle
                cx={100 + exam.landmarks.standing.iliac * 8}
                cy="175"
                r="6"
                fill={exam.landmarks.standing.iliac === 0 ? "#4CAF50" : "#FF9800"}
                opacity="0.8"
              />
              <text x="165" y="178" fontSize="8" fill="#666">腸骨稜</text>

              {/* 凡例 */}
              <circle cx="20" cy="260" r="4" fill="#4CAF50" />
              <text x="28" y="263" fontSize="7" fill="#666">均等</text>
              <circle cx="60" cy="260" r="4" fill="#FF9800" />
              <text x="68" y="263" fontSize="7" fill="#666">偏位あり</text>
            </svg>
          </div>
        </div>

        {/* セルフケア提案 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-sm">AI</span>
            </div>
            <h3 className="font-bold text-[var(--primary)]">セルフケア提案</h3>
            <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold">AI自動生成</span>
          </div>
          <div className="space-y-3">
            {exam.selfcare.map((care, i) => (
              <div key={i} className="flex items-start gap-3 bg-green-50 rounded-xl p-4">
                <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center text-green-700 text-xs font-bold flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <p className="text-sm text-gray-700">{care}</p>
              </div>
            ))}
          </div>
        </div>

        {/* アクションボタン */}
        <div className="flex gap-3">
          <button
            className="flex-1 py-3 rounded-xl font-bold text-sm text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: CLINIC.themeColor }}
            onClick={() => alert("デモ版ではPDF出力はできません。\n実際のシステムでは患者用・施術者用の\n2種類のPDFを自動生成します。")}
          >
            PDF出力（患者用）
          </button>
          <button
            className="flex-1 py-3 rounded-xl font-bold text-sm border-2 transition-colors hover:bg-gray-50"
            style={{ borderColor: CLINIC.themeColor, color: CLINIC.themeColor }}
            onClick={() => alert("デモ版ではPDF出力はできません。\n施術提案書には治療方針・通院プラン・\nセルフケア指導が含まれます。")}
          >
            施術提案書PDF
          </button>
        </div>
      </main>

      {/* フッター */}
      <footer className="text-center py-6 text-xs text-gray-400">
        <p>検査シート作成システム デモ版</p>
        <a
          href="https://clinic-saas-lp.vercel.app/systems/kensa"
          className="text-[var(--accent)] hover:underline mt-1 inline-block"
        >
          導入のご相談はこちら
        </a>
      </footer>
    </div>
  );
}
