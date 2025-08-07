import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Button,
  Tag,
  Space,
  Input,
  Select,
  Modal,
  message,
  Tooltip,
  Avatar,
  Progress,
  Switch,
  Popconfirm,
  Typography,
  Row,
  Col,
  Statistic
} from 'antd';
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  EyeOutlined,
  SettingOutlined,
  CloudServerOutlined,
  RobotOutlined,
  FileTextOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;
const { Option } = Select;
const { Text, Title } = Typography;

// 模型数据接口
interface TenantModel {
  id: string;
  modelId: string;
  displayName: string;
  description: string;
  author: string;
  avatar?: string;
  source: 'ModelScope' | 'HuggingFace' | '启智平台';
  framework: string;
  parameterCount: string;
  license: string;
  contextWindow: number;
  tags: string[];
  category: string;
  
  // 推理相关
  isVisible: boolean; // 可见状态（公开状态）
  canPresetInference: boolean; // 可预制推理状态
  deploymentStatus: 'running' | 'stopped' | 'deploying' | 'error';
  instanceType?: string;
  
  // 统计信息
  deploymentCount: number;
  totalRequests: number;
  averageRating: number;
  
  // 时间信息
  importTime: string;
  lastUsedTime?: string;
  
  // 计费信息
  tokenBillingEnabled: boolean;
  inputTokenPrice?: number;
  outputTokenPrice?: number;
}

