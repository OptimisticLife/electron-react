const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  greetings: (message) => ipcRenderer.send("greeting", message),
  getPersonData: () => ipcRenderer.invoke("getPersonData"),
  addPersonData: (person) => ipcRenderer.send("addPersonData", person),
});
