import React, { useState } from 'react';
import { Card, Input, Button, Row, Col, Typography, Avatar, Space } from 'antd';
import { SendOutlined, UserOutlined, RobotOutlined } from '@ant-design/icons';
import './index.css';

const { TextArea } = Input;
const { Title, Text } = Typography;

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ModelChat {
  modelId: string;
  modelName: string;
  messages: Message[];
  isLoading: boolean;
}

const QuickExperience: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [modelChats, setModelChats] = useState<ModelChat[]>([
    {
      modelId: 'gpt-4',
      modelName: 'GPT-4',
      messages: [],
      isLoading: false
    },
    {
      modelId: 'claude-3',
      modelName: 'Claude-3',
      messages: [],
      isLoading: false
    },
    {
      modelId: 'gemini-pro',
      modelName: 'Gemini Pro',
      messages: [],
      isLoading: false
    }
  ]);

  // 模拟API响应
  const mockResponses: { [key: string]: string[] } = {
    'gpt-4': [
      '我是GPT-4，一个由OpenAI开发的大型语言模型。我可以帮助您解答问题、进行对话、协助写作等多种任务。',
      '作为GPT-4，我具有强大的理解和生成能力，可以处理复杂的推理任务和创意写作。',
      '我基于Transformer架构，经过大量文本数据训练，能够理解上下文并生成连贯的回复。'
    ],
    'claude-3': [
      '您好！我是Claude-3，由Anthropic开发的AI助手。我致力于提供有用、无害且诚实的回复。',
      '作为Claude-3，我在安全性和可靠性方面有着特别的优化，能够拒绝有害请求并提供负责任的建议。',
      '我擅长分析、推理和创作，同时会谨慎处理敏感话题，确保对话的安全性。'
    ],
    'gemini-pro': [
      '我是Gemini Pro，Google开发的多模态AI模型。我可以处理文本、图像等多种类型的输入。',
      '作为Gemini Pro，我具备强大的多模态理解能力，可以同时处理和分析不同类型的信息。',
      'Gemini Pro在代码生成、数学推理和创意任务方面表现出色，能够提供准确和有用的回复。'
    ]
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputText,
      isUser: true,
      timestamp: new Date()
    };

    // 为所有模型添加用户消息
    setModelChats(prev => prev.map(chat => ({
      ...chat,
      messages: [...chat.messages, userMessage],
      isLoading: true
    })));

    setInputText('');

    // 模拟每个模型的响应
    setTimeout(() => {
      setModelChats(prev => prev.map(chat => {
        const responses = mockResponses[chat.modelId] || ['抱歉，我暂时无法回复。'];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const botMessage: Message = {
          id: (Date.now() + Math.random()).toString(),
          content: randomResponse,
          isUser: false,
          timestamp: new Date()
        };

        return {
          ...chat,
          messages: [...chat.messages, botMessage],
          isLoading: false
        };
      }));
    }, 1000 + Math.random() * 2000); // 随机延迟模拟真实响应时间
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearAllChats = () => {
    setModelChats(prev => prev.map(chat => ({
      ...chat,
      messages: [],
      isLoading: false
    })));
  };

  return (
    <div className="quick-experience">
      <div className="header">
        <Title level={2}>模型快速体验</Title>
        <Text type="secondary">同时对比多个AI模型的回复效果</Text>
      </div>

      <div className="input-section">
        <div className="input-container">
          <TextArea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="请输入您的问题，将同时发送给所有模型进行对比..."
            autoSize={{ minRows: 2, maxRows: 4 }}
            className="message-input"
          />
          <div className="input-actions">
            <Button onClick={clearAllChats} type="text">
              清空对话
            </Button>
            <Button 
              type="primary" 
              icon={<SendOutlined />}
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
            >
              发送
            </Button>
          </div>
        </div>
      </div>

      <Row gutter={[16, 16]} className="models-container">
        {modelChats.map((chat) => (
          <Col xs={24} lg={8} key={chat.modelId}>
            <Card 
              title={
                <Space>
                  <Avatar icon={<RobotOutlined />} size="small" />
                  <span>{chat.modelName}</span>
                </Space>
              }
              className="model-chat-card"
              bodyStyle={{ padding: 0 }}
            >
              <div className="chat-messages">
                {chat.messages.length === 0 ? (
                  <div className="empty-state">
                    <Text type="secondary">开始对话以查看 {chat.modelName} 的回复</Text>
                  </div>
                ) : (
                  chat.messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}
                    >
                      <div className="message-avatar">
                        <Avatar 
                          icon={message.isUser ? <UserOutlined /> : <RobotOutlined />} 
                          size="small"
                        />
                      </div>
                      <div className="message-content">
                        <div className="message-text">{message.content}</div>
                        <div className="message-time">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                {chat.isLoading && (
                  <div className="message bot-message">
                    <div className="message-avatar">
                      <Avatar icon={<RobotOutlined />} size="small" />
                    </div>
                    <div className="message-content">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default QuickExperience;