import { Button, Select, Input, InputNumber, Form } from "antd";
import { PlusOutlined } from '@ant-design/icons';

export default function AddItem({ onItemAdd }) {
  // 1. สร้างตัวแปร form เพื่อควบคุมมัน
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Form Submitted:", values);
    
    // ส่งข้อมูลไปให้ App (FinanceScreen)
    onItemAdd(values);
    
    // 2. สั่งเคลียร์ช่องกรอกให้ว่าง หลังกดปุ่ม
    form.resetFields();
  };

  return (
    <Form
      form={form} // 3. เชื่อม form กับตัวแปร
      className="add-item-form"
      layout="inline"
      onFinish={onFinish}
    >
      <Form.Item
        name="type"
        label="ชนิด"
        rules={[{ required: true, message: "กรุณาเลือกชนิด" }]}
      >
        <Select
          allowClear
          style={{ width: "100px" }}
          options={[
            { value: "income", label: "รายรับ" },
            { value: "expense", label: "รายจ่าย" },
          ]}
        />
      </Form.Item>

      <Form.Item
        name="amount"
        label="จำนวนเงิน"
        rules={[{ required: true, message: "กรุณากรอกจำนวนเงิน" }]}
      >
        <InputNumber placeholder="จำนวนเงิน" />
      </Form.Item>

      <Form.Item
        name="note"
        label="โน๊ต"
      >
        <Input placeholder="โน๊ต" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block icon={<PlusOutlined />}>
          เพิ่มรายการ
        </Button>
      </Form.Item>
    </Form>
  );
}