// server.js
const express = require('express');

// Import the Puppeteer scraper function
 const scrapePage = require('./puppeteerScraper');  


const app = express();
app.use(express.json());  // To parse JSON bodies

app.get('/',(req, res)=> {
    return res.send('Server is running...!');
})

app.get('/scrape',(req, res)=> {
    return res.send('Try POST method with Required Data!');
})

// Route to accept a POST request with a URL
app.post('/scrape', async (req, res) => {
  const { url, wait } = req.body;  // Extract URL from the request body

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Call the Puppeteer function to scrape the page
    const content = await scrapePage(url,wait);

    // Send the page content back as the response
    res.json({ content });

  } catch (error) {
    console.error('Error during Puppeteer execution:', error);
    res.status(500).json({ error: 'Failed to fetch data from the URL' });
  }
});

// Start the server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
