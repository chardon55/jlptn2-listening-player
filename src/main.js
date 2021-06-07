const { app, BrowserWindow } = require('electron')
const fs = require('fs')

function createWindow() {
    const win = new BrowserWindow({
        //
    })

    win.maximize()
    win.loadFile(`./html/index.html`)
    win.webContents.openDevTools()

    win.webContents.on('did-finish-load', () => {
        win.webContents.send('version', fs.readFileSync("./package.json"))
    })
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})