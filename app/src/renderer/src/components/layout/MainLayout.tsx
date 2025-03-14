import { useState, ReactNode, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, Spin } from 'antd'
import {
  DownloadOutlined,
  AudioOutlined,
  HistoryOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  BugOutlined
} from '@ant-design/icons'
import Logo from '../Logo/Logo'
import StatusBar from './StatusBar'
import '../../styles/layout.css'

interface MainLayoutProps {
  children: ReactNode
  loading?: boolean
  showDetailPanel?: boolean
  detailPanel?: ReactNode
}

const MainLayout = ({
  children,
  loading = false,
  showDetailPanel = false,
  detailPanel = null
}: MainLayoutProps): JSX.Element => {
  const navigate = useNavigate()
  const location = useLocation()
  const [siderCollapsed, setSiderCollapsed] = useState(false)
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  // 添加引用来存储DOM元素
  const rootContainerRef = useRef<HTMLDivElement>(null)
  const appContainerRef = useRef<HTMLDivElement>(null)
  const mainContentRef = useRef<HTMLDivElement>(null)

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth
      const newHeight = window.innerHeight

      // 更新窗口尺寸状态
      setWindowDimensions({
        width: newWidth,
        height: newHeight
      })
    }

    // 监听浏览器窗口大小变化
    window.addEventListener('resize', handleResize)

    // 监听来自主进程的resize事件
    if (window.electron?.ipcRenderer) {
      window.electron.ipcRenderer.on('window-resize', handleResize)
    }

    return () => {
      window.removeEventListener('resize', handleResize)
      // 清理ipcRenderer监听器
      if (window.electron?.ipcRenderer) {
        window.electron.ipcRenderer.removeAllListeners('window-resize')
      }
    }
  }, [])

  // 监听窗口准备就绪事件
  useEffect(() => {
    if (window.electron?.ipcRenderer) {
      window.electron.ipcRenderer.on('window-ready', () => {})
      window.electron.ipcRenderer.on('window-focus', () => {})
    }

    return () => {
      if (window.electron?.ipcRenderer) {
        window.electron.ipcRenderer.removeAllListeners('window-ready')
        window.electron.ipcRenderer.removeAllListeners('window-focus')
      }
    }
  }, [])

  const menuItems = [
    {
      key: '/download',
      icon: <DownloadOutlined className="nav-icon" />,
      label: '下载管理'
    },
    {
      key: '/conversion',
      icon: <AudioOutlined className="nav-icon" />,
      label: '转换管理'
    },
    {
      key: '/history',
      icon: <HistoryOutlined className="nav-icon" />,
      label: '历史记录'
    },
    {
      key: '/settings',
      icon: <SettingOutlined className="nav-icon" />,
      label: '设置'
    },
    {
      key: '/help',
      icon: <QuestionCircleOutlined className="nav-icon" />,
      label: '帮助'
    },
    {
      key: '/test',
      icon: <BugOutlined className="nav-icon" />,
      label: '测试页面'
    }
  ]

  const handleMenuClick = (key: string) => {
    navigate(key)
  }

  // 判断当前页面是否显示状态栏
  const shouldShowStatusBar = () => {
    // 在设置、帮助和测试页面不显示状态栏
    const hiddenStatusBarPages = ['/settings', '/help', '/test']
    return !hiddenStatusBarPages.includes(location.pathname)
  }

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" tip="加载中..." />
      </div>
    )
  }

  return (
    <div className="root-container" ref={rootContainerRef}>
      <div className="app-container" ref={appContainerRef}>
        {/* 侧边导航栏 */}
        <div className={`sidebar ${siderCollapsed ? 'sidebar-collapsed' : ''}`}>
          <div className="sidebar-header">
            <div className="app-logo">
              <Logo size={28} color="#FFFFFF" />
              <span className="app-name">BiliSonic</span>
            </div>
          </div>
          <div className="sidebar-content">
            <Menu
              mode="inline"
              selectedKeys={[location.pathname]}
              items={menuItems.slice(0, 3)}
              onClick={({ key }) => handleMenuClick(key)}
              className="sidebar-menu"
              inlineCollapsed={siderCollapsed}
            />
          </div>
          <div className="sidebar-footer">
            <Menu
              mode="inline"
              selectedKeys={[location.pathname]}
              items={menuItems.slice(3)}
              onClick={({ key }) => handleMenuClick(key)}
              className="sidebar-menu"
              inlineCollapsed={siderCollapsed}
            />
          </div>
        </div>

        {/* 中央内容区 */}
        <div className="main-content" ref={mainContentRef}>
          {children}
          {/* 状态栏 - 仅在特定页面显示 */}
          {shouldShowStatusBar() && (
            <StatusBar
              activeTasks={2}
              completedTasks={1}
              errorTasks={1}
              initialCpuUsage={12}
              initialMemoryUsage="245MB"
            />
          )}
        </div>

        {/* 右侧详情面板 */}
        {showDetailPanel && (
          <div className="details-panel">
            {detailPanel}
          </div>
        )}
      </div>
    </div>
  )
}

export default MainLayout
