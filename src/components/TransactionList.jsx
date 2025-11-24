import { Button, Table } from "antd";
import { DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined, EditOutlined } from "@ant-design/icons";

export default function TransactionList({ data, onDelete,onEdit }) {

  const columns = [
    {
      title: "วันที่",
      dataIndex: "create",
      key: "create",
    },
    {
      title: "ประเภท",
      key: "type",
      dataIndex: "type",
      render: (type) => (
        <>
          {type === "income" ? (
            <span style={{ color: "green", fontWeight: "bold" }}>
              <ArrowUpOutlined /> รายรับ
            </span>
          ) : (
            <span style={{ color: "red", fontWeight: "bold" }}>
              <ArrowDownOutlined /> รายจ่าย
            </span>
          )}
        </>
      ),
    },
    {
      title: "จำนวนเงิน",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "โน๊ต",
      dataIndex: "note",
      key: "note",
    },
    {
      title: "documentId",
      key: "documentId",
      dataIndex: "documentId",
      render: (docId) => (
        <span style={{ fontSize: "12px", color: "#aaa" }}>{docId}</span>
      ),
    },
    {
      title: "แก้ไข",
      key: "action",
      render: (_, tx) => (
        <>
          <Button
            icon={<EditOutlined />}
            style={{ marginRight: 8 }}
            onClick={() => onEdit(tx)}   // ส่งทั้ง record
          >
          </Button>
        </>
      ),
    },
    {
      title: "ลบ",
      key: "action",
      render: (_, tx) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => onDelete(tx.documentId)}
        />
      ),
    },
  ];

  return (
    <Table
      rowKey="documentId"
      columns={columns}
      dataSource={data}
      pagination={false}
    />
  );
}
