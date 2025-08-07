import React, { useState, useEffect } from 'react';
import {
  Layout,
  Card,
  Button,
  Form,
  Input,
  Select,
  Descriptions,
  Divider,
  Typography,
  message,
  Tag
} from 'antd';
import {
  ArrowLeftOutlined,
  RocketOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import './index.css';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

interface ModelInfo {
  id: string;
  name: string;
  displayName: string;
  parameterCount: string;
  inputTokenPrice: number;
  outputTokenPrice: number;
  contextWindow: number;
  provider: string;
}

interface ProjectInfo {
  id: string;
  name: string;
  description: string;
}

const ModelDeploy: React.FC = () => {
  const navigate = useNavigate();
  const { modelId } = useParams();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [deployType, setDeployType] = useState('preset'); // preset: 预制模型部署, custom: 自定义部署, scenario: 场景化部署
  const [selectedModel, setSelectedModel] = useState<ModelInfo | null>(null);
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [isQuickDeploy, setIsQuickDeploy] = useState(false); // 是否为一键推理模式
  const [estimatedCost, setEstimatedCost] = useState({
    hourly: 10.00,
    monthly: 7200,
    inputTokens: 1000,
    outputTokens: 1000
  });

  const steps = isQuickDeploy ? [
    {
      title: '配置部署',
      content: 'config'
    },
    {
      title: '确认部署',
      content: 'confirm'
    }
  ] : [
    {
      title: '选择部署类型',
      content: 'deploy-type'
    },
    {
      title: '配置部署',
      content: 'config'
    },
    {
      title: '确认部署',
      content: 'confirm'
    }
  ];

  useEffect(() => {
    // 检查是否为一键推理模式（从模型页面跳转过来）
    const urlParams = new URLSearchParams(window.location.search);
    const quickDeploy = urlParams.get('quick') === 'true';
    
    if (quickDeploy || modelId) {
      setIsQuickDeploy(true);
      setCurrentStep(1); // 直接跳到配置页面
      setDeployType('preset'); // 默认预制模型部署
    }

    // 模拟获取模型列表
    const mockModels: ModelInfo[] = [
      {
        id: 'moonshot-v1-128k',
        name: 'moonshot-v1-128k',
        displayName: 'Moonshot-v1-128k',
        parameterCount: '8B',
        inputTokenPrice: 0.009,
        outputTokenPrice: 0.018,
        contextWindow: 128000,
        provider: 'Moonshot'
      },
      {
        id: 'qwen2-72b-instruct',
        name: 'qwen2-72b-instruct',
        displayName: 'Qwen2-72B-Instruct',
        parameterCount: '72B',
        inputTokenPrice: 0.12,
        outputTokenPrice: 0.12,
        contextWindow: 32768,
        provider: 'Alibaba'
      },
      {
        id: 'deepseek-v3',
        name: 'deepseek-v3',
        displayName: 'DeepSeek-V3',
        parameterCount: '67B',
        inputTokenPrice: 0.10,
        outputTokenPrice: 0.15,
        contextWindow: 65536,
        provider: 'DeepSeek'
      }
    ];
    setModels(mockModels);

    // 如果有传入modelId，自动选择对应模型
    if (modelId) {
      const model = mockModels.find(m => m.id === modelId);
      if (model) {
        setSelectedModel(model);
        form.setFieldsValue({ modelId: model.id });
      }
    }
  }, [modelId, form]);

  const handleModelChange = (modelId: string) => {
    const model = models.find(m => m.id === modelId);
    setSelectedModel(model || null);
    if (model) {
      calculateEstimatedCost(model);
    }
  };

  const calculateEstimatedCost = (model: ModelInfo) => {
    const inputCost = (estimatedCost.inputTokens / 1000) * model.inputTokenPrice;
    const outputCost = (estimatedCost.outputTokens / 1000) * model.outputTokenPrice;
    const totalCost = inputCost + outputCost;
    
    setEstimatedCost(prev => ({
      ...prev,
      hourly: totalCost,
      monthly: totalCost * 24 * 30
    }));
  };

  const handleNext = () => {
    if (!isQuickDeploy && currentStep === 0) {
      // 验证是否选择了部署类型（仅在非一键推理模式下）
      if (!deployType) {
        message.error('请选择部署类型');
        return;
      }
    } else if ((isQuickDeploy && currentStep === 0) || (!isQuickDeploy && currentStep === 1)) {
      // 验证表单（一键推理模式的第0步或正常模式的第1步）
      form.validateFields().then(() => {
        setCurrentStep(currentStep + 1);
      }).catch(() => {
        message.error('请完善配置信息');
        return;
      });
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else if (isQuickDeploy) {
      // 一键推理模式下，如果在第一步，返回到模型页面
      navigate(-1);
    }
  };

  const handleDeploy = (values: any) => {
    setLoading(true);
    console.log('部署参数:', { ...values, selectedModel });
    
    // 模拟部署过程
    setTimeout(() => {
      setLoading(false);
      message.success('模型部署成功！');
      navigate('/deployments'); // 跳转到部署列表页面
    }, 2000);
  };

  const renderDeployTypeSelection = () => (
    <div className="deploy-type-selection">
      <Title level={3}>新建服务</Title>
      <Paragraph type="secondary">
        选择部署类型来创建您的AI服务
      </Paragraph>
      
      <div className="deploy-types">
        <Card 
          className={`deploy-type-card ${deployType === 'custom' ? 'selected' : ''}`}
          hoverable
          onClick={() => setDeployType('custom')}
        >
          <div className="deploy-type-content">
            <RocketOutlined className="deploy-type-icon" />
            <Title level={4}>自定义部署</Title>
            <Paragraph>
              基于容器、镜像、代码等自行构建AI服务，支持多种开发框架，
              具备Notebook环境，提供完整的开发到部署流程。
            </Paragraph>
          </div>
        </Card>

        <div className="scenario-deploy-section">
          <Title level={4}>场景化部署</Title>
          
          <Card 
            className={`deploy-type-card ${deployType === 'llm' ? 'selected' : ''}`}
            hoverable
            onClick={() => setDeployType('llm')}
          >
            <div className="deploy-type-content">
              <div className="deploy-type-header">
                <span className="deploy-type-icon">🤖</span>
                <span>LLM大语言模型部署</span>
              </div>
              <Paragraph>
                一键部署主流大模型到私有云环境，支持多种推理框架，
                为用户提供高性能的推理服务。
              </Paragraph>
            </div>
          </Card>

          <Card 
            className={`deploy-type-card ${deployType === 'preset' ? 'selected' : ''}`}
            hoverable
            onClick={() => setDeployType('preset')}
          >
            <div className="deploy-type-content">
              <div className="deploy-type-header">
                <span className="deploy-type-icon">⚡</span>
                <span>预制模型部署</span>
              </div>
              <Paragraph>
                利用平台预制的优化模型，让您快速部署高性能AI服务，
                无需复杂配置即可获得最佳推理效果。
              </Paragraph>
            </div>
          </Card>

          <Card className="deploy-type-card disabled">
            <div className="deploy-type-content">
              <div className="deploy-type-header">
                <span className="deploy-type-icon">🔧</span>
                <span>其他模型</span>
              </div>
              <Paragraph>敬请期待，更多模型类型即将上线</Paragraph>
            </div>
          </Card>
        </div>
      </div>

      <div className="deploy-actions">
        <Button onClick={() => navigate(-1)}>取消</Button>
        <Button 
          type="primary" 
          onClick={handleNext}
          disabled={!deployType || deployType === 'custom' || deployType === 'llm'}
        >
          下一步
        </Button>
      </div>
    </div>
  );

  const renderDeployForm = () => (
    <div className="deploy-form-container">
      <div className="deploy-form-header">
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={handlePrev}
        >
          新建服务
        </Button>
        <div className="deploy-steps">
          <span className="step-number completed">1</span>
          <span className="step-text">部署类型</span>
          <span className="step-number current">2</span>
          <span className="step-text current">填写配置</span>
        </div>
      </div>

      <div className="deploy-form-content">
        <div className="form-section">
          <Card title="基本信息" className="form-card">
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                billingType: 'token',
                billingRule: 'postpaid'
              }}
            >
              <Form.Item
                label="所属项目"
                name="projectId"
                rules={[{ required: true, message: '请选择所属项目' }]}
              >
                <Input placeholder="xxx项目项目1" />
              </Form.Item>
              
              <Form.Item
                label="选择模型"
                name="modelId"
                rules={[{ required: true, message: '请选择模型' }]}
              >
                <Select 
                  placeholder="选择要部署的模型"
                  onChange={handleModelChange}
                  showSearch
                  filterOption={(input, option) => {
                    const model = models.find(m => m.id === option?.value);
                    return model?.displayName.toLowerCase().includes(input.toLowerCase()) || false;
                  }}
                >
                  {models.map(model => (
                    <Option key={model.id} value={model.id}>
                      <div className="model-option">
                        <span className="model-name">{model.displayName}</span>
                        <Tag>{model.parameterCount}</Tag>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {selectedModel && (
                <div className="model-info-display">
                  <Descriptions size="small" column={1}>
                    <Descriptions.Item label="模型ID">{selectedModel.name}</Descriptions.Item>
                    <Descriptions.Item label="参数规模">{selectedModel.parameterCount}</Descriptions.Item>
                    <Descriptions.Item label="上下文长度">{selectedModel.contextWindow.toLocaleString()}</Descriptions.Item>
                    <Descriptions.Item label="提供商">{selectedModel.provider}</Descriptions.Item>
                  </Descriptions>
                </div>
              )}
            </Form>
          </Card>
        </div>

        <div className="pricing-section">
          <Card title="计费规则" className="pricing-card">
            <div className="pricing-info">
              <div className="pricing-item">
                <span className="pricing-label">选择模型：</span>
                <span className="pricing-value">{selectedModel?.displayName || 'Moonshot-v1-128k'}</span>
              </div>
              <div className="pricing-item">
                <span className="pricing-label">计费方式：</span>
                <span className="pricing-value">按Token消费后付费</span>
              </div>
              <div className="pricing-item">
                <span className="pricing-label">计费规则：</span>
                <span className="pricing-value">按实际使用量计费</span>
              </div>
            </div>

            {selectedModel && (
              <div className="pricing-details">
                <Divider />
                <div className="price-section">
                  <Title level={5}>价格详情</Title>
                  <div className="price-grid">
                    <div className="price-card input-price">
                      <div className="price-type">输入Token</div>
                      <div className="price-amount">¥ {selectedModel.inputTokenPrice}</div>
                      <div className="price-unit">/ 千Token</div>
                    </div>
                    <div className="price-card output-price">
                      <div className="price-type">输出Token</div>
                      <div className="price-amount">¥ {selectedModel.outputTokenPrice}</div>
                      <div className="price-unit">/ 千Token</div>
                    </div>
                  </div>
                  <div className="billing-note">
                    <Text type="secondary">
                      💡 计费说明：实际费用以实际消费为准，支持余额和按量付费
                    </Text>
                  </div>
                </div>
              </div>
            )}

            <div className="deploy-action">
              <Button 
                type="primary" 
                size="large" 
                block
                loading={loading}
                onClick={handleNext}
              >
                部署
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="deploy-confirmation-container">
      <div className="confirmation-header">
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={handlePrev}
        >
          返回配置
        </Button>
        <div className="deploy-steps">
          {!isQuickDeploy && (
            <>
              <span className="step-number completed">1</span>
              <span className="step-text">部署类型</span>
            </>
          )}
          <span className="step-number completed">{isQuickDeploy ? '1' : '2'}</span>
          <span className="step-text">填写配置</span>
          <span className="step-number current">{isQuickDeploy ? '2' : '3'}</span>
          <span className="step-text current">确认部署</span>
        </div>
      </div>

      <div className="confirmation-content">
        <Card title="部署确认" className="confirmation-card">
          <Descriptions column={1}>
            <Descriptions.Item label="所属项目">{form.getFieldValue('projectId')}</Descriptions.Item>
            <Descriptions.Item label="选择模型">{selectedModel?.displayName}</Descriptions.Item>
            <Descriptions.Item label="部署类型">预制模型推理</Descriptions.Item>
            <Descriptions.Item label="计费方式">按Token消费后付费</Descriptions.Item>
          </Descriptions>
          
          <div className="confirmation-actions">
            <Button onClick={handlePrev}>上一步</Button>
            <Button 
              type="primary" 
              loading={loading}
              onClick={() => {
                form.validateFields().then(values => {
                  handleDeploy(values);
                }).catch(errorInfo => {
                  console.log('Validation failed:', errorInfo);
                });
              }}
            >
              确认部署
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderStepContent = () => {
    if (isQuickDeploy) {
      switch (currentStep) {
        case 0:
          return renderDeployForm();
        case 1:
          return renderConfirmation();
        default:
          return null;
      }
    } else {
      switch (currentStep) {
        case 0:
          return renderDeployTypeSelection();
        case 1:
          return renderDeployForm();
        case 2:
          return renderConfirmation();
        default:
          return null;
      }
    }
  };

  return (
    <Layout className="model-deploy-layout">
      <Content className="model-deploy-content">
        {renderStepContent()}
      </Content>
    </Layout>
  );
};

export default ModelDeploy;