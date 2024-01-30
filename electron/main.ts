import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path from "node:path";
import { convertTsxToJsx } from "./util";
// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, "../dist");
process.env.VITE_PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, "../public");

let win: BrowserWindow | null;
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, "index.html"));
  }
  setInterval(() => {
    win.webContents.send(
      "update-counter",
      Math.floor(Math.random() * 1000) + __dirname
    );
    console.log("sending data");
  }, 6000);
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);

ipcMain.on("get-title", async (e, t) => {
  let path;
  try {
    const webContent = e.sender;
    const win = BrowserWindow.fromWebContents(webContent);
    win!.setTitle(t);
    const options: any = {
      title: "Select a Directory",
      properties: ["openDirectory"],
    };
    const result = await dialog.showOpenDialog(win!, options);

    if (!result.canceled && result.filePaths.length > 0) {
      console.log("Selected Path:", result.filePaths[0]);
      // Do something with the selected path
      console.log(`result`, result);
    }

    path = result.filePaths[0];
  } catch (error) {}
  console.log(`__dirrname`, __dirname); //dirname is in dist not in process
  console.log(`path=========================================`, path);
  convertTsxToJsx(path.toString());
  convertTsxToJsx(
    "/home/mehransaghebifard/mehran/electron-vite-project/electron"
  );
});
