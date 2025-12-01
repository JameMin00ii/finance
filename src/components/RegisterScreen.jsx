import { useState } from "react";
import { Form, Input, Button, Typography, Alert } from "antd";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const { Title } = Typography;

export default function RegisterScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const URL_REGISTER = "/api/auth/local/register";

  const onFinish = async (values) => {
    try {
      setLoading(true);
      setError(null);

      // ส่งไปเฉพาะข้อมูลที่ Backend ต้องการ (ไม่ต้องส่ง confirm password ไป)
      await axios.post(URL_REGISTER, {
        username: values.username,
        email: values.email,
        password: values.password,
      });

      alert("สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ");
      navigate("/login");
      
    } catch (err) {
      console.error(err);
      const errorMessage =
        err.response?.data?.error?.message || "การสมัครสมาชิกขัดข้อง โปรดลองใหม่";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", textAlign: "left" }}>
      <Title level={3} style={{ color: "white" }}>สมัครสมาชิก</Title>

      {error && (
        <Alert
          type="error"
          message="เกิดข้อผิดพลาด"
          description={error}
          style={{ marginBottom: 16 }}
          showIcon
        />
      )}

      <Form
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        scrollToFirstError
      >
        <Form.Item
          label={<span style={{ color: "white" }}>Username</span>}
          name="username"
          rules={[{ required: true, message: "กรุณากรอก Username" }]}
        >
          <Input placeholder="ตั้งชื่อผู้ใช้" />
        </Form.Item>

        <Form.Item
          label={<span style={{ color: "white" }}>Email</span>}
          name="email"
          rules={[
            { required: true, message: "กรุณากรอก Email" },
            { type: "email", message: "รูปแบบ Email ไม่ถูกต้อง" },
          ]}
        >
          <Input placeholder="user@example.com" />
        </Form.Item>

        <Form.Item
          label={<span style={{ color: "white" }}>Password</span>}
          name="password"
          rules={[
            { required: true, message: "กรุณากรอกรหัสผ่าน" },
            { min: 6, message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" },
          ]}
          hasFeedback
        >
          <Input.Password placeholder="ตั้งรหัสผ่าน" />
        </Form.Item>

        {/* --- ส่วนที่เพิ่มมา: ยืนยันรหัสผ่าน --- */}
        <Form.Item
          label={<span style={{ color: "white" }}>Confirm Password</span>}
          name="confirm"
          dependencies={['password']} // ให้เช็คทุกครั้งที่ช่อง password เปลี่ยน
          hasFeedback
          rules={[
            {
              required: true,
              message: 'กรุณายืนยันรหัสผ่าน',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('รหัสผ่านทั้งสองช่องไม่ตรงกัน!'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="ยืนยันรหัสผ่านอีกครั้ง" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            size="large"
          >
            สมัครสมาชิก
          </Button>
        </Form.Item>

        <div style={{ textAlign: "center", color: "white" }}>
          <p>
            มีบัญชีอยู่แล้ว? <Link to="/login" style={{ color: "#1677ff" }}>เข้าสู่ระบบที่นี่</Link>
          </p>
        </div>
      </Form>
    </div>
  );
}