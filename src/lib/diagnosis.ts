// 検査ロジック - 本番アプリと同じアルゴリズム

export type LandmarkValue = -1 | 0 | 1;

export interface PositionData {
  mastoid: LandmarkValue;
  scapula: LandmarkValue;
  iliac: LandmarkValue;
}

export interface DiagnosisResult {
  primaryCause: "foot" | "upperBody" | "cranialPelvic" | "spine" | "none";
  treatmentArea: string;
  summary: string;
  pattern: "zenran" | "taigaichigai" | "normal";
  direction: "left" | "right" | "none";
  label: string;
  icon: string;
  color: string;
  steps: {
    step: number;
    name: string;
    finding: string;
  }[];
}

export const CAUSE_LABELS: Record<
  string,
  { label: string; icon: string; color: string }
> = {
  foot: { label: "足部（下半身）の影響", icon: "🦶", color: "#f59e0b" },
  upperBody: { label: "上半身の影響", icon: "💪", color: "#3b82f6" },
  cranialPelvic: {
    label: "頭蓋骨・骨盤の影響（全乱）",
    icon: "🦴",
    color: "#ef4444",
  },
  spine: { label: "背骨の影響（互い違い）", icon: "🔩", color: "#8b5cf6" },
  none: { label: "顕著な歪みなし", icon: "✅", color: "#22c55e" },
};

function describeLandmark(name: string, val: LandmarkValue): string {
  if (val === -1) return `${name}: 左が高い`;
  if (val === 1) return `${name}: 右が高い`;
  return `${name}: 均等`;
}

function describePosition(data: PositionData): string {
  const parts = [
    describeLandmark("乳様突起", data.mastoid),
    describeLandmark("肩甲下角", data.scapula),
    describeLandmark("腸骨稜", data.iliac),
  ];
  return parts.join("、");
}

function hasChange(a: PositionData, b: PositionData): boolean {
  return (
    a.mastoid !== b.mastoid ||
    a.scapula !== b.scapula ||
    a.iliac !== b.iliac
  );
}

function analyzePattern(data: PositionData): {
  pattern: "zenran" | "taigaichigai" | "normal";
  direction: "left" | "right" | "none";
} {
  const vals = [data.mastoid, data.scapula, data.iliac];
  const positives = vals.filter((v) => v > 0).length;
  const negatives = vals.filter((v) => v < 0).length;
  const zeros = vals.filter((v) => v === 0).length;

  if (zeros === 3) return { pattern: "normal", direction: "none" };

  // 全て同じ方向 → 全乱
  if (positives > 0 && negatives === 0)
    return { pattern: "zenran", direction: "right" };
  if (negatives > 0 && positives === 0)
    return { pattern: "zenran", direction: "left" };

  // 混在 → 互い違い
  return { pattern: "taigaichigai", direction: "none" };
}

