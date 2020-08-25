// Imports
const { ipcRenderer } = require('electron');

// Queries
const portInput = document.querySelector('.path-input');
const baudInput = document.querySelector('.baud-input');
const portButt = document.querySelector('.path-button');
const pathP = document.querySelector('.path-p');
const monitorDiv = document.querySelector('.monitor');
const devicesDiv = document.querySelector('.devices');

// Functionallity
const setPath = (path) => {
    const response = ipcRenderer.sendSync('setSerial', { path: path , baud: baudInput.value});
    if (response) {
        pathP.innerHTML = response;
    }
};

portButt.addEventListener('click', () => {
    setPath(portInput.value);
});

// Logging

const log = (msg) => {
    const p = document.createElement('p');
    p.innerHTML = msg;
    monitorDiv.appendChild(p);
    monitorDiv.scrollTop = monitorDiv.scrollHeight;
};

ipcRenderer.on('log', (event, data) => {
    log(data.msg);
});

// Get device list

const addDevice = (dev) => {
    const li = document.createElement('li');
    li.innerHTML = dev;
    li.onclick = () => {
        setPath(`/dev/${dev}`);
    };
    devicesDiv.children[1].appendChild(li);
};

const devices = ipcRenderer.sendSync('getDevices');
devices.forEach((dev) => {
    addDevice(dev);
});
