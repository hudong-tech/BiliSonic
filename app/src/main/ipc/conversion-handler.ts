import { ipcMain, BrowserWindow } from 'electron'
import path from 'path'

// 定义转换任务接口
interface ConversionTask {
  id: string
  download_id?: string
  input_path: string
  output_path: string
  format: 'mp3' | 'aac' | 'flac' | 'ogg' | 'wav' | 'm4a'
  status: 'pending' | 'converting' | 'completed' | 'error'
  progress: number
  created_at: string
  updated_at: string
  error_message?: string
}

// 模拟数据
const mockConversions: ConversionTask[] = [
  {
    id: '1',
    input_path: '/downloads/video1.mp4',
    output_path: '/music/audio1.mp3',
    format: 'mp3',
    status: 'completed',
    progress: 100,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    input_path: '/downloads/video2.mp4',
    output_path: '/music/audio2.flac',
    format: 'flac',
    status: 'converting',
    progress: 60,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

/**
 * 设置转换相关的IPC处理器
 */
export function setupConversionHandlers(): void {
  // 开始转换
  ipcMain.handle('conversion:start', async (_, task) => {
    console.log('开始转换:', task)

    // 模拟转换过程
    const newTask: ConversionTask = {
      id: Date.now().toString(),
      download_id: task.download_id,
      input_path: task.input_path,
      output_path: `${path.dirname(task.input_path)}/${path.basename(task.input_path, path.extname(task.input_path))}.${task.format}`,
      format: task.format,
      status: 'converting',
      progress: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // 将任务添加到模拟数据中
    mockConversions.push(newTask)

    // 模拟转换进度更新
    simulateConversionProgress(newTask.id)

    return newTask
  })

  // 取消转换
  ipcMain.handle('conversion:cancel', async (_, args) => {
    const { id } = args
    console.log('取消转换:', id)

    const task = mockConversions.find(t => t.id === id)
    if (task && task.status === 'converting') {
      task.status = 'error'
      task.error_message = '已取消'
      task.updated_at = new Date().toISOString()
    }

    return { success: true }
  })

  // 获取转换列表
  ipcMain.handle('conversion:list', async () => {
    console.log('获取转换列表')
    return mockConversions
  })
}

/**
 * 模拟转换进度更新
 */
function simulateConversionProgress(id: string): void {
  const task = mockConversions.find(t => t.id === id)
  if (!task || task.status !== 'converting') return

  const interval = setInterval(() => {
    const task = mockConversions.find(t => t.id === id)
    if (!task || task.status !== 'converting') {
      clearInterval(interval)
      return
    }

    // 更新进度
    task.progress += Math.random() * 15
    task.updated_at = new Date().toISOString()

    // 发送进度更新事件
    const mainWindow = BrowserWindow.getAllWindows()[0]
    if (mainWindow) {
      mainWindow.webContents.send('conversion:progress', {
        id,
        progress: task.progress
      })
    }

    // 转换完成
    if (task.progress >= 100) {
      task.progress = 100
      task.status = 'completed'
      clearInterval(interval)

      // 发送转换完成事件
      if (mainWindow) {
        mainWindow.webContents.send('conversion:complete', { id })
      }
    }
  }, 800) // 每0.8秒更新一次
}