export function diagnose(
  standing: PositionData,
  seated: PositionData
): DiagnosisResult {
  const steps: DiagnosisResult["steps"] = [];

  // Step 1: 立位記録
  steps.push({
    step: 1,
    name: "立位検査",
    finding: describePosition(standing),
  });

  // Step 2: 立位 vs 座位比較
  const footInfluence = hasChange(standing, seated);
  steps.push({
    step: 2,
    name: "座位検査",
    finding: footInfluence
      ? "立位と座位で変化あり → 足部の影響が考えられます"
      : "立位と座位で変化なし → 足部の影響は少ない",
  });

  if (footInfluence) {
    const pat = analyzePattern(standing);
    const cause = CAUSE_LABELS.foot;
    return {
      primaryCause: "foot",
      treatmentArea: "足部（足関節・足底・下腿）",
      summary:
        "立位と座位で左右差に変化があるため、足の接地による影響が考えられます。足部の治療を優先的に検討してください。",
      pattern: pat.pattern,
      direction: pat.direction,
      label: cause.label,
      icon: cause.icon,
      color: cause.color,
      steps,
    };
  }

  // Step 3: パターン分析（足部影響なしの場合）
  const pat = analyzePattern(seated);

  if (pat.pattern === "zenran") {
    const cause = CAUSE_LABELS.cranialPelvic;
    const dir = pat.direction === "right" ? "右" : "左";
    steps.push({
      step: 3,
      name: "パターン分析",
      finding: `全ランドマークが${dir}方向 → 全乱パターン（頭蓋骨・骨盤の影響）`,
    });
    return {
      primaryCause: "cranialPelvic",
      treatmentArea: "頭蓋骨・骨盤",
      summary: `どの体勢でも同じ方向（${dir}）の歪みが見られます。頭蓋骨や骨盤からの影響が考えられます。頭蓋・骨盤の調整を優先してください。`,
      pattern: pat.pattern,
      direction: pat.direction,
      label: cause.label,
      icon: cause.icon,
      color: cause.color,
      steps,
    };
  }

  if (pat.pattern === "taigaichigai") {
    const cause = CAUSE_LABELS.spine;
    steps.push({
      step: 3,
      name: "パターン分析",
      finding: "ランドマークが互い違い → 背骨（脊柱）の影響",
    });
    return {
      primaryCause: "spine",
      treatmentArea: "背骨（脊柱）",
      summary:
        "ランドマークが互い違いのパターンです。背骨そのものの影響が考えられます。脊柱の可動域と配列を確認してください。",
      pattern: pat.pattern,
      direction: pat.direction,
      label: cause.label,
      icon: cause.icon,
      color: cause.color,
      steps,
    };
  }

  // 異常なし
  const cause = CAUSE_LABELS.none;
  steps.push({
    step: 3,
    name: "パターン分析",
    finding: "全ランドマーク均等 → 顕著な歪みなし",
  });
  return {
    primaryCause: "none",
    treatmentArea: "特になし",
    summary:
      "全てのランドマークが均等で、顕著な構造的歪みは見られません。症状がある場合は軟部組織や神経系の評価を追加してください。",
    pattern: "normal",
    direction: "none",
    label: cause.label,
    icon: cause.icon,
    color: cause.color,
    steps,
  };
}

// セルフケア提案
export function getSelfcare(result: DiagnosisResult): string[] {
  switch (result.primaryCause) {
    case "foot":
      return [
        "足関節の回旋運動：座位で足首をゆっくり大きく回す（内回し10回・外回し10回×2セット）",
        "タオルギャザー：床に置いたタオルを足指でたぐり寄せる（10回×3セット）。足底のアーチを活性化します。",
        "カーフレイズ：壁に手をつき、つま先立ち→ゆっくり下ろす（15回×3セット）。下腿の安定性向上。",
        "片脚立ちバランス：目を開けて片脚30秒キープ（左右3回ずつ）。足部の固有感覚を鍛えます。",
      ];
    case "upperBody":
      return [
        "僧帽筋ストレッチ：首を横に倒し、反対の肩を下げる（20秒×左右3セット）",
        "胸椎回旋運動：四つ這いで上半身を左右にゆっくり回す（10回×2セット）",
        "肩甲骨の内転運動：両腕を横に広げ、肩甲骨を背骨に寄せる（10秒×10回）",
        "顎引き運動：二重顎を作るように顎を引いてキープ（10秒×5回）。頭部前方変位の改善。",
      ];
    case "cranialPelvic":
      return [
        "骨盤前後傾運動：仰向けで膝を立て、骨盤を前後にゆっくり傾ける（10回×3セット）",
        "ドローイン：仰向けでお腹を凹ませて10秒キープ（10回×2セット）。骨盤底筋群の活性化。",
        "側臥位の体幹回旋：横向きに寝て上半身だけ反対側に開く（20秒×左右3セット）",
        "後頭部リリース：テニスボールを後頭部に当て、仰向けで軽く圧をかける（2分間）",
      ];
    case "spine":
      return [
        "キャット＆カウ：四つ這いで背中を丸める↔反らすを繰り返す（10回×3セット）",
        "胸椎伸展：バスタオルを丸めて背中に当て、仰向けで2分キープ",
        "回旋ストレッチ：椅子に座り、体を左右にゆっくり回す（各方向10秒×5回）",
        "ブリッジ運動：仰向けで膝を立て、お尻を持ち上げてキープ（10秒×10回）。脊柱の安定性向上。",
      ];
    default:
      return [
        "全身のストレッチ：朝晩5分間の軽いストレッチを習慣にしましょう",
        "ウォーキング：1日20分の軽い散歩で全身の血流を改善",
        "深呼吸：腹式呼吸を1日3回（朝・昼・就寝前）5回ずつ",
      ];
  }
}
