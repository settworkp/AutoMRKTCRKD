const puppeteer = require("puppeteer-core");
const { executablePath } = require("puppeteer-core");
const fs = require("fs");

const COOKIES = JSON.parse(process.env.COOKIES_JSON);
const MESSAGE = "**💎🚀📈 ＳＩＧＮＡＴＵＲＥ　ＳＰＯＴ　ＦＯＲ　ＳＡＬＥ / ＧＲＯＷ　ＹＯＵＲ　ＢＵＳＩＮＥＳＳ　ＮＯＷ 📈🚀💎** https://cracked.sh/Thread-SIGNATURE-SPOTS-FOR-SALE--1901057";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  console.log("🚀 Starting bot...");

  const browser = await puppeteer.launch({
    executablePath: process.env.PUPPETEER_EXEC_PATH || "/usr/bin/chromium-browser",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
    headless: true,
  });

  const page = await browser.newPage();

  // Set user agent
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );

  // Step 1: Go to cracked.sh and set cookies
  console.log("🌐 Navigating to cracked.sh...");
  await page.goto("https://cracked.sh/", { waitUntil: "networkidle2" });

  // Set cookies from secret
  for (const cookie of COOKIES) {
    try {
      const c = { ...cookie };
      delete c.storeId;
      delete c.hostOnly;
      delete c.session;
      if (c.sameSite === null) delete c.sameSite;
      if (c.expirationDate) {
        c.expires = Math.floor(c.expirationDate);
        delete c.expirationDate;
      }
      c.domain = c.domain.startsWith(".") ? c.domain : "." + c.domain;
      await page.setCookie(c);
    } catch (e) {
      console.warn("Cookie warning:", e.message);
    }
  }

  console.log("✅ Cookies set. Waiting 20s...");
  await sleep(20000);

  // Step 2: Reload page with cookies (logged in)
  console.log("🔄 Reloading page as logged-in user...");
  await page.goto("https://cracked.sh/", { waitUntil: "networkidle2" });
  await sleep(20000);

  // Step 3: Click on Marketplace tab in chat
  console.log("🏪 Switching to Marketplace chat...");
  const switched = await page.evaluate(() => {
    const spans = document.querySelectorAll("span");
    for (const span of spans) {
      if (span.textContent.trim() === "Marketplace") {
        const anchor = span.closest("a") || span.parentElement;
        if (anchor) {
          anchor.click();
          return true;
        }
        span.click();
        return true;
      }
    }
    return false;
  });

  if (!switched) {
    console.error("❌ Could not find Marketplace tab!");
    await browser.close();
    process.exit(1);
  }

  console.log("✅ Clicked Marketplace. Waiting 20s...");
  await sleep(20000);

  // Step 4: Paste message in chat input (same method as Tampermonkey)
  console.log("✍️ Pasting message...");
  const inputSelector = "#message_input";
  await page.waitForSelector(inputSelector, { timeout: 15000 });
  const pasted = await page.evaluate((msg) => {
    const chatBox = document.getElementById("message_input");
    if (!chatBox) return false;
    chatBox.focus();
    chatBox.value = msg;
    chatBox.dispatchEvent(new Event("input",  { bubbles: true }));
    chatBox.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  }, MESSAGE);
  if (!pasted) {
    console.error("❌ Could not find message_input!");
    await browser.close();
    process.exit(1);
  }

  console.log("✅ Message typed. Waiting 20s...");
  await sleep(20000);

  // Step 5: Press Enter to send
  console.log("📤 Sending message...");
  await page.keyboard.press("Enter");

  console.log("✅ Message sent! Waiting 20s...");
  await sleep(20000);

  await browser.close();
  console.log("🎉 Done! Bot finished successfully.");
})();
