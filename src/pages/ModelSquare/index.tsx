import React, { useState, useEffect } from 'react';
import { Layout, Card, Input, Select, Button, Rate, Tag, Pagination, Spin, Modal, message } from 'antd';
import { SearchOutlined, EyeOutlined, RocketOutlined, ExperimentOutlined, StarOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './index.css';

const { Content, Sider } = Layout;
const { Search } = Input;
const { Option } = Select;

interface ModelItem {
  id: string;
  name: string;
  displayName: string;
  description: string;
  provider: string;
  modelSource: '平台严选' | '用户发布';
  applicationDomain: string[];
  modelType: string[];
  framework: string;
  parameterCount: string;
  contextWindow: number;
  averageRating: number;
  ratingCount: number;
  ratingDistribution: { [key: number]: number };
  deploymentCount: number;
  lastUpdated: string;
  supportTokenBilling: boolean;
  inputTokenPrice?: number;
  outputTokenPrice?: number;
  userRating?: number;
}

interface RatingModalData {
  modelId: string;
  modelName: string;
  currentRating: number;
}

const ModelSquare: React.FC = () => {
  const navigate = useNavigate();

  const [models, setModels] = useState<ModelItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState<{
    modelSource: string[];
    modelType: string[];
    framework: string[];
    contextLength: string[];
  }>({
    modelSource: [],
    modelType: [],
    framework: [],
    contextLength: []
  });
  const [sortBy, setSortBy] = useState('热门程度');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [ratingModalData, setRatingModalData] = useState<RatingModalData | null>(null);
  const [userRating, setUserRating] = useState(0);

  // 模拟数据
  useEffect(() => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      const mockData: ModelItem[] = [
        {
          id: '1788e248-1c4e-471b-84e6-04fcc3e5e396',
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
          averageRating: 4.8,
          ratingCount: 256,
          ratingDistribution: { 5: 180, 4: 50, 3: 20, 2: 4, 1: 2 },
          deploymentCount: 128,
          lastUpdated: '2025-01-15',
          supportTokenBilling: true,
          inputTokenPrice: 0.12,
          outputTokenPrice: 0.12
        },
        {
          id: '2788e248-1c4e-471b-84e6-04fcc3e5e397',
          name: 'deepseek-v3',
          displayName: 'DeepSeek-V3',
          description: 'DeepSeek自研的高性能大语言模型，在代码生成和推理方面表现优异',
          provider: 'DeepSeek',
          modelSource: '平台严选',
          applicationDomain: ['通用', '代码'],
          modelType: ['大语言模型', '代码生成'],
          framework: 'PyTorch',
          parameterCount: '67B',
          contextWindow: 65536,
          averageRating: 4.7,
          ratingCount: 189,
          ratingDistribution: { 5: 120, 4: 45, 3: 18, 2: 4, 1: 2 },
          deploymentCount: 95,
          lastUpdated: '2025-01-14',
          supportTokenBilling: true,
          inputTokenPrice: 0.10,
          outputTokenPrice: 0.15
        },
        {
          id: '3788e248-1c4e-471b-84e6-04fcc3e5e398',
          name: 'llama3-8b',
          displayName: 'Llama 3-8B',
          description: 'Meta开源的80亿参数语言模型，在多项基准测试中表现出色',
          provider: 'Meta',
          modelSource: '用户发布',
          applicationDomain: ['通用'],
          modelType: ['大语言模型', '文本生成'],
          framework: 'Transformers',
          parameterCount: '8B',
          contextWindow: 8192,
          averageRating: 4.5,
          ratingCount: 342,
          ratingDistribution: { 5: 180, 4: 95, 3: 45, 2: 15, 1: 7 },
          deploymentCount: 256,
          lastUpdated: '2025-01-13',
          supportTokenBilling: false
        }
      ];
      setModels(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const handleModelClick = (modelId: string) => {
    navigate(`/model/${modelId}`);
  };

  const handleQuickDeploy = (e: React.MouseEvent, modelId: string) => {
    e.stopPropagation();
    navigate(`/deploy/${modelId}?quick=true`);
  };

  const handleRateModel = (e: React.MouseEvent, model: ModelItem) => {
    e.stopPropagation();
    setRatingModalData({
      modelId: model.id,
      modelName: model.displayName,
      currentRating: model.userRating || 0
    });
    setUserRating(model.userRating || 0);
    setRatingModalVisible(true);
  };

  const handleRatingSubmit = () => {
    if (!ratingModalData || userRating === 0) {
      message.warning('请选择评分');
      return;
    }

    // 更新模型评分
    setModels(prevModels => 
      prevModels.map(model => {
        if (model.id === ratingModalData.modelId) {
          const oldUserRating = model.userRating || 0;
          const newRatingCount = oldUserRating === 0 ? model.ratingCount + 1 : model.ratingCount;
          
          // 更新评分分布
          const newDistribution = { ...model.ratingDistribution };
          if (oldUserRating > 0) {
            newDistribution[oldUserRating] = Math.max(0, newDistribution[oldUserRating] - 1);
          }
          newDistribution[userRating] = (newDistribution[userRating] || 0) + 1;
          
          // 计算新的平均评分
          const totalScore = Object.entries(newDistribution).reduce(
            (sum, [rating, count]) => sum + parseInt(rating) * count, 0
          );
          const newAverageRating = totalScore / newRatingCount;
          
          return {
            ...model,
            averageRating: Math.round(newAverageRating * 10) / 10,
            ratingCount: newRatingCount,
            ratingDistribution: newDistribution,
            userRating: userRating
          };
        }
        return model;
      })
    );

    message.success('评价提交成功！');
    setRatingModalVisible(false);
    setRatingModalData(null);
    setUserRating(0);
  };

  const handleRatingCancel = () => {
    setRatingModalVisible(false);
    setRatingModalData(null);
    setUserRating(0);
  };

  const renderModelCard = (model: ModelItem) => (
    <Card
      key={model.id}
      className="model-card"
      hoverable
      onClick={() => handleModelClick(model.id)}
      actions={[
        <Button type="link" icon={<EyeOutlined />}>查看详情</Button>,
        <Button type="primary" icon={<RocketOutlined />}>快速体验</Button>,
        <Button 
           type="default" 
           icon={<PlayCircleOutlined />}
           onClick={(e) => handleQuickDeploy(e, model.id)}
         >
           一键推理
         </Button>
      ]}
    >
      <div className="model-card-header">
        <div className="model-title">
          <h3>{model.displayName}</h3>
          <Tag color={model.modelSource === '平台严选' ? 'blue' : 'green'}>
            {model.modelSource}
          </Tag>
        </div>
        <div className="model-rating">
          <Rate disabled defaultValue={model.averageRating} allowHalf />
          <span className="rating-text">({model.averageRating}) {model.ratingCount}人评价</span>
          {model.userRating && (
            <span className="user-rating-indicator">已评价: {model.userRating}星</span>
          )}
          <Button 
            type="text" 
            size="small"
            icon={<StarOutlined />}
            onClick={(e) => handleRateModel(e, model)}
            className="rating-button"
          >
            {model.userRating ? '修改评价' : '评价模型'}
          </Button>
        </div>
      </div>
      
      <div className="model-info">
        <p className="model-description">{model.description}</p>
        
        <div className="model-tags">
          {model.modelType.map(type => (
            <Tag key={type}>{type}</Tag>
          ))}
          <Tag>{model.parameterCount}</Tag>
          <Tag>{model.framework}</Tag>
        </div>
        
        <div className="model-stats">
          <span>部署量: {model.deploymentCount}</span>
          <span>上下文: {model.contextWindow.toLocaleString()}</span>
          {model.supportTokenBilling && (
            <span>Token计费: ¥{model.inputTokenPrice}/1K</span>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <Layout className="model-square-layout">
      <Sider width={280} className="filter-sider">
        <div className="filter-section">
          <h4>模型来源</h4>
          <Select
            mode="multiple"
            placeholder="选择模型来源"
            style={{ width: '100%' }}
            onChange={(value: string[]) => setFilters({...filters, modelSource: value})}
          >
            <Option value="平台严选">平台严选</Option>
            <Option value="用户发布">用户发布</Option>
          </Select>
        </div>
        
        <div className="filter-section">
          <h4>模型类型</h4>
          <Select
            mode="multiple"
            placeholder="选择模型类型"
            style={{ width: '100%' }}
            onChange={(value: string[]) => setFilters({...filters, modelType: value})}
          >
            <Option value="大语言模型">大语言模型</Option>
            <Option value="文本生成">文本生成</Option>
            <Option value="代码生成">代码生成</Option>
            <Option value="多模态">多模态</Option>
          </Select>
        </div>
        
        <div className="filter-section">
          <h4>技术框架</h4>
          <Select
            mode="multiple"
            placeholder="选择框架"
            style={{ width: '100%' }}
            onChange={(value: string[]) => setFilters({...filters, framework: value})}
          >
            <Option value="PyTorch">PyTorch</Option>
            <Option value="TensorFlow">TensorFlow</Option>
            <Option value="Transformers">Transformers</Option>
          </Select>
        </div>
        
        <div className="filter-section">
          <h4>上下文长度</h4>
          <Select
            mode="multiple"
            placeholder="选择上下文长度"
            style={{ width: '100%' }}
            onChange={(value: string[]) => setFilters({...filters, contextLength: value})}
          >
            <Option value="16K以下">16K以下</Option>
            <Option value="16K-64K">16K-64K</Option>
            <Option value="64K以上">64K以上</Option>
          </Select>
        </div>
      </Sider>
      
      <Content className="main-content">
        <div className="content-header">
          <div className="search-bar">
            <Search
              placeholder="搜索模型名称、类型、标签..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              value={searchText}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value)}
            />
          </div>
          
          <div className="header-actions">
            <Button 
              type="primary" 
              icon={<ExperimentOutlined />}
              onClick={() => navigate('/experience')}
              style={{ marginRight: 16 }}
            >
              快速体验
            </Button>
            <Select
              value={sortBy}
              onChange={setSortBy}
              style={{ width: 120 }}
            >
              <Option value="热门程度">热门程度</Option>
              <Option value="最新发布">最新发布</Option>
              <Option value="最高评分">最高评分</Option>
            </Select>
          </div>
        </div>
        
        <div className="recommended-section">
          <h3>精选推荐</h3>
          <div className="recommended-models">
            {/* 推荐模型展示 */}
          </div>
        </div>
        
        <Spin spinning={loading}>
          <div className="models-grid">
            {models.map(renderModelCard)}
          </div>
        </Spin>
        
        <div className="pagination-wrapper">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={models.length}
            onChange={setCurrentPage}
            showSizeChanger={false}
            showQuickJumper
            showTotal={(total: number, range: [number, number]) => 
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
            }
          />
        </div>
      </Content>
      
      <Modal
        title={`评价模型: ${ratingModalData?.modelName}`}
        open={ratingModalVisible}
        onOk={handleRatingSubmit}
        onCancel={handleRatingCancel}
        okText="提交评价"
        cancelText="取消"
        width={500}
      >
        <div className="rating-modal-content">
          <div className="rating-section">
            <h4>请为这个模型打分：</h4>
            <div className="rating-stars">
              <Rate 
                value={userRating} 
                onChange={setUserRating}
                style={{ fontSize: '32px' }}
              />
            </div>
            <div className="rating-labels">
              <span>1星: 很差</span>
              <span>2星: 较差</span>
              <span>3星: 一般</span>
              <span>4星: 良好</span>
              <span>5星: 优秀</span>
            </div>
          </div>
          
          {ratingModalData && (
            <div className="current-stats">
              <h4>当前评价统计：</h4>
              <div className="rating-distribution">
                {[5, 4, 3, 2, 1].map(star => {
                  const model = models.find(m => m.id === ratingModalData.modelId);
                  const count = model?.ratingDistribution[star] || 0;
                  const percentage = model ? (count / model.ratingCount * 100).toFixed(1) : '0';
                  return (
                    <div key={star} className="rating-bar">
                      <span className="star-label">{star}星</span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="count-label">{count}人 ({percentage}%)</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </Layout>
  );
};

export default ModelSquare;