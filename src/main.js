const { app, BrowserWindow } = require('electron')

function createWindow() {
    const win = BrowserWindow({
        //
    })

    win.maximize()
    win.loadFile("../html/index.html")
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