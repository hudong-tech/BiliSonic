import { useEffect } from 'react'
import { theme } from 'antd'
import { useUIStore } from '../stores/ui-store'
import { useSettingsStore } from '../stores/settings-store'

const { darkAlgorithm, defaultAlgorithm } = theme

// 获取系统主题
export const getSystemTheme = (): 'light' | 'dark' => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

// 应用主题到文档
export const applyTheme = (themeName: 'light' | 'dark') => {
  document.documentElement.setAttribute('data-theme', themeName)
  // 更新body类名，用于一些全局样式
  if (themeName === 'dark') {
    document.body.classList.add('dark-theme')
    document.body.classList.remove('light-theme')
  } else {
    document.body.classList.add('light-theme')
    document.body.classList.remove('dark-theme')
  }
}

// 监听系统主题变化
export const useThemeDetector = () => {
  const { theme: appTheme, setTheme } = useUIStore()
  const { theme: settingsTheme } = useSettingsStore()

  useEffect(() => {
    // 如果设置为跟随系统，则更新UI状态
    if (settingsTheme === 'auto') {
      setTheme('auto')
    } else {
      setTheme(settingsTheme)
    }
  }, [settingsTheme, setTheme])

  useEffect(() => {
    if (appTheme !== 'auto') {
      // 直接应用指定主题
      applyTheme(appTheme)
      return
    }

    // 跟随系统主题
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? 'dark' : 'light'
      applyTheme(newTheme)
    }

    // 初始设置
    applyTheme(darkModeMediaQuery.matches ? 'dark' : 'light')

    // 添加监听器
    darkModeMediaQuery.addEventListener('change', handleChange)

    return () => {
      darkModeMediaQuery.removeEventListener('change', handleChange)
    }
  }, [appTheme])

  return appTheme === 'auto' ? getSystemTheme() : appTheme
}

// 获取Ant Design主题配置
export const getThemeConfig = () => {
  const currentTheme = useThemeDetector()

  return {
    algorithm: currentTheme === 'dark' ? darkAlgorithm : defaultAlgorithm,
    token: {
      colorPrimary: currentTheme === 'dark' ? '#4A89DC' : '#1677ff',
      borderRadius: 6,
    },
    components: {
      Layout: {
        bodyBg: currentTheme === 'dark' ? '#2B2D30' : '#F5F5F5',
        siderBg: currentTheme === 'dark' ? '#3C3F41' : '#FFFFFF',
      },
      Menu: {
        darkItemBg: '#3C3F41',
        darkItemHoverBg: '#4E5254',
        darkItemSelectedBg: '#4A89DC',
      },
      Card: {
        colorBorderSecondary: currentTheme === 'dark' ? '#555555' : '#D1D1D1',
      },
      Button: {
        colorPrimaryHover: currentTheme === 'dark' ? '#5A99EC' : '#4096ff',
      }
    }
  }
}

// 切换主题
export const toggleTheme = () => {
  const { theme: currentTheme, setTheme } = useUIStore()
  const { updateSettings } = useSettingsStore()

  let newTheme: 'light' | 'dark' | 'auto'

  if (currentTheme === 'light') {
    newTheme = 'dark'
  } else if (currentTheme === 'dark') {
    newTheme = 'auto'
  } else {
    newTheme = 'light'
  }

  setTheme(newTheme)
  updateSettings({ theme: newTheme })

  return newTheme
}
