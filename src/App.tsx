import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { AppstoreOutlined, HeartOutlined, UserOutlined, RocketOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons';
import ModelSquare from './pages/ModelSquare';
import ModelDetail from './pages/ModelDetail/index';
import QuickExperience from './pages/QuickExperience';
import ModelDeploy from './pages/ModelDeploy';
import OnlineInference from './pages/OnlineInference';
import OnlineInferenceDetail from './pages/OnlineInference/detail';
import ModelManagement from './pages/ModelManagement';
import ModelAdd from './pages/ModelManagement/ModelAdd';
import './App.css';

const { Header, Sider, Content } = Layout;

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Header className="app-header">
          <div className="logo">模型广场</div>
        </Header>
        
        <Layout>
          <Sider width={200} className="app-sider">
            <Menu
              mode="inline"
              defaultSelectedKeys={['models']}
              style={{ height: '100%', borderRight: 0 }}
              items={[
                {
                  key: 'models',
                  icon: <AppstoreOutlined />,
                  label: <Link to="/">模型广场</Link>
                },
                {
                  key: 'deploy',
                  icon: <PlusOutlined />,
                  label: '新建服务',
                  children: [
                    {
                      key: 'online-inference',
                      icon: <RocketOutlined />,
                      label: <Link to="/deploy">在线推理</Link>
                    }
                  ]
                },
                {
                  key: 'inference-list',
                  icon: <RocketOutlined />,
                  label: <Link to="/inference">在线推理</Link>
                },
                {
                  key: 'management',
                  icon: <SettingOutlined />,
                  label: <Link to="/management">模型管理</Link>
                },
                {
                  key: 'my-models',
                  icon: <UserOutlined />,
                  label: '我的模型'
                },
                {
                  key: 'favorites',
                  icon: <HeartOutlined />,
                  label: '收藏模型'
                },
                {
                  key: 'experience',
                  label: <Link to="/experience">快速体验</Link>
                }
              ]}
            />
          </Sider>
          
          <Content>
            <Routes>
              <Route path="/" element={<ModelSquare />} />
              <Route path="/model/:id" element={<ModelDetail />} />
              <Route path="/experience" element={<QuickExperience />} />
              <Route path="/deploy" element={<ModelDeploy />} />
              <Route path="/deploy/:modelId" element={<ModelDeploy />} />
              <Route path="/inference" element={<OnlineInference />} />
              <Route path="/inference/:id" element={<OnlineInferenceDetail />} />
              <Route path="/management" element={<ModelManagement />} />
              <Route path="/management/add" element={<ModelAdd />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;
