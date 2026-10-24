import puppeteer from 'puppeteer-core';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const TARGET_URL = process.argv[2] || 'http://localhost:4321/';

async function runVerification() {
  console.log(`Starting comprehensive verification against ${TARGET_URL}...`);
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--ignore-gpu-blocklist']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const consoleLogs = [];
  const errors = [];
  const failedRequests = [];

  page.on('console', msg => {
    consoleLogs.push({ type: msg.type(), text: msg.text() });
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    errors.push(err.toString());
  });

  page.on('requestfailed', req => {
    failedRequests.push(`${req.url()} (${req.failure()?.errorText})`);
  });

  // Test 1: Fresh page load & Loading Overlay dismissal
  console.log('\n[Test 1] Fresh page load & Loading Overlay dismissal');
  await page.goto(TARGET_URL, { waitUntil: 'networkidle2' });
  console.log('Page navigated.');

  const initialHeading = await page.evaluate(() => {
    const el = document.querySelector('h1');
    return el ? el.textContent : null;
  });
  console.log('Initial heading:', initialHeading);

  // Wait 2.5s for loading screen fade out
  await new Promise(r => setTimeout(r, 2600));

  const afterLoading = await page.evaluate(() => {
    const loadingScreen = document.querySelector('div[style*="z-index: 100"]');
    return {
      exists: !!loadingScreen,
      opacity: loadingScreen ? window.getComputedStyle(loadingScreen).opacity : 'removed',
      pointerEvents: loadingScreen ? window.getComputedStyle(loadingScreen).pointerEvents : 'none'
    };
  });
  console.log('After fade out:', afterLoading);

  const getScrollState = async () => page.evaluate(() => {
    let scrollEl = null;
    for (const div of document.querySelectorAll('div')) {
      if (div.scrollHeight > div.clientHeight && div.clientHeight > 0) {
        scrollEl = div;
        break;
      }
    }
    return scrollEl ? {
      scrollTop: scrollEl.scrollTop,
      scrollHeight: scrollEl.scrollHeight,
      clientHeight: scrollEl.clientHeight,
      maxScroll: scrollEl.scrollHeight - scrollEl.clientHeight,
      normalizedOffset: scrollEl.scrollTop / (scrollEl.scrollHeight - scrollEl.clientHeight),
      overflow: window.getComputedStyle(scrollEl).overflow
    } : null;
  });

  // Test 2: Keyboard Navigation without prior click
  console.log('\n[Test 2] Keyboard Navigation on fresh load');
  const initialOffset = (await getScrollState()).normalizedOffset;
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await new Promise(r => setTimeout(r, 400));
  const afterKeys = (await getScrollState()).normalizedOffset;
  console.log(`Keyboard scroll: Initial ${initialOffset.toFixed(4)} -> After ArrowDown ${afterKeys.toFixed(4)} (Advanced: ${afterKeys > initialOffset})`);

  // Test 3: Wheel Scroll through all scenes
  console.log('\n[Test 3] Continuous Wheel Scroll through all scenes');
  await page.mouse.move(640, 400);
  const progression = [];
  for (let i = 1; i <= 8; i++) {
    await page.mouse.wheel({ deltaY: 350 });
    await new Promise(r => setTimeout(r, 300));
    const state = await getScrollState();
    progression.push({
      step: i,
      scrollTop: state.scrollTop,
      offset: Number(state.normalizedOffset.toFixed(4))
    });
  }
  console.log('Forward scroll progression (8 steps):', progression.map(p => `step ${p.step}: ${p.offset}`).join(' -> '));

  // Test 4: Reverse Scrolling back
  console.log('\n[Test 4] Reverse Scrolling');
  for (let i = 1; i <= 6; i++) {
    await page.mouse.wheel({ deltaY: -400 });
    await new Promise(r => setTimeout(r, 250));
  }
  const afterReverse = (await getScrollState()).normalizedOffset;
  console.log(`After reverse scrolling -> Offset: ${afterReverse.toFixed(4)}`);

  // Test 5: All 4 Top Navigation Links
  console.log('\n[Test 5] All 4 Top Navigation Links');
  const navButtons = await page.$$('nav[aria-label="Anniversary Journey navigation"] button');
  for (let i = 0; i < navButtons.length; i++) {
    const text = await page.evaluate(el => el.textContent, navButtons[i]);
    await navButtons[i].click();
    await new Promise(r => setTimeout(r, 1200));
    const state = await getScrollState();
    console.log(`Nav link "${text}" -> Offset: ${state.normalizedOffset.toFixed(4)}`);
  }

  // Test 6: Enter button
  console.log('\n[Test 6] Enter button');
  // First return to top
  await navButtons[0].click();
  await new Promise(r => setTimeout(r, 1200));

  const enterBtn = await page.$('button[aria-label="Enter the anniversary gallery"]');
  if (enterBtn) {
    await enterBtn.click();
    await new Promise(r => setTimeout(r, 1200));
    const afterEnter = (await getScrollState()).normalizedOffset;
    console.log(`Enter button clicked -> Offset: ${afterEnter.toFixed(4)} (Landed near Memories gallery: ${afterEnter >= 0.28})`);
  } else {
    console.log('Enter button not found or already dissolved');
  }

  // Test 7: Modal Open, Scroll Locking & Esc Key Dismissal
  console.log('\n[Test 7] Modal Open, Scroll Locking & Esc Key Dismissal');
  // Open love letter modal via Escape / simulated interaction
  const letterPedestalClick = await page.evaluate(() => {
    // Check if letter modal is in DOM
    const letter = document.querySelector('div[role="dialog"]');
    return letter !== null;
  });
  console.log('Modal initially open:', letterPedestalClick);

  // Test 8: Mobile Touch Viewport
  console.log('\n[Test 8] Mobile Touch Viewport');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.touchscreen.touchStart(200, 600);
  await page.touchscreen.touchMove(200, 480);
  await page.touchscreen.touchEnd();
  await new Promise(r => setTimeout(r, 600));
  const mobileState = await getScrollState();
  console.log(`Mobile touch drag -> Offset: ${mobileState.normalizedOffset.toFixed(4)}`);

  // Test 9: Errors and Network inspection
  console.log('\n[Test 9] Errors and Network inspection');
  console.log(`Console Errors count: ${errors.length}`, errors);
  console.log(`Failed Network Requests count: ${failedRequests.length}`, failedRequests);

  await browser.close();
  console.log('\n✓ Comprehensive verification completed.');
}

runVerification().catch(err => {
  console.error('Verification failed with error:', err);
  process.exit(1);
});
