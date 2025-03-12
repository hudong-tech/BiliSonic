import { useState, useEffect } from 'react'
import { Card, Input, Button, Form, Typography, Space, message, Row, Col } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { downloadAPI } from '../../services/api-service'

const { Title } = Typography

interface DownloadPageProps {
  showDetail?: (content: React.ReactNode) => void
  hideDetail?: () => void
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DownloadPage = ({ showDetail, hideDetail }: DownloadPageProps): JSX.Element => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [downloadTasks, setDownloadTasks] = useState<any[]>([])

  // 加载下载任务列表
  const loadDownloadTasks = async () => {
    try {
      const tasks = await downloadAPI.getDownloads()
      setDownloadTasks(tasks)
    } catch (error) {
      console.error('加载下载任务失败:', error)
      message.error('加载下载任务失败')
    }
  }

  // 组件挂载时加载任务列表
  useEffect(() => {
    loadDownloadTasks()

    // 监听下载进度更新
    const progressListener = (data: any) => {
      console.log('下载进度更新:', data)
      // 这里将来会更新下载任务的进度
    }

    // 监听下载完成事件
    const completeListener = (data: any) => {
      console.log('下载完成:', data)
      // 这里将来会更新下载任务的状态
      message.success('下载完成')
      loadDownloadTasks()
    }

    // 添加监听器
    window.electron.ipcRenderer.on('download:progress', progressListener)
    window.electron.ipcRenderer.on('download:complete', completeListener)

    return () => {
      // 清理监听器
      window.electron.ipcRenderer.removeAllListeners('download:progress')
      window.electron.ipcRenderer.removeAllListeners('download:complete')
    }
  }, []) // 空依赖数组，只在组件挂载时执行一次

  const handleSubmit = async (values: { url: string }) => {
    setLoading(true)
    try {
      // 解析视频链接
      const videoInfo = await downloadAPI.parseVideo(values.url)
      console.log('视频信息:', videoInfo)

      // 开始下载
      const task = await downloadAPI.startDownload({
        url: values.url,
        title: videoInfo.title,
        author: videoInfo.author,
        platform: videoInfo.platform
      })

      console.log('下载任务已创建:', task)
      message.success('下载任务已创建')

      // 重新加载任务列表
      await loadDownloadTasks()

      // 重置表单
      form.resetFields()
    } catch (error) {
      console.error('下载请求失败:', error)
      message.error('下载请求失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <div className="content-header">
        <Title level={4} className="page-title">下载管理</Title>
      </div>

      <div className="content-body">
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card title="添加下载任务" className="download-card">
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
              >
                <Form.Item
                  name="url"
                  label="视频链接"
                  rules={[
                    { required: true, message: '请输入视频链接' },
                    { type: 'url', message: '请输入有效的URL' }
                  ]}
                >
                  <Input
                    placeholder="请输入B站或YouTube视频链接"
                    size="large"
                    allowClear
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    loading={loading}
                    htmlType="submit"
                    size="large"
                  >
                    开始下载
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          <Col span={24}>
            <Card
              title="下载任务列表"
              className="download-card"
              extra={
                <Button type="link" onClick={loadDownloadTasks}>
                  刷新
                </Button>
              }
            >
              {downloadTasks.length === 0 ? (
                <Typography.Text type="secondary">暂无下载任务</Typography.Text>
              ) : (
                <Space direction="vertical" style={{ width: '100%' }}>
                  {downloadTasks.map(task => (
                    <Card
                      key={task.id}
                      size="small"
                      className="task-card"
                    >
                      <div className="task-info">
                        <div className="task-title">{task.title}</div>
                        <div className="task-meta">
                          <span>作者: {task.author}</span>
                          <span>平台: {task.platform}</span>
                          <span className={`status-tag status-tag-${task.status}`}>
                            {task.status === 'completed' ? '完成' :
                             task.status === 'downloading' ? '下载中' :
                             task.status === 'error' ? '错误' : '等待中'}
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div
                            className="progress-bar-fill"
                            style={{ width: `${Math.round(task.progress)}%` }}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </Space>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default DownloadPage
