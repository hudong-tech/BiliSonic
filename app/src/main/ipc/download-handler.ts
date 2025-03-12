import { ipcMain, dialog, BrowserWindow } from 'electron'
import path from 'path'

// 定义下载任务接口
interface DownloadTask {
  id: string
  url: string
  title: string
  author: string
  platform: 'bilibili' | 'youtube'
  filepath: string
  filesize: number
  status: 'pending' | 'downloading' | 'paused' | 'completed' | 'error'
  progress: number
  created_at: string
  updated_at: string
  error_message?: string
}

// 模拟数据
const mockDownloads: DownloadTask[] = [
  {
    id: '1',
    url: 'https://www.bilibili.com/video/BV1xx411c7mD',
    title: '示例视频1',
    author: '用户A',
    platform: 'bilibili',
    filepath: '/downloads/video1.mp4',
    filesize: 1024 * 1024 * 10, // 10MB
    status: 'completed',
    progress: 100,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: '示例视频2',
    author: '用户B',
    platform: 'youtube',
    filepath: '/downloads/video2.mp4',
    filesize: 1024 * 1024 * 20, // 20MB
    status: 'downloading',
    progress: 45,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

/**
 * 设置下载相关的IPC处理器
 */
export function setupDownloadHandlers(): void {
  // 解析视频链接
  ipcMain.handle('video:parse', async (_, args) => {
    const { url } = args
    console.log('解析视频链接:', url)

    // 模拟解析过程
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 根据URL判断平台
    const platform = url.includes('bilibili.com') ? 'bilibili' : 'youtube'

    return {
      url,
      title: platform === 'bilibili' ? 'B站视频标题' : 'YouTube视频标题',
      author: platform === 'bilibili' ? 'B站UP主' : 'YouTube创作者',
      platform,
      duration: 180, // 3分钟
      thumbnail: 'https://example.com/thumbnail.jpg'
    }
  })

  // 开始下载
  ipcMain.handle('download:start', async (_, task) => {
    console.log('开始下载:', task)

    // 模拟下载过程
    const newTask: DownloadTask = {
      id: Date.now().toString(),
      url: task.url,
      title: task.title,
      author: task.author,
      platform: task.platform,
      filepath: `/downloads/${task.title}.mp4`,
      filesize: 1024 * 1024 * Math.floor(Math.random() * 100), // 随机大小
      status: 'downloading',
      progress: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // 将任务添加到模拟数据中
    mockDownloads.push(newTask)

    // 模拟下载进度更新
    simulateDownloadProgress(newTask.id)

    return newTask
  })

  // 暂停下载
  ipcMain.handle('download:pause', async (_, args) => {
    const { id } = args
    console.log('暂停下载:', id)

    const task = mockDownloads.find(t => t.id === id)
    if (task && task.status === 'downloading') {
      task.status = 'paused'
      task.updated_at = new Date().toISOString()
    }

    return { success: true }
  })

  // 恢复下载
  ipcMain.handle('download:resume', async (_, args) => {
    const { id } = args
    console.log('恢复下载:', id)

    const task = mockDownloads.find(t => t.id === id)
    if (task && task.status === 'paused') {
      task.status = 'downloading'
      task.updated_at = new Date().toISOString()

      // 继续模拟下载进度
      simulateDownloadProgress(id)
    }

    return { success: true }
  })

  // 取消下载
  ipcMain.handle('download:cancel', async (_, args) => {
    const { id } = args
    console.log('取消下载:', id)

    const task = mockDownloads.find(t => t.id === id)
    if (task && (task.status === 'downloading' || task.status === 'paused')) {
      task.status = 'error'
      task.error_message = '已取消'
      task.updated_at = new Date().toISOString()
    }

    return { success: true }
  })

  // 获取下载列表
  ipcMain.handle('download:list', async () => {
    console.log('获取下载列表')
    return mockDownloads
  })
}

/**
 * 模拟下载进度更新
 */
function simulateDownloadProgress(id: string): void {
  const task = mockDownloads.find(t => t.id === id)
  if (!task || task.status !== 'downloading') return

  const interval = setInterval(() => {
    const task = mockDownloads.find(t => t.id === id)
    if (!task || task.status !== 'downloading') {
      clearInterval(interval)
      return
    }

    // 更新进度
    task.progress += Math.random() * 10
    task.updated_at = new Date().toISOString()

    // 发送进度更新事件
    const mainWindow = BrowserWindow.getAllWindows()[0]
    if (mainWindow) {
      mainWindow.webContents.send('download:progress', {
        id,
        progress: task.progress
      })
    }

    // 下载完成
    if (task.progress >= 100) {
      task.progress = 100
      task.status = 'completed'
      clearInterval(interval)

      // 发送下载完成事件
      if (mainWindow) {
        mainWindow.webContents.send('download:complete', { id })
      }
    }
  }, 1000) // 每秒更新一次
}
