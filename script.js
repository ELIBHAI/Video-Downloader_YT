// DOM Elements
const downloadButton = document.getElementById('downloadBtn');
const progressBar = document.getElementById('progressBar');
const progressBarContainer = document.getElementById('progressBarContainer');
const howToUseBtn = document.getElementById('howToUseBtn');
const closePanelBtn = document.getElementById('closePanelBtn');
const howToUsePanel = document.getElementById('howToUsePanel');
const themeSelector = document.getElementById('themeSelector');
const themeIcon = document.getElementById('themeIcon');

// Custom Alert Functions
function showAlert(message) {
  const alertElement = document.getElementById('customAlert');
  const alertMessage = document.getElementById('alertMessage');

  alertMessage.textContent = message;
  alertElement.classList.remove('hidden');

  // Auto-hide alert after 5 seconds
  setTimeout(() => {
    alertElement.classList.add('hidden');
  }, 5000);
}

function closeAlert() {
  document.getElementById('customAlert').classList.add('hidden');
}

// Download Button Event
downloadButton.addEventListener('click', async () => {
  const videoUrl = prompt("Enter YouTube URL:");
  if (!videoUrl) {
    showAlert('Please enter a valid YouTube URL!');
    return;
  }

  const downloadType = document.querySelector('input[name="downloadType"]:checked').value;

  // Show progress bar and initialize state
  progressBarContainer.style.display = 'block';
  progressBar.style.width = '0%';
  downloadButton.textContent = 'Downloading...';
  downloadButton.disabled = true;

  try {
    const response = await fetch('http://localhost:3000/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: videoUrl, type: downloadType }),
    });

    if (!response.ok) {
      showAlert(`Failed to download: ${response.statusText}`);
    } else {
      showAlert('Download completed successfully!');
    }
  } catch (error) {
    showAlert('Error: Unable to connect to the server.');
  } finally {
    // Reset button and progress bar state
    downloadButton.textContent = 'Download';
    downloadButton.disabled = false;
    progressBarContainer.style.display = 'none';
  }
});

// How-to-Use Panel
howToUseBtn.addEventListener('click', () => howToUsePanel.classList.add('open'));
closePanelBtn.addEventListener('click', () => howToUsePanel.classList.remove('open'));

// Theme Management
function applyTheme(theme) {
  const body = document.body;
  body.classList.remove('light', 'dark');

  if (theme === 'dark') {
    body.classList.add('dark');
    themeIcon.className = 'ri-moon-line';
  } else if (theme === 'light') {
    body.classList.add('light');
    themeIcon.className = 'ri-sun-line';
  } else {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    body.classList.add(isDarkMode ? 'dark' : 'light');
    themeIcon.className = isDarkMode ? 'ri-moon-line' : 'ri-sun-line';
  }

  localStorage.setItem('theme', theme);
}

// Load and apply saved theme
const savedTheme = localStorage.getItem('theme') || 'system';
themeSelector.value = savedTheme;
applyTheme(savedTheme);

// Handle theme change
themeSelector.addEventListener('change', (e) => applyTheme(e.target.value));

// Handle system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (themeSelector.value === 'system') {
    applyTheme('system');
  }
});
