// RENDER PROCESS

// Imports
const { ipcRenderer } = require('electron');

// Queries
const portInput = document.querySelector('.path-input');
const baudInput = document.querySelector('.baud-input');
const portButt = document.querySelector('.path-button');
const pathP = document.querySelector('.path-p');
const monitorOutputDiv = document.querySelector('.monitor-output');
const autoscrolInput = document.querySelector('.monitor-autoscroll-input');
const devicesDiv = document.querySelector('.devices');
const gitHubImg = document.querySelector('.github-img');

// Functionallity
const setPath = (path) => {
    const response = ipcRenderer.sendSync('setSerial', {
        path: path,
        baud: parseInt(baudInput.value),
    });
    if (response) {
        pathP.innerHTML = response;
    }
};

portButt.addEventListener('click', () => {
    setPath(portInput.value);
});

gitHubImg.addEventListener('click', () => {
    ipcRenderer.send('openGitHub');
})

// Logging

const log = (msg) => {
    const p = document.createElement('p');
    p.innerHTML = msg;
    monitorOutputDiv.appendChild(p);
    if (autoscrolInput.checked) {
        monitorOutputDiv.scrollTop = monitorOutputDiv.scrollHeight;
    }
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
