const puppeteer = require('puppeteer');

// Helper function to check if a string is valid JSON
function isValidJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

async function scrapePage(url, wait=0) {
  const browser = await puppeteer.launch({
    headless: "new",
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

  // Set user agent to mimic a real browser
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4606.81 Safari/537.36'
  );

  // Set viewport size
  await page.setViewport({ width: 1200, height: 800 });

  try {
    // Go to the provided URL
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Wait for some time in case of challenges or slow load
    await new Promise(resolve => setTimeout(resolve, wait));  // Wait for 10 seconds

    // Get the page content
    const content = await page.content();

    // Try to extract the inner text inside <pre> (which could be JSON) or fallback to full HTML content
    const bodyHandle = await page.$('pre');
    let pageText = null;

    if (bodyHandle) {
      pageText = await page.evaluate(body => body.innerText, bodyHandle);
    }

    await browser.close();

    // Check if the response text is valid JSON
    if (pageText && isValidJson(pageText)) {
      return JSON.parse(pageText);  // Return JSON if valid
    } else {
      return content;  // Return full HTML content if not JSON
    }

  } catch (error) {
    console.error('Error fetching data:', error);
    await browser.close();
    throw error;
  }
}

module.exports = scrapePage;
