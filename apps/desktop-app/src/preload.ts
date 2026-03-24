import { contextBridge, ipcRenderer } from 'electron';

// Expose a minimal API to the renderer process
contextBridge.exposeInMainWorld('electron', {
  send: (channel: string, data: any) => {
    // whitelist channels
    const validChannels = ['toMain'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel: string, callback: (...args: any[]) => void) => {
    const validChannels = ['fromMain'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => callback(...args));
    }
  },
});
