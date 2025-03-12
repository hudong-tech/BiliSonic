import { ipcMain } from 'electron'
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
