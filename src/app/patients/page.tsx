"use client";

import { useState } from "react";
import Link from "next/link";
import { CLINIC, PATIENTS, EXAMS } from "@/lib/mock-data";

export default function PatientsPage() {
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  const filtered = PATIENTS.filter((p) =>
    p.name.includes(search) || p.chiefComplaint.includes(search)
  );

  const selected = PATIENTS.find((p) => p.id === selectedPatient);
  const selectedExams = EXAMS.filter((e) => e.patientId === selectedPatient);

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
        <div className="flex items-center gap-3">
          <Link href="/" className="text-white/70 hover:text-white text-sm">
            ← ダッシュボード
          </Link>
        </div>
        <h1 className="font-bold">患者���覧</h1>
        <span className="bg-white/20 px-3 py-1 rounded-lg text-xs">デモモード</span>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* 検索 */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="患者名・症状で検索..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none text-sm"
          />
          <p className="text-xs text-gray-400 mt-2">{filtered.length}名の患者</p>
        </div>

        {/* 患者テーブル */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-50">
            {filtered.map((patient) => (
              <button
                key={patient.id}
                onClick={() => setSelectedPatient(patient.id)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-[var(--primary)]">{patient.name}</span>
                    <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full">
                      {patient.gender}
                    </span>
                    <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full">
                      {patient.age}歳
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{patient.chiefComplaint}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{patient.occupation}</p>
                </div>
                <div className="text-right ml-4 flex-shrink-0">
                  <p className="text-xs font-bold text-[var(--accent)]">検査 {patient.examCount}回</p>
                  <p className="text-xs text-gray-400">{patient.lastExamDate}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* 患者詳細モーダル */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto">
            <div
              className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between text-white rounded-t-2xl"
              style={{ backgroundColor: CLINIC.themeColor }}
            >
              <h2 className="font-bold">{selected.name}</h2>
              <button
                onClick={() => setSelectedPatient(null)}
                className="text-white/70 hover:text-white text-xl"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              {/* 基本情報 */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500">年齢</p>
                  <p className="font-bold text-sm">{selected.age}���</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500">性別</p>
                  <p className="font-bold text-sm">{selected.gender}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500">職業</p>
                  <p className="font-bold text-sm truncate">{selected.occupation}</p>
                </div>
              </div>

              {/* 既往歴・メモ */}
              <div className="space-y-3 mb-6">
                <div>
                  <p className="text-xs text-gray-500 mb-1">既往歴</p>
                  <p className="text-sm bg-gray-50 rounded-lg p-3">{selected.medicalHistory}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">メモ</p>
                  <p className="text-sm bg-gray-50 rounded-lg p-3">{selected.memo}</p>
                </div>
              </div>

              {/* 検査履歴 */}
              <h3 className="font-bold text-sm text-[var(--primary)] mb-3">検査履歴</h3>
              <div className="space-y-2">
                {selectedExams.length === 0 ? (
                  <p className="text-sm text-gray-400">検査履歴はありません</p>
                ) : (
                  selectedExams.map((exam) => (
                    <Link
                      key={exam.id}
                      href={`/exam/${exam.id}`}
                      className="block bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">{exam.examDate}</span>
                        <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                          {exam.visitType}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-[var(--primary)]">{exam.diagnosis.label}</p>
                      <p className="text-xs text-gray-500 mt-1">NRS {exam.painLevel}/10</p>
                    </Link>
                  ))
                )}
              </div>

              {/* 新規検査ボタン */}
              <Link
                href="/exam/new"
                className="block w-full mt-6 text-center py-3 rounded-xl font-bold text-sm text-white transition-colors"
                style={{ backgroundColor: CLINIC.themeColor }}
              >
                この患者で新規検査を開始
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
