import { create } from 'zustand'

export interface DownloadTask {
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

export interface DownloadState {
  tasks: DownloadTask[]
  currentTask: DownloadTask | null
  addTask: (task: Omit<DownloadTask, 'id' | 'created_at' | 'updated_at' | 'status' | 'progress'>) => void
  updateTask: (id: string, updates: Partial<DownloadTask>) => void
  removeTask: (id: string) => void
  startTask: (id: string) => void
  pauseTask: (id: string) => void
  resumeTask: (id: string) => void
  cancelTask: (id: string) => void
  setTasks: (tasks: DownloadTask[]) => void
}

export const useDownloadStore = create<DownloadState>((set, get) => ({
  tasks: [],
  currentTask: null,

  addTask: (task) => {
    const newTask: DownloadTask = {
      id: Date.now().toString(),
      status: 'pending',
      progress: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...task
    }

    set((state) => ({
      tasks: [...state.tasks, newTask]
    }))

    // 这里将来会通过IPC调用主进程开始下载
  },

  updateTask: (id, updates) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates, updated_at: new Date().toISOString() } : task
      )
    }))
  },

  removeTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id)
    }))

    // 这里将来会通过IPC调用主进程删除任务
  },

  startTask: (id) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, status: 'downloading', updated_at: new Date().toISOString() } : task
      )
    }))

    // 这里将来会通过IPC调用主进程开始下载
  },

  pauseTask: (id) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, status: 'paused', updated_at: new Date().toISOString() } : task
      )
    }))

    // 这里将来会通过IPC调用主进程暂停下载
  },

  resumeTask: (id) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, status: 'downloading', updated_at: new Date().toISOString() } : task
      )
    }))

    // 这里将来会通过IPC调用主进程恢复下载
  },

  cancelTask: (id) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, status: 'error', error_message: '已取消', updated_at: new Date().toISOString() } : task
      )
    }))

    // 这里将来会通过IPC调用主进程取消下载
  },

  setTasks: (tasks) => {
    set({ tasks })
  }
}))
