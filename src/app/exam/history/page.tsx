"use client";

import { useState } from "react";
import Link from "next/link";
import { CLINIC, EXAMS } from "@/lib/mock-data";

export default function ExamHistoryPage() {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "patient">("list");

  const filtered = EXAMS.filter(
    (e) => e.patientName.includes(search) || e.chiefComplaint.includes(search) || e.diagnosis.label.includes(search)
  );

  // 患者別グループ
  const byPatient = filtered.reduce((acc, e) => {
    if (!acc[e.patientId]) acc[e.patientId] = { name: e.patientName, exams: [] };
    acc[e.patientId].exams.push(e);
    return acc;
  }, {} as Record<string, { name: string; exams: typeof EXAMS }>);

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
        <Link href="/" className="text-white/70 hover:text-white text-sm">
          ← ダッシュボード
        </Link>
        <h1 className="font-bold">検査履歴</h1>
        <span className="bg-white/20 px-3 py-1 rounded-lg text-xs">デモモード</span>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* 検索 + ビュー切替 */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="患者名・症状・診断名で検索..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none text-sm"
          />
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                viewMode === "list" ? "bg-white text-[var(--primary)] shadow-sm" : "text-gray-500"
              }`}
            >
              一覧
            </button>
            <button
              onClick={() => setViewMode("patient")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                viewMode === "patient" ? "bg-white text-[var(--primary)] shadow-sm" : "text-gray-500"
              }`}
            >
              患者別
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-400 mb-4">{filtered.length}件の検査</p>

        {viewMode === "list" ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="divide-y divide-gray-50">
              {filtered.map((exam) => (
                <Link
                  key={exam.id}
                  href={`/exam/${exam.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-[var(--primary)]">{exam.patientName}</span>
                      <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {exam.visitType}
                      </span>
                    </div>
                    <p className="text-xs text-gray-700 font-medium">{exam.diagnosis.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{exam.chiefComplaint}</p>
                  </div>
                  <div className="text-right ml-4 flex-shrink-0">
                    <p className="text-xs text-gray-400">{exam.examDate}</p>
                    <p className="text-xs text-gray-400">NRS {exam.painLevel}/10</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(byPatient).map(([pid, group]) => (
              <div key={pid} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
                  <span className="font-bold text-sm text-[var(--primary)]">{group.name}</span>
                  <span className="text-xs text-gray-400 ml-2">{group.exams.length}回</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {group.exams.map((exam) => (
                    <Link
                      key={exam.id}
                      href={`/exam/${exam.id}`}
                      className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <p className="text-xs text-gray-700 font-medium">{exam.diagnosis.label}</p>
                        <p className="text-xs text-gray-500">{exam.chiefComplaint}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">{exam.examDate}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
