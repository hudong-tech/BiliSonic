import { useState, ReactNode } from 'react'
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
import TitleBar from '../TitleBar/TitleBar'
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
    <div className="root-container">
      <TitleBar />
      <div className="app-container">
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
        <div className="main-content">
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
