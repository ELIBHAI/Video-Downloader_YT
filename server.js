const express = require('express');
const cors = require('cors');
const path = require('path');
const ytdlp = require('yt-dlp-exec');
const os = require('os');

const app = express();
app.use(cors());
app.use(express.json());

// Use temporary directory for file downloads in Vercel
const downloadPath = path.join(os.tmpdir(), 'Downloads');

app.post('/download', async (req, res) => {
  const { url, type } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'No URL provided' });
  }

  const formatOptions = {
    output: `${downloadPath}/%(title)s.%(ext)s`,
  };

  switch (type) {
    case 'audio':
      formatOptions.format = 'bestaudio/best';
      break;
    case 'video':
      formatOptions.format = 'bestvideo/best';
      break;
    case 'merged':
      formatOptions.format = 'bestvideo+bestaudio/best';
      formatOptions.mergeOutputFormat = 'mp4';
      break;
    default:
      return res.status(400).json({ error: 'Invalid type specified' });
  }

  try {
    const output = await ytdlp(url, formatOptions);
    res.json({ message: `Download complete: ${output}`, downloadPath });
  } catch (err) {
    console.error('Download failed:', err.message);
    res.status(500).json({ error: 'Failed to download', details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
