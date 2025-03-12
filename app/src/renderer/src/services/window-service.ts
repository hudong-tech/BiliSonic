/**
 * 窗口服务，封装窗口操作API
 */

// 关闭窗口
export const closeWindow = async (): Promise<void> => {
  try {
    await window.electron.ipcRenderer.invoke('window:close')
  } catch (error) {
    console.error('关闭窗口失败:', error)
    throw error
  }
}

// 最小化窗口
export const minimizeWindow = async (): Promise<void> => {
  try {
    await window.electron.ipcRenderer.invoke('window:minimize')
  } catch (error) {
    console.error('最小化窗口失败:', error)
    throw error
  }
}

// 最大化/还原窗口
export const maximizeWindow = async (): Promise<boolean> => {
  try {
    const result = await window.electron.ipcRenderer.invoke('window:maximize')
    return result.isMaximized
  } catch (error) {
    console.error('最大化/还原窗口失败:', error)
    throw error
  }
}

// 获取窗口状态
export const getWindowState = async (): Promise<{
  isMaximized: boolean
  isMinimized: boolean
  isFullScreen: boolean
  isVisible: boolean
  isFocused: boolean
}> => {
  try {
    return await window.electron.ipcRenderer.invoke('window:state')
  } catch (error) {
    console.error('获取窗口状态失败:', error)
    throw error
  }
}

// 退出应用
export const quitApp = async (): Promise<void> => {
  try {
    await window.electron.ipcRenderer.invoke('app:quit')
  } catch (error) {
    console.error('退出应用失败:', error)
    throw error
  }
}

// 重启应用
export const restartApp = async (): Promise<void> => {
  try {
    await window.electron.ipcRenderer.invoke('app:restart')
  } catch (error) {
    console.error('重启应用失败:', error)
    throw error
  }
}
