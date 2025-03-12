import { useState } from 'react'
import { Card, Table, Typography, Tabs, Button, Space, Tag, Row, Col, Divider } from 'antd'
import { DeleteOutlined, ReloadOutlined } from '@ant-design/icons'
import type { TabsProps } from 'antd'

const { Title } = Typography

interface HistoryPageProps {
  showDetail?: (content: React.ReactNode) => void
  hideDetail?: () => void
}

// 模拟数据
const mockDownloadData = [
  {
    id: '1',
    title: '示例视频1',
    author: '用户A',
    platform: 'bilibili',
    status: 'completed',
    created_at: '2023-03-01 12:00:00',
  },
  {
    id: '2',
    title: '示例视频2',
    author: '用户B',
    platform: 'youtube',
    status: 'error',
    created_at: '2023-03-02 14:30:00',
  }
]

const mockConversionData = [
  {
    id: '1',
    title: '示例转换1',
    format: 'mp3',
    status: 'completed',
    created_at: '2023-03-03 10:15:00',
  },
  {
    id: '2',
    title: '示例转换2',
    format: 'flac',
    status: 'completed',
    created_at: '2023-03-04 16:45:00',
  }
]

const HistoryPage = ({ showDetail, hideDetail }: HistoryPageProps): JSX.Element => {
  const [activeTab, setActiveTab] = useState('downloads')
  const [loading, setLoading] = useState(false)

  const handleRefresh = () => {
    setLoading(true)
    // 这里将来会从主进程获取历史记录
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  const handleClear = () => {
    // 这里将来会调用主进程清除历史记录
    console.log('清除历史记录')
  }

  // 查看详情
  const handleViewDetail = (record: any) => {
    if (showDetail) {
      const detailContent = (
        <div style={{ padding: '16px' }}>
          <Typography.Title level={4}>详细信息</Typography.Title>
          <Divider />
          <Typography.Paragraph>
            <strong>ID:</strong> {record.id}
          </Typography.Paragraph>
          <Typography.Paragraph>
            <strong>标题:</strong> {record.title}
          </Typography.Paragraph>
          {record.author && (
            <Typography.Paragraph>
              <strong>作者:</strong> {record.author}
            </Typography.Paragraph>
          )}
          {record.platform && (
            <Typography.Paragraph>
              <strong>平台:</strong> {record.platform}
            </Typography.Paragraph>
          )}
          {record.format && (
            <Typography.Paragraph>
              <strong>格式:</strong> {record.format}
            </Typography.Paragraph>
          )}
          <Typography.Paragraph>
            <strong>状态:</strong> {record.status}
          </Typography.Paragraph>
          <Typography.Paragraph>
            <strong>创建时间:</strong> {record.created_at}
          </Typography.Paragraph>
          <Divider />
          <Button type="primary" onClick={hideDetail}>关闭</Button>
        </div>
      )
      showDetail(detailContent)
    }
  }

  const downloadColumns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: '平台',
      dataIndex: 'platform',
      key: 'platform',
      render: (platform: string) => (
        <Tag color={platform === 'bilibili' ? 'blue' : 'red'}>
          {platform === 'bilibili' ? 'B站' : 'YouTube'}
        </Tag>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'completed' ? 'green' : 'red'}>
          {status === 'completed' ? '完成' : '失败'}
        </Tag>
      )
    },
    {
      title: '时间',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="link"
            onClick={() => handleViewDetail(record)}
          >
            详情
          </Button>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => console.log('删除记录', record.id)}
          />
        </Space>
      )
    }
  ]

  const conversionColumns = [
    {
      title: '文件名',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '格式',
      dataIndex: 'format',
      key: 'format',
      render: (format: string) => (
        <Tag color="blue">{format.toUpperCase()}</Tag>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'completed' ? 'green' : 'red'}>
          {status === 'completed' ? '完成' : '失败'}
        </Tag>
      )
    },
    {
      title: '时间',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="link"
            onClick={() => handleViewDetail(record)}
          >
            详情
          </Button>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => console.log('删除记录', record.id)}
          />
        </Space>
      )
    }
  ]

  const items: TabsProps['items'] = [
    {
      key: 'downloads',
      label: '下载历史',
      children: (
        <Table
          dataSource={mockDownloadData}
          columns={downloadColumns}
          rowKey="id"
          loading={loading}
        />
      ),
    },
    {
      key: 'conversions',
      label: '转换历史',
      children: (
        <Table
          dataSource={mockConversionData}
          columns={conversionColumns}
          rowKey="id"
          loading={loading}
        />
      ),
    },
  ]

  return (
    <div className="history-page">
      <Title level={2}>历史记录</Title>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Space style={{ marginBottom: 16 }}>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                loading={loading}
              >
                刷新
              </Button>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={handleClear}
              >
                清空历史
              </Button>
            </Space>
            <Tabs
              activeKey={activeTab}
              items={items}
              onChange={setActiveTab}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default HistoryPage
