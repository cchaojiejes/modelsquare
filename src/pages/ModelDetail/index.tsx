import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout, Card, Button, Tag, Rate, Descriptions, Tabs, Typography, Divider, Modal, Form, Select, InputNumber, Tooltip } from 'antd';
import { RocketOutlined, HeartOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import './index.css';

const { Content } = Layout;
// const { TabPane } = Tabs; // 使用 Tabs.TabPane 替代
const { Paragraph, Title } = Typography;
const { Option } = Select;

interface ModelVersion {
  id: string;
  version: string;
  versionTag: string;
  description: string;
  features: string[];
  releaseDate: string;
  status: 'stable' | 'beta' | 'deprecated';
  isCurrentVersion: boolean;
  changelog: string;
}

interface ModelDetailType {
  id: string;
  name: string;
  displayName: string;
  description: string;
  provider: string;
  modelSource: string;
  applicationDomain: string[];
  modelType: string[];
  framework: string;
  parameterCount: string;
  contextWindow: number;
  tpm: string;
  rpm: string;
  license: string;
  modelFamily: string;
  averageRating: number;
  deploymentCount: number;
  lastUpdated: string;
  supportTokenBilling: boolean;
  inputTokenPrice?: number;
  outputTokenPrice?: number;
  recommendedInstance: string[];
  readme: string;
  versions: ModelVersion[];
}

const ModelDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [model, setModel] = useState<ModelDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [deployModalVisible, setDeployModalVisible] = useState(false);
  const [experienceModalVisible, setExperienceModalVisible] = useState(false);
  const [deployForm] = Form.useForm();

  useEffect(() => {
    // 模拟API调用获取模型详情
    setTimeout(() => {
      const mockDetail: ModelDetailType = {
        id: id || '',
        name: 'qwen2-72b-instruct',
        displayName: '通义千问2-72B-指令微调',
        description: '阿里达摩院自研的720亿参数大规模语言模型，优化了指令遵循能力',
        provider: '通义千问',
        modelSource: '平台严选',
        applicationDomain: ['通用', '教育'],
        modelType: ['大语言模型', '文本生成'],
        framework: 'PyTorch',
        parameterCount: '72B',
        contextWindow: 32768,
        tpm: '800K',
        rpm: '1K',
        license: 'Apache License 2.0',
        modelFamily: '通义',
        averageRating: 4.8,
        deploymentCount: 128,
        lastUpdated: '2025-01-15',
        supportTokenBilling: true,
        inputTokenPrice: 0.12,
        outputTokenPrice: 0.12,
        recommendedInstance: ['1* NVIDIA A100 (80G)', '2* NVIDIA V100 (32G)', '1* NVIDIA H100 (80G)'],
        versions: [
          {
            id: 'instruct',
            version: '1.5B',
            versionTag: 'Instruct',
            description: '指令微调版本，优化了指令遵循能力和对话质量，适合生产环境部署',
            features: ['指令遵循', '对话优化', '安全增强', '多轮对话'],
            releaseDate: '2024-08-21',
            status: 'stable',
            isCurrentVersion: true,
            changelog: '- 优化指令遵循能力\n- 提升生成质量\n- 增强安全机制'
          },
          {
            id: 'gptq-int4',
            version: '1.5B',
            versionTag: 'GPTQ-Int4',
            description: 'GPTQ 4位量化版本，显著减少内存占用，保持高质量输出',
            features: ['4位量化', '内存优化', '推理加速', '高质量输出'],
            releaseDate: '2024-08-21',
            status: 'stable',
            isCurrentVersion: false,
            changelog: '- GPTQ 4位量化\n- 内存使用减少75%\n- 推理速度提升'
          },
          {
            id: 'awq',
            version: '0.5B',
            versionTag: 'AWQ',
            description: 'AWQ量化版本，平衡了模型大小和性能，适合边缘设备部署',
            features: ['AWQ量化', '边缘部署', '低延迟', '高效推理'],
            releaseDate: '2024-08-21',
            status: 'stable',
            isCurrentVersion: false,
            changelog: '- AWQ量化技术\n- 适配边缘设备\n- 优化推理延迟'
          },
          {
            id: 'gguf',
            version: '7B',
            versionTag: 'GGUF',
            description: 'GGUF格式版本，兼容llama.cpp生态，支持CPU推理',
            features: ['GGUF格式', 'CPU推理', 'llama.cpp兼容', '跨平台'],
            releaseDate: '2024-08-21',
            status: 'stable',
            isCurrentVersion: false,
            changelog: '- GGUF格式支持\n- CPU推理优化\n- 跨平台兼容'
          },
          {
            id: 'mlx',
            version: '1.5B',
            versionTag: 'MLX',
            description: 'MLX格式版本，专为Apple Silicon优化，支持Metal加速',
            features: ['MLX格式', 'Apple Silicon', 'Metal加速', 'macOS优化'],
            releaseDate: '2024-06-06',
            status: 'stable',
            isCurrentVersion: false,
            changelog: '- MLX格式支持\n- Apple Silicon优化\n- Metal GPU加速'
          },
          {
            id: 'math',
            version: '72B',
            versionTag: 'Math',
            description: '数学专用版本，在数学推理和计算任务上表现优异',
            features: ['数学推理', '计算优化', '逻辑分析', '公式生成'],
            releaseDate: '2024-09-13',
            status: 'beta',
            isCurrentVersion: false,
            changelog: '- 数学能力增强\n- 计算精度提升\n- 公式推导优化'
          }
        ],
        readme: `# 通义千问2-72B-指令微调

## 模型介绍

通义千问2-72B是阿里达摩院自研的720亿参数大规模语言模型，在多个评测基准上表现优异。该模型经过大规模预训练和指令微调，具备强大的自然语言理解和生成能力。

## 主要特性

- **大规模参数**: 720亿参数，提供强大的语言理解能力
- **多语言支持**: 支持中文、英文等多种语言
- **指令遵循**: 经过指令微调，能够准确理解和执行用户指令
- **安全可控**: 内置安全机制，避免有害内容生成

## 技术规格

| 参数 | 值 |
|------|----|
| 参数量 | 72B |
| 上下文长度 | 32,768 tokens |
| 训练数据 | 多语言高质量数据 |
| 模型架构 | Transformer |

## 使用场景

### 1. 文本生成
适用于各种文本创作任务，包括：
- 文章写作
- 代码生成
- 创意写作

### 2. 问答系统
可以构建智能问答系统：
- 知识问答
- 技术咨询
- 学习辅导

### 3. 对话助手
支持多轮对话：
- 客服机器人
- 个人助理
- 教育辅导

## 代码示例

\`\`\`python
from openai import OpenAI

client = OpenAI(
    api_key="your-api-key",
    base_url="https://api.example.com/v1"
)

response = client.chat.completions.create(
    model="qwen2-72b-instruct",
    messages=[
        {"role": "user", "content": "请介绍一下人工智能的发展历程"}
    ],
    max_tokens=1000,
    temperature=0.7
)

print(response.choices[0].message.content)
\`\`\`

## 注意事项

> **重要提示**: 使用本模型时请遵守相关法律法规，不得用于生成有害、违法或不当内容。

## 更新日志

- **v2.0** (2025-01-15): 优化指令遵循能力，提升生成质量
- **v1.5** (2024-12-01): 增强多语言支持
- **v1.0** (2024-10-01): 初始版本发布

## 联系我们

如有任何问题或建议，请联系我们：
- 邮箱: support@example.com
- 官网: https://www.example.com`
      };
      setModel(mockDetail);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleDeploy = () => {
    navigate(`/deploy/${model?.id}?quick=true`);
  };

  const handleExperience = () => {
    setExperienceModalVisible(true);
  };

  const handleDeploySubmit = (values: any) => {
    console.log('部署参数:', values);
    setDeployModalVisible(false);
    // 实际部署逻辑
  };

  if (loading || !model) {
    return <div>加载中...</div>;
  }

  return (
    <Layout className="model-detail-layout">
      <Content className="model-detail-content">
        <Card className="model-header-card">
          <div className="model-header">
            <div className="model-basic-info">
              <Title level={2}>{model.displayName}</Title>
              <div className="model-meta">
                <Tag color="blue">{model.modelSource}</Tag>
                <Tag>{model.provider}</Tag>
                <Tag>{model.parameterCount}</Tag>
                <Tag>{model.framework}</Tag>
              </div>
              <Paragraph className="model-description">
                {model.description}
              </Paragraph>
              <div className="model-rating">
                <Rate disabled defaultValue={model.averageRating} allowHalf />
                <span>({model.averageRating}) · {model.deploymentCount} 次部署</span>
              </div>
            </div>
            
            <div className="model-actions">
              <Button type="primary" size="large" icon={<RocketOutlined />} onClick={handleDeploy}>
                一键推理
              </Button>
              <Button size="large" onClick={handleExperience}>
                快速体验
              </Button>
              <Button icon={<HeartOutlined />}>收藏</Button>
            </div>
          </div>
        </Card>
        
        <Card className="model-content-card">
          <Tabs defaultActiveKey="overview">
            <Tabs.TabPane tab="模型概览" key="overview">
              <Descriptions title="基础信息" bordered column={2}>
                <Descriptions.Item label="模型名称">{model.name}</Descriptions.Item>
                <Descriptions.Item label="模型调用ID">{model.name}</Descriptions.Item>
                <Descriptions.Item label="模型类型">
                  {model.modelType.map(type => <Tag key={type}>{type}</Tag>)}
                </Descriptions.Item>
                <Descriptions.Item label="应用领域">
                  {model.applicationDomain.map(domain => <Tag key={domain}>{domain}</Tag>)}
                </Descriptions.Item>

                <Descriptions.Item label="技术框架">{model.framework}</Descriptions.Item>
                <Descriptions.Item label="模型协议">{model.license}</Descriptions.Item>
                
                <Descriptions.Item label="参数规模">{model.parameterCount}</Descriptions.Item>
                <Descriptions.Item label="推荐实例">
                  <div>
                    {model.recommendedInstance.map((instance, index) => (
                      <Tag key={index} style={{ marginBottom: 4, display: 'block', width: 'fit-content' }}>
                        {instance}
                      </Tag>
                    ))}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="最后更新">{model.lastUpdated}</Descriptions.Item>
              </Descriptions>
              
              <Divider />
              <Descriptions title="模型限制" bordered column={2}>
                <Descriptions.Item label="上下文长度">{model.contextWindow.toLocaleString()}</Descriptions.Item>
                <Descriptions.Item label={
                  <span>
                    TPM 
                    <Tooltip title="Tokens Per Minute，每分钟tokens数量">
                      <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                    </Tooltip>
                  </span>
                }>{model.tpm}</Descriptions.Item>
                <Descriptions.Item label={
                  <span>
                    RPM 
                    <Tooltip title="Requests Per Minute，每分钟请求数">
                      <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                    </Tooltip>
                  </span>
                }>{model.rpm}</Descriptions.Item>
              </Descriptions>
              
              {model.supportTokenBilling && (
                <>
                  <Divider />
                  <Descriptions title="计费信息" bordered column={2}>
                    <Descriptions.Item label="输入Token单价">¥{model.inputTokenPrice}/1K tokens</Descriptions.Item>
                    <Descriptions.Item label="输出Token单价">¥{model.outputTokenPrice}/1K tokens</Descriptions.Item>
                    <Descriptions.Item label="模型部署-后付费">按算力单元计费</Descriptions.Item>
                  </Descriptions>
                </>
              )}
            </Tabs.TabPane>
            
            <Tabs.TabPane tab="模型介绍" key="readme">
              <div className="readme-content">
                <ReactMarkdown>{model.readme}</ReactMarkdown>
              </div>
            </Tabs.TabPane>
            
            <Tabs.TabPane tab="接入文档" key="api">
              <div className="api-docs">
                <Title level={4}>API调用示例</Title>
                <Paragraph>
                  <pre>{`
// HTTP API 调用示例
curl -X POST "https://api.example.com/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-api-key" \
  -d '{
    "model": "${model.name}",
    "messages": [
      {
        "role": "user",
        "content": "你好，请介绍一下自己"
      }
    ],
    "max_tokens": 1000,
    "temperature": 0.7
  }'
                  `}</pre>
                </Paragraph>
                
                <Title level={4}>OpenAI SDK调用示例</Title>
                <Paragraph>
                  <pre>{`
// Python OpenAI SDK示例
from openai import OpenAI

client = OpenAI(
    api_key="your-api-key",
    base_url="https://api.example.com/v1"
)

response = client.chat.completions.create(
    model="${model.name}",
    messages=[
        {"role": "user", "content": "你好，请介绍一下自己"}
    ],
    max_tokens=1000,
    temperature=0.7
)

print(response.choices[0].message.content)

# Node.js OpenAI SDK示例
const OpenAI = require('openai');

const client = new OpenAI({
  apiKey: 'your-api-key',
  baseURL: 'https://api.example.com/v1'
});

async function main() {
  const response = await client.chat.completions.create({
    model: '${model.name}',
    messages: [
      { role: 'user', content: '你好，请介绍一下自己' }
    ],
    max_tokens: 1000,
    temperature: 0.7
  });
  
  console.log(response.choices[0].message.content);
}

main();
                  `}</pre>
                </Paragraph>
              </div>
            </Tabs.TabPane>
            
            <Tabs.TabPane tab="关联版本" key="versions">
              <div className="version-management">
                <div className="version-header">
                  <Title level={4}>关联版本</Title>
                  <Paragraph type="secondary">
                    展示相同基础模型的不同量化版本和优化版本
                  </Paragraph>
                </div>
                
                <div className="version-grid">
                  {model.versions.map((version) => (
                    <Card
                      key={version.id}
                      className={`version-card ${version.isCurrentVersion ? 'current-version' : ''}`}
                      hoverable
                      size="small"
                    >
                      <div className="version-card-header">
                        <div className="model-info">
                          <div className="model-name">
                            <RocketOutlined className="model-icon" />
                            <span className="model-title">
                              {model.name.split('-')[0]}/{model.name}-{version.versionTag}
                            </span>
                          </div>
                          {version.isCurrentVersion && (
                             <Tag color="green">
                               当前版本
                             </Tag>
                           )}
                        </div>
                        

                      </div>
                      
                      <div className="version-description">
                        <Paragraph ellipsis={{ rows: 2 }}>
                          {version.description}
                        </Paragraph>
                      </div>
                      
                      <div className="version-stats">
                        <div className="stat-item">
                          <span className="stat-label">更新时间</span>
                          <span className="stat-value">{version.releaseDate}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">部署量</span>
                          <span className="stat-value">{Math.floor(Math.random() * 10000)}K</span>
                        </div>
                        <div className="stat-item">
                          <HeartOutlined className="heart-icon" />
                          <span className="stat-value">{Math.floor(Math.random() * 100)}</span>
                        </div>
                      </div>
                      
                      <div className="version-features">
                         <Tag className="feature-tag">文本生成</Tag>
                         <Tag className="feature-tag">{model.parameterCount}</Tag>
                         {version.features.slice(0, 2).map((feature, index) => (
                           <Tag key={index} className="feature-tag">
                             {feature}
                           </Tag>
                         ))}
                         {version.features.length > 2 && (
                           <Tooltip title={version.features.slice(2).join(', ')}>
                             <Tag className="more-features">
                               +{version.features.length - 2}
                             </Tag>
                           </Tooltip>
                         )}
                       </div>
                      

                    </Card>
                  ))}
                </div>
              </div>
            </Tabs.TabPane>
          </Tabs>
        </Card>
        
        {/* 部署模态框 */}
        <Modal
          title="模型部署"
          open={deployModalVisible}
          onCancel={() => setDeployModalVisible(false)}
          footer={null}
          width={600}
        >
          <Form
            form={deployForm}
            layout="vertical"
            onFinish={handleDeploySubmit}
          >
            <Form.Item label="部署方式" name="deployType" initialValue="token">
              <Select>
                <Option value="token">按Token计费</Option>
                <Option value="resource">按资源计费</Option>
              </Select>
            </Form.Item>
            
            <Form.Item label="实例规格" name="instanceType">
              <Select placeholder="选择实例规格">
                <Option value="a100-80g">NVIDIA A100 (80G)</Option>
                <Option value="v100-32g">NVIDIA V100 (32G)</Option>
              </Select>
            </Form.Item>
            
            <Form.Item label="实例数量" name="instanceCount" initialValue={1}>
              <InputNumber min={1} max={10} />
            </Form.Item>
            
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                确认部署
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        
        {/* 体验模态框 */}
        <Modal
          title="模型体验"
          open={experienceModalVisible}
          onCancel={() => setExperienceModalVisible(false)}
          footer={null}
          width={800}
        >
          <div className="experience-content">
            {/* 模型体验界面 */}
            <p>模型体验功能开发中...</p>
          </div>
        </Modal>
      </Content>
    </Layout>
  );
};

export default ModelDetail;