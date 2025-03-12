import { useCallback } from 'react'
import { closeWindow, minimizeWindow, maximizeWindow } from '../../services/window-service'
import './TitleBar.css'

const TitleBar = (): JSX.Element => {
  const handleClose = useCallback(async () => {
    await closeWindow()
  }, [])

  const handleMinimize = useCallback(async () => {
    await minimizeWindow()
  }, [])

  const handleMaximize = useCallback(async () => {
    await maximizeWindow()
  }, [])

  return (
    <div className="title-bar">
      <div className="title-bar-controls">
        <button className="window-control close-btn" onClick={handleClose} />
        <button className="window-control minimize-btn" onClick={handleMinimize} />
        <button className="window-control maximize-btn" onClick={handleMaximize} />
      </div>
      <div className="title-bar-title">视频下载与音频转换工具</div>
      <div style={{ width: 60 }} /> {/* 平衡布局 */}
    </div>
  )
}

export default TitleBar
