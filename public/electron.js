const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: false,  // Keep disabled for now
      allowRunningInsecureContent: false,
      experimentalFeatures: false
    },
    show: false
  });

  const isDev = !app.isPackaged;
  
  let startUrl;
  if (isDev) {
    startUrl = 'http://localhost:5173';
  } else {
    // Make sure this points to the correct location
    startUrl = `file://${path.join(__dirname, '../dist/index.html')}`;
  }
  
  console.log('isDev:', isDev);
  console.log('Loading URL:', startUrl);
  console.log('__dirname:', __dirname);
  
  mainWindow.loadURL(startUrl);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Keep DevTools open to see errors
  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});