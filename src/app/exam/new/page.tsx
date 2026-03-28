"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CLINIC } from "@/lib/mock-data";

const LANDMARK_NAMES = [
  { key: "mastoid", label: "乳様突起（耳の後ろ）", desc: "側頭骨の突起部分を触診" },
  { key: "scapula", label: "肩甲下角（肩甲骨の下端）", desc: "肩甲骨の最下端を触診" },
  { key: "iliac", label: "腸骨稜（骨盤の上端）", desc: "骨盤の最上部を触診" },
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

export default function NewExamPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("男性");
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [painLevel, setPainLevel] = useState(5);

  const [standing, setStanding] = useState({ mastoid: 0, scapula: 0, iliac: 0 });
  const [seated, setSeated] = useState({ mastoid: 0, scapula: 0, iliac: 0 });

  const totalSteps = 3;

  const handleComplete = () => {
    alert(
      "デモ版では検査データの保存はできません。\n\n" +
      "実際のシステムでは：\n" +
      "・検査結果が自動保存されます\n" +
      "・AIが診断結果を自動生成します\n" +
      "・セルフケア提案が自動で作られます\n" +
      "・PDFレポートをワンクリックで出力できます"
    );
    router.push("/exam/e1");
  };

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
        <h1 className="font-bold">
          {step === 0 && "患者情報"}
          {step === 1 && "立位検査"}
          {step === 2 && "座位検査"}
        </h1>
        <span className="text-sm text-white/70">{step}/{totalSteps}</span>
      </header>

      {/* プログレスバー */}
      <div className="h-1 bg-gray-200">
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${((step + 1) / (totalSteps + 1)) * 100}%`,
            backgroundColor: CLINIC.themeColor,
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
                className="w-full"
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
            <p className="text-sm text-gray-500 mb-4">患者を立位で後方から観察し、3つのランドマークの高さを評価してください。</p>
            {LANDMARK_NAMES.map((lm) => (
              <LandmarkInput
                key={lm.key}
                label={lm.label}
                desc={lm.desc}
                value={standing[lm.key as keyof typeof standing]}
                onChange={(v) => setStanding((prev) => ({ ...prev, [lm.key]: v }))}
              />
            ))}
          </div>
        )}

        {/* Step 2: 座位検査 */}
        {step === 2 && (
          <div>
            <p className="text-sm text-gray-500 mb-4">患者を座位で後方から観察し、同じ3つのランドマークを再評価してください。</p>
            {LANDMARK_NAMES.map((lm) => (
              <LandmarkInput
                key={lm.key}
                label={lm.label}
                desc={lm.desc}
                value={seated[lm.key as keyof typeof seated]}
                onChange={(v) => setSeated((prev) => ({ ...prev, [lm.key]: v }))}
              />
            ))}

            {/* 立位との比較 */}
            <div className="bg-blue-50 rounded-xl p-4 mt-4 border border-blue-200">
              <p className="text-xs font-bold text-blue-700 mb-2">立位との比較</p>
              {LANDMARK_NAMES.map((lm) => {
                const s = standing[lm.key as keyof typeof standing];
                const se = seated[lm.key as keyof typeof seated];
                const changed = s !== se;
                return (
                  <div key={lm.key} className="flex items-center justify-between text-xs py-1">
                    <span className="text-gray-600">{lm.label.split("（")[0]}</span>
                    <span className={changed ? "text-orange-600 font-bold" : "text-green-600"}>
                      {changed ? "変化あり" : "変化なし"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ナビゲーションボタン */}
        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 py-3 rounded-xl font-bold text-sm border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition"
            >
              戻る
            </button>
          )}
          {step < totalSteps - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex-1 py-3 rounded-xl font-bold text-sm text-white transition hover:opacity-90"
              style={{ backgroundColor: CLINIC.themeColor }}
            >
              次へ
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="flex-1 py-3 rounded-xl font-bold text-sm text-white transition hover:opacity-90 bg-green-600"
            >
              診断結果を見る
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
