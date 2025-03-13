import { ipcMain, app, BrowserWindow } from 'electron'
import { setupDownloadHandlers } from './download-handler'
import { setupConversionHandlers } from './conversion-handler'
import { setupFileHandlers } from './file-handler'
import { setupSettingsHandlers } from './settings-handler'
import { setupWindowHandlers } from './window-handler'

/**
 * 设置所有IPC处理器
 */
export function setupIpcHandlers(): void {
  // 设置基本的ping-pong测试处理器
  setupPingHandler()

  // 设置测试处理器
  setupTestHandlers()

  // 设置各模块的IPC处理器
  setupDownloadHandlers()
  setupConversionHandlers()
  setupFileHandlers()
  setupSettingsHandlers()
  setupWindowHandlers()

  console.log('所有IPC处理器已设置')
}

/**
 * 设置基本的ping-pong测试处理器
 */
function setupPingHandler(): void {
  // 处理同步消息
  ipcMain.on('ping', (event) => {
    console.log('收到ping消息')
    event.returnValue = 'pong'
  })

  // 处理异步消息
  ipcMain.handle('ping-async', async () => {
    console.log('收到ping-async消息')
    return 'pong-async'
  })
}

/**
 * 设置测试处理器
 */
function setupTestHandlers(): void {
  // 获取应用名称
  ipcMain.handle('test:get-app-name', () => {
    console.log('获取应用名称:', app.name)
    return app.name
  })

  // 获取窗口信息
  ipcMain.handle('test:get-window-info', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (!win) {
      return { error: '无法获取窗口' }
    }

    return {
      id: win.id,
      title: win.getTitle(),
      size: win.getSize(),
      position: win.getPosition(),
      isMaximized: win.isMaximized(),
      isMinimized: win.isMinimized(),
      isFullScreen: win.isFullScreen(),
      isAlwaysOnTop: win.isAlwaysOnTop()
    }
  })
}
