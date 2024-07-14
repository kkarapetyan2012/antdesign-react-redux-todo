import React, { ReactNode } from 'react';
import { Layout, Col, Row } from "antd";
import TodoForm from './TodoForm';
import Filter from './Filter';
import { Content } from 'antd/es/layout/layout';

interface MainLayoutProps {
  children?: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
    <Content>
      <Row justify="center" style={{ minHeight: '100vh' }}>
        <Col xs={24} sm={18} className="p-large m-middle mt-4">
          <TodoForm />
          <Filter />
          {children}
        </Col>
      </Row>
    </Content>
  </Layout>
  );
}

export default MainLayout;

