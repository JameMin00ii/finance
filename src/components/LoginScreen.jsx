import { useState } from "react";
import { Form, Input, Button, Typography, Alert, Checkbox } from "antd";
import axios from "axios";
import { Link } from "react-router-dom";

const { Title } = Typography;

export default function LoginScreen({ onLoginSuccess }) {
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState(null);
  const [form] = Form.useForm();
  const remember = Form.useWatch('remember', form);
  console.log('test', remember)

  const onFinish = async (values) => {
    try {
      setLoading(true);
      setErrMsg(null);

      const response = await axios.post("/api/auth/local", {
        identifier: values.identifier,
        password: values.password,
      });

      const token = response.data.jwt;   // string JWT
      const user = response.data.user;   // object user

      onLoginSuccess(token, user, remember);

    } catch (err) {
      console.error(err);
      setErrMsg("เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบอีเมลหรือรหัสผ่าน");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", textAlign: "left" }}>
      <Title level={3} style={{ color: "white" }}>เข้าสู่ระบบ</Title>

      {errMsg && (
        <Alert
          type="error"
          message="ผิดพลาด"
          description={errMsg}
          style={{ marginBottom: 16 }}
        />
      )}

      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          label="อีเมล หรือ Username (identifier)"
          name="identifier"
          rules={[{ required: true, message: "กรุณากรอก" }]}
        >
          <Input placeholder="เช่น user@test.com" />
        </Form.Item>

        <Form.Item
          label="รหัสผ่าน"
          name="password"
          rules={[{ required: true, message: "กรุณากรอกรหัสผ่าน" }]}
        >
          <Input.Password placeholder="รหัสผ่าน" />
        </Form.Item>

        {/* Remember Me */}
        <Form.Item name="remember" valuePropName="checked" initialValue={true}>
          <Checkbox style={{ color: "white" }}> จดจำฉัน </Checkbox>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
          >
            เข้าสู่ระบบ
          </Button>
        </Form.Item>
        <div className="switch-auth">
          <p>ยังไม่มีบัญชี? <Link to="/register">สมัครสมาชิกที่นี่</Link></p>
        </div>
      </Form>
    </div>
  );
}
