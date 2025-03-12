import { Card, Typography, Collapse, Space, Divider, Button, Row, Col } from 'antd'
import { QuestionCircleOutlined, BookOutlined, ToolOutlined, GithubOutlined } from '@ant-design/icons'

const { Title, Paragraph, Text, Link } = Typography
const { Panel } = Collapse

const HelpPage = (): JSX.Element => {
  return (
    <div className="help-page">
      <Title level={2}>帮助中心</Title>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Paragraph>
                欢迎使用 BiliSonic 视频下载与音频转换工具。本应用可以帮助您从 B 站和 YouTube 下载视频，并将其转换为高质量的音频文件。
              </Paragraph>

              <Divider />

              <Title level={4}>
                <QuestionCircleOutlined /> 常见问题
              </Title>

              <Collapse bordered={false}>
                <Panel header="如何下载视频？" key="1">
                  <Paragraph>
                    1. 在"下载管理"页面，复制视频链接到输入框中
                    <br />
                    2. 点击"开始下载"按钮
                    <br />
                    3. 等待下载完成
                    <br />
                    4. 下载完成后，您可以在下载列表中找到该视频
                  </Paragraph>
                </Panel>

                <Panel header="如何转换视频为音频？" key="2">
                  <Paragraph>
                    1. 在"转换管理"页面，点击"添加文件"按钮选择视频文件
                    <br />
                    2. 选择所需的输出格式（MP3、AAC、FLAC等）
                    <br />
                    3. 点击"开始转换"按钮
                    <br />
                    4. 等待转换完成
                    <br />
                    5. 转换完成后，您可以在转换列表中找到该音频文件
                  </Paragraph>
                </Panel>

                <Panel header="支持哪些视频平台？" key="3">
                  <Paragraph>
                    目前支持以下视频平台：
                    <ul>
                      <li>哔哩哔哩 (Bilibili)</li>
                      <li>YouTube</li>
                    </ul>
                    我们计划在未来版本中添加更多平台支持。
                  </Paragraph>
                </Panel>

                <Panel header="支持哪些音频格式？" key="4">
                  <Paragraph>
                    目前支持以下音频格式：
                    <ul>
                      <li>MP3</li>
                      <li>AAC</li>
                      <li>FLAC</li>
                      <li>OGG</li>
                      <li>WAV</li>
                      <li>M4A</li>
                    </ul>
                  </Paragraph>
                </Panel>

                <Panel header="如何更改下载和保存位置？" key="5">
                  <Paragraph>
                    1. 进入"设置"页面
                    <br />
                    2. 在"基本设置"部分，您可以更改下载路径
                    <br />
                    3. 点击"保存设置"按钮应用更改
                  </Paragraph>
                </Panel>
              </Collapse>

              <Divider />

              <Title level={4}>
                <BookOutlined /> 使用指南
              </Title>

              <Paragraph>
                <Text strong>下载管理：</Text> 用于从支持的视频平台下载视频。
              </Paragraph>

              <Paragraph>
                <Text strong>转换管理：</Text> 用于将视频文件转换为音频文件。
              </Paragraph>

              <Paragraph>
                <Text strong>历史记录：</Text> 查看和管理您的下载和转换历史。
              </Paragraph>

              <Paragraph>
                <Text strong>设置：</Text> 配置应用程序的各种选项。
              </Paragraph>

              <Divider />

              <Title level={4}>
                <ToolOutlined /> 故障排除
              </Title>

              <Paragraph>
                <Text strong>下载失败：</Text> 请检查您的网络连接和视频链接是否有效。某些视频可能受到版权保护而无法下载。
              </Paragraph>

              <Paragraph>
                <Text strong>转换失败：</Text> 请确保视频文件格式受支持，并且您的计算机有足够的存储空间。
              </Paragraph>

              <Paragraph>
                <Text strong>应用程序崩溃：</Text> 请尝试重启应用程序。如果问题持续存在，请联系我们的支持团队。
              </Paragraph>

              <Divider />

              <Space>
                <Button type="primary" icon={<GithubOutlined />}>
                  访问 GitHub 仓库
                </Button>
                <Button icon={<QuestionCircleOutlined />}>
                  提交问题反馈
                </Button>
              </Space>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default HelpPage
