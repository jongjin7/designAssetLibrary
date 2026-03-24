"use strict";
const electron = require("electron");
const path = require("node:path");
const RENDERER_DIST = path.join(__dirname, "../dist");
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;
function createWindow() {
  const win = new electron.BrowserWindow({
    title: "NOVA Desktop",
    width: 1200,
    height: 800,
    minWidth: 760,
    minHeight: 500,
    backgroundColor: "#0a0c13",
    titleBarStyle: "hiddenInset",
    // macOS standard for premium apps
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      // mjs if built as ESM
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  const WEB_APP_URL = "https://localhost:3000";
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(`${WEB_APP_URL}?platform=desktop`).catch(() => {
      console.warn("Web app at localhost:3000 not reachable, falling back to desktop-app renderer");
      win.loadURL(VITE_DEV_SERVER_URL);
    });
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
  win.webContents.on("certificate-error", (event, url, error, certificate, callback) => {
    if (url.startsWith("https://localhost")) {
      event.preventDefault();
      callback(true);
    } else {
      callback(false);
    }
  });
}
electron.app.setName("NOVA Desktop");
electron.app.whenReady().then(() => {
  createWindow();
  electron.app.on("activate", () => {
    if (electron.BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
