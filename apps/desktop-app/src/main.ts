import { app, BrowserWindow, ipcMain, dialog, protocol, net } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import chokidar from 'chokidar';

// Register custom protocol as privileged to allow Fetch API
protocol.registerSchemesAsPrivileged([
  { scheme: 'nova-asset', privileges: { standard: true, secure: true, supportFetchAPI: true } }
]);

// Configuration storage (very simple for now)
const CONFIG_PATH = path.join(app.getPath('userData'), 'trove-config.json');
let config = {
  watchFolderPath: ''
};

try {
  if (fs.existsSync(CONFIG_PATH)) {
    config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
  }
} catch (err) {
  console.error('Failed to load config:', err);
}

function saveConfig() {
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
  } catch (err) {
    console.error('Failed to save config:', err);
  }
}

let watcher: any = null;

function setupWatcher(win: BrowserWindow) {
  if (watcher) {
    watcher.close();
  }

  if (!config.watchFolderPath || !fs.existsSync(config.watchFolderPath)) {
    return;
  }

  watcher = chokidar.watch(config.watchFolderPath, {
    ignored: [
      /(^|[\/\\])\../, // ignore dotfiles
      '**/node_modules/**',
      '**/dist/**',
      '**/.git/**',
      '**/.next/**'
    ],
    persistent: true,
    ignoreInitial: true, // only watch for new files
    depth: 5, // prevent excessively deep watching
  });

  console.log(`Starting watcher on: ${config.watchFolderPath}`);

  watcher.on('error', (error: Error) => {
    console.error('Watcher error:', error);
  });

  watcher.on('add', (filePath: string) => {
    const fileName = path.basename(filePath);
    const ext = path.extname(filePath).toLowerCase().slice(1);
    
    // Support formats: jpg, jpeg, png, webp, gif, svg, pdf, otf, ttf
    const supported = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'pdf', 'otf', 'ttf'];
    if (supported.includes(ext)) {
      // Find window to send event to
      const targetWin = win || BrowserWindow.getAllWindows()[0];
      if (targetWin) {
        targetWin.webContents.send('file-added', {
          path: filePath,
          name: fileName,
          type: `image/${ext === 'jpg' ? 'jpeg' : ext}`, // Basic type estimation
          size: fs.statSync(filePath).size
        });
      }
    }
  });
}

// Register custom protocol for local assets
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('trove', process.execPath, [path.resolve(process.argv[1])])
  }
} else {
  app.setAsDefaultProtocolClient('trove')
}

function registerProtocol() {
  protocol.handle('nova-asset', (request) => {
    const filePath = decodeURIComponent(request.url.replace('nova-asset://', ''));
    // Ensure correct file URL formatting
    const formattedPath = filePath.startsWith('/') ? filePath : '/' + filePath;
    return net.fetch('file://' + formattedPath);
  });
}

function createWindow() {
  const win = new BrowserWindow({
    title: 'Trove',
    width: 1200,
    height: 800,
    minWidth: 1024,
    minHeight: 500,
    backgroundColor: '#0a0c13',
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const WEB_APP_URL = 'https://localhost:3000';
  let isErrorPageLoaded = false;

  win.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    if (isErrorPageLoaded) return;
    if (validatedURL.startsWith(WEB_APP_URL)) {
      isErrorPageLoaded = true;
      if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL);
      } else {
        win.loadFile(path.join(__dirname, '../dist/index.html'));
      }
    }
  });

  win.webContents.on('did-finish-load', () => {
    const currentURL = win.webContents.getURL();
    if (currentURL.startsWith(WEB_APP_URL)) {
      isErrorPageLoaded = false;
    }
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(`${WEB_APP_URL}?platform=desktop`);
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Handle self-signed certificate
  win.webContents.on('certificate-error', (event, url, error, certificate, callback) => {
    if (url.startsWith('https://localhost')) {
      event.preventDefault();
      callback(true);
    } else {
      callback(false);
    }
  });

  // Watcher setup
  setupWatcher(win);

  return win;
}

app.setName('Trove');

app.whenReady().then(() => {
  registerProtocol();
  const win = createWindow();

  // IPC Handlers
  ipcMain.handle('select-folder', async () => {
    const result = await dialog.showOpenDialog(win, {
      properties: ['openDirectory']
    });
    if (!result.canceled && result.filePaths.length > 0) {
      config.watchFolderPath = result.filePaths[0];
      saveConfig();
      setupWatcher(win);
      return config.watchFolderPath;
    }
    return null;
  });

  ipcMain.handle('get-watch-folder', () => {
    return config.watchFolderPath;
  });

  ipcMain.on('set-watch-folder', (event, folderPath) => {
    config.watchFolderPath = folderPath;
    saveConfig();
    setupWatcher(win);
  });

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
