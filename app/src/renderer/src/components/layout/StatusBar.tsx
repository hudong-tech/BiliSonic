import { FC, useState, useEffect } from 'react'
import '../../styles/layout.css'

interface StatusBarProps {
  // 可以根据需要添加更多属性
  activeTasks?: number
  completedTasks?: number
  errorTasks?: number
  initialCpuUsage?: number
  initialMemoryUsage?: string
}

const StatusBar: FC<StatusBarProps> = ({
  activeTasks = 0,
  completedTasks = 0,
  errorTasks = 0,
  initialCpuUsage = 0,
  initialMemoryUsage = '0MB'
}) => {
  const [cpuUsage, setCpuUsage] = useState(initialCpuUsage)
  const [memoryUsage, setMemoryUsage] = useState(initialMemoryUsage)

  // 使用useEffect定期更新系统资源使用情况
  useEffect(() => {
    // 在实际应用中，这里应该从electron的主进程获取实际的系统数据
    // 这里只是模拟资源使用情况的变化
    const updateInterval = setInterval(() => {
      // 模拟CPU使用率变化 (0-30%)
      const newCpuUsage = Math.floor(Math.random() * 30)
      setCpuUsage(newCpuUsage)

      // 模拟内存使用变化 (200MB-500MB)
      const newMemoryUsage = `${200 + Math.floor(Math.random() * 300)}MB`
      setMemoryUsage(newMemoryUsage)
    }, 3000) // 每3秒更新一次

    return () => clearInterval(updateInterval) // 清除定时器
  }, []) // 空依赖数组，仅在组件挂载时执行一次

  return (
    <div className="status-bar">
      <div>活动任务: {activeTasks} | 已完成: {completedTasks} | 错误: {errorTasks}</div>
      <div className="flex-grow"></div>
      <div>CPU: {cpuUsage}% | 内存: {memoryUsage}</div>
    </div>
  )
}

export default StatusBar
