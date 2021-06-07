const { app, BrowserWindow } = require('electron')
const fs = require('fs')

function createWindow() {
    const win = new BrowserWindow({
        //
    })

    win.maximize()
    win.loadFile(`./html/index.html`)
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