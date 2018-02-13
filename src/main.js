'use strict'

const {app, BrowserWindow, Menu, Tray} = require('electron')
const path = require('path')
const packgeJson = require('../package.json')
const menu = require('./menu')
const trayMenu = require('./tray-menu')

let mainWindow
let tray

function createWindow () {
  mainWindow = new BrowserWindow({
    icon: path.join(__dirname, '..', 'assets', 'icons', '48x48.png'),
    backgroundColor: '#5458AF',
    autoHideMenuBar: true,
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, 'browser.js')
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.webContents.setUserAgent(
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36'
  )

  mainWindow.loadURL('https://teams.microsoft.com')

  // Setting the application menu, hidden by default
  Menu.setApplicationMenu(menu)

  // Setting tray icon
  tray = new Tray(path.join(__dirname, '..', 'assets', 'icons', '32x32.png'))
  tray.setToolTip(packgeJson.productName)
  tray.setContextMenu(trayMenu)
  tray.on('click', () => {
    mainWindow.show()
    mainWindow.focus()
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
