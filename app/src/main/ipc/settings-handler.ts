import { ipcMain, app } from 'electron'
import path from 'path'
import fs from 'fs'
import { promisify } from 'util'

const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)
const mkdir = promisify(fs.mkdir)

// 设置文件路径
const SETTINGS_FILE = path.join(app.getPath('userData'), 'settings.json')

// 默认设置
const DEFAULT_SETTINGS = {
  downloadPath: path.join(app.getPath('downloads'), 'BiliSonic'),
  maxConcurrentDownloads: 3,
  maxConcurrentConversions: 2,
  autoConvert: true,
  defaultFormat: 'mp3',
  theme: 'auto',
  ytdlpPath: '',
  ffmpegPath: ''
}

// 当前设置
let currentSettings = { ...DEFAULT_SETTINGS }

/**
 * 设置设置相关的IPC处理器
 */
export function setupSettingsHandlers(): void {
  // 初始化设置
  initSettings()

  // 获取设置
  ipcMain.handle('settings:get', async () => {
    console.log('获取设置')
    return currentSettings
  })

  // 更新设置
  ipcMain.handle('settings:update', async (_, settings) => {
    console.log('更新设置:', settings)

    // 合并设置
    currentSettings = {
      ...currentSettings,
      ...settings
    }

    // 保存设置
    await saveSettings()

    return { success: true }
  })

  // 重置设置
  ipcMain.handle('settings:reset', async () => {
    console.log('重置设置')

    // 恢复默认设置
    currentSettings = { ...DEFAULT_SETTINGS }

    // 保存设置
    await saveSettings()

    return { success: true }
  })
}

/**
 * 初始化设置
 */
async function initSettings(): Promise<void> {
  try {
    // 确保设置目录存在
    const settingsDir = path.dirname(SETTINGS_FILE)
    await mkdir(settingsDir, { recursive: true })

    // 读取设置文件
    try {
      const data = await readFile(SETTINGS_FILE, 'utf8')
      currentSettings = {
        ...DEFAULT_SETTINGS,
        ...JSON.parse(data)
      }
      console.log('已加载设置:', currentSettings)
    } catch (error) {
      // 如果文件不存在，创建默认设置
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        await saveSettings()
        console.log('已创建默认设置')
      } else {
        throw error
      }
    }

    // 确保下载目录存在
    await mkdir(currentSettings.downloadPath, { recursive: true })
  } catch (error) {
    console.error('初始化设置失败:', error)
  }
}

/**
 * 保存设置
 */
async function saveSettings(): Promise<void> {
  try {
    await writeFile(SETTINGS_FILE, JSON.stringify(currentSettings, null, 2), 'utf8')
    console.log('设置已保存')
  } catch (error) {
    console.error('保存设置失败:', error)
    throw error
  }
}
