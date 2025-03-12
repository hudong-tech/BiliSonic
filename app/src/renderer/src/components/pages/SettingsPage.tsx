import { useState } from 'react'
import { Card, Form, Input, Switch, Select, Button, Typography, Divider, Space, InputNumber, Row, Col } from 'antd'
import { SaveOutlined, ReloadOutlined } from '@ant-design/icons'

const { Title, Text } = Typography
const { Option } = Select

// 模拟默认设置
const defaultSettings = {
  downloadPath: '/Users/downloads',
  maxConcurrentDownloads: 3,
  maxConcurrentConversions: 2,
  autoConvert: true,
  defaultFormat: 'mp3',
  theme: 'auto',
  ytdlpPath: '',
  ffmpegPath: '',
}

const SettingsPage = (): JSX.Element => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      console.log('保存设置:', values)
      // 这里将来会调用主进程保存设置
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('保存设置失败:', error)
      setLoading(false)
    }
  }

  const handleReset = () => {
    form.setFieldsValue(defaultSettings)
  }

  return (
    <div className="settings-page">
      <Title level={2}>设置</Title>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Form
              form={form}
              layout="vertical"
              initialValues={defaultSettings}
              onFinish={handleSubmit}
            >
              <Title level={4}>基本设置</Title>
              <Form.Item
                name="downloadPath"
                label="下载路径"
                rules={[{ required: true, message: '请输入下载路径' }]}
              >
                <Input
                  placeholder="请选择下载文件保存路径"
                  addonAfter={<Button type="text" size="small">浏览</Button>}
                />
              </Form.Item>

              <Form.Item
                name="maxConcurrentDownloads"
                label="最大同时下载数"
                rules={[{ required: true, message: '请输入最大同时下载数' }]}
              >
                <InputNumber min={1} max={10} />
              </Form.Item>

              <Form.Item
                name="maxConcurrentConversions"
                label="最大同时转换数"
                rules={[{ required: true, message: '请输入最大同时转换数' }]}
              >
                <InputNumber min={1} max={5} />
              </Form.Item>

              <Divider />

              <Title level={4}>转换设置</Title>
              <Form.Item
                name="autoConvert"
                label="下载后自动转换"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="defaultFormat"
                label="默认转换格式"
              >
                <Select>
                  <Option value="mp3">MP3</Option>
                  <Option value="aac">AAC</Option>
                  <Option value="flac">FLAC</Option>
                  <Option value="ogg">OGG</Option>
                  <Option value="wav">WAV</Option>
                  <Option value="m4a">M4A</Option>
                </Select>
              </Form.Item>

              <Divider />

              <Title level={4}>外观设置</Title>
              <Form.Item
                name="theme"
                label="主题"
              >
                <Select>
                  <Option value="light">浅色</Option>
                  <Option value="dark">深色</Option>
                  <Option value="auto">跟随系统</Option>
                </Select>
              </Form.Item>

              <Divider />

              <Title level={4}>高级设置</Title>
              <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                如果您安装了自定义版本的工具，可以在这里指定路径。留空则使用内置版本。
              </Text>

              <Form.Item
                name="ytdlpPath"
                label="yt-dlp 路径"
              >
                <Input placeholder="可选，留空使用内置版本" />
              </Form.Item>

              <Form.Item
                name="ffmpegPath"
                label="FFmpeg 路径"
              >
                <Input placeholder="可选，留空使用内置版本" />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    loading={loading}
                    htmlType="submit"
                  >
                    保存设置
                  </Button>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={handleReset}
                  >
                    恢复默认
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default SettingsPage
