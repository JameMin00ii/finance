import { useState } from "react";
import { Form, Input, Button, Checkbox, Card, Alert, Typography, Layout, Space } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import axios from "axios";
import { Link } from "react-router-dom";

// ดึง Component ย่อยจาก Layout
const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

export default function LoginScreen({ onLoginSuccess }) {
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState(null);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      setErrMsg(null);

      const response = await axios.post("/api/auth/local", {
        identifier: values.username,
        password: values.password,
      });

      const token = response.data.jwt;
      const user = response.data.user;

      onLoginSuccess(token, user, values.remember);

    } catch (err) {
      console.error(err);
      setErrMsg("ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      
      {/* 1. Header: แถบด้านบน ใส่โลโก้ชื่อแอพ */}
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        backgroundColor: '#001529', // สีเดียวกับหน้า Dashboard
        padding: '0 50px'
      }}>
        <Space size="small">
            <Text strong style={{ fontSize: '20px', color: 'white' }}>
               Finance App
            </Text>
        </Space>
      </Header>

      {/* 2. Content: พื้นที่ตรงกลาง ใส่พื้นหลังสีเทาอ่อน */}
      <Content style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#f0f2f5' // สีเทาอ่อน (Standard PC App)
      }}>
        
        {/* Card ลอยเด่นตรงกลาง */}
        <Card
          style={{ 
            width: 400, 
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)", // เงาฟุ้งๆ ดูมีมิติ
            borderRadius: "8px"
          }}
          bordered={false}
        >
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <Title level={3}>ยินดีต้อนรับกลับ!</Title>
            <Text type="secondary">กรุณาเข้าสู่ระบบเพื่อจัดการการเงินของคุณ</Text>
          </div>

          {errMsg && (
            <Alert
              message={errMsg}
              type="error"
              showIcon
              style={{ marginBottom: 24 }}
            />
          )}

          <Form
            name="login_form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              label="Username / Email"
              name="username"
              rules={[{ required: true, message: "กรุณากรอกข้อมูล" }]}
            >
              <Input prefix={<UserOutlined />} placeholder="กรอกชื่อผู้ใช้" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "กรุณากรอกรหัสผ่าน" }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="กรอกรหัสผ่าน" />
            </Form.Item>

            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>จดจำฉันไว้ในเครื่องนี้</Checkbox>
              </Form.Item>
            </Form.Item>

            <Form.Item style={{ marginBottom: 10 }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                icon={<LoginOutlined />}
              >
                เข้าสู่ระบบ
              </Button>
            </Form.Item>

            <div style={{ textAlign: "center" }}>
              <Text type="secondary">ยังไม่มีบัญชี? </Text>
              <Link to="/register">สมัครสมาชิกฟรี</Link>
            </div>
          </Form>
        </Card>
      </Content>

      {/* 3. Footer: ลิขสิทธิ์ด้านล่าง */}
      <Footer style={{ textAlign: 'center', backgroundColor: '#f0f2f5' }}>
        Finance App ©{new Date().getFullYear()} Created by Jetsada <br/>
        <Text type="secondary" style={{ fontSize: '12px' }}>Secure Login System</Text>
      </Footer>

    </Layout>
  );
}