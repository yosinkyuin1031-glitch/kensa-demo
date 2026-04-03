import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "video-frames");

const BASE_URL = "https://kensa-demo.vercel.app";

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function capture(page, name) {
  await page.screenshot({
    path: path.join(outDir, `${name}.png`),
    fullPage: false,
  });
  console.log(`  -> ${name}.png`);
}

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // 1. ダッシュボード
  console.log("1. Dashboard...");
  await page.goto(BASE_URL, { waitUntil: "networkidle2", timeout: 15000 });
  await sleep(2000);
  await capture(page, "01-dashboard");

  // 2. 新規検査クリック
  console.log("2. Navigate to new exam...");
  await page.click('a[href="/exam/new"]');
  await sleep(2000);
  await capture(page, "02-patient-info");

  // 3. 患者情報入力
  console.log("3. Fill patient info...");
  await page.type('input[placeholder="例: 山田 太郎"]', "山田 太郎", { delay: 80 });
  await sleep(500);
  await page.type('input[placeholder="45"]', "45", { delay: 100 });
  await sleep(500);
  await page.click("textarea");
  await page.type("textarea", "右肩の痛み、首のこり", { delay: 60 });
  await sleep(500);
  // NRSスライダーを6に設定
  await page.evaluate(() => {
    const slider = document.querySelector('input[type="range"]');
    if (slider) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      ).set;
      nativeInputValueSetter.call(slider, "6");
      slider.dispatchEvent(new Event("input", { bubbles: true }));
      slider.dispatchEvent(new Event("change", { bubbles: true }));
    }
  });
  await sleep(500);
  await capture(page, "03-patient-filled");

  // 4. 次へ（立位検査）
  console.log("4. Standing exam...");
  const buttons = await page.$$("button");
  for (const btn of buttons) {
    const text = await page.evaluate((el) => el.textContent, btn);
    if (text.trim() === "次へ") {
      await btn.click();
      break;
    }
  }
  await sleep(1500);
  await capture(page, "04-standing-default");

  // 5. 立位のランドマーク入力（乳様突起=右が高い, 肩甲下角=右が高い, 腸骨稜=均等）
  console.log("5. Input standing landmarks...");
  // 各ランドマークの「右が高い」ボタン（3番目のボタン）をクリック
  const landmarkButtons = await page.$$(".bg-gray-50.rounded-xl button");
  // 乳様突起 → 右が高い (index 2)
  if (landmarkButtons[2]) await landmarkButtons[2].click();
  await sleep(300);
  // 肩甲下角 → 右が高い (index 5)
  if (landmarkButtons[5]) await landmarkButtons[5].click();
  await sleep(300);
  // 腸骨稜 → 均等のまま (index 7 = 均等ボタン、すでにデフォルト)
  await sleep(500);
  await capture(page, "05-standing-filled");

  // 6. 次へ（座位検査）
  console.log("6. Seated exam...");
  const btns2 = await page.$$("button");
  for (const btn of btns2) {
    const text = await page.evaluate((el) => el.textContent, btn);
    if (text.trim() === "次へ") {
      await btn.click();
      break;
    }
  }
  await sleep(1500);
  await capture(page, "06-seated-default");

  // 7. 座位のランドマーク入力（乳様突起=均等, 肩甲下角=均等, 腸骨稜=均等）→ 足部の影響パターン
  console.log("7. Seated landmarks (change from standing = foot influence)...");
  // 座位では全て「均等」（デフォルト）のまま → 立位と変化あり = 足部の影響
  await sleep(500);
  await capture(page, "07-seated-filled");

  // 8. 診断実行
  console.log("8. Run diagnosis...");
  const btns3 = await page.$$("button");
  for (const btn of btns3) {
    const text = await page.evaluate((el) => el.textContent, btn);
    if (text.includes("診断を実行")) {
      await btn.click();
      break;
    }
  }
  await sleep(2000);
  await capture(page, "08-diagnosis-result");

  // 9. スクロールしてセルフケア提案を表示
  console.log("9. Scroll to selfcare...");
  await page.evaluate(() => window.scrollTo(0, 600));
  await sleep(1000);
  await capture(page, "09-selfcare");

  // 10. さらにスクロールしてPDFボタン
  console.log("10. PDF buttons...");
  await page.evaluate(() => window.scrollTo(0, 1200));
  await sleep(1000);
  await capture(page, "10-pdf-buttons");

  // 11. ダッシュボードに戻る
  console.log("11. Back to dashboard...");
  await page.goto(BASE_URL, { waitUntil: "networkidle2", timeout: 15000 });
  await sleep(2000);

  // 12. 患者一覧
  console.log("12. Patient list...");
  await page.goto(`${BASE_URL}/patients`, {
    waitUntil: "networkidle2",
    timeout: 15000,
  });
  await sleep(2000);
  await capture(page, "11-patients");

  // 13. 検査履歴
  console.log("13. Exam history...");
  await page.goto(`${BASE_URL}/exam/history`, {
    waitUntil: "networkidle2",
    timeout: 15000,
  });
  await sleep(2000);
  await capture(page, "12-history");

  // 14. 検査詳細
  console.log("14. Exam detail...");
  await page.goto(`${BASE_URL}/exam/e1`, {
    waitUntil: "networkidle2",
    timeout: 15000,
  });
  await sleep(2000);
  await capture(page, "13-exam-detail");

  await browser.close();
  console.log("\nDone! Frames saved to public/video-frames/");
}

main().catch(console.error);
