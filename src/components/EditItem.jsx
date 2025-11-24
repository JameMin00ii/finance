import { useEffect } from "react";
import { Modal, Form, Select, InputNumber, Input } from "antd";

export default function EditItem({ isOpen, item, onCancel, onItemEdited }) {
  const [form] = Form.useForm();

  // เวลาเปิด Modal + มี item → ใส่ค่าเดิมลงใน Form
  useEffect(() => {
    if (isOpen && item) {
      form.setFieldsValue({
        type: item.type,
        amount: item.amount,
        note: item.note,
      });
    }
  }, [isOpen, item, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        // values = { type, amount, note }
        const updatedItem = {
          ...item,      // เก็บ id, documentId, create เดิม
          ...values,    // ทับด้วยค่าที่แก้ใหม่
        };

        onItemEdited(updatedItem);   // ส่งกลับไปให้ FinanceScreen อัปเดต server
      })
      .catch(() => {
        // validation ไม่ผ่าน ไม่ต้องทำอะไร
      });
  };

  return (
    <Modal
      title="แก้ไขรายการ"
      open={isOpen}
      onOk={handleOk}
      onCancel={onCancel}
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="type"
          label="ประเภท"
          rules={[{ required: true, message: "กรุณาเลือกประเภท" }]}
        >
          <Select
            style={{ width: "100%" }}
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
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="note"
          label="โน๊ต"
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
