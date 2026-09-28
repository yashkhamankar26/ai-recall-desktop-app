import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
   getObsidianNotes: (folderPath) => ipcRenderer.invoke('read-notes', folderPath),
  // new function for folder path
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  //new function for reading a files
  readFileContent: (folderPath, fileName) => ipcRenderer.invoke('read-file-content', folderPath, fileName)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
