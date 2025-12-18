const { app, BrowserWindow, Tray, Menu, globalShortcut, screen, ipcMain } = require("electron");
const path = require("path");

let Store, AutoLaunch;
let dimWindows = [];
let tray = null;
let brightness = 0.5;
let autoLauncher;

async function initializeApp() {
  const StoreModule = await import("electron-store");
  Store = StoreModule.default;

  const AutoLaunchModule = await import("auto-launch");
  AutoLaunch = AutoLaunchModule.default;

  const store = new Store();
  brightness = store.get("brightness", 0.5);

  autoLauncher = new AutoLaunch({ name: "ScreenDimmer" });

  app.whenReady().then(() => {
    createDimWindows();
    createTray();
    registerShortcuts();
  });

  screen.on("display-added", createDimWindows);
  screen.on("display-removed", createDimWindows);
}

function createDimWindows() {
    const displays = screen.getAllDisplays();
  
    // Close previous dimming windows
    dimWindows.forEach(win => win.close());
    dimWindows = [];
  
    displays.forEach(display => {
      let win = new BrowserWindow({
        x: display.bounds.x,
        y: display.bounds.y,
        width: display.bounds.width,
        height: display.bounds.height,
        alwaysOnTop: true, // Keep it above other windows
        frame: false, // Remove the window frame
        fullscreen: true, // Ensure it covers the whole screen
        transparent: true, // Allow transparency
        skipTaskbar: true, // Don't show in taskbar
        focusable: false, // Don't take focus
        type: process.platform === "darwin" ? "toolbar" : "popup",
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
        },
      });
  
      win.setAlwaysOnTop(true, "screen-saver"); // Keep it above everything
      win.setIgnoreMouseEvents(true); // Don't block user interaction
  
     
  
      win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(getHTML(brightness))}`);
  
      dimWindows.push(win);
    });
  }

function createTray() {
  let iconPath = path.join(__dirname, process.platform === "win32" ? "icon.ico" : "icon.png");

  tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    { label: "Increase Brightness (+)", click: () => adjustBrightness(0.1) },
    { label: "Decrease Brightness (-)", click: () => adjustBrightness(-0.1) },
    { type: "separator" },
    { label: "Auto Start", type: "checkbox", checked: new Store().get("autoStart", false), click: toggleAutoStart },
    { type: "separator" },
    { label: "Quit", role: "quit" },
  ]);
  tray.setContextMenu(contextMenu);
  tray.setToolTip("Screen Dimmer");
}

function registerShortcuts() {
  globalShortcut.unregisterAll();
  globalShortcut.register("CommandOrControl+Up", () => adjustBrightness(0.1));
  globalShortcut.register("CommandOrControl+Down", () => adjustBrightness(-0.1));
}

function adjustBrightness(change) {
  brightness = Math.max(0, Math.min(1, brightness + change));
  const store = new Store();
  store.set("brightness", brightness);

  dimWindows.forEach(win => {
    if (win && !win.isDestroyed()) {
      win.webContents.send("update-brightness", brightness);
    }
  });
}

// Listen for brightness updates from the main process
ipcMain.on("request-brightness", (event) => {
  event.reply("update-brightness", brightness);
});

function toggleAutoStart(menuItem) {
  const store = new Store();
  store.set("autoStart", menuItem.checked);
  menuItem.checked ? autoLauncher.enable() : autoLauncher.disable();
}

function getHTML(brightness) {
  return `<body style="background: rgba(0, 0, 0, ${brightness}); width:100vw; height:100vh; margin:0;"></body>
  <script>
    const { ipcRenderer } = require("electron");
    ipcRenderer.send("request-brightness");
    
    ipcRenderer.on("update-brightness", (_, value) => { 
      document.body.style.background = "rgba(0, 0, 0, " + value + ")";
    });
  </script>`;
}

initializeApp();
