import React, { useState, useEffect } from 'react';
import {
  Layout,
  Table,
  Button,
  Tag,
  Space,
  Input,
  Select,
  Card,
  Tooltip,
  Modal,
  message,
  Dropdown,
  Menu
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  MoreOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './index.css';

const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;

interface InferenceService {
  id: string;
  modelName: string;
  status: 'running' | 'stopped' | 'deploying' | 'error';
  projectName: string;
  billingType: string;
  inputTokenPrice: number;
  outputTokenPrice: number;
  rpmLimit: number;
  tpmLimit: number;
  createTime: string;
  lastCallTime?: string;
  totalCalls: number;
  totalTokens: number;
}

const OnlineInference: React.FC = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<InferenceService[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      const mockServices: InferenceService[] = [
        {
          id: 'qwen-sft-7b-0.0.1-1',
          modelName: 'qwen-sft-7b-0.0.1',
          status: 'running',
          projectName: 'projectname',
          billingType: '按Token计费',
          inputTokenPrice: 0.002,
          outputTokenPrice: 0.004,
          rpmLimit: 900,
          tpmLimit: 300000,
          createTime: '2024-01-15 10:30:00',
          lastCallTime: '2024-01-15 15:20:00',
          totalCalls: 1250,
          totalTokens: 45000
        },
        {
          id: 'qwen-sft-7b-0.0.1-2',
          modelName: 'qwen-sft-7b-0.0.1',
          status: 'running',
          projectName: 'projectname',
          billingType: '按Token计费',
          inputTokenPrice: 0.002,
          outputTokenPrice: 0.004,
          rpmLimit: 900,
          tpmLimit: 300000,
          createTime: '2024-01-14 09:15:00',
          lastCallTime: '2024-01-15 14:45:00',
          totalCalls: 890,
          totalTokens: 32000
        },
        {
          id: 'qwen-sft-7b-0.0.1-3',
          modelName: 'qwen-sft-7b-0.0.1',
          status: 'stopped',
          projectName: 'projectname',
          billingType: '按Token计费',
          inputTokenPrice: 0.002,
          outputTokenPrice: 0.004,
          rpmLimit: 900,
          tpmLimit: 300000,
          createTime: '2024-01-13 16:20:00',
          lastCallTime: '2024-01-14 11:30:00',
          totalCalls: 456,
          totalTokens: 18000
        }
      ];
      setServices(mockServices);
      setLoading(false);
    }, 1000);
  };

  const handleServiceAction = (action: string, serviceId: string) => {
    switch (action) {
      case 'start':
        message.success('服务启动成功');
        break;
      case 'stop':
        message.success('服务停止成功');
        break;
      case 'delete':
        Modal.confirm({
          title: '确认删除',
          content: '删除后无法恢复，确定要删除这个推理服务吗？',
          onOk: () => {
            message.success('服务删除成功');
          }
        });
        break;
      case 'edit':
        navigate(`/inference/edit/${serviceId}`);
        break;
      case 'detail':
        navigate(`/inference/${serviceId}`);
        break;
    }
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

  const getActionMenu = (record: InferenceService) => (
    <Menu>
      <Menu.Item key="detail" icon={<EyeOutlined />} onClick={() => handleServiceAction('detail', record.id)}>
        详情
      </Menu.Item>
      <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => handleServiceAction('edit', record.id)}>
        修改
      </Menu.Item>
      {record.status === 'running' ? (
        <Menu.Item key="stop" icon={<PauseCircleOutlined />} onClick={() => handleServiceAction('stop', record.id)}>
          下线
        </Menu.Item>
      ) : (
        <Menu.Item key="start" icon={<PlayCircleOutlined />} onClick={() => handleServiceAction('start', record.id)}>
          上线
        </Menu.Item>
      )}
      <Menu.Divider />
      <Menu.Item key="delete" icon={<DeleteOutlined />} danger onClick={() => handleServiceAction('delete', record.id)}>
        删除
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: '模型名称',
      dataIndex: 'modelName',
      key: 'modelName',
      width: 200,
      render: (text: string, record: InferenceService) => (
        <div>
          <div className="model-name">{text}</div>
          <div className="service-id">ID: {record.id}</div>
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => getStatusTag(status)
    },
    {
      title: '所属项目',
      dataIndex: 'projectName',
      key: 'projectName',
      width: 150
    },
    {
      title: '计费方式',
      dataIndex: 'billingType',
      key: 'billingType',
      width: 120
    },
    {
      title: '计费信息',
      key: 'pricing',
      width: 200,
      render: (record: InferenceService) => (
        <div className="pricing-info">
          <div>输入 {record.inputTokenPrice} 元/千Tokens</div>
          <div>输出 {record.outputTokenPrice} 元/千Tokens</div>
        </div>
      )
    },
    {
      title: (
        <span>
          服务调用限制
          <Tooltip title="RPM: 每分钟请求数限制\nTPM: 每分钟Token数限制">
            <span style={{ marginLeft: 4, cursor: 'help' }}>ⓘ</span>
          </Tooltip>
        </span>
      ),
      key: 'limits',
      width: 150,
      render: (record: InferenceService) => (
        <div className="limits-info">
          <div>RPM {record.rpmLimit}</div>
          <div>TPM {record.tpmLimit}</div>
        </div>
      )
    },
    {
      title: '操作',
      key: 'actions',
      width: 120,
      render: (record: InferenceService) => (
        <Space>
          <Button type="link" onClick={() => handleServiceAction('detail', record.id)}>详情</Button>
          <Button type="link" onClick={() => handleServiceAction('edit', record.id)}>修改</Button>
          <Dropdown overlay={getActionMenu(record)} trigger={['click']}>
            <Button type="link" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      )
    }
  ];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.modelName.toLowerCase().includes(searchText.toLowerCase()) ||
                         service.projectName.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || service.status === statusFilter;
    const matchesProject = projectFilter === 'all' || service.projectName === projectFilter;
    return matchesSearch && matchesStatus && matchesProject;
  });

  return (
    <Layout className="online-inference-layout">
      <Content className="online-inference-content">
        <Card className="page-header-card">
          <div className="page-header">
            <div className="page-title">
              <h2>在线推理</h2>
              <p>管理您的在线推理服务</p>
            </div>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/deploy')}>
              新建推理
            </Button>
          </div>
        </Card>

        <Card className="filter-card">
          <div className="filter-section">
            <Space size="middle">
              <Search
                placeholder="搜索模型名称或项目名称"
                allowClear
                style={{ width: 300 }}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: 120 }}
                placeholder="状态筛选"
              >
                <Option value="all">全部状态</Option>
                <Option value="running">服务中</Option>
                <Option value="stopped">已下线</Option>
                <Option value="deploying">部署中</Option>
                <Option value="error">异常</Option>
              </Select>
              <Select
                value={projectFilter}
                onChange={setProjectFilter}
                style={{ width: 150 }}
                placeholder="项目筛选"
              >
                <Option value="all">全部项目</Option>
                <Option value="projectname">projectname</Option>
              </Select>
            </Space>
          </div>
        </Card>

        <Card className="table-card">
          <Table
            columns={columns}
            dataSource={filteredServices}
            rowKey="id"
            loading={loading}
            pagination={{
              total: filteredServices.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
            }}
          />
        </Card>
      </Content>
    </Layout>
  );
};

export default OnlineInference;