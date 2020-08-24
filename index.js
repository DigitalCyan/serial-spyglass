const { app, ipcMain, BrowserWindow } = require('electron');
const SerialPort = require('serialport');
const fs = require('fs');

let serialPort = null;

const createWindow = () => {
    const mainWin = new BrowserWindow({
        width: 600,
        height: 500,
        webPreferences: {
            nodeIntegration: true,
        },
    });
    mainWin.setMenu(null);
    mainWin.maximize();
    mainWin.toggleDevTools();
    mainWin.loadFile('./static/index.html');
};

ipcMain.on('setSerial', (event, data) => {
    if (data.path && fs.existsSync(data.path)) {
        try {
            fs.accessSync(data.path, fs.constants.R_OK);
            serialPort = new SerialPort(data.path);
            event.returnValue = data.path;
        }catch{
            event.returnValue = `${data.path} exists, but you are not allowed to read from it.`
        }
    } else {
        event.returnValue = 'Invalid path';
    }
});

app.on('ready', createWindow);
