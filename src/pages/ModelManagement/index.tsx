import React, { useState, useEffect } from 'react';
import {
  Layout,
  Card,
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  Switch,
  Steps,
  Space,
  message,
  AutoComplete,
  Spin,
  Tag,
  Divider,
  Row,
  Col,
  Typography,
  Modal,
  Table,
  Tooltip,
  Checkbox,
  Avatar,
  Progress,
  Tabs
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  SaveOutlined,
  ReloadOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  ImportOutlined,
  StarOutlined,
  HeartOutlined,
  DatabaseOutlined,
  CloudUploadOutlined,
  UnorderedListOutlined,
  FormOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ModelList from './ModelList';
import './index.css';

const { Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;
const { Step } = Steps;
const { TabPane } = Tabs;

interface ModelSearchResult {
  id: string;
  name: string;
  displayName: string;
  description: string;
  source: 'ModelScope' | 'HuggingFace' | '启智平台';
  framework?: string;
  parameterCount?: string;
  license?: string;
  contextWindow?: number;
  tags?: string[];
}

// 平台收藏模型接口
interface FavoriteModel {
  id: string;
  name: string;
  displayName: string;
  description: string;
  source: 'ModelScope' | 'HuggingFace' | '启智平台';
  framework: string;
  parameterCount: string;
  license: string;
  contextWindow: number;
  tags: string[];
  category: string;
  popularity: number;
  favoriteTime: string;
  downloads: number;
  rating: number;
  isImported: boolean; // 是否已导入
  author: string;
  avatar?: string;
}

interface ModelFormData {
  // 基础信息
  modelId: string;
  displayName: string;
  description: string;
  modelSource: string;
  modelFamily: string;
  applicationDomain: string[];
  modelType: string[];
  
  // 技术规格
  framework: string;
  parameterCount: string;
  contextWindow: number;
  tpm: number;
  rpm: number;
  license: string;
  
  // 使用与集成
  readmeFile: string;
  supportedImages: string[];
  launchCommand?: string;
  inputSchema?: string;
  outputSchema?: string;
  thinkingMode: string[];
  
  // 计费信息
  tokenBillingEnabled: boolean;
  inputTokenPrice?: number;
  outputTokenPrice?: number;
  recommendedInstance: string[];
  
  // 平台指标
  deploymentCount: number;
  averageRating: number;
}

const ModelManagement: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('list');
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<ModelSearchResult[]>([]);
  const [selectedModel, setSelectedModel] = useState<ModelSearchResult | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  // 批量导入相关状态
  const [batchImportVisible, setBatchImportVisible] = useState(false);
  const [favoriteModels, setFavoriteModels] = useState<FavoriteModel[]>([]);
  const [selectedFavoriteModels, setSelectedFavoriteModels] = useState<string[]>([]);
  const [batchImportLoading, setBatchImportLoading] = useState(false);
  const [favoriteModelsLoading, setFavoriteModelsLoading] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importingModels, setImportingModels] = useState<string[]>([]);

  // 枚举选项
  const modelSources = ['平台严选', '用户发布'];
  const modelFamilies = ['通义', '百川智能', 'DeepSeek', 'Llama', 'Stable Diffusion', 'Meta', 'Minimax', '零一万物', 'Kimi', '其他'];
  const applicationDomains = ['通用', '代码', '金融', '教育', '医疗', '电商零售', '文娱传媒', '法律法务', '客服', '科学研究', '内容创作', '市场营销', '政务公开', '工业制造'];
  const modelTypes = ['大语言模型', '文本生成', '代码生成', '图像生成', '语音识别', '语音合成', '多模态'];
  const frameworks = ['PyTorch', 'TensorFlow', 'JAX', 'Safetensors', 'Transformers', 'PEFT', 'TensorBoard', 'GGUF', 'Diffusers', 'ONNX'];
  const licenses = ['apache-2.0', 'mit', 'openrail', 'creativeml-openrail-m', 'cc-by-nc-4.0', 'llama2', 'llama3', 'gemma', 'cc-by-4.0'];
  const thinkingModes = ['思考模式', '非思考模式'];
  const recommendedInstances = ['1 * NVIDIA A100 (80G)', '2 * NVIDIA A100 (80G)', '1 * NVIDIA H100 (80G)', '4 * NVIDIA A100 (80G)'];

  // 模拟快速识别API调用
  const handleModelSearch = async (value: string) => {
    if (!value.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setSearchLoading(true);
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟搜索结果
      const mockResults: ModelSearchResult[] = [
        {
          id: 'qwen2-72b-instruct',
          name: 'qwen2-72b-instruct',
          displayName: '通义千问2-72B-指令微调',
          description: '阿里达摩院自研的720亿参数大规模语言模型，优化了指令遵循能力。',
          source: 'ModelScope' as const,
          framework: 'PyTorch',
          parameterCount: '72B',
          license: 'apache-2.0',
          contextWindow: 32768,
          tags: ['通用', '代码', '金融']
        },
        {
          id: 'qwen2-7b-instruct',
          name: 'qwen2-7b-instruct',
          displayName: '通义千问2-7B-指令微调',
          description: '阿里达摩院自研的70亿参数大规模语言模型，优化了指令遵循能力。',
          source: 'HuggingFace' as const,
          framework: 'PyTorch',
          parameterCount: '7B',
          license: 'apache-2.0',
          contextWindow: 32768,
          tags: ['通用', '代码']
        },
        {
          id: 'deepseek-r1',
          name: 'deepseek-r1',
          displayName: 'DeepSeek-R1',
          description: 'DeepSeek推出的具有推理能力的大语言模型。',
          source: 'HuggingFace' as const,
          framework: 'PyTorch',
          parameterCount: '70B',
          license: 'mit',
          contextWindow: 65536,
          tags: ['通用', '科学研究']
        }
      ].filter(model => 
        model.name.toLowerCase().includes(value.toLowerCase()) ||
        model.displayName.toLowerCase().includes(value.toLowerCase())
      );
      
      setSearchResults(mockResults);
      setShowSearchResults(true);
    } catch (error) {
      message.error('搜索失败，请重试');
    } finally {
      setSearchLoading(false);
    }
  };

  // 选择模型并预填信息
  const handleSelectModel = (model: ModelSearchResult) => {
    setSelectedModel(model);
    setShowSearchResults(false);
    setSearchValue(model.displayName);
    
    // 预填表单数据
    form.setFieldsValue({
      modelId: model.id,
      displayName: model.displayName,
      description: model.description,
      modelSource: '平台严选',
      modelFamily: model.name.includes('qwen') ? '通义' : model.name.includes('deepseek') ? 'DeepSeek' : '其他',
      applicationDomain: model.tags || ['通用'],
      modelType: ['大语言模型', '文本生成'],
      framework: model.framework || 'PyTorch',
      parameterCount: model.parameterCount || '',
      contextWindow: model.contextWindow || 32768,
      tpm: 800000,
      rpm: 1000,
      license: model.license || 'apache-2.0',
      readmeFile: `/models/${model.id}/readme.md`,
      supportedImages: ['registry.cn-hangzhou.aliyuncs.com/modelscope/modelscope:ubuntu22.04-cuda12.1.0-py310-torch2.2.0-tf2.15.0-1.10.0'],
      thinkingMode: ['思考模式', '非思考模式'],
      tokenBillingEnabled: true,
      inputTokenPrice: 0.12,
      outputTokenPrice: 0.12,
      recommendedInstance: ['1 * NVIDIA A100 (80G)'],
      deploymentCount: 0,
      averageRating: 5.0
    });
    
    message.success(`已选择模型：${model.displayName}`);
  };

  // 步骤配置
  const steps = [
    {
      title: '模型识别',
      description: '快速识别模型'
    },
    {
      title: '基础信息',
      description: '填写基本信息'
    },
    {
      title: '技术规格',
      description: '配置技术参数'
    },
    {
      title: '使用集成',
      description: '部署和集成配置'
    },
    {
      title: '计费信息',
      description: '设置计费规则'
    }
  ];

  // 下一步
  const handleNext = async () => {
    try {
      await form.validateFields();
      setCurrentStep(currentStep + 1);
    } catch (error) {
      message.error('请完善当前步骤的必填信息');
    }
  };

  // 上一步
  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      message.success('模型录入成功！');
      navigate('/');
    } catch (error) {
      message.error('录入失败，请检查表单信息');
    } finally {
      setLoading(false);
    }
  };

  // 渲染模型识别步骤
  const renderModelSearch = () => (
    <Card title="快速识别模型" className="step-card">
      <div className="model-search-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text type="secondary" className="search-hint">
            输入模型名称，系统将从 ModelScope、HuggingFace 等平台自动识别并预填信息
          </Text>
          <Space>
            <Button 
              type="primary" 
              icon={<HeartOutlined />}
              onClick={() => {
                setBatchImportVisible(true);
                fetchFavoriteModels();
              }}
            >
              批量导入收藏模型
            </Button>
          </Space>
        </div>
        
        <div className="search-container">
          <AutoComplete
            value={searchValue}
            onChange={setSearchValue}
            onSearch={handleModelSearch}
            placeholder="请输入模型名称，如：qwen2-72b-instruct"
            size="large"
            className="model-search-input"
            suffixIcon={searchLoading ? <Spin size="small" /> : <SearchOutlined />}
            dropdownClassName="model-search-dropdown"
            open={showSearchResults && searchResults.length > 0}
            onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
            onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
          />
        </div>

        {showSearchResults && searchResults.length > 0 && (
          <div className="search-results">
            <Title level={5}>搜索结果</Title>
            {searchResults.map((model) => (
              <Card
                key={model.id}
                className="model-result-card"
                hoverable
                onClick={() => handleSelectModel(model)}
              >
                <div className="model-result-header">
                  <div className="model-info">
                    <Title level={5} className="model-name">{model.displayName}</Title>
                    <Text type="secondary" className="model-id">{model.id}</Text>
                  </div>
                  <Tag color={model.source === 'ModelScope' ? 'blue' : 'green'}>
                    {model.source}
                  </Tag>
                </div>
                <Text className="model-description">{model.description}</Text>
                <div className="model-tags">
                  {model.tags?.map(tag => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}

        {selectedModel && (
          <div className="selected-model">
            <Title level={5}>已选择模型</Title>
            <Card className="selected-model-card">
              <div className="selected-model-info">
                <CheckCircleOutlined className="check-icon" />
                <div>
                  <Title level={5} className="selected-model-name">{selectedModel.displayName}</Title>
                  <Text type="secondary">{selectedModel.id}</Text>
                </div>
                <Tag color={selectedModel.source === 'ModelScope' ? 'blue' : 'green'}>
                  {selectedModel.source}
                </Tag>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Card>
  );

  // 渲染基础信息步骤
  const renderBasicInfo = () => (
    <Card title="基础信息" className="step-card">
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Form.Item
            name="modelId"
            label="模型ID"
            rules={[{ required: true, message: '请输入模型ID' }]}
          >
            <Input placeholder="如：qwen2-72b-instruct" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="displayName"
            label="展示名称"
            rules={[{ required: true, message: '请输入展示名称' }]}
          >
            <Input placeholder="如：通义千问2-72B-指令微调" />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="description"
            label="简短描述"
            rules={[{ required: true, message: '请输入模型描述' }]}
          >
            <TextArea 
              rows={3} 
              placeholder="一句话描述模型的核心功能和用途，将显示在模型卡片上" 
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="modelSource"
            label="模型来源"
            rules={[{ required: true, message: '请选择模型来源' }]}
          >
            <Select placeholder="请选择模型来源">
              {modelSources.map(source => (
                <Option key={source} value={source}>{source}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="modelFamily"
            label="模型提供方"
            rules={[{ required: true, message: '请选择模型提供方' }]}
          >
            <Select placeholder="请选择模型提供方">
              {modelFamilies.map(family => (
                <Option key={family} value={family}>{family}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="applicationDomain"
            label="应用领域"
            rules={[{ required: true, message: '请选择应用领域' }]}
          >
            <Select mode="multiple" placeholder="请选择应用领域">
              {applicationDomains.map(domain => (
                <Option key={domain} value={domain}>{domain}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="modelType"
            label="模型类型"
            rules={[{ required: true, message: '请选择模型类型' }]}
          >
            <Select mode="multiple" placeholder="请选择模型类型">
              {modelTypes.map(type => (
                <Option key={type} value={type}>{type}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );

  // 渲染技术规格步骤
  const renderTechSpecs = () => (
    <Card title="技术规格" className="step-card">
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Form.Item
            name="framework"
            label="技术框架"
            rules={[{ required: true, message: '请选择技术框架' }]}
          >
            <Select placeholder="请选择技术框架">
              {frameworks.map(framework => (
                <Option key={framework} value={framework}>{framework}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="parameterCount"
            label="参数规模"
            rules={[{ required: true, message: '请输入参数规模' }]}
          >
            <Input placeholder="如：72B" addonAfter="B" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="contextWindow"
            label="上下文长度"
            rules={[{ required: true, message: '请输入上下文长度' }]}
          >
            <InputNumber 
              placeholder="32768" 
              style={{ width: '100%' }}
              addonAfter="tokens"
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="tpm"
            label="TPM"
            rules={[{ required: true, message: '请输入TPM' }]}
            tooltip="Tokens Per Minute，每分钟tokens数量"
          >
            <InputNumber 
              placeholder="800000" 
              style={{ width: '100%' }}
              addonAfter="/min"
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="rpm"
            label="RPM"
            rules={[{ required: true, message: '请输入RPM' }]}
            tooltip="Requests Per Minute，每分钟请求数"
          >
            <InputNumber 
              placeholder="1000" 
              style={{ width: '100%' }}
              addonAfter="/min"
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="license"
            label="模型协议"
            rules={[{ required: true, message: '请选择模型协议' }]}
          >
            <Select placeholder="请选择模型协议">
              {licenses.map(license => (
                <Option key={license} value={license}>{license}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );

  // 渲染使用集成步骤
  const renderIntegration = () => (
    <Card title="使用与集成" className="step-card">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item
            name="readmeFile"
            label="README文件路径"
            rules={[{ required: true, message: '请输入README文件路径' }]}
          >
            <Input placeholder="如：/models/qwen2-72b/readme.md" />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="supportedImages"
            label="支持启动镜像"
            rules={[{ required: true, message: '请输入支持的镜像' }]}
          >
            <Select mode="tags" placeholder="请输入镜像地址">
              <Option value="registry.cn-hangzhou.aliyuncs.com/modelscope/modelscope:ubuntu22.04-cuda12.1.0-py310-torch2.2.0-tf2.15.0-1.10.0">
                ModelScope 标准镜像
              </Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="launchCommand"
            label="推荐启动命令"
          >
            <TextArea 
              rows={3} 
              placeholder="如：python launch.py --model-id..." 
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="inputSchema"
            label="输入格式 (JSON Schema)"
          >
            <TextArea 
              rows={4} 
              placeholder='{"type": "object", "properties": {"prompt": {"type": "string"}}}' 
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="outputSchema"
            label="输出格式 (JSON Schema)"
          >
            <TextArea 
              rows={4} 
              placeholder='{"type": "object", "properties": {"response": {"type": "string"}}}' 
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="thinkingMode"
            label="思考模式"
            rules={[{ required: true, message: '请选择思考模式' }]}
          >
            <Select mode="multiple" placeholder="请选择支持的思考模式">
              {thinkingModes.map(mode => (
                <Option key={mode} value={mode}>{mode}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );

  // 渲染计费信息步骤
  const renderBilling = () => (
    <Card title="计费信息" className="step-card">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item
            name="tokenBillingEnabled"
            label="支持Token计费"
            valuePropName="checked"
          >
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="inputTokenPrice"
            label="输入Token单价"
            tooltip="每千输入tokens的价格（人民币）"
          >
            <InputNumber 
              placeholder="0.12" 
              style={{ width: '100%' }}
              addonBefore="¥"
              addonAfter="/千tokens"
              step={0.01}
              precision={2}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="outputTokenPrice"
            label="输出Token单价"
            tooltip="每千输出tokens的价格（人民币）"
          >
            <InputNumber 
              placeholder="0.12" 
              style={{ width: '100%' }}
              addonBefore="¥"
              addonAfter="/千tokens"
              step={0.01}
              precision={2}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="recommendedInstance"
            label="推荐资源规格"
            rules={[{ required: true, message: '请选择推荐资源规格' }]}
          >
            <Select mode="multiple" placeholder="请选择推荐的GPU实例规格">
              {recommendedInstances.map(instance => (
                <Option key={instance} value={instance}>{instance}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="deploymentCount"
            label="初始部署量"
            initialValue={0}
          >
            <InputNumber 
              placeholder="0" 
              style={{ width: '100%' }}
              min={0}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="averageRating"
            label="初始评分"
            initialValue={5.0}
          >
            <InputNumber 
              placeholder="5.0" 
              style={{ width: '100%' }}
              min={1}
              max={5}
              step={0.1}
              precision={1}
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );

  // 渲染当前步骤内容
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderModelSearch();
      case 1:
        return renderBasicInfo();
      case 2:
        return renderTechSpecs();
      case 3:
        return renderIntegration();
      case 4:
        return renderBilling();
      default:
        return null;
    }
  };

  // 获取平台收藏模型列表
  const fetchFavoriteModels = async () => {
    setFavoriteModelsLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockFavoriteModels: FavoriteModel[] = [
        {
          id: 'qwen2-72b-instruct',
          name: 'qwen2-72b-instruct',
          displayName: '通义千问2-72B-指令微调',
          description: '阿里达摩院自研的720亿参数大规模语言模型，在代码、数学、推理等多个领域表现优异。',
          source: 'ModelScope' as const,
          framework: 'PyTorch',
          parameterCount: '72B',
          license: 'apache-2.0',
          contextWindow: 32768,
          tags: ['通用', '代码', '金融', '推理'],
          category: '大语言模型',
          popularity: 95,
          favoriteTime: '2024-01-15',
          downloads: 125000,
          rating: 4.8,
          isImported: false,
          author: '阿里达摩院',
          avatar: '🤖'
        },
        {
          id: 'qwen2-7b-instruct',
          name: 'qwen2-7b-instruct',
          displayName: '通义千问2-7B-指令微调',
          description: '轻量级版本的通义千问模型，在保持优秀性能的同时大幅降低了计算资源需求。',
          source: 'ModelScope' as const,
          framework: 'PyTorch',
          parameterCount: '7B',
          license: 'apache-2.0',
          contextWindow: 32768,
          tags: ['通用', '代码', '轻量级'],
          category: '大语言模型',
          popularity: 88,
          favoriteTime: '2024-01-10',
          downloads: 89000,
          rating: 4.6,
          isImported: true,
          author: '阿里达摩院',
          avatar: '🤖'
        },
        {
          id: 'deepseek-r1',
          name: 'deepseek-r1',
          displayName: 'DeepSeek-R1',
          description: 'DeepSeek推出的具有强大推理能力的大语言模型，在数学和科学研究领域表现突出。',
          source: 'HuggingFace' as const,
          framework: 'PyTorch',
          parameterCount: '70B',
          license: 'mit',
          contextWindow: 65536,
          tags: ['通用', '科学研究', '推理', '数学'],
          category: '大语言模型',
          popularity: 92,
          favoriteTime: '2024-01-20',
          downloads: 67000,
          rating: 4.7,
          isImported: false,
          author: 'DeepSeek',
          avatar: '🧠'
        },
        {
          id: 'baichuan2-13b-chat',
          name: 'baichuan2-13b-chat',
          displayName: '百川2-13B-对话',
          description: '百川智能开发的130亿参数对话模型，在中文理解和生成方面表现优异。',
          source: 'ModelScope' as const,
          framework: 'PyTorch',
          parameterCount: '13B',
          license: 'apache-2.0',
          contextWindow: 4096,
          tags: ['通用', '对话', '中文', '聊天'],
          category: '大语言模型',
          popularity: 85,
          favoriteTime: '2024-01-08',
          downloads: 45000,
          rating: 4.5,
          isImported: false,
          author: '百川智能',
          avatar: '🌊'
        },
        {
          id: 'stable-diffusion-xl',
          name: 'stable-diffusion-xl',
          displayName: 'Stable Diffusion XL',
          description: '高质量图像生成模型，支持1024x1024分辨率图像生成，在艺术创作领域广受好评。',
          source: 'HuggingFace' as const,
          framework: 'Diffusers',
          parameterCount: '3.5B',
          license: 'openrail',
          contextWindow: 77,
          tags: ['图像生成', '艺术创作', '高分辨率'],
          category: '图像生成',
          popularity: 90,
          favoriteTime: '2024-01-12',
          downloads: 156000,
          rating: 4.9,
          isImported: false,
          author: 'Stability AI',
          avatar: '🎨'
        },
        {
          id: 'whisper-large-v3',
          name: 'whisper-large-v3',
          displayName: 'Whisper Large V3',
          description: 'OpenAI开发的多语言语音识别模型，支持99种语言，在语音转文字领域表现卓越。',
          source: 'HuggingFace' as const,
          framework: 'PyTorch',
          parameterCount: '1.55B',
          license: 'mit',
          contextWindow: 30,
          tags: ['语音识别', '多语言', '转录'],
          category: '语音识别',
          popularity: 87,
          favoriteTime: '2024-01-05',
          downloads: 78000,
          rating: 4.6,
          isImported: false,
          author: 'OpenAI',
          avatar: '🎤'
        }
      ];
      
      setFavoriteModels(mockFavoriteModels);
    } catch (error) {
      message.error('获取收藏模型列表失败');
    } finally {
      setFavoriteModelsLoading(false);
    }
  };

  // 批量导入收藏模型
  const handleBatchImportFavorites = async () => {
    if (selectedFavoriteModels.length === 0) {
      message.warning('请至少选择一个模型进行导入');
      return;
    }
    
    // 过滤掉已导入的模型
    const modelsToImport = selectedFavoriteModels.filter(modelId => {
      const model = favoriteModels.find(m => m.id === modelId);
      return model && !model.isImported;
    });
    
    if (modelsToImport.length === 0) {
      message.warning('选中的模型已全部导入');
      return;
    }
    
    setBatchImportLoading(true);
    setImportProgress(0);
    setImportingModels(modelsToImport);
    
    try {
      // 模拟批量导入过程
      for (let i = 0; i < modelsToImport.length; i++) {
        const modelId = modelsToImport[i];
        const model = favoriteModels.find(m => m.id === modelId);
        
        // 模拟单个模型导入
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // 更新进度
        const progress = Math.round(((i + 1) / modelsToImport.length) * 100);
        setImportProgress(progress);
        
        // 标记为已导入
        setFavoriteModels(prev => prev.map(m => 
          m.id === modelId ? { ...m, isImported: true } : m
        ));
        
        message.success(`${model?.displayName} 导入成功`);
      }
      
      message.success(`成功导入 ${modelsToImport.length} 个模型`);
      setBatchImportVisible(false);
      setSelectedFavoriteModels([]);
      setImportProgress(0);
      setImportingModels([]);
      
      // 跳转到模型列表页面
      navigate('/');
    } catch (error) {
      message.error('批量导入失败，请重试');
    } finally {
      setBatchImportLoading(false);
    }
  };

  // 收藏模型表格列配置
  const favoriteModelColumns = [
    {
      title: '选择',
      dataIndex: 'id',
      width: 60,
      render: (id: string, record: FavoriteModel) => (
        <Checkbox
          checked={selectedFavoriteModels.includes(id)}
          disabled={record.isImported}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedFavoriteModels([...selectedFavoriteModels, id]);
            } else {
              setSelectedFavoriteModels(selectedFavoriteModels.filter(modelId => modelId !== id));
            }
          }}
        />
      )
    },
    {
      title: '模型信息',
      dataIndex: 'displayName',
      render: (text: string, record: FavoriteModel) => (
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <Avatar 
            size={48} 
            style={{ 
              backgroundColor: record.isImported ? '#f0f0f0' : '#1890ff',
              marginRight: 12,
              flexShrink: 0
            }}
          >
            {record.avatar || record.author.charAt(0)}
          </Avatar>
          <div style={{ flex: 1 }}>
            <div style={{ 
              fontWeight: 500, 
              marginBottom: 4,
              color: record.isImported ? '#999' : '#000'
            }}>
              {text}
              {record.isImported && (
                <Tag color="green" style={{ marginLeft: 8, fontSize: 12 }}>已导入</Tag>
              )}
            </div>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
              {record.id} • {record.author}
            </div>
            <div style={{ fontSize: 12, color: '#999', marginBottom: 8 }}>
              {record.description}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 12, color: '#666' }}>
                <StarOutlined style={{ color: '#faad14', marginRight: 4 }} />
                {record.rating}
              </span>
              <span style={{ fontSize: 12, color: '#666' }}>
                <CloudUploadOutlined style={{ marginRight: 4 }} />
                {record.downloads.toLocaleString()}
              </span>
              <span style={{ fontSize: 12, color: '#666' }}>
                收藏于 {record.favoriteTime}
              </span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: '来源',
      dataIndex: 'source',
      width: 100,
      render: (source: string) => (
        <Tag color={source === 'ModelScope' ? 'blue' : source === 'HuggingFace' ? 'green' : 'orange'}>
          {source}
        </Tag>
      )
    },
    {
      title: '类别',
      dataIndex: 'category',
      width: 100,
      render: (category: string) => <Tag>{category}</Tag>
    },
    {
      title: '参数量',
      dataIndex: 'parameterCount',
      width: 80,
      render: (count: string) => <Text strong>{count}</Text>
    },
    {
      title: '热度',
      dataIndex: 'popularity',
      width: 100,
      render: (popularity: number) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Progress 
            percent={popularity} 
            size="small" 
            showInfo={false}
            strokeColor={popularity >= 90 ? '#52c41a' : popularity >= 80 ? '#faad14' : '#ff4d4f'}
            style={{ width: 40, marginRight: 8 }}
          />
          <Text style={{ fontSize: 12 }}>{popularity}%</Text>
        </div>
      )
    },
    {
      title: '标签',
      dataIndex: 'tags',
      render: (tags: string[]) => (
        <div>
          {tags.slice(0, 2).map(tag => (
            <Tag key={tag} style={{ marginBottom: 2, fontSize: 12 }}>{tag}</Tag>
          ))}
          {tags.length > 2 && (
            <Tooltip title={tags.slice(2).join(', ')}>
              <Tag style={{ fontSize: 12 }}>+{tags.length - 2}</Tag>
            </Tooltip>
          )}
        </div>
      )
    }
  ];

  return (
    <Layout className="model-management-layout">
      <Content className="model-management-content">
        <div className="page-header">
          <Title level={2}>模型管理</Title>
        </div>

        <Card>
          <ModelList />
        </Card>

        {/* 批量导入模态框 */}
        <Modal
          title="批量导入收藏模型"
          open={batchImportVisible}
          onCancel={() => {
            setBatchImportVisible(false);
            setSelectedFavoriteModels([]);
            setImportProgress(0);
          }}
          width={1200}
          footer={[
            <Button key="cancel" onClick={() => setBatchImportVisible(false)}>
              取消
            </Button>,
            <Button
              key="import"
              type="primary"
              loading={batchImportLoading}
              onClick={handleBatchImportFavorites}
              disabled={selectedFavoriteModels.length === 0}
            >
              导入选中模型 ({selectedFavoriteModels.length})
            </Button>
          ]}
        >
          {batchImportLoading && (
            <div style={{ marginBottom: 16 }}>
              <Text>正在导入模型...</Text>
              <Progress percent={importProgress} status="active" />
            </div>
          )}
          
          <Table
            columns={favoriteModelColumns}
            dataSource={favoriteModels}
            rowKey="id"
            loading={favoriteModelsLoading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 个模型`
            }}
            scroll={{ y: 400 }}
          />
        </Modal>
      </Content>
    </Layout>
  );
};

export default ModelManagement;
