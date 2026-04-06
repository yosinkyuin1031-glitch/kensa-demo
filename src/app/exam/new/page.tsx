"use client";

import { useState } from "react";
import Link from "next/link";
import { CLINIC } from "@/lib/mock-data";
import {
  diagnose,
  getSelfcare,
  type PositionData,
  type LandmarkValue,
  type DiagnosisResult,
} from "@/lib/diagnosis";

const LANDMARK_NAMES = [
  { key: "mastoid", label: "乳様突起（首の後ろ）", simpleName: "首の後ろ", desc: "側頭骨の突起部分を触診" },
  { key: "scapula", label: "肩甲下角（肩甲骨の下）", simpleName: "肩甲骨の下", desc: "肩甲骨の最下端を触診" },
  { key: "iliac", label: "腸骨稜（骨盤の外側）", simpleName: "骨盤の外側", desc: "骨盤の最上部を触診" },
];

function LandmarkInput({
  label,
  desc,
  value,
  onChange,
}: {
  label: string;
  desc: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 mb-3">
      <p className="text-sm font-bold text-[var(--primary)] mb-1">{label}</p>
      <p className="text-xs text-gray-500 mb-3">{desc}</p>
      <div className="flex gap-2">
        {[
          { val: -1, label: "左が高い", color: "bg-blue-500" },
          { val: 0, label: "均等", color: "bg-green-500" },
          { val: 1, label: "右が高い", color: "bg-orange-500" },
        ].map((opt) => (
          <button
            key={opt.val}
            onClick={() => onChange(opt.val)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              value === opt.val
                ? `${opt.color} text-white shadow-md scale-105`
                : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function landmarkDisplay(val: LandmarkValue) {
  if (val === -1) return { text: "左が高い", color: "text-blue-600", bg: "bg-blue-50" };
  if (val === 1) return { text: "右が高い", color: "text-orange-600", bg: "bg-orange-50" };
  return { text: "均等", color: "text-green-600", bg: "bg-green-50" };
}

function causeColor(cause: string) {
  if (cause === "foot") return { border: "border-amber-200", bg: "bg-amber-50" };
  if (cause === "upperBody") return { border: "border-blue-200", bg: "bg-blue-50" };
  if (cause === "cranialPelvic") return { border: "border-red-200", bg: "bg-red-50" };
  if (cause === "spine") return { border: "border-purple-200", bg: "bg-purple-50" };
  return { border: "border-green-200", bg: "bg-green-50" };
}

export default function NewExamPage() {
  const [step, setStep] = useState(0);
  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("男性");
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [painLevel, setPainLevel] = useState(5);
  const [standing, setStanding] = useState<PositionData>({ mastoid: 0, scapula: 0, iliac: 0 });
  const [seated, setSeated] = useState<PositionData>({ mastoid: 0, scapula: 0, iliac: 0 });
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [selfcare, setSelfcare] = useState<string[]>([]);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  const totalSteps = 4; // 患者情報 → 立位 → 座位 → 結果

  const runDiagnosis = () => {
    const diagResult = diagnose(standing, seated);
    const selfcareList = getSelfcare(diagResult);
    setResult(diagResult);
    setSelfcare(selfcareList);
    setStep(3);
  };

  const handlePdfExport = async (type: "patient" | "clinical") => {
    setPdfGenerating(true);
    // 動的にjsPDFをインポート
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    // ヘッダー
    doc.setFillColor(33, 150, 243);
    doc.rect(0, 0, 210, 25, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text(type === "patient" ? "Body Check Report" : "Clinical Examination Report", 15, 16);

    // 患者情報
    doc.setTextColor(20, 37, 42);
    doc.setFontSize(10);
    doc.text(`Patient: ${patientName || "Demo Patient"}`, 15, 35);
    doc.text(`Date: ${new Date().toLocaleDateString("ja-JP")}`, 15, 42);
    doc.text(`Age: ${age || "-"} / Gender: ${gender}`, 120, 35);
    doc.text(`Pain Level: ${painLevel}/10`, 120, 42);

    // 主訴
    doc.setFontSize(9);
    doc.text(`Chief Complaint: ${chiefComplaint || "-"}`, 15, 52);

    // 診断結果
    if (result) {
      doc.setFillColor(245, 245, 245);
      doc.rect(15, 58, 180, 25, "F");
      doc.setFontSize(11);
      doc.setTextColor(20, 37, 42);
      doc.text(`Diagnosis: ${result.icon} ${result.label}`, 20, 68);
      doc.setFontSize(8);
      doc.text(result.summary.substring(0, 80), 20, 76);

      // 施術対象
      doc.setFontSize(9);
      doc.text(`Treatment Area: ${result.treatmentArea}`, 15, 92);

      // 検査データテーブル
      doc.setFontSize(10);
      doc.text("Examination Data", 15, 105);
      doc.setFontSize(8);

      const headers = ["Landmark", "Standing", "Seated"];
      const startY = 112;
      headers.forEach((h, i) => {
        doc.setFillColor(33, 150, 243);
        doc.setTextColor(255, 255, 255);
        doc.rect(15 + i * 60, startY, 60, 8, "F");
        doc.text(h, 20 + i * 60, startY + 6);
      });

      const rows = [
        { name: "Mastoid (Behind Neck)", s: standing.mastoid, se: seated.mastoid },
        { name: "Scapula Inf. (Below Scapula)", s: standing.scapula, se: seated.scapula },
        { name: "Iliac Crest (Outer Pelvis)", s: standing.iliac, se: seated.iliac },
      ];
      doc.setTextColor(20, 37, 42);
      rows.forEach((row, i) => {
        const y = startY + 8 + i * 8;
        if (i % 2 === 0) {
          doc.setFillColor(250, 250, 250);
          doc.rect(15, y, 180, 8, "F");
        }
        doc.text(row.name, 20, y + 6);
        doc.text(row.s === -1 ? "Left High" : row.s === 1 ? "Right High" : "Even", 80, y + 6);
        doc.text(row.se === -1 ? "Left High" : row.se === 1 ? "Right High" : "Even", 140, y + 6);
      });

      // セルフケア（患者用のみ）
      if (type === "patient" && selfcare.length > 0) {
        doc.setFontSize(10);
        doc.text("Self-Care Recommendations", 15, 150);
        doc.setFontSize(8);
        selfcare.forEach((care, i) => {
          const text = `${i + 1}. ${care}`;
          const lines = doc.splitTextToSize(text, 170);
          doc.text(lines, 20, 158 + i * 12);
        });
      }

      // 分析ステップ（臨床用のみ）
      if (type === "clinical" && result.steps.length > 0) {
        doc.setFontSize(10);
        doc.text("Analysis Steps", 15, 150);
        doc.setFontSize(8);
        result.steps.forEach((s, i) => {
          doc.text(`Step ${s.step}: ${s.name}`, 20, 158 + i * 10);
          doc.text(s.finding.substring(0, 90), 25, 164 + i * 10);
        });
      }
    }

    // フッター
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text("Generated by Kensa Sheet System - Demo", 15, 285);
    doc.text(`Page 1 / 1`, 180, 285);

    doc.save(
      type === "patient"
        ? `body-check-report-${patientName || "demo"}.pdf`
        : `clinical-report-${patientName || "demo"}.pdf`
    );
    setPdfGenerating(false);
  };

  const stepTitle = ["患者情報", "立位検査", "座位検査", "診断結果"][step];

  return (
    <div className="min-h-screen">
      {/* デモバナー */}
      <div className="bg-amber-500 text-white text-center py-2 px-4 text-sm font-bold">
        これはデモ画面です。実際に操作してお試しください。
      </div>

      {/* ヘッダー */}
      <header
        className="text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40"
        style={{ backgroundColor: CLINIC.themeColor }}
      >
        <Link href="/" className="text-white/70 hover:text-white text-sm">
          ← 戻る
        </Link>
        <h1 className="font-bold">{stepTitle}</h1>
        <span className="text-sm text-white/70">
          {step < 3 ? `${step}/${totalSteps - 1}` : "完了"}
        </span>
      </header>

      {/* プログレスバー */}
      <div className="h-1 bg-gray-200">
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${((step + 1) / totalSteps) * 100}%`,
            backgroundColor: step === 3 ? "#22c55e" : CLINIC.themeColor,
          }}
        />
      </div>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Step 0: 患者情報 */}
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-[var(--primary)] mb-1 block">患者名 *</label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="例: 山田 太郎"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--accent)] outline-none text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-bold text-[var(--primary)] mb-1 block">年齢</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="45"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--accent)] outline-none text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-[var(--primary)] mb-1 block">性別</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--accent)] outline-none text-sm bg-white"
                >
                  <option>男性</option>
                  <option>女性</option>
                  <option>その他</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-bold text-[var(--primary)] mb-1 block">主訴 *</label>
              <textarea
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                placeholder="例: 右肩の痛み、首のこり"
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--accent)] outline-none text-sm resize-none"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-[var(--primary)] mb-1 block">
                痛みレベル（NRS）: {painLevel}/10
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={painLevel}
                onChange={(e) => setPainLevel(Number(e.target.value))}
                className="w-full accent-[var(--accent)]"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>痛みなし</span>
                <span>最大の痛み</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: 立位検査 */}
        {step === 1 && (
          <div>
            <p className="text-sm text-gray-500 mb-4">
              患者を立位で後方から観察し、3つのランドマークの高さを評価してください。
            </p>
            {LANDMARK_NAMES.map((lm) => (
              <LandmarkInput
                key={lm.key}
                label={lm.label}
                desc={lm.desc}
                value={standing[lm.key as keyof typeof standing]}
                onChange={(v) =>
                  setStanding((prev) => ({ ...prev, [lm.key]: v as LandmarkValue }))
                }
              />
            ))}
          </div>
        )}

        {/* Step 2: 座位検査 */}
        {step === 2 && (
          <div>
            <p className="text-sm text-gray-500 mb-4">
              患者を座位で後方から観察し、同じ3つのランドマークを再評価してください。
            </p>
            {LANDMARK_NAMES.map((lm) => (
              <LandmarkInput
                key={lm.key}
                label={lm.label}
                desc={lm.desc}
                value={seated[lm.key as keyof typeof seated]}
                onChange={(v) =>
                  setSeated((prev) => ({ ...prev, [lm.key]: v as LandmarkValue }))
                }
              />
            ))}
            <div className="bg-blue-50 rounded-xl p-4 mt-4 border border-blue-200">
              <p className="text-xs font-bold text-blue-700 mb-2">立位との比較（リアルタイム）</p>
              {LANDMARK_NAMES.map((lm) => {
                const s = standing[lm.key as keyof typeof standing];
                const se = seated[lm.key as keyof typeof seated];
                const changed = s !== se;
                return (
                  <div key={lm.key} className="flex items-center justify-between text-xs py-1">
                    <span className="text-gray-600">{lm.label.split("（")[0]}</span>
                    <span className={changed ? "text-orange-600 font-bold" : "text-green-600"}>
                      {changed ? "変化あり → 足部の影響" : "変化なし"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: 診断結果 */}
        {step === 3 && result && (
          <div className="space-y-6">
            {/* 患者情報サマリー */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-black text-lg text-[var(--primary)]">
                    {patientName || "デモ患者"}
                  </h2>
                  <p className="text-xs text-gray-400">
                    {age ? `${age}歳` : ""} {gender} / {new Date().toLocaleDateString("ja-JP")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">NRS</p>
                  <p
                    className="text-xl font-black"
                    style={{
                      color: painLevel >= 7 ? "#f44336" : painLevel >= 4 ? "#FF9800" : "#4CAF50",
                    }}
                  >
                    {painLevel}<span className="text-sm text-gray-400">/10</span>
                  </p>
                </div>
              </div>
              {chiefComplaint && (
                <div className="bg-gray-50 rounded-lg p-3 mt-3">
                  <p className="text-xs text-gray-500">主訴</p>
                  <p className="text-sm">{chiefComplaint}</p>
                </div>
              )}
            </div>

            {/* 診断結果カード */}
            {(() => {
              const cc = causeColor(result.primaryCause);
              return (
                <div className={`rounded-2xl p-6 border-2 ${cc.border} ${cc.bg}`}>
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{result.icon}</span>
                    <div>
                      <h3 className="font-black text-[var(--primary)] text-lg">{result.label}</h3>
                      <p className="text-sm text-gray-700 leading-relaxed mt-1">{result.summary}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-white/70 rounded-xl p-3">
                      <p className="text-[10px] text-gray-500">施術対象部位</p>
                      <p className="text-xs font-bold text-[var(--primary)]">{result.treatmentArea}</p>
                    </div>
                    <div className="bg-white/70 rounded-xl p-3">
                      <p className="text-[10px] text-gray-500">パターン</p>
                      <p className="text-xs font-bold text-[var(--primary)]">
                        {result.pattern === "zenran"
                          ? "全乱"
                          : result.pattern === "taigaichigai"
                          ? "互い違い"
                          : "正常"}
                        {result.direction !== "none" &&
                          ` (${result.direction === "left" ? "左" : "右"})`}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* 分析ステップ */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-[var(--primary)] mb-3">分析ステップ</h3>
              <div className="space-y-3">
                {result.steps.map((s) => (
                  <div key={s.step} className="flex items-start gap-3">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: CLINIC.themeColor }}
                    >
                      {s.step}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[var(--primary)]">{s.name}</p>
                      <p className="text-xs text-gray-600">{s.finding}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 検査データテーブル */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-[var(--primary)] mb-3">検査データ</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-2 text-gray-500 font-medium text-xs">ランドマーク</th>
                    <th className="text-center py-2 px-2 text-gray-500 font-medium text-xs">立位</th>
                    <th className="text-center py-2 px-2 text-gray-500 font-medium text-xs">座位</th>
                  </tr>
                </thead>
                <tbody>
                  {(["mastoid", "scapula", "iliac"] as const).map((key) => {
                    const labels = { mastoid: "乳様突起（首の後ろ）", scapula: "肩甲下角（肩甲骨の下）", iliac: "腸骨稜（骨盤の外側）" };
                    const sv = landmarkDisplay(standing[key]);
                    const se = landmarkDisplay(seated[key]);
                    return (
                      <tr key={key} className="border-b border-gray-50">
                        <td className="py-2 px-2 font-medium text-[var(--primary)] text-xs">
                          {labels[key]}
                        </td>
                        <td className="py-2 px-2 text-center">
                          <span className={`inline-block px-2 py-1 rounded-lg text-[10px] font-bold ${sv.bg} ${sv.color}`}>
                            {sv.text}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-center">
                          <span className={`inline-block px-2 py-1 rounded-lg text-[10px] font-bold ${se.bg} ${se.color}`}>
                            {se.text}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* セルフケア提案 */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-sm font-bold">AI</span>
                </div>
                <h3 className="font-bold text-[var(--primary)]">セルフケア提案</h3>
                <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  自動生成
                </span>
              </div>
              <div className="space-y-3">
                {selfcare.map((care, i) => (
                  <div key={i} className="flex items-start gap-3 bg-green-50 rounded-xl p-4">
                    <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center text-green-700 text-xs font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{care}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* PDF出力ボタン */}
            <div className="space-y-3">
              <button
                onClick={() => handlePdfExport("patient")}
                disabled={pdfGenerating}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-colors hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ backgroundColor: CLINIC.themeColor }}
              >
                {pdfGenerating ? (
                  "PDF生成中..."
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    PDF出力（患者用レポート）
                  </>
                )}
              </button>
              <button
                onClick={() => handlePdfExport("clinical")}
                disabled={pdfGenerating}
                className="w-full py-3.5 rounded-xl font-bold text-sm border-2 transition-colors hover:bg-gray-50 disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ borderColor: CLINIC.themeColor, color: CLINIC.themeColor }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                施術提案書PDF
              </button>
            </div>

            {/* ダッシュボードに戻る */}
            <Link
              href="/"
              className="block text-center text-[var(--accent)] text-sm hover:underline mt-4"
            >
              ダッシュボードに戻る
            </Link>
          </div>
        )}

        {/* ナビゲーションボタン（結果画面以外） */}
        {step < 3 && (
          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 py-3 rounded-xl font-bold text-sm border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition"
              >
                戻る
              </button>
            )}
            {step < 2 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex-1 py-3 rounded-xl font-bold text-sm text-white transition hover:opacity-90"
                style={{ backgroundColor: CLINIC.themeColor }}
              >
                次へ
              </button>
            ) : (
              <button
                onClick={runDiagnosis}
                className="flex-1 py-3 rounded-xl font-bold text-sm text-white transition hover:opacity-90 bg-green-600"
              >
                診断を実行する
              </button>
            )}
          </div>
        )}
      </main>

      {/* フッター */}
      <footer className="text-center py-6 text-xs text-gray-400">
        <p>カラダマップ デモ版</p>
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
