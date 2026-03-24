"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electron", {
  send: (channel, data) => {
    const validChannels = ["toMain"];
    if (validChannels.includes(channel)) {
      electron.ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, callback) => {
    const validChannels = ["fromMain"];
    if (validChannels.includes(channel)) {
      electron.ipcRenderer.on(channel, (event, ...args) => callback(...args));
    }
  }
});
