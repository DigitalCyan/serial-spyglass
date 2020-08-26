// MAIN PROCESS

const { app, ipcMain, BrowserWindow } = require('electron');
const SerialPort = require('serialport');
const fs = require('fs');

let serialPort = null;
let mainWin = null;

const createWindow = () => {
    mainWin = new BrowserWindow({
        width: 600,
        height: 500,
        webPreferences: {
            nodeIntegration: true,
        },
    });
    mainWin.setMenu(null);
    mainWin.toggleDevTools();
    mainWin.maximize();
    mainWin.loadFile('./static/index.html');
};

// IPC listeners

ipcMain.on('setSerial', (event, data) => {
    if (data.path && data.baud && fs.existsSync(data.path)) {
        try {
            fs.accessSync(data.path, fs.constants.R_OK);
            if (serialPort) {
                serialPort.close();
                serialPort = null;
            }
            serialPort = new SerialPort(data.path, {
                baudRate: data.baud,
                autoOpen: false,
            });
            serialPort.on('data', (data) => {
                mainWin.webContents.send('log', { msg: data.toString() });
            });
            serialPort.open();
            event.returnValue = 'Reading the serial...';
        } catch (err) {
            event.returnValue = `${data.path} exists, but you are not allowed to read from it. ${err}`;
        }
    } else {
        event.returnValue = 'Invalid path or baud';
    }
});

ipcMain.on('getDevices', (event) => {
    event.returnValue = fs.readdirSync('/dev');
});

app.on('ready', createWindow);
