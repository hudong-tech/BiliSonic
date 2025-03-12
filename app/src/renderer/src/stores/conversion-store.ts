import { create } from 'zustand'

export interface ConversionTask {
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

export interface ConversionState {
  tasks: ConversionTask[]
  currentTask: ConversionTask | null
  addTask: (task: Omit<ConversionTask, 'id' | 'created_at' | 'updated_at' | 'status' | 'progress'>) => void
  updateTask: (id: string, updates: Partial<ConversionTask>) => void
  removeTask: (id: string) => void
  startTask: (id: string) => void
  cancelTask: (id: string) => void
  setTasks: (tasks: ConversionTask[]) => void
}

export const useConversionStore = create<ConversionState>((set) => ({
  tasks: [],
  currentTask: null,

  addTask: (task) => {
    const newTask: ConversionTask = {
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

    // 这里将来会通过IPC调用主进程开始转换
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
        task.id === id ? { ...task, status: 'converting', updated_at: new Date().toISOString() } : task
      )
    }))

    // 这里将来会通过IPC调用主进程开始转换
  },

  cancelTask: (id) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, status: 'error', error_message: '已取消', updated_at: new Date().toISOString() } : task
      )
    }))

    // 这里将来会通过IPC调用主进程取消转换
  },

  setTasks: (tasks) => {
    set({ tasks })
  }
}))
