import { ipcMain, BrowserWindow, app } from 'electron'

/**
 * 设置窗口相关的IPC处理器
 */
export function setupWindowHandlers(): void {
  // 关闭窗口
  ipcMain.handle('window:close', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window) {
      window.close()
    }
    return { success: true }
  })

  // 最小化窗口
  ipcMain.handle('window:minimize', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window) {
      window.minimize()
    }
    return { success: true }
  })

  // 最大化/还原窗口
  ipcMain.handle('window:maximize', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window) {
      if (window.isMaximized()) {
        window.unmaximize()
      } else {
        window.maximize()
      }
    }
    return { success: true, isMaximized: window?.isMaximized() }
  })

  // 获取窗口状态
  ipcMain.handle('window:state', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (!window) {
      return { error: '无法获取窗口' }
    }

    return {
      isMaximized: window.isMaximized(),
      isMinimized: window.isMinimized(),
      isFullScreen: window.isFullScreen(),
      isVisible: window.isVisible(),
      isFocused: window.isFocused()
    }
  })

  // 退出应用
  ipcMain.handle('app:quit', () => {
    app.quit()
    return { success: true }
  })

  // 重启应用
  ipcMain.handle('app:restart', () => {
    app.relaunch()
    app.exit(0)
    return { success: true }
  })
}
