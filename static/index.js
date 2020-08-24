// Imports
const { ipcRenderer } = require('electron');

// Queries
const portInput = document.querySelector('.path-input');
const portButt = document.querySelector('.path-button');
const pathP = document.querySelector('.path-p')

portButt.addEventListener('click', () => {
    const path = ipcRenderer.sendSync('setSerial', {path: portInput.value});
    if(path){
        pathP.innerHTML = path;
    }
})