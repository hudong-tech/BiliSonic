import React, { useEffect, useState } from 'react'

const TestPage: React.FC = () => {
  const [appName, setAppName] = useState<string>('未获取')
  const [windowInfo, setWindowInfo] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [isElectron, setIsElectron] = useState<boolean>(false)
  const [environment, setEnvironment] = useState<string>('检测中...')

  useEffect(() => {
    console.log('TestPage 组件已加载')
    document.title = 'BiliSonic - 测试页面'

    // 检测是否在Electron环境中
    const checkEnvironment = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const isElectronEnv = userAgent.indexOf(' electron/') > -1
      setIsElectron(isElectronEnv)

      if (isElectronEnv) {
        setEnvironment('Electron 应用')
      } else if (window.location.href.includes('localhost')) {
        setEnvironment('浏览器开发服务器 (无法使用Electron API)')
      } else {
        setEnvironment('未知环境')
      }

      console.log('环境检测:', {
        isElectron: isElectronEnv,
        userAgent,
        windowElectron: typeof window.electron !== 'undefined',
        windowApi: typeof window.api !== 'undefined'
      })
    }

    checkEnvironment()
  }, [])

  const getAppName = async () => {
    try {
      console.log('尝试获取应用名称...')
      if (!window.electron) {
        throw new Error('Electron API 不可用')
      }
      const name = await window.electron.ipcRenderer.invoke('test:get-app-name')
      console.log('获取到应用名称:', name)
      setAppName(name)
    } catch (err) {
      console.error('获取应用名称失败:', err)
      setError(`获取应用名称失败: ${err}`)
    }
  }

  const getWindowInfo = async () => {
    try {
      console.log('尝试获取窗口信息...')
      if (!window.electron) {
        throw new Error('Electron API 不可用')
      }
      const info = await window.electron.ipcRenderer.invoke('test:get-window-info')
      console.log('获取到窗口信息:', info)
      setWindowInfo(info)
    } catch (err) {
      console.error('获取窗口信息失败:', err)
      setError(`获取窗口信息失败: ${err}`)
    }
  }

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#25262A',
      color: 'white',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      <h1 style={{ color: '#4A89DC', fontSize: '24px', marginBottom: '20px' }}>
        BiliSonic 测试页面
      </h1>

      <div style={{
        padding: '10px',
        backgroundColor: isElectron ? '#28A745' : '#DC3545',
        color: 'white',
        borderRadius: '4px',
        marginBottom: '20px'
      }}>
        <p><strong>当前环境:</strong> {environment}</p>
        <p><strong>Electron API:</strong> {window.electron ? '可用' : '不可用'}</p>
        {!isElectron && (
          <p style={{ fontWeight: 'bold' }}>
            警告: 您正在浏览器中访问此页面，而不是在Electron应用中。Electron API将不可用。
            请直接运行Electron应用来测试。
          </p>
        )}
      </div>

      {error && (
        <div style={{
          padding: '10px',
          backgroundColor: '#DC3545',
          color: 'white',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          错误: {error}
        </div>
      )}

      <div style={{
        border: '1px solid #4A89DC',
        padding: '10px',
        borderRadius: '4px',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: '#4A89DC', fontSize: '18px', marginBottom: '10px' }}>窗口信息</h2>
        <p>窗口标题: {document.title}</p>
        <p>窗口宽度: {window.innerWidth}px</p>
        <p>窗口高度: {window.innerHeight}px</p>
        <p>用户代理: {navigator.userAgent}</p>
      </div>

      <div style={{
        border: '1px solid #4A89DC',
        padding: '10px',
        borderRadius: '4px',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: '#4A89DC', fontSize: '18px', marginBottom: '10px' }}>Electron 信息</h2>
        <p>应用名称: {appName}</p>
        {windowInfo && (
          <div>
            <p>窗口ID: {windowInfo.id}</p>
            <p>窗口标题: {windowInfo.title}</p>
            <p>窗口大小: {windowInfo.size?.[0] || 'N/A'} x {windowInfo.size?.[1] || 'N/A'}</p>
            <p>Frame: {windowInfo.frame !== undefined ? String(windowInfo.frame) : 'N/A'}</p>
            <p>TitleBarStyle: {windowInfo.titleBarStyle || 'N/A'}</p>
          </div>
        )}
      </div>

      <div style={{
        border: '1px solid #4A89DC',
        padding: '10px',
        borderRadius: '4px'
      }}>
        <h2 style={{ color: '#4A89DC', fontSize: '18px', marginBottom: '10px' }}>测试按钮</h2>
        <button
          style={{
            backgroundColor: '#4A89DC',
            color: 'white',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            marginRight: '10px',
            cursor: 'pointer',
            fontSize: '14px',
            opacity: isElectron ? 1 : 0.5
          }}
          onClick={getAppName}
          disabled={!isElectron}
        >
          获取应用名称
        </button>

        <button
          style={{
            backgroundColor: '#4A89DC',
            color: 'white',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            opacity: isElectron ? 1 : 0.5
          }}
          onClick={getWindowInfo}
          disabled={!isElectron}
        >
          获取窗口信息
        </button>
      </div>
    </div>
  )
}

export default TestPage
