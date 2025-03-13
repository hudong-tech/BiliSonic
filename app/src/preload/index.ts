import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// 自定义IPC API
const ipcAPI = {
  // 发送消息（无返回值）
  send: (channel: string, ...args: any[]) => {
    ipcRenderer.send(channel, ...args)
  },

  // 发送同步消息（有返回值）
  sendSync: (channel: string, ...args: any[]) => {
    return ipcRenderer.sendSync(channel, ...args)
  },

  // 发送异步消息（有返回值）
  invoke: (channel: string, ...args: any[]) => {
    return ipcRenderer.invoke(channel, ...args)
  },

  // 监听消息
  on: (channel: string, listener: (...args: any[]) => void) => {
    ipcRenderer.on(channel, (_, ...args) => listener(...args))

    // 返回一个清理函数
    return () => {
      ipcRenderer.removeListener(channel, listener)
    }
  },

  // 监听一次性消息
  once: (channel: string, listener: (...args: any[]) => void) => {
    ipcRenderer.once(channel, (_, ...args) => listener(...args))
  },

  // 移除所有监听器
  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel)
  }
}

// 暴露给渲染进程的API
const api = {
  // 测试API
  test: {
    ping: () => ipcRenderer.invoke('ping-async'),
    getAppName: () => ipcRenderer.invoke('test:get-app-name'),
    getWindowInfo: () => ipcRenderer.invoke('test:get-window-info')
  },

  // 版本信息
  versions: {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron
  }
}

// 使用contextBridge暴露API
if (process.contextIsolated) {
  try {
    // 暴露electron API
    contextBridge.exposeInMainWorld('electron', {
      ipcRenderer: ipcAPI
    })

    // 暴露自定义API
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error('预加载脚本错误:', error)
  }
} else {
  // @ts-ignore
  window.electron = {
    ipcRenderer: ipcAPI
  }
  // @ts-ignore
  window.api = api
}
