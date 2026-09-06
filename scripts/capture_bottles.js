// scripts/capture_bottles.js
const { chromium } = require('/home/ubuntu/.cache/ms-playwright-go/1.57.0/node_modules/playwright-core');
const path = require('path');

async function captureBottles() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/home/ubuntu/.cache/ms-playwright/chromium-1155/chrome-linux/chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({ viewport: { width: 1200, height: 800 } });
  const page = await context.newPage();

  // Pre-seed local storage so LMS login modal never shows up
  await page.addInitScript(() => {
    localStorage.setItem('redbook_g1_current_user', JSON.stringify({
      id: '10101',
      name: '홍길동',
      grade: '1',
      classNum: '1'
    }));
  });

  await page.goto('http://localhost:8080/g1_coordinate.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // Switch view to activity and load 2-2
  await page.evaluate(() => {
    state.isTeacherLoggedIn = true;
    state.unlockedTabs = [0, 1, 2, 3, 4, 5];
    switchView('activity');
    switchMainTab(2);
    loadSubStep('2-2');
  });
  await page.waitForTimeout(1000);

  // 1. Select Bottle B
  await page.evaluate(() => {
    selectBottleType('B');
  });
  await page.waitForTimeout(600);
  const canvasEl = await page.$('#canvas-container');
  if (canvasEl) {
    await canvasEl.screenshot({ path: path.join(__dirname, '../docs/bottle_B_fixed.png') });
  } else {
    await page.screenshot({ path: path.join(__dirname, '../docs/bottle_B_fixed.png') });
  }
  console.log("Captured bottle B screenshot!");

  // 2. Select Bottle C
  await page.evaluate(() => {
    selectBottleType('C');
  });
  await page.waitForTimeout(600);
  if (canvasEl) {
    await canvasEl.screenshot({ path: path.join(__dirname, '../docs/bottle_C_fixed.png') });
  } else {
    await page.screenshot({ path: path.join(__dirname, '../docs/bottle_C_fixed.png') });
  }
  console.log("Captured bottle C screenshot!");

  await browser.close();
}

captureBottles().catch(err => {
  console.error("Capture failed:", err);
  process.exit(1);
});
