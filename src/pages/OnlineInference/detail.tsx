import React, { useState, useEffect } from 'react';
import {
  Layout,
  Card,
  Descriptions,
  Button,
  Tag,
  Space,
  Tabs,
  Table,
  Statistic,
  Row,
  Col,
  Typography,
  Divider,
  Modal,
  Form,
  Input,
  Select,
  message,
  Tooltip,
  Progress
} from 'antd';
import {
  ArrowLeftOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  ReloadOutlined,
  SettingOutlined,
  ApiOutlined,
  BarChartOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import './detail.css';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

interface InferenceServiceDetail {
  id: string;
  modelName: string;
  modelDisplayName: string;
  status: 'running' | 'stopped' | 'deploying' | 'error';
  projectName: string;
  projectId: string;
  billingType: string;
  inputTokenPrice: number;
  outputTokenPrice: number;
  rpmLimit: number;
  tpmLimit: number;
  createTime: string;
  lastCallTime?: string;
  totalCalls: number;
  totalTokens: number;
  totalCost: number;
  apiEndpoint: string;
  apiKey: string;
  modelConfig: {
    maxTokens: number;
    temperature: number;
    topP: number;
    frequencyPenalty: number;
    presencePenalty: number;
  };
  deploymentConfig: {
    instanceType: string;
    replicas: number;
    autoScaling: boolean;
    minReplicas: number;
    maxReplicas: number;
  };
}

interface CallLog {
  id: string;
  timestamp: string;
  inputTokens: number;
  outputTokens: number;
  cost: number;
  latency: number;
  status: 'success' | 'error';
  errorMessage?: string;
}

const OnlineInferenceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<InferenceServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchServiceDetail();
    fetchCallLogs();
  }, [id]);

  const fetchServiceDetail = async () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      const mockService: InferenceServiceDetail = {
        id: id || 'qwen-sft-7b-0.0.1-1',
        modelName: 'qwen-sft-7b-0.0.1',
        modelDisplayName: 'Qwen-SFT-7B v0.0.1',
        status: 'running',
        projectName: 'projectname',
        projectId: 'proj_123456',
        billingType: '按Token计费',
        inputTokenPrice: 0.002,
        outputTokenPrice: 0.004,
        rpmLimit: 900,
        tpmLimit: 300000,
        createTime: '2024-01-15 10:30:00',
        lastCallTime: '2024-01-15 15:20:00',
        totalCalls: 1250,
        totalTokens: 45000,
        totalCost: 156.8,
        apiEndpoint: 'https://api.example.com/v1/chat/completions',
        apiKey: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        modelConfig: {
          maxTokens: 2048,
          temperature: 0.7,
          topP: 0.9,
          frequencyPenalty: 0.0,
          presencePenalty: 0.0
        },
        deploymentConfig: {
          instanceType: 'GPU-V100-1',
          replicas: 2,
          autoScaling: true,
          minReplicas: 1,
          maxReplicas: 5
        }
      };
      setService(mockService);
      setLoading(false);
    }, 1000);
  };

  const fetchCallLogs = async () => {
    // 模拟调用日志数据
    const mockLogs: CallLog[] = [
      {
        id: '1',
        timestamp: '2024-01-15 15:20:15',
        inputTokens: 45,
        outputTokens: 128,
        cost: 0.602,
        latency: 1250,
        status: 'success'
      },
      {
        id: '2',
        timestamp: '2024-01-15 15:18:32',
        inputTokens: 32,
        outputTokens: 95,
        cost: 0.444,
        latency: 980,
        status: 'success'
      },
      {
        id: '3',
        timestamp: '2024-01-15 15:15:08',
        inputTokens: 28,
        outputTokens: 0,
        cost: 0.056,
        latency: 0,
        status: 'error',
        errorMessage: 'Rate limit exceeded'
      }
    ];
    setCallLogs(mockLogs);
  };

  const handleServiceAction = (action: string) => {
    switch (action) {
      case 'start':
        message.success('服务启动成功');
        if (service) {
          setService({ ...service, status: 'running' });
        }
        break;
      case 'stop':
        message.success('服务停止成功');
        if (service) {
          setService({ ...service, status: 'stopped' });
        }
        break;
      case 'delete':
        Modal.confirm({
          title: '确认删除',
          content: '删除后无法恢复，确定要删除这个推理服务吗？',
          onOk: () => {
            message.success('服务删除成功');
            navigate('/inference');
          }
        });
        break;
      case 'edit':
        navigate(`/inference/edit/${id}`);
        break;
    }
  };

  const handleConfigSave = async (values: any) => {
    console.log('保存配置:', values);
    message.success('配置保存成功');
    setConfigModalVisible(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('已复制到剪贴板');
  };

  const getStatusTag = (status: string) => {
    const statusConfig = {
      running: { color: 'green', text: '服务中' },
      stopped: { color: 'red', text: '已下线' },
      deploying: { color: 'blue', text: '部署中' },
      error: { color: 'red', text: '异常' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const callLogColumns = [
    {
      title: '调用时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 150
    },
    {
      title: '输入Token',
      dataIndex: 'inputTokens',
      key: 'inputTokens',
      width: 100,
      render: (tokens: number) => tokens.toLocaleString()
    },
    {
      title: '输出Token',
      dataIndex: 'outputTokens',
      key: 'outputTokens',
      width: 100,
      render: (tokens: number) => tokens.toLocaleString()
    },
    {
      title: '费用(元)',
      dataIndex: 'cost',
      key: 'cost',
      width: 100,
      render: (cost: number) => `¥${cost.toFixed(3)}`
    },
    {
      title: '延迟(ms)',
      dataIndex: 'latency',
      key: 'latency',
      width: 100,
      render: (latency: number) => latency > 0 ? latency : '-'
    },
    {
      title: 'Temperature',
      key: 'temperature',
      width: 100,
      render: () => service?.modelConfig.temperature || '-'
    },
    {
      title: 'Top P',
      key: 'topP',
      width: 80,
      render: () => service?.modelConfig.topP || '-'
    },
    {
      title: 'Max Tokens',
      key: 'maxTokens',
      width: 100,
      render: () => service?.modelConfig.maxTokens || '-'
    }
  ];

  if (loading || !service) {
    return <div>加载中...</div>;
  }

  return (
    <Layout className="inference-detail-layout">
      <Content className="inference-detail-content">
        <Card className="detail-header-card">
          <div className="detail-header">
            <div className="header-left">
              <Button 
                type="text" 
                icon={<ArrowLeftOutlined />} 
                onClick={() => navigate('/inference')}
                className="back-button"
              >
                返回列表
              </Button>
              <div className="service-info">
                <Title level={3}>{service.modelDisplayName}</Title>
                <div className="service-meta">
                <Text type="secondary">服务ID: {service.id}</Text>
                <Divider type="vertical" />
                <Text type="secondary">项目: {service.projectName}</Text>
                <Divider type="vertical" />
                {getStatusTag(service.status)}
                <Divider type="vertical" />
                <Text type="secondary">计费方式: {service.billingType}</Text>
                <Divider type="vertical" />
                <Text type="secondary">输入: ¥{service.inputTokenPrice}/千Token</Text>
                <Divider type="vertical" />
                <Text type="secondary">输出: ¥{service.outputTokenPrice}/千Token</Text>
                <Divider type="vertical" />
                <Text type="secondary">RPM: {service.rpmLimit}</Text>
                <Divider type="vertical" />
                <Text type="secondary">TPM: {service.tpmLimit.toLocaleString()}</Text>
                <Divider type="vertical" />
                <Button type="link" size="small" onClick={() => navigate(`/model/${service.modelName}`)}>查看模型详情</Button>
              </div>
              </div>
            </div>
            <div className="header-actions">
              <Space>
                {service.status === 'running' && (
                  <Button icon={<PauseCircleOutlined />} onClick={() => handleServiceAction('stop')}>
                    下线服务
                  </Button>
                )}
              </Space>
            </div>
          </div>
        </Card>

        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Card>
              <Statistic
                title="总调用次数"
                value={service.totalCalls}
                prefix={<ApiOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Tooltip 
                title={
                  <div>
                    <div>输入Token: {Math.floor(service.totalTokens * 0.4).toLocaleString()}</div>
                    <div>输出Token: {Math.floor(service.totalTokens * 0.6).toLocaleString()}</div>
                  </div>
                }
              >
                <Statistic
                  title="总Token消耗"
                  value={service.totalTokens}
                  prefix={<BarChartOutlined />}
                />
              </Tooltip>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="总费用(元)"
                value={service.totalCost}
                precision={2}
                prefix="¥"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="最后调用"
                value={service.lastCallTime || '暂无'}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Card className="detail-content-card">
          <Tabs defaultActiveKey="api">
            <TabPane tab="API接入" key="api">
              <Card title="API信息">
                <Descriptions column={1}>
                  <Descriptions.Item label="API端点">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Text code>{service.apiEndpoint}</Text>
                      <Button 
                        type="text" 
                        icon={<CopyOutlined />} 
                        size="small"
                        onClick={() => copyToClipboard(service.apiEndpoint)}
                      />
                    </div>
                  </Descriptions.Item>
                  <Descriptions.Item label="API密钥">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Text code>{service.apiKey}</Text>
                      <Button 
                        type="text" 
                        icon={<CopyOutlined />} 
                        size="small"
                        onClick={() => copyToClipboard(service.apiKey)}
                      />
                    </div>
                  </Descriptions.Item>
                </Descriptions>
              </Card>

              <Card title="调用示例" style={{ marginTop: 16 }}>
                <Tabs size="small">
                  <TabPane tab="cURL" key="curl">
                    <pre className="code-block">
{`curl -X POST "${service.apiEndpoint}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${service.apiKey}" \
  -d '{
    "model": "${service.modelName}",
    "messages": [
      {
        "role": "user",
        "content": "你好，请介绍一下自己"
      }
    ],
    "max_tokens": ${service.modelConfig.maxTokens},
    "temperature": ${service.modelConfig.temperature}
  }'`}
                    </pre>
                  </TabPane>
                  <TabPane tab="Python" key="python">
                    <pre className="code-block">
{`import requests

url = "${service.apiEndpoint}"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer ${service.apiKey}"
}

data = {
    "model": "${service.modelName}",
    "messages": [
        {
            "role": "user",
            "content": "你好，请介绍一下自己"
        }
    ],
    "max_tokens": ${service.modelConfig.maxTokens},
    "temperature": ${service.modelConfig.temperature}
}

response = requests.post(url, headers=headers, json=data)
print(response.json())`}
                    </pre>
                  </TabPane>
                </Tabs>
              </Card>
            </TabPane>

            <TabPane tab="调用日志" key="logs">
              <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button icon={<ReloadOutlined />} onClick={fetchCallLogs}>
                  刷新日志
                </Button>
                <Button icon={<SettingOutlined />} onClick={() => setConfigModalVisible(true)}>
                  调整模型参数
                </Button>
              </div>
              <Table
                columns={callLogColumns}
                dataSource={callLogs}
                rowKey="id"
                pagination={{
                  pageSize: 20,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
                }}
              />
            </TabPane>
          </Tabs>
        </Card>

        <Modal
          title="模型配置"
          open={configModalVisible}
          onCancel={() => setConfigModalVisible(false)}
          onOk={() => form.submit()}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={service.modelConfig}
            onFinish={handleConfigSave}
          >
            <Form.Item
              label="最大Token数"
              name="maxTokens"
              rules={[{ required: true, message: '请输入最大Token数' }]}
            >
              <Input type="number" min={1} max={8192} />
            </Form.Item>
            <Form.Item
              label="Temperature"
              name="temperature"
              rules={[{ required: true, message: '请输入Temperature值' }]}
            >
              <Input type="number" min={0} max={2} step={0.1} />
            </Form.Item>
            <Form.Item
              label="Top P"
              name="topP"
              rules={[{ required: true, message: '请输入Top P值' }]}
            >
              <Input type="number" min={0} max={1} step={0.1} />
            </Form.Item>
            <Form.Item
              label="Frequency Penalty"
              name="frequencyPenalty"
            >
              <Input type="number" min={-2} max={2} step={0.1} />
            </Form.Item>
            <Form.Item
              label="Presence Penalty"
              name="presencePenalty"
            >
              <Input type="number" min={-2} max={2} step={0.1} />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default OnlineInferenceDetail;