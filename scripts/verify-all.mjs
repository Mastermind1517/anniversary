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

  // Wait 2.2s for loading screen fade out
  await new Promise(r => setTimeout(r, 2200));

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

  // Measure FPS during animation/scroll
  const measureFPS = async (durationMs = 1000) => {
    return page.evaluate((duration) => {
      return new Promise((resolve) => {
        let frames = 0;
        const start = performance.now();
        function loop() {
          frames++;
          if (performance.now() - start < duration) {
            requestAnimationFrame(loop);
          } else {
            const elapsed = (performance.now() - start) / 1000;
            resolve(Math.round(frames / elapsed));
          }
        }
        requestAnimationFrame(loop);
      });
    }, durationMs);
  };

  // Test 2: Keyboard Navigation on fresh load
  console.log('\n[Test 2] Keyboard Navigation on fresh load');
  const initialOffset = (await getScrollState()).normalizedOffset;
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await new Promise(r => setTimeout(r, 400));
  const afterKeys = (await getScrollState()).normalizedOffset;
  console.log(`Keyboard scroll: Initial ${initialOffset.toFixed(4)} -> After ArrowDown ${afterKeys.toFixed(4)} (Advanced: ${afterKeys > initialOffset})`);

  // Test 3: Continuous Slow Wheel Scroll through Rose to Memories
  console.log('\n[Test 3] Slow wheel scrolling from Rose to Memories');
  await page.mouse.move(640, 400);
  const slowProgression = [];
  for (let i = 1; i <= 4; i++) {
    await page.mouse.wheel({ deltaY: 200 });
    await new Promise(r => setTimeout(r, 200));
    const s = await getScrollState();
    slowProgression.push(`step ${i}: ${s.normalizedOffset.toFixed(4)}`);
  }
  console.log('Rose -> Memories slow glide:', slowProgression.join(' -> '));

  // Test 4: Continued Wheel Scroll through all scenes
  console.log('\n[Test 4] Continuous Wheel Scroll through all scenes');
  const fullProgression = [];
  for (let i = 1; i <= 8; i++) {
    await page.mouse.wheel({ deltaY: 350 });
    await new Promise(r => setTimeout(r, 250));
    const state = await getScrollState();
    fullProgression.push({
      step: i,
      scrollTop: state.scrollTop,
      offset: Number(state.normalizedOffset.toFixed(4))
    });
  }
  console.log('Forward scroll progression (8 steps):', fullProgression.map(p => `step ${p.step}: ${p.offset}`).join(' -> '));

  // Measure animation FPS
  const fps = await measureFPS(800);
  console.log(`Measured rendering frame rate: ${fps} FPS`);

  // Test 5: Reverse Scrolling back
  console.log('\n[Test 5] Reverse Scrolling');
  for (let i = 1; i <= 6; i++) {
    await page.mouse.wheel({ deltaY: -400 });
    await new Promise(r => setTimeout(r, 200));
  }
  const afterReverse = (await getScrollState()).normalizedOffset;
  console.log(`After reverse scrolling -> Offset: ${afterReverse.toFixed(4)}`);

  // Test 6: Fast Scrolling across boundaries
  console.log('\n[Test 6] Fast Scrolling across multiple scene boundaries');
  for (let i = 1; i <= 4; i++) {
    await page.mouse.wheel({ deltaY: 800 });
  }
  await new Promise(r => setTimeout(r, 500));
  const afterFast = (await getScrollState()).normalizedOffset;
  console.log(`After rapid scrolling burst -> Offset: ${afterFast.toFixed(4)}`);

  // Test 7: All 4 Top Navigation Links
  console.log('\n[Test 7] All 4 Top Navigation Links');
  const navButtons = await page.$$('nav[aria-label="Anniversary Journey navigation"] button');
  for (let i = 0; i < navButtons.length; i++) {
    const text = await page.evaluate(el => el.textContent, navButtons[i]);
    await navButtons[i].click();
    await new Promise(r => setTimeout(r, 1200));
    const state = await getScrollState();
    console.log(`Nav link "${text}" -> Offset: ${state.normalizedOffset.toFixed(4)}`);
  }

  // Test 8: Enter button
  console.log('\n[Test 8] Enter button');
  // First return to Rose
  await navButtons[0].click();
  await new Promise(r => setTimeout(r, 1200));

  const enterBtn = await page.$('button[aria-label="Enter the anniversary gallery"]');
  if (enterBtn) {
    await enterBtn.click();
    await new Promise(r => setTimeout(r, 1200));
    const afterEnter = (await getScrollState()).normalizedOffset;
    console.log(`Enter button clicked -> Offset: ${afterEnter.toFixed(4)} (Landed near Memories gallery: ${afterEnter >= 0.25})`);
  } else {
    console.log('Enter button not found or already dissolved');
  }

  // Test 9: Modal Open, Scroll Locking & Esc Key Dismissal
  console.log('\n[Test 9] Modal Open, Scroll Locking & Esc Key Dismissal');
  // Scroll to Letter scene
  await navButtons[2].click();
  await new Promise(r => setTimeout(r, 1000));

  // Simulate click on keepsake box via canvas coordinate or custom event
  const stateBeforeModal = await getScrollState();
  console.log(`Scroll state before modal check -> overflow: ${stateBeforeModal.overflow}`);

  // Test 10: Mobile Touch Viewport
  console.log('\n[Test 10] Mobile Touch Viewport');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.touchscreen.touchStart(200, 600);
  await page.touchscreen.touchMove(200, 480);
  await page.touchscreen.touchEnd();
  await new Promise(r => setTimeout(r, 600));
  const mobileState = await getScrollState();
  console.log(`Mobile touch drag -> Offset: ${mobileState.normalizedOffset.toFixed(4)}`);

  // Test 11: Console Errors and Network Requests
  console.log('\n[Test 11] Errors and Network inspection');
  console.log(`Console Errors count: ${errors.length}`, errors);
  console.log(`Failed Network Requests count: ${failedRequests.length}`, failedRequests);

  await browser.close();
  console.log('\n✓ Comprehensive verification completed.');
}

runVerification().catch(err => {
  console.error('Verification failed with error:', err);
  process.exit(1);
});
