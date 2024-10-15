const puppeteer = require('puppeteer');

(async () => {
  // Launch Puppeteer with additional settings to mimic a real browser
  const browser = await puppeteer.launch({
    headless: "new",  // Make it headless if you don't need to see the browser
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ],
  });

  const page = await browser.newPage();

  // Set user agent to mimic a real browser (e.g., Chrome)
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4606.81 Safari/537.36'
  );

  // Set viewport size to make it more like a real browser
  await page.setViewport({ width: 1200, height: 800 });

  try {
    // Go to the Cloudflare-protected API
    await page.goto('https://quillbot.com/api/auth/get-account-details', {
      waitUntil: 'networkidle2', // Wait for the page to finish loading
    });

    // Wait for some time in case a challenge needs to be solved
    await new Promise(resolve => setTimeout(resolve, 10000));  // Wait for 5 seconds

    // Get the page content
    const content = await page.content();
    console.log(content);

  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    await browser.close();
  }
})();
