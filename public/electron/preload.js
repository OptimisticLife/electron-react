const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  getPersonData: () => ipcRenderer.invoke("getPersonData"),
  addPersonData: (person) => ipcRenderer.invoke("addPersonData", person),
  generatePdf: (url) => ipcRenderer.invoke("generatePdf", url),
});
