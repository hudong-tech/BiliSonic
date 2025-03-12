import { useState } from 'react'
import { Button, Typography, Select, Upload, message, Empty, Divider } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'

const { Title } = Typography
const { Option } = Select

interface ConversionPageProps {
  showDetail?: (content: React.ReactNode) => void
  hideDetail?: () => void
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ConversionPage = ({ showDetail, hideDetail }: ConversionPageProps): JSX.Element => {
  const [loading, setLoading] = useState(false)
  const [fileList, setFileList] = useState<any[]>([])
  const [selectedFormat, setSelectedFormat] = useState('mp3')

  const handleStartConversion = () => {
    if (fileList.length === 0) {
      message.error('请先选择视频文件');
      return;
    }

    setLoading(true);
    try {
      console.log('开始转换:', { file: fileList[0], format: selectedFormat });
      // 这里将来会调用主进程的转换功能
      setTimeout(() => {
        setLoading(false)
        setFileList([])
      }, 1000)
    } catch (error) {
      console.error('转换请求失败:', error)
      setLoading(false)
    }
  }

  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      const isVideo = file.type.startsWith('video/') ||
                      file.name.endsWith('.mp4') ||
                      file.name.endsWith('.flv') ||
                      file.name.endsWith('.webm')
      if (!isVideo) {
        message.error('只能上传视频文件!')
        return Upload.LIST_IGNORE
      }
      setFileList([file])
      return false
    },
    fileList,
    onRemove: () => {
      setFileList([])
    },
    maxCount: 1,
    showUploadList: false
  }

  const handleFormatChange = (value: string) => {
    setSelectedFormat(value);
  }

  return (
    <div className="page-container">
      <div className="content-header">
        <Title level={4} className="page-title">转换管理</Title>
      </div>

      <div className="content-body">
        <div className="conversion-content" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          textAlign: 'center'
        }}>
          {fileList.length === 0 ? (
            <>
              <Upload {...uploadProps}>
                <Button
                  size="large"
                  icon={<UploadOutlined />}
                  style={{ marginBottom: 16 }}
                >
                  选择文件
                </Button>
              </Upload>
              <Empty
                description="拖放视频文件至此处或点击上方按钮选择文件"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </>
          ) : (
            <div style={{ width: '100%', maxWidth: 400 }}>
              <Title level={5} style={{ color: '#A7A7A7', marginBottom: 24 }}>
                已选择: {fileList[0].name}
              </Title>

              <div style={{ marginBottom: 16 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 8
                }}>
                  <span style={{ marginRight: 12, color: '#A7A7A7' }}>输出格式:</span>
                  <Select
                    value={selectedFormat}
                    onChange={handleFormatChange}
                    style={{ width: 120 }}
                  >
                    <Option value="mp3">MP3</Option>
                    <Option value="aac">AAC</Option>
                    <Option value="flac">FLAC</Option>
                    <Option value="ogg">OGG</Option>
                    <Option value="wav">WAV</Option>
                    <Option value="m4a">M4A</Option>
                  </Select>
                </div>
              </div>

              <Divider style={{ borderColor: '#555555' }} />

              <Button
                type="primary"
                size="large"
                loading={loading}
                onClick={handleStartConversion}
                style={{ width: 200 }}
              >
                开始转换
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ConversionPage
