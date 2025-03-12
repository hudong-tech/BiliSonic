import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Settings {
  downloadPath: string
  maxConcurrentDownloads: number
  maxConcurrentConversions: number
  autoConvert: boolean
  defaultFormat: 'mp3' | 'aac' | 'flac' | 'ogg' | 'wav' | 'm4a'
  theme: 'light' | 'dark' | 'auto'
  ytdlpPath: string
  ffmpegPath: string
}

export interface SettingsState extends Settings {
  updateSettings: (settings: Partial<Settings>) => void
  resetSettings: () => void
}

// 默认设置
const defaultSettings: Settings = {
  downloadPath: '/Users/downloads',
  maxConcurrentDownloads: 3,
  maxConcurrentConversions: 2,
  autoConvert: true,
  defaultFormat: 'mp3',
  theme: 'auto',
  ytdlpPath: '',
  ffmpegPath: '',
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,

      updateSettings: (newSettings) => {
        set((state) => ({
          ...state,
          ...newSettings
        }))

        // 这里将来会通过IPC调用主进程保存设置
      },

      resetSettings: () => {
        set(defaultSettings)

        // 这里将来会通过IPC调用主进程重置设置
      }
    }),
    {
      name: 'bilisonic-settings',
    }
  )
)
