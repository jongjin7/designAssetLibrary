import { app, BrowserWindow } from 'electron';
import path from 'node:path';

// The built directory of renderer
const RENDERER_DIST = path.join(__dirname, '../dist');
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;

function createWindow() {
  const win = new BrowserWindow({
    title: 'Trove',
    width: 1200,
    height: 800,
    minWidth: 760,
    minHeight: 500,
    backgroundColor: '#0a0c13',
    titleBarStyle: 'hiddenInset', // macOS standard for premium apps
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'), // mjs if built as ESM
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // In development, load the local web-app URL if available
  // Or keep loading the local vite dev server for desktop-app specific renderer
  const WEB_APP_URL = 'https://localhost:3000';

  let isErrorPageLoaded = false;

  // Handle navigation failures (e.g., server goes down after initial load)
  win.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    // Prevent infinite loops or redundant loads
    if (isErrorPageLoaded) return;

    // We only want to handle failures to the main web app URL
    if (validatedURL.startsWith(WEB_APP_URL)) {
      console.warn(`Navigation to ${validatedURL} failed: ${errorCode} (${errorDescription})`);
      isErrorPageLoaded = true;
      
      // Load the local error page in dev or the built index.html in prod
      if (VITE_DEV_SERVER_URL) {
        win.loadURL(VITE_DEV_SERVER_URL);
      } else {
        win.loadFile(path.join(RENDERER_DIST, 'index.html'));
      }
    }
  });

  // Reset the error flag when navigation succeeds
  win.webContents.on('did-finish-load', () => {
    const currentURL = win.webContents.getURL();
    if (currentURL.startsWith(WEB_APP_URL)) {
      isErrorPageLoaded = false;
    }
  });

  if (VITE_DEV_SERVER_URL) {
    // If you want desktop-specific UI, use VITE_DEV_SERVER_URL
    // If you want to load the existing web-app, use WEB_APP_URL
    win.loadURL(`${WEB_APP_URL}?platform=desktop`);
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'));
  }

  // Handle self-signed certificate for dev:https
  win.webContents.on('certificate-error', (event, url, error, certificate, callback) => {
    if (url.startsWith('https://localhost')) {
      event.preventDefault();
      callback(true);
    } else {
      callback(false);
    }
  });
}

app.setName('Trove');

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
