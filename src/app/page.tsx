"use client";

import { useState } from "react";
import Link from "next/link";
import { CLINIC, STATS, MONTHLY_TREND, EXAMS } from "@/lib/mock-data";

export default function Dashboard() {
  const [demoBanner, setDemoBanner] = useState(true);
  const maxCount = Math.max(...MONTHLY_TREND.map((m) => m.count));
  const recentExams = EXAMS.slice(0, 5);
  const monthChange = STATS.thisMonthExams - STATS.lastMonthExams;

  return (
    <div className="min-h-screen">
      {/* デモバナー */}
      {demoBanner && (
        <div className="bg-amber-500 text-white text-center py-2 px-4 text-sm font-bold relative">
          これはデモ画面です。実際のデータではありません。
          <button
            onClick={() => setDemoBanner(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
          >
            &times;
          </button>
        </div>
      )}

      {/* ヘッダー */}
      <header
        className="text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40"
        style={{ backgroundColor: CLINIC.themeColor }}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center font-black text-sm">
            検
          </div>
          <div>
            <h1 className="font-bold text-base">{CLINIC.name}</h1>
            <p className="text-xs text-white/70">カラダマップ</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-white/70 hidden sm:block">demo@clinicapps.jp</span>
          <span className="bg-white/20 px-3 py-1 rounded-lg text-xs">デモモード</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* 統計カード */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">今月の検査数</p>
            <p className="text-2xl font-black text-[var(--primary)]">{STATS.thisMonthExams}</p>
            <p className={`text-xs mt-1 ${monthChange >= 0 ? "text-green-600" : "text-red-500"}`}>
              {monthChange >= 0 ? "+" : ""}{monthChange} 先月比
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">総患者数</p>
            <p className="text-2xl font-black text-[var(--primary)]">{STATS.totalPatients}</p>
            <p className="text-xs text-gray-400 mt-1">登録済み</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">今週の検査数</p>
            <p className="text-2xl font-black text-[var(--primary)]">{STATS.thisWeekExams}</p>
            <p className="text-xs text-gray-400 mt-1">今週</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">TOP診断</p>
            <div className="space-y-1 mt-1">
              {STATS.topDiagnoses.map((d, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-gray-700 truncate">{d.name}</span>
                  <span className="font-bold text-[var(--accent)] ml-2">{d.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 月別推移グラフ */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <h2 className="font-bold text-[var(--primary)] mb-4">月別検査数</h2>
          <div className="flex items-end gap-4 h-40">
            {MONTHLY_TREND.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-bold text-[var(--accent)]">{m.count}</span>
                <div
                  className="w-full rounded-t-lg transition-all"
                  style={{
                    height: `${(m.count / maxCount) * 100}%`,
                    backgroundColor: CLINIC.themeColor,
                    opacity: 0.7 + (i / MONTHLY_TREND.length) * 0.3,
                  }}
                />
                <span className="text-[10px] text-gray-400">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* クイックアクション */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <Link
            href="/exam/new"
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all text-center group"
          >
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">+</div>
            <p className="font-bold text-sm text-[var(--primary)]">新規検査</p>
          </Link>
          <Link
            href="/exam/history"
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all text-center group"
          >
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📄</div>
            <p className="font-bold text-sm text-[var(--primary)]">検査履歴</p>
          </Link>
          <Link
            href="/patients"
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all text-center group"
          >
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">👤</div>
            <p className="font-bold text-sm text-[var(--primary)]">患者一覧</p>
          </Link>
        </div>

        {/* 最近の検査 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-[var(--primary)]">最近の検査</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {recentExams.map((exam) => (
              <Link
                key={exam.id}
                href={`/exam/${exam.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-[var(--primary)]">{exam.patientName}</span>
                    {exam.visitType === "初診" && (
                      <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">初診</span>
                    )}
                    {exam.visitType === "経過観察" && (
                      <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">経過観察</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{exam.diagnosis.label}</p>
                </div>
                <div className="text-right ml-4 flex-shrink-0">
                  <p className="text-xs text-gray-400">{exam.examDate}</p>
                  <p className="text-xs text-gray-400">NRS {exam.painLevel}/10</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
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
