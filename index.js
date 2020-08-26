// MAIN PROCESS

const { app, ipcMain, BrowserWindow } = require('electron');
const SerialPort = require('serialport');
const fs = require('fs');
const open = require('open');

let serialPort = null;
let mainWin = null;

const createWindow = () => {
    mainWin = new BrowserWindow({
        minWidth: 900,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: true,
        },
    });
    mainWin.setMenu(null);
    // mainWin.toggleDevTools(); // IN CASE OF A DISASTER AND A SURGE OF WILL TO FIX IT, UNCOMMENT THIS LINE
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
            event.returnValue = `${data.path} exists, but you are not allowed to read from it.`;
        }
    } else {
        event.returnValue = 'Invalid path or baud';
    }
});

ipcMain.on('getDevices', (event) => {
    event.returnValue = fs.readdirSync('/dev');
});

ipcMain.on('openGitHub', () => {
    open('https://github.com/DigitalCyan/serial-spyglass');
});

// Run the ignition function

app.on('ready', createWindow);