const ModelList: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [models, setModels] = useState<TenantModel[]>([]);
  const [filteredModels, setFilteredModels] = useState<TenantModel[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filterSource, setFilterSource] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all'); // 改为公开状态筛选
  const [filterInference, setFilterInference] = useState<string>('all');

  // 获取模型列表
  const fetchModels = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockModels: TenantModel[] = [
        {
          id: 'tenant-qwen2-72b',
          modelId: 'qwen2-72b-instruct',
          displayName: '通义千问2-72B-指令微调',
          description: '阿里达摩院自研的720亿参数大规模语言模型，在代码、数学、推理多个领域表现优异。',
          author: '阿里达摩院',
          avatar: '🤖',
          source: 'ModelScope' as const,
          framework: 'PyTorch',
          parameterCount: '72B',
          license: 'apache-2.0',
          contextWindow: 32768,
          tags: ['通用', '代码', '金融', '推理'],
          category: '大语言模型',
          isVisible: true,
          canPresetInference: true,
          deploymentStatus: 'running' as const,
          instanceType: '2 * NVIDIA A100 (80G)',
          deploymentCount: 15,
          totalRequests: 125000,
          averageRating: 4.8,
          importTime: '2024-01-15 14:30:00',
          lastUsedTime: '2024-01-25 16:45:00',
          tokenBillingEnabled: true,
          inputTokenPrice: 0.12,
          outputTokenPrice: 0.12
        },
        {
          id: 'tenant-qwen2-7b',
          modelId: 'qwen2-7b-instruct',
          displayName: '通义千问2-7B-指令微调',
          description: '轻量级版本的通义千问模型，在保持优秀性能的同时大幅降低了计算资源需求。',
          author: '阿里达摩院',
          avatar: '🤖',
          source: 'ModelScope' as const,
          framework: 'PyTorch',
          parameterCount: '7B',
          license: 'apache-2.0',
          contextWindow: 32768,
          tags: ['通用', '代码', '轻量级'],
          category: '大语言模型',
          isVisible: true,
          canPresetInference: true,
          deploymentStatus: 'running' as const,
          instanceType: '1 * NVIDIA A100 (80G)',
          deploymentCount: 8,
          totalRequests: 89000,
          averageRating: 4.6,
          importTime: '2024-01-10 09:15:00',
          lastUsedTime: '2024-01-25 18:20:00',
          tokenBillingEnabled: true,
          inputTokenPrice: 0.08,
          outputTokenPrice: 0.08
        },
        {
          id: 'tenant-deepseek-r1',
          modelId: 'deepseek-r1',
          displayName: 'DeepSeek-R1',
          description: 'DeepSeek推出的具有强大推理能力的大语言模型，在数学和科学研究领域表现突出。',
          author: 'DeepSeek',
          avatar: '🧠',
          source: 'HuggingFace' as const,
          framework: 'PyTorch',
          parameterCount: '70B',
          license: 'mit',
          contextWindow: 65536,
          tags: ['通用', '科学研究', '推理', '数学'],
          category: '大语言模型',
          isVisible: false,
          canPresetInference: true,
          deploymentStatus: 'stopped' as const,
          deploymentCount: 0,
          totalRequests: 0,
          averageRating: 4.7,
          importTime: '2024-01-20 11:00:00',
          tokenBillingEnabled: true,
          inputTokenPrice: 0.15,
          outputTokenPrice: 0.15
        },
        {
          id: 'tenant-stable-diffusion-xl',
          modelId: 'stable-diffusion-xl',
          displayName: 'Stable Diffusion XL',
          description: '高质量图像生成模型，支持1024x1024分辨率图像生成，在艺术创作领域广受好评。',
          author: 'Stability AI',
          avatar: '🎨',
          source: 'HuggingFace' as const,
          framework: 'Diffusers',
          parameterCount: '3.5B',
          license: 'openrail',
          contextWindow: 77,
          tags: ['图像生成', '艺术创作', '高分辨率'],
          category: '图像生成',
          isVisible: true,
          canPresetInference: false,
          deploymentStatus: 'running' as const,
          instanceType: '1 * NVIDIA A100 (80G)',
          deploymentCount: 3,
          totalRequests: 15600,
          averageRating: 4.9,
          importTime: '2024-01-12 16:20:00',
          lastUsedTime: '2024-01-24 14:30:00',
          tokenBillingEnabled: false
        },
        {
          id: 'tenant-whisper-large-v3',
          modelId: 'whisper-large-v3',
          displayName: 'Whisper Large V3',
          description: 'OpenAI开发的多语言语音识别模型，支持99种语言，在语音转文字领域表现卓越。',
          author: 'OpenAI',
          avatar: '🎤',
          source: 'HuggingFace' as const,
          framework: 'PyTorch',
          parameterCount: '1.55B',
          license: 'mit',
          contextWindow: 30,
          tags: ['语音识别', '多语言', '转录'],
          category: '语音识别',
          isVisible: false,
          canPresetInference: false,
          deploymentStatus: 'stopped' as const,
          deploymentCount: 0,
          totalRequests: 0,
          averageRating: 4.6,
          importTime: '2024-01-05 13:45:00',
          tokenBillingEnabled: false
        }
      ];
      
      setModels(mockModels);
      setFilteredModels(mockModels);
    } catch (error) {
      message.error('获取模型列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  // 筛选逻辑
  useEffect(() => {
    let filtered = models;
    
    // 搜索筛选
    if (searchText) {
      filtered = filtered.filter(model => 
        model.displayName.toLowerCase().includes(searchText.toLowerCase()) ||
        model.modelId.toLowerCase().includes(searchText.toLowerCase()) ||
        model.author.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    // 来源筛选
    if (filterSource !== 'all') {
      filtered = filtered.filter(model => model.source === filterSource);
    }
    
    // 公开状态筛选
    if (filterStatus !== 'all') {
      if (filterStatus === 'running') { // 这里用running表示公开
        filtered = filtered.filter(model => model.isVisible);
      } else if (filterStatus === 'stopped') { // 这里用stopped表示未公开
        filtered = filtered.filter(model => !model.isVisible);
      }
    }
    
    setFilteredModels(filtered);
  }, [models, searchText, filterSource, filterStatus]);

  // 切换推理状态
  const toggleInference = async (modelId: string, enabled: boolean) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setModels(prev => prev.map(model => 
        model.id === modelId 
          ? { 
              ...model, 
              inferenceEnabled: enabled,
              deploymentStatus: enabled ? 'deploying' as const : 'stopped' as const
            }
          : model
      ));
      
      message.success(`${enabled ? '启用' : '禁用'}推理成功`);
      
      // 模拟部署过程
      if (enabled) {
        setTimeout(() => {
          setModels(prev => prev.map(model => 
            model.id === modelId 
              ? { ...model, deploymentStatus: 'running' as const }
              : model
          ));
        }, 3000);
      }
    } catch (error) {
      message.error('操作失败，请重试');
    }
  };

  // 删除模型
  const deleteModel = async (modelId: string) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setModels(prev => prev.filter(model => model.id !== modelId));
      message.success('删除模型成功');
    } catch (error) {
      message.error('删除失败，请重试');
    }
  };

  // 切换模型可见性（上线/下线）
  const toggleModelVisibility = async (modelId: string, visible: boolean) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setModels(prev => prev.map(model => 
        model.id === modelId 
          ? { ...model, isVisible: visible }
          : model
      ));
      
      message.success(`${visible ? '上线' : '下线'}模型成功`);
    } catch (error) {
      message.error('操作失败，请重试');
    }
  };

  // 获取状态标签
  const getStatusTag = (status: string) => {
    const statusConfig = {
      running: { color: 'green', text: '运行中' },
      stopped: { color: 'default', text: '已停止' },
      deploying: { color: 'blue', text: '部署中' },
      error: { color: 'red', text: '错误' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.stopped;
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 表格列配置
  const columns: ColumnsType<TenantModel> = [
    {
      title: '模型信息',
      dataIndex: 'displayName',
      width: 300,
      render: (text: string, record: TenantModel) => (
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <Avatar 
            size={48} 
            style={{ 
              backgroundColor: '#1890ff',
              marginRight: 12,
              flexShrink: 0
            }}
          >
            {record.avatar || record.author.charAt(0)}
          </Avatar>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 500, marginBottom: 4 }}>
              {text}
            </div>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
              {record.modelId} • {record.author}
            </div>
            <div style={{ fontSize: 12, color: '#999', marginBottom: 8 }}>
              {record.description.length > 60 
                ? `${record.description.substring(0, 60)}...` 
                : record.description
              }
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Tag color={record.source === 'ModelScope' ? 'blue' : record.source === 'HuggingFace' ? 'green' : 'orange'}>
                {record.source}
              </Tag>
              <Tag>{record.category}</Tag>
              <Text strong style={{ fontSize: 12 }}>{record.parameterCount}</Text>
            </div>
          </div>
        </div>
      )
    },
    {
      title: '公开状态',
      dataIndex: 'isVisible',
      width: 120,
      render: (isVisible: boolean, record: TenantModel) => (
        <div>
          <div style={{ marginBottom: 8 }}>
            <Tag color={isVisible ? 'green' : 'default'}>
              {isVisible ? '公开' : '未公开'}
            </Tag>
          </div>
          {/* 去掉预制推理显示 */}
          {/* <div>
            <span style={{ fontSize: 12, color: '#666', marginRight: 8 }}>预制推理:</span>
            <Tag color={record.canPresetInference ? 'blue' : 'default'}>
              {record.canPresetInference ? '支持' : '不支持'}
            </Tag>
          </div> */}
        </div>
      )
    },
    {
      title: '使用统计',
      dataIndex: 'totalRequests',
      width: 150,
      render: (requests: number, record: TenantModel) => (
        <div>
          <div style={{ marginBottom: 4 }}>
            <Text strong>{requests.toLocaleString()}</Text>
            <Text type="secondary" style={{ fontSize: 12, marginLeft: 4 }}>次调用</Text>
          </div>
          <div style={{ marginBottom: 4 }}>
            <Text strong>{record.deploymentCount}</Text>
            <Text type="secondary" style={{ fontSize: 12, marginLeft: 4 }}>个部署</Text>
          </div>
          {/* 去掉评分显示 */}
          {/* <div style={{ display: 'flex', alignItems: 'center' }}>
            <Text style={{ fontSize: 12, marginRight: 4 }}>评分:</Text>
            <Text strong style={{ fontSize: 12 }}>{record.averageRating}</Text>
          </div> */}
        </div>
      )
    },
    {
      title: '计费信息',
      dataIndex: 'tokenBillingEnabled',
      width: 120,
      render: (enabled: boolean, record: TenantModel) => (
        <div>
          {enabled ? (
            <div>
              <div style={{ fontSize: 12, marginBottom: 2 }}>
                <Text>输入: ¥{record.inputTokenPrice}/千tokens</Text>
              </div>
              <div style={{ fontSize: 12 }}>
                <Text>输出: ¥{record.outputTokenPrice}/千tokens</Text>
              </div>
            </div>
          ) : (
            <Tag>免费使用</Tag>
          )}
        </div>
      )
    },
    {
      title: '导入时间',
      dataIndex: 'importTime',
      width: 120,
      render: (time: string, record: TenantModel) => (
        <div>
          <div style={{ fontSize: 12, marginBottom: 2 }}>
            {time.split(' ')[0]}
          </div>
          <div style={{ fontSize: 12, color: '#666' }}>
            {time.split(' ')[1]}
          </div>
          {record.lastUsedTime && (
            <div style={{ fontSize: 10, color: '#999', marginTop: 4 }}>
              最近使用: {record.lastUsedTime.split(' ')[0]}
            </div>
          )}
        </div>
      )
    },
    {
      title: '操作',
      key: 'actions',
      width: 150,
      render: (_, record: TenantModel) => (
        <Space direction="vertical" size="small">
          <Space size="small">
            <Tooltip title="查看详情">
              <Button 
                type="text" 
                size="small" 
                icon={<EyeOutlined />}
                onClick={() => navigate(`/model/${record.modelId}`)}
              />
            </Tooltip>
            <Tooltip title="编辑模型">
              <Button 
                type="text" 
                size="small" 
                icon={<EditOutlined />}
                onClick={() => navigate(`/management/edit/${record.id}`)}
              />
            </Tooltip>
            {/* 去掉推理设置按钮 */}
            {/* <Tooltip title="推理设置">
              <Button 
                type="text" 
                size="small" 
                icon={<SettingOutlined />}
                disabled={!record.canPresetInference}
                onClick={() => navigate(`/management/inference/${record.id}`)}
              />
            </Tooltip> */}
          </Space>
          <Space size="small">
            {/* 未公开模型显示上线按钮 */}
            {!record.isVisible && (
              <Tooltip title="上线模型">
                <Button 
                  type="text" 
                  size="small" 
                  icon={<PlayCircleOutlined />}
                  onClick={() => toggleModelVisibility(record.id, true)}
                />
              </Tooltip>
            )}
            {/* 只有未公开的模型才显示删除按钮 */}
            {!record.isVisible && (
              <Popconfirm
                title="确定删除此模型？"
                description="删除后将无法恢复，请谨慎操作。"
                onConfirm={() => deleteModel(record.id)}
                okText="确定"
                cancelText="取消"
              >
                <Tooltip title="删除模型">
                  <Button 
                    type="text" 
                    size="small" 
                    danger
                    icon={<DeleteOutlined />}
                  />
                </Tooltip>
              </Popconfirm>
            )}
          </Space>
        </Space>
      )
    }
  ];

  // 统计数据
  const stats = {
    total: models.length,
    running: models.filter(m => m.deploymentStatus === 'running').length,
    visible: models.filter(m => m.isVisible).length, // 修复：使用 isVisible 替代 inferenceEnabled
    presetInference: models.filter(m => m.canPresetInference).length
  };

  return (
    <div className="model-list-container">
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic 
              title="总模型数" 
              value={stats.total} 
              prefix={<CloudServerOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic 
              title="公开模型" 
              value={stats.visible} 
              prefix={<RobotOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic 
              title="可预置推理" 
              value={stats.presetInference} 
              prefix={<SettingOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 筛选和搜索 */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col span={8}>
            <Search
              placeholder="搜索模型名称、ID或作者"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={6}>
            <Select
              value={filterSource}
              onChange={setFilterSource}
              style={{ width: '100%' }}
              placeholder="来源筛选"
            >
              <Option value="all">全部来源</Option>
              <Option value="ModelScope">ModelScope</Option>
              <Option value="HuggingFace">HuggingFace</Option>
              <Option value="启智平台">启智平台</Option>
            </Select>
          </Col>

          <Col span={6}>
            <Select
              value={filterStatus}
              onChange={setFilterStatus}
              style={{ width: '100%' }}
              placeholder="状态筛选"
            >
              <Option value="all">全部状态</Option>
              <Option value="running">公开</Option>
              <Option value="stopped">未公开</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => navigate('/management/add')}
              block
            >
              录入模型
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 模型列表 */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredModels}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`
          }}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
};

export default ModelList;

