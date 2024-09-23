let { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  ipcMain.on("greeting", (event, args) => {
    // console.log("Message:", args);
  });

  ipcMain.handle("getPersonData", async (event, args) => {
    const personData = await readFile("db/person.json", "utf-8");
    return personData;
  });

  ipcMain.on("addPersonData", async (event, person) => {
    const personData = await readFile("db/person.json", "utf-8");
    const parsedPersonData = await JSON.parse(personData);
    parsedPersonData.push(person);
    writeFile("db/person.json", JSON.stringify(parsedPersonData));
    event.sender.send("personUpdated", parsedPersonData);
  });

  mainWindow.loadURL("http://localhost:3000");
  mainWindow.on("closed", () => (mainWindow = null));
  mainWindow.webContents.openDevTools();
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
