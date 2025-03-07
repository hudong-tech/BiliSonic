import { app, BrowserWindow } from 'electron'
import { join } from 'path'

export class AppManager {
  private mainWindow: BrowserWindow | null = null

  constructor() {
    this.setupAppEvents()
  }

  private setupAppEvents() {
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })

    app.on('activate', () => {
      if (!this.mainWindow) {
        this.createWindow()
      }
    })
  }

  public async createWindow() {
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      show: false,
      autoHideMenuBar: true,
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        nodeIntegration: false,
        contextIsolation: true,
      },
    })

    this.mainWindow.on('ready-to-show', () => {
      this.mainWindow?.show()
    })

    // Load the entry URL
    if (process.env.VITE_DEV_SERVER_URL) {
      await this.mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
      this.mainWindow.webContents.openDevTools()
    } else {
      await this.mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    }

    return this.mainWindow
  }

  public getMainWindow(): BrowserWindow | null {
    return this.mainWindow
  }
}
