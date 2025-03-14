import { app, BrowserWindow, screen } from 'electron'
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
    // 获取主显示器的工作区域大小
    const primaryDisplay = screen.getPrimaryDisplay()
    const { width, height } = primaryDisplay.workAreaSize

    // 计算窗口大小，确保不超过工作区域
    const windowWidth = Math.min(1200, width * 0.8)
    const windowHeight = Math.min(800, height * 0.8)

    this.mainWindow = new BrowserWindow({
      width: windowWidth,
      height: windowHeight,
      show: false,
      autoHideMenuBar: true,
      // 设置背景颜色与应用一致
      backgroundColor: '#18191C',
      // 使用系统标题栏
      frame: true, // 使用系统窗口框架
      titleBarStyle: 'default', // 使用默认标题栏样式
      title: 'BiliSonic', // 设置窗口标题
      // 确保布局填充整个窗口
      useContentSize: true,
      // 启用窗口阴影
      hasShadow: true,
      // 确保窗口边框与内容无缝衔接
      fullscreenable: true,
      // 确保窗口内容完全不透明
      transparent: false,
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        nodeIntegration: false,
        contextIsolation: true,
        // 禁用背景节流，确保背景渲染正常
        backgroundThrottling: false
      },
    })

    // 设置应用名称
    app.name = 'BiliSonic'

    // 创建窗口后立即设置标题
    this.mainWindow.setTitle('BiliSonic')

    // 监听窗口大小变化
    this.mainWindow.on('resize', () => {
      // 通知渲染进程窗口大小已更改
      if (this.mainWindow && !this.mainWindow.isDestroyed()) {
        this.mainWindow.webContents.send('window-resize')
      }
    })

    // 监听窗口移动
    this.mainWindow.on('move', () => {
      // 通知渲染进程窗口位置已更改
      if (this.mainWindow && !this.mainWindow.isDestroyed()) {
        this.mainWindow.webContents.send('window-move')
      }
    })

    // 监听窗口获取焦点
    this.mainWindow.on('focus', () => {
      if (this.mainWindow && !this.mainWindow.isDestroyed()) {
        this.mainWindow.webContents.send('window-focus')
      }
    })

    this.mainWindow.on('ready-to-show', () => {
      this.mainWindow?.show()

      // 窗口显示后，再次确保标题设置正确
      if (this.mainWindow) {
        this.mainWindow.setTitle('BiliSonic')

        // 窗口显示后，记录窗口尺寸
        const [width, height] = this.mainWindow.getSize()
        console.log('窗口尺寸:', { width, height })

        const [x, y] = this.mainWindow.getPosition()
        console.log('窗口位置:', { x, y })

        const contentSize = this.mainWindow.getContentSize()
        console.log('内容区域尺寸:', {
          width: contentSize[0],
          height: contentSize[1]
        })

        // 确保窗口尺寸正确
        setTimeout(() => {
          if (this.mainWindow && !this.mainWindow.isDestroyed()) {
            this.mainWindow.webContents.send('window-ready')
          }
        }, 500)
      }
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
