let { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
let mainWindow;

ipcMain.handle("getPersonData", async (event, args) => {
  const personData = await readFile("db/person.json", "utf-8");
  return personData;
});

ipcMain.handle("addPersonData", async (event, person) => {
  const personData = await readFile("db/person.json", "utf-8");
  const parsedPersonData = await JSON.parse(personData);
  parsedPersonData.push(person);
  writeFile("db/person.json", JSON.stringify(parsedPersonData));
  return parsedPersonData;
});

// ipcMain.handle("generatePdf", async (event) => {
//   const pdfWindow = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
//       nodeIntegration: true,
//       contextIsolation: true,
//       preload: path.join(__dirname, "preload.js"),
//     },
//   });

//   pdfWindow.loadURL("http://localhost:3000/table-view");
//   let pdfOptions = {
//     printBackground: true,
//     margins: {
//       left: 0,
//       top: 0,
//       right: 0,
//       bottom: 0,
//     },
//   };

//   pdfWindow.webContents.on("did-finish-load", async function () {
//     pdfWindow.webContents.openDevTools();
//     const pdfPath = path.join(__dirname, "temp.pdf");

//     const webData = await mainWindow.webContents.printToPDF(pdfOptions);
//     try {
//       const pdfResponse = await writeFile(pdfPath, webData);
//       return { status: 200, pdfResponse };
//     } catch (err) {
//       console.log(`Failed to write PDF to ${pdfPath}: `, err);
//     }
//   });
// });

ipcMain.handle("generatePdf", async (event) => {
  let pdfOptions = {
    printBackground: true,
    margins: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    },
  };

  const pdfPath = path.join(__dirname, "temp.pdf");

  const webData = await mainWindow.webContents.printToPDF(pdfOptions);
  try {
    const pdfResponse = await writeFile(pdfPath, webData);
    console.log("PDF Created...");
    return { status: 200, pdfResponse };
  } catch (err) {
    console.log(`Failed to write PDF to ${pdfPath}: `, err);
  }
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
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
