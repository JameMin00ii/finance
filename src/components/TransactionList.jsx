import { Table, Tag, Space, Button, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

export default function TransactionList({ data, onNoteChanged, onDelete, onEdit }) {
  
  // กำหนดหัวตาราง (Columns)
  const columns = [
    {
      title: 'วันที่',
      dataIndex: 'create', // ต้องตรงกับ key ใน data ที่ส่งมา
      key: 'create',
      width: 180,
    },
    {
      title: 'ประเภท',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => (
        <Tag color={type === "income" ? "green" : "red"}>
          {type === "income" ? "รายรับ" : "รายจ่าย"}
        </Tag>
      ),
    },
    {
      title: 'จำนวนเงิน',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right', // ตัวเลขชิดขวา
      render: (amount, record) => (
        <span style={{ color: record.type === "income" ? "green" : "red", fontWeight: "bold" }}>
          {amount.toLocaleString()}
        </span>
      ),
    },
    {
      title: 'บันทึกช่วยจำ',
      dataIndex: 'note',
      key: 'note',
    },
    {
      title: 'จัดการ',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small" 
            onClick={() => onEdit(record)} 
          />
          
          <Popconfirm
            title="ลบรายการ"
            description="คุณแน่ใจหรือไม่ที่จะลบรายการนี้?"
            onConfirm={() => onDelete(record.documentId)}
            okText="ลบ"
            cancelText="ยกเลิก"
          >
            <Button 
              type="primary" 
              danger 
              icon={<DeleteOutlined />} 
              size="small" 
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table 
      columns={columns} 
      dataSource={data} 
      rowKey="id" 
      pagination={{ pageSize: 5 }} // แบ่งหน้าละ 5 รายการ
      bordered
    />
  );
}