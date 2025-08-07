import React, { useState, useEffect } from 'react';
import {
  Layout,
  Card,
  Form,
  Input,
  Button,
  Steps,
  Row,
  Col,
  Select,
  InputNumber,
  Switch,
  Upload,
  message,
  Space,
  Typography,
  Divider,
  List,
  Avatar,
  Tag,
  Spin,
  Radio,
  Table,
  Checkbox,
  Modal,
  Progress,
  Tooltip,
  AutoComplete
} from 'antd';
import {
  ArrowLeftOutlined,
  SaveOutlined,
  SearchOutlined,
  UploadOutlined,
  StarOutlined,
  CloudUploadOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './index.css';

const { Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;
const { Step } = Steps;

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
  isImported: boolean;
  author: string;
  avatar?: string;
}

const ModelAdd: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<ModelSearchResult[]>([]);
  const [selectedModel, setSelectedModel] = useState<ModelSearchResult | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  // 录入模式：official-启智官方, platform-共享平台, manual-手动录入, batch-批量导入
  const [inputMode, setInputMode] = useState<'official' | 'platform' | 'manual' | 'batch'>('official');
  
  // 文件上传相关状态
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [modelFileInfo, setModelFileInfo] = useState<any>(null);
  const [parseLoading, setParseLoading] = useState(false);
  
  // 平台搜索相关状态
  const [platformSource, setPlatformSource] = useState<'HuggingFace' | 'ModelScope'>('HuggingFace');
  
  // 批量导入相关状态
  const [favoriteModels, setFavoriteModels] = useState<FavoriteModel[]>([]);
  const [favoriteModelsLoading, setFavoriteModelsLoading] = useState(false);
  const [selectedFavoriteModels, setSelectedFavoriteModels] = useState<string[]>([]);
  const [batchImportLoading, setBatchImportLoading] = useState(false);
  const [importProgress, setImportProgress] = useState(0);

  // 枚举选项
  const modelSources = ['平台严选', '用户发布'];
  const modelFamilies = ['通义', '百川智能', 'DeepSeek', 'Llama', 'Stable Diffusion', 'Meta', 'Minimax', '零一万物', 'Kimi', '其他'];
  const applicationDomains = ['通用', '代码', '金融', '教育', '医疗', '电商零售', '文娱传媒', '法律法务', '客服', '科学研究', '内容创作', '市场营销', '政务公开', '工业制造'];
  const modelTypes = ['大语言模型', '文本生成', '代码生成', '图像生成', '语音识别', '语音合成', '多模态'];
  const frameworks = ['PyTorch', 'TensorFlow', 'JAX', 'Safetensors', 'Transformers', 'PEFT', 'TensorBoard', 'GGUF', 'Diffusers', 'ONNX'];
  const licenses = ['apache-2.0', 'mit', 'openrail', 'creativeml-openrail-m', 'cc-by-nc-4.0', 'llama2', 'llama3', 'gemma', 'cc-by-4.0'];
  const thinkingModes = ['思考模式', '非思考模式'];
  const recommendedInstances = ['1 * NVIDIA A100 (80G)', '2 * NVIDIA A100 (80G)', '1 * NVIDIA H100 (80G)', '4 * NVIDIA A100 (80G)'];

  // 步骤导航函数
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // 模拟快速识别API调用
  const handleModelSearch = async (value: string) => {
    if (!value.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setSearchLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
        }
      ];
      
      setSearchResults(mockResults.filter(model => 
        model.displayName.toLowerCase().includes(value.toLowerCase()) ||
        model.name.toLowerCase().includes(value.toLowerCase())
      ));
      setShowSearchResults(true);
    } catch (error) {
      message.error('搜索失败，请重试');
    } finally {
      setSearchLoading(false);
    }
  };

  // 平台模型搜索
  const handlePlatformSearch = async (value: string) => {
    if (!value.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setSearchLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 根据选择的平台返回不同的搜索结果
      const mockResults: ModelSearchResult[] = platformSource === 'HuggingFace' ? [
        {
          id: 'microsoft/DialoGPT-medium',
          name: 'microsoft/DialoGPT-medium',
          displayName: 'DialoGPT Medium',
          description: 'Microsoft开发的对话生成模型',
          source: 'HuggingFace' as const,
          framework: 'PyTorch',
          parameterCount: '345M',
          license: 'mit',
          contextWindow: 1024,
          tags: ['对话', '生成']
        }
      ] : [
        {
          id: 'qwen/Qwen2-7B-Instruct',
          name: 'qwen/Qwen2-7B-Instruct',
          displayName: '通义千问2-7B-指令微调',
          description: '阿里达摩院开源的指令微调模型',
          source: 'ModelScope' as const,
          framework: 'PyTorch',
          parameterCount: '7B',
          license: 'apache-2.0',
          contextWindow: 32768,
          tags: ['中文', '指令微调']
        }
      ];
      
      setSearchResults(mockResults.filter(model => 
        model.displayName.toLowerCase().includes(value.toLowerCase()) ||
        model.name.toLowerCase().includes(value.toLowerCase())
      ));
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
    
    // 预填表单信息
    form.setFieldsValue({
      modelId: model.name,
      displayName: model.displayName,
      description: model.description,
      framework: model.framework,
      parameterCount: model.parameterCount,
      license: model.license,
      contextWindow: model.contextWindow,
      applicationDomain: model.tags
    });
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      message.success('模型录入成功！');
      navigate('/management');
    } catch (error) {
      message.error('录入失败，请检查表单信息');
    } finally {
      setLoading(false);
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
          description: '阿里达摩院自研的720亿参数大规模语言模型',
          author: '阿里达摩院',
          avatar: '🤖',
          source: 'ModelScope',
          framework: 'PyTorch',
          license: 'apache-2.0',
          contextWindow: 32768,
          category: '大语言模型',
          parameterCount: '72B',
          rating: 4.8,
          downloads: 125000,
          popularity: 95,
          tags: ['中文', '指令微调', '推理'],
          favoriteTime: '2024-01-15',
          isImported: false
        },
        {
          id: 'baichuan2-13b-chat',
          name: 'baichuan2-13b-chat',
          displayName: '百川2-13B-对话',
          description: '百川智能开源的130亿参数对话模型',
          author: '百川智能',
          avatar: '🚀',
          source: 'ModelScope',
          framework: 'PyTorch',
          license: 'apache-2.0',
          contextWindow: 4096,
          category: '大语言模型',
          parameterCount: '13B',
          rating: 4.6,
          downloads: 89000,
          popularity: 88,
          tags: ['中文', '对话', '开源'],
          favoriteTime: '2024-01-10',
          isImported: true
        }
      ];
      
      setFavoriteModels(mockFavoriteModels);
    } catch (error) {
      message.error('获取收藏模型列表失败');
    } finally {
      setFavoriteModelsLoading(false);
    }
  };

  // 处理文件上传
  const handleFileUpload = async (info: any) => {
    const { fileList } = info;
    setUploadedFiles(fileList);
    
    if (fileList.length > 0 && fileList[0].status === 'done') {
      setParseLoading(true);
      try {
        // 模拟解析模型文件信息
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 模拟从README或config.json中解析的信息
        const parsedInfo = {
          modelName: 'custom-model-v1',
          description: '从README.md文件中解析的模型描述信息...',
          framework: 'PyTorch',
          license: 'apache-2.0',
          tags: ['自定义', '本地模型'],
          parameterCount: '7B'
        };
        
        setModelFileInfo(parsedInfo);
        
        // 预填表单
        form.setFieldsValue({
          modelId: parsedInfo.modelName,
          displayName: parsedInfo.modelName,
          description: parsedInfo.description,
          framework: parsedInfo.framework,
          license: parsedInfo.license,
          parameterCount: parsedInfo.parameterCount,
          applicationDomain: parsedInfo.tags
        });
        
        message.success('模型文件解析完成，已预填相关信息');
      } catch (error) {
        message.error('模型文件解析失败');
      } finally {
        setParseLoading(false);
      }
    }
  };

  // 批量导入收藏模型
  const handleBatchImportFavorites = async () => {
    if (selectedFavoriteModels.length === 0) {
      message.warning('请至少选择一个模型进行导入');
      return;
    }
    
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
    
    try {
      for (let i = 0; i < modelsToImport.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setImportProgress(Math.round(((i + 1) / modelsToImport.length) * 100));
      }
      
      message.success(`成功导入 ${modelsToImport.length} 个模型`);
      setSelectedFavoriteModels([]);
      
      // 更新模型状态为已导入
      setFavoriteModels(prev => prev.map(model => 
        modelsToImport.includes(model.id) 
          ? { ...model, isImported: true }
          : model
      ));
      
      // 跳转到模型列表页面
      navigate('/management');
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
    }
  ];

  // 当切换到批量导入模式时，获取收藏模型列表
  useEffect(() => {
    if (inputMode === 'batch' || inputMode === 'official') {
      fetchFavoriteModels();
    }
  }, [inputMode]);

  // 渲染录入内容
  const renderInputContent = () => {
    switch (inputMode) {
      
      case 'platform':
        return (
          <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ maxWidth: 1200 }}>
            <Card>
              <div style={{ marginBottom: 16 }}>
                <Title level={4}>模型共享平台录入</Title>
                <Text type="secondary">
                  从HuggingFace或ModelScope平台搜索并录入模型。
                </Text>
              </div>
              
              
              
              <Steps
                current={currentStep}
                items={[
                  { title: '模型搜索', description: '搜索并选择模型' },
                  { title: '基础信息', description: '确认基本信息' },
                  { title: '技术规格', description: '技术参数配置' },
                  { title: '使用集成', description: '使用方式配置' },
                  { title: '计费信息', description: '资源与计费' }
                ]}
                style={{ marginBottom: 32 }}
              />
              
              {renderStepContent()}
              
              <Divider />
              
              <div style={{ textAlign: 'center' }}>
                <Space size="large">
                  {currentStep > 0 && (
                    <Button size="large" onClick={prevStep}>上一步</Button>
                  )}
                  {currentStep < 4 && (
                    <Button type="primary" size="large" onClick={nextStep}>下一步</Button>
                  )}
                  {currentStep === 4 && (
                    <Button 
                      type="primary" 
                      size="large"
                      icon={<SaveOutlined />}
                      loading={loading}
                      htmlType="submit"
                    >
                      提交录入
                    </Button>
                  )}
                </Space>
              </div>
            </Card>
          </Form>
        );
        
      case 'manual':
        return (
          <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ maxWidth: 1200 }}>
            <Card>
              <div style={{ marginBottom: 16 }}>
                <Title level={4}>手动录入模型</Title>
                <Text type="secondary">
                  上传模型文件（支持文件夹），系统将自动解析README等文件预填信息。
                </Text>
              </div>
              
              <Steps
                current={currentStep}
                items={[
                  { title: '文件上传', description: '上传模型文件' },
                  { title: '信息确认', description: '确认解析信息' },
                  { title: '技术规格', description: '技术参数配置' },
                  { title: '使用集成', description: '使用方式配置' },
                  { title: '计费信息', description: '资源与计费' }
                ]}
                style={{ marginBottom: 32 }}
              />
              
              {currentStep === 0 && (
                <Card title="上传模型文件">
                  <Upload.Dragger
                    name="modelFiles"
                    multiple
                    directory
                    onChange={handleFileUpload}
                    style={{ marginBottom: 16 }}
                  >
                    <p className="ant-upload-drag-icon">
                      <UploadOutlined />
                    </p>
                    <p className="ant-upload-text">点击或拖拽文件/文件夹到此区域上传</p>
                    <p className="ant-upload-hint">
                      支持上传模型文件夹，系统将自动解析README.md、config.json等文件
                    </p>
                  </Upload.Dragger>
                  
                  {parseLoading && (
                    <div style={{ textAlign: 'center', padding: 20 }}>
                      <Spin size="large" />
                      <div style={{ marginTop: 16 }}>正在解析模型文件...</div>
                    </div>
                  )}
                  
                  {modelFileInfo && (
                    <Card size="small" title="解析结果" style={{ marginTop: 16 }}>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Text strong>模型名称：</Text>{modelFileInfo.modelName}
                        </Col>
                        <Col span={12}>
                          <Text strong>框架：</Text>{modelFileInfo.framework}
                        </Col>
                        <Col span={24} style={{ marginTop: 8 }}>
                          <Text strong>描述：</Text>{modelFileInfo.description}
                        </Col>
                      </Row>
                    </Card>
                  )}
                </Card>
              )}
              
              {currentStep > 0 && renderStepContent()}
              
              <Divider />
              
              <div style={{ textAlign: 'center' }}>
                <Space size="large">
                  {currentStep > 0 && (
                    <Button size="large" onClick={prevStep}>上一步</Button>
                  )}
                  {currentStep < 4 && (
                    <Button 
                      type="primary" 
                      size="large" 
                      onClick={nextStep}
                      disabled={currentStep === 0 && !modelFileInfo}
                    >
                      下一步
                    </Button>
                  )}
                  {currentStep === 4 && (
                    <Button 
                      type="primary" 
                      size="large"
                      icon={<SaveOutlined />}
                      loading={loading}
                      htmlType="submit"
                    >
                      提交录入
                    </Button>
                  )}
                </Space>
              </div>
            </Card>
          </Form>
        );
        
      case 'batch':
        return (
          <Card>
            <div style={{ marginBottom: 16 }}>
              <Title level={4}>批量导入收藏模型</Title>
              <Text type="secondary">
                从您的收藏列表中选择模型进行批量导入，已导入的模型将显示为灰色状态。
              </Text>
            </div>
            
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
            
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <Space size="large">
                <Button 
                  size="large" 
                  onClick={() => navigate('/management')}
                >
                  取消
                </Button>
                <Button
                  type="primary"
                  size="large"
                  loading={batchImportLoading}
                  onClick={handleBatchImportFavorites}
                  disabled={selectedFavoriteModels.length === 0}
                >
                  导入选中模型 ({selectedFavoriteModels.length})
                </Button>
              </Space>
            </div>
          </Card>
        );
        
      default:
        return null;
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

  return (
    <Layout className="model-management-layout">
      <Content className="model-management-content">
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate('/management')}
              style={{ marginRight: 16 }}
            >
              返回模型管理
            </Button>
            <div>
              <Title level={2} style={{ margin: 0 }}>录入模型</Title>
              <Text type="secondary">添加新的模型到租户资源库</Text>
            </div>
          </div>
          
          {/* 录入模式选择 */}
          <Card style={{ marginBottom: 24 }}>
            <Title level={4} style={{ marginBottom: 16 }}>选择录入方式</Title>
            <Radio.Group 
              value={inputMode} 
              onChange={(e) => setInputMode(e.target.value)}
              size="large"
              style={{ width: '100%' }}
            >
              <Row gutter={16}>
                <Col span={6}>
                  <Radio.Button 
                    value="platform" 
                    style={{ 
                      width: '100%', 
                      height: 'auto', 
                      padding: '16px',
                      textAlign: 'center'
                    }}
                  >
                    <div>
                      <SearchOutlined style={{ fontSize: 24, display: 'block', marginBottom: 8 }} />
                      <div style={{ fontWeight: 'bold' }}>模型共享平台</div>
                      <div style={{ fontSize: 12, color: '#666' }}>从HuggingFace/ModelScope搜索录入</div>
                    </div>
                  </Radio.Button>
                </Col>
                <Col span={6}>
                  <Radio.Button 
                    value="manual" 
                    style={{ 
                      width: '100%', 
                      height: 'auto', 
                      padding: '16px',
                      textAlign: 'center'
                    }}
                  >
                    <div>
                      <UploadOutlined style={{ fontSize: 24, display: 'block', marginBottom: 8 }} />
                      <div style={{ fontWeight: 'bold' }}>手动录入</div>
                      <div style={{ fontSize: 12, color: '#666' }}>上传模型文件手动配置</div>
                    </div>
                  </Radio.Button>
                </Col>
                <Col span={6}>
                  <Radio.Button 
                    value="batch" 
                    style={{ 
                      width: '100%', 
                      height: 'auto', 
                      padding: '16px',
                      textAlign: 'center'
                    }}
                  >
                    <div>
                      <StarOutlined style={{ fontSize: 24, display: 'block', marginBottom: 8 }} />
                      <div style={{ fontWeight: 'bold' }}>批量导入平台严选模型</div>
                      <div style={{ fontSize: 12, color: '#666' }}>从启智平台精选的模型库中批量导入模型。 </div>
                    </div>
                  </Radio.Button>
                </Col>
              </Row>
            </Radio.Group>
          </Card>
        </div>

        {renderInputContent()}
      </Content>
    </Layout>
  );
};

export default ModelAdd;