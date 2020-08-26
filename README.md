# Serial Spyglass

## About

Serial Spyglass is a Linux tool for reading serial data from devices. Simply run the program and from the right side select the device of which you wish to see the serial input. The window in the middle serves as the monitor. If you wish to enter the location of the device yourself, you can do so from the settings window to the left.

## Suported platforms
Linux only

Serial Spyglass runs on [Electron](https://github.com/electron/electron) which basically means it can be ported to run on Windows, macOS and Linux by fiddling with the source a bit and using [electron-packager](https://www.npmjs.com/package/electron-packager/v/15.1.0).

## Getting ready to fiddle
Use `cd` to enter the cloned repo's folder, then run: 
```
npm i
```
This will download all the dependencies, now to make sure that all the packages are rebuilt for electron do:
```
npm run rebuild
```
And now you are ready to fiddle.

## Running

Running the software:
```
npm start
```
Packaging the source:
```
npm package
```