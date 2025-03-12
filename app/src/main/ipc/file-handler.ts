import { ipcMain, dialog, BrowserWindow } from 'electron'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const stat = promisify(fs.stat)

/**
 * 设置文件相关的IPC处理器
 */
export function setupFileHandlers(): void {
  // 选择文件
  ipcMain.handle('file:select', async (event, options) => {
    const mainWindow = BrowserWindow.fromWebContents(event.sender)
    if (!mainWindow) {
      throw new Error('无法获取主窗口')
    }

    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      title: options.title || '选择文件',
      properties: ['openFile'],
      filters: options.filters || [
        { name: '视频文件', extensions: ['mp4', 'flv', 'webm', 'mkv', 'avi'] }
      ]
    })

    if (canceled || filePaths.length === 0) {
      return null
    }

    return filePaths[0]
  })

  // 选择目录
  ipcMain.handle('file:select-dir', async (event) => {
    const mainWindow = BrowserWindow.fromWebContents(event.sender)
    if (!mainWindow) {
      throw new Error('无法获取主窗口')
    }

    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      title: '选择目录',
      properties: ['openDirectory']
    })

    if (canceled || filePaths.length === 0) {
      return null
    }

    return filePaths[0]
  })

  // 获取文件信息
  ipcMain.handle('file:info', async (_, args) => {
    const { path: filePath } = args

    try {
      const stats = await stat(filePath)

      return {
        path: filePath,
        name: path.basename(filePath),
        size: stats.size,
        isDirectory: stats.isDirectory(),
        isFile: stats.isFile(),
        created: stats.birthtime,
        modified: stats.mtime,
        extension: path.extname(filePath)
      }
    } catch (error) {
      console.error('获取文件信息失败:', error)
      throw error
    }
  })

  // 检查文件是否存在
  ipcMain.handle('file:exists', async (_, args) => {
    const { path: filePath } = args

    try {
      await stat(filePath)
      return true
    } catch (error) {
      return false
    }
  })
}
