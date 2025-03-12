// API服务，封装与主进程的通信

// 下载相关API
export const downloadAPI = {
  // 解析视频链接
  parseVideo: async (url: string): Promise<any> => {
    try {
      return await window.electron.ipcRenderer.invoke('video:parse', { url })
    } catch (error) {
      console.error('解析视频失败:', error)
      throw error
    }
  },

  // 开始下载
  startDownload: async (task: any): Promise<void> => {
    try {
      await window.electron.ipcRenderer.invoke('download:start', task)
    } catch (error) {
      console.error('开始下载失败:', error)
      throw error
    }
  },

  // 暂停下载
  pauseDownload: async (id: string): Promise<void> => {
    try {
      await window.electron.ipcRenderer.invoke('download:pause', { id })
    } catch (error) {
      console.error('暂停下载失败:', error)
      throw error
    }
  },

  // 恢复下载
  resumeDownload: async (id: string): Promise<void> => {
    try {
      await window.electron.ipcRenderer.invoke('download:resume', { id })
    } catch (error) {
      console.error('恢复下载失败:', error)
      throw error
    }
  },

  // 取消下载
  cancelDownload: async (id: string): Promise<void> => {
    try {
      await window.electron.ipcRenderer.invoke('download:cancel', { id })
    } catch (error) {
      console.error('取消下载失败:', error)
      throw error
    }
  },

  // 获取下载列表
  getDownloads: async (): Promise<any[]> => {
    try {
      return await window.electron.ipcRenderer.invoke('download:list')
    } catch (error) {
      console.error('获取下载列表失败:', error)
      throw error
    }
  }
}

// 转换相关API
export const conversionAPI = {
  // 开始转换
  startConversion: async (task: any): Promise<void> => {
    try {
      await window.electron.ipcRenderer.invoke('conversion:start', task)
    } catch (error) {
      console.error('开始转换失败:', error)
      throw error
    }
  },

  // 取消转换
  cancelConversion: async (id: string): Promise<void> => {
    try {
      await window.electron.ipcRenderer.invoke('conversion:cancel', { id })
    } catch (error) {
      console.error('取消转换失败:', error)
      throw error
    }
  },

  // 获取转换列表
  getConversions: async (): Promise<any[]> => {
    try {
      return await window.electron.ipcRenderer.invoke('conversion:list')
    } catch (error) {
      console.error('获取转换列表失败:', error)
      throw error
    }
  }
}

// 文件相关API
export const fileAPI = {
  // 选择文件
  selectFile: async (options: any): Promise<string> => {
    try {
      return await window.electron.ipcRenderer.invoke('file:select', options)
    } catch (error) {
      console.error('选择文件失败:', error)
      throw error
    }
  },

  // 选择目录
  selectDirectory: async (): Promise<string> => {
    try {
      return await window.electron.ipcRenderer.invoke('file:select-dir')
    } catch (error) {
      console.error('选择目录失败:', error)
      throw error
    }
  },

  // 获取文件信息
  getFileInfo: async (path: string): Promise<any> => {
    try {
      return await window.electron.ipcRenderer.invoke('file:info', { path })
    } catch (error) {
      console.error('获取文件信息失败:', error)
      throw error
    }
  }
}

// 设置相关API
export const settingsAPI = {
  // 获取设置
  getSettings: async (): Promise<any> => {
    try {
      return await window.electron.ipcRenderer.invoke('settings:get')
    } catch (error) {
      console.error('获取设置失败:', error)
      throw error
    }
  },

  // 更新设置
  updateSettings: async (settings: any): Promise<void> => {
    try {
      await window.electron.ipcRenderer.invoke('settings:update', settings)
    } catch (error) {
      console.error('更新设置失败:', error)
      throw error
    }
  },

  // 重置设置
  resetSettings: async (): Promise<void> => {
    try {
      await window.electron.ipcRenderer.invoke('settings:reset')
    } catch (error) {
      console.error('重置设置失败:', error)
      throw error
    }
  }
}
