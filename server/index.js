const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Auto-login function (can also be reused at startup, if needed)
async function autoLogin(password = 'helios') {
  console.log('[AutoLogin] Starting login process...');

  const browser = await puppeteer.launch({
    headless: true, // set to false for debugging
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  console.log('[AutoLogin] Navigating to login page...');
  await page.goto('http://192.168.1.180/', { waitUntil: 'networkidle2' });

  console.log('[AutoLogin] Typing password...');
  await page.type('#v00402', password);

  console.log('[AutoLogin] Clicking login button...');
  await page.click('#but0');

  console.log('[AutoLogin] Waiting for page to respond...');
  await new Promise(resolve => setTimeout(resolve, 5000)); // wait for 5s

  await browser.close();
  console.log('[AutoLogin] Browser closed. Login attempt finished.');

  return { status: 'Login successful (maybe 😄)' };
}
let lastLoginTimestamp = 0; // timestamp in milliseconds

app.post('/auto-login', async (req, res) => {
  const now = Date.now();
  const TWO_HOURS = 2 * 60 * 60 * 1000;

  if (now - lastLoginTimestamp < TWO_HOURS) {
    const waitMinutes = Math.ceil((TWO_HOURS - (now - lastLoginTimestamp)) / 60000);
    return res.status(429).json({ error: `Too many requests. Please wait ${waitMinutes} minutes before retrying.` });
  }

  const password = req.body.password || 'helios';
  try {
    const result = await autoLogin(password);
    res.json(result);
    lastLoginTimestamp = Date.now();
  } catch (err) {
    console.error('[AutoLogin] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Node server running at http://localhost:${PORT}`);
});
