// Imports
const { ipcRenderer } = require('electron');

// Queries
const portInput = document.querySelector('.path-input');
const baudInput = document.querySelector('.baud-input');
const portButt = document.querySelector('.path-button');
const pathP = document.querySelector('.path-p');
const monitorOutputDiv = document.querySelector('.monitor-output');
const autoscrollInput = document.querySelector('.monitor-autoscroll-input');
const devicesDiv = document.querySelector('.devices');
const filterInput = document.querySelector('.devices-filter-input');
const gitHubImg = document.querySelector('.github-img');
const refreshDevicesButton = document.querySelector('.refresh-devices-button');

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

const getDevices = () => {
    while (devicesDiv.children[1].firstChild) {
        devicesDiv.children[1].removeChild(devicesDiv.children[1].firstChild);
    }
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
        if (dev.search(filterInput.value) != -1) {
            addDevice(dev);
        }
    });
};

// Event listeners
portButt.addEventListener('click', () => {
    setPath(portInput.value);
});

gitHubImg.addEventListener('click', () => {
    ipcRenderer.send('openGitHub');
});

refreshDevicesButton.addEventListener('click', () => {
    getDevices();
});

// Logging
const log = (msg) => {
    const p = document.createElement('p');
    p.innerHTML = msg;
    monitorOutputDiv.appendChild(p);
    if (autoscrollInput.checked) {
        monitorOutputDiv.scrollTop = monitorOutputDiv.scrollHeight;
    }
};

ipcRenderer.on('log', (event, data) => {
    log(data.msg);
});

getDevices();
