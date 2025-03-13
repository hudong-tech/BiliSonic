import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider, App as AntdApp, theme } from 'antd'
import MainLayout from './components/layout/MainLayout'
import DownloadPage from './components/pages/DownloadPage'
import ConversionPage from './components/pages/ConversionPage'
import HistoryPage from './components/pages/HistoryPage'
import SettingsPage from './components/pages/SettingsPage'
import HelpPage from './components/pages/HelpPage'
import TestPage from './pages/TestPage'
import { useUIStore } from './stores/ui-store'
import { useSettingsStore } from './stores/settings-store'

const { darkAlgorithm } = theme

function App(): JSX.Element {
  const [loading, setLoading] = useState(true)
  const { setLoading: setGlobalLoading } = useUIStore()
  const { updateSettings } = useSettingsStore()
  const [showDetailPanel, setShowDetailPanel] = useState(false)
  const [detailPanelContent, setDetailPanelContent] = useState<React.ReactNode>(null)

  useEffect(() => {
    // 初始化应用
    const initApp = async () => {
      try {
        setGlobalLoading(true)
        // 这里将来会从主进程获取初始数据
        // 例如：const settings = await settingsAPI.getSettings()
        // updateSettings(settings)

        // 模拟初始化延迟
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (error) {
        console.error('初始化应用失败:', error)
      } finally {
        setLoading(false)
        setGlobalLoading(false)
      }
    }

    initApp()
  }, [setGlobalLoading, updateSettings])

  // 显示详情面板
  const showDetail = (content: React.ReactNode) => {
    setDetailPanelContent(content)
    setShowDetailPanel(true)
  }

  // 隐藏详情面板
  const hideDetail = () => {
    setShowDetailPanel(false)
    setDetailPanelContent(null)
  }

  // 检查是否是测试路径
  const isTestPath = window.location.pathname.includes('/test')

  return (
    <ConfigProvider
      theme={{
        algorithm: darkAlgorithm,
        token: {
          colorPrimary: '#4A89DC',
          borderRadius: 6,
          colorBgContainer: '#2B2D30',
          colorBgElevated: '#2B2D30',
          colorBorder: '#555555',
          colorText: '#FFFFFF',
          colorTextSecondary: '#A7A7A7',
          colorBgLayout: '#2B2D30',
          colorBgBase: '#2B2D30',
        },
        components: {
          Menu: {
            colorItemBg: '#2B2D30',
            colorItemBgHover: '#3C3F41',
            colorItemBgSelected: 'rgba(74, 137, 220, 0.1)',
            colorItemText: '#A7A7A7',
            colorItemTextHover: '#FFFFFF',
            colorItemTextSelected: '#4A89DC',
          },
          Button: {
            colorPrimary: '#4A89DC',
            colorPrimaryHover: '#3A79CC',
          },
          Select: {
            colorBgContainer: '#2B2D30',
            colorBorder: '#555555',
            colorText: '#FFFFFF',
            colorTextPlaceholder: '#A7A7A7',
            controlItemBgHover: '#3C3F41',
            controlItemBgActive: 'rgba(74, 137, 220, 0.1)',
          },
          Card: {
            colorBgContainer: '#3C3F41',
            colorBorderSecondary: '#555555',
            colorText: '#FFFFFF',
            colorTextHeading: '#FFFFFF',
          },
          Table: {
            colorBgContainer: '#3C3F41',
            colorBorderSecondary: '#555555',
            colorText: '#FFFFFF',
            colorTextHeading: '#FFFFFF',
            colorFillAlter: '#4E5254',
            colorFillContent: '#4E5254',
          },
          Input: {
            colorBgContainer: '#4E5254',
            colorBorder: '#555555',
            colorText: '#FFFFFF',
            colorTextPlaceholder: '#A7A7A7',
          }
        }
      }}
    >
      <AntdApp style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
        {isTestPath ? (
          <TestPage />
        ) : (
          <MainLayout
            loading={loading}
            showDetailPanel={showDetailPanel}
            detailPanel={detailPanelContent}
          >
            <Routes>
              <Route
                path="/download"
                element={
                  <DownloadPage
                    showDetail={showDetail}
                    hideDetail={hideDetail}
                  />
                }
              />
              <Route
                path="/conversion"
                element={
                  <ConversionPage
                    showDetail={showDetail}
                    hideDetail={hideDetail}
                  />
                }
              />
              <Route
                path="/history"
                element={
                  <HistoryPage
                    showDetail={showDetail}
                    hideDetail={hideDetail}
                  />
                }
              />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/test" element={<TestPage />} />
              <Route path="/" element={<Navigate to="/download" replace />} />
            </Routes>
          </MainLayout>
        )}
      </AntdApp>
    </ConfigProvider>
  )
}

export default App
