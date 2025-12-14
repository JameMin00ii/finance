import { useState, useEffect } from "react";
import TransactionList from "./components/TransactionList";
import dayjs from "dayjs";
import { Spin, Button, Layout, Typography, Avatar, Space, Row, Col, Card, Statistic } from "antd";
import { UserOutlined, LogoutOutlined, ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import Clock from "./components/Clock";
import AddItem from "./components/AddItem";
import axios from "axios";
import EditItem from "./components/EditItem";

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

axios.defaults.baseURL = "http://localhost:1337";
const URL_TRANSACTIONS = "http://localhost:1337/api/transactions";

function FinanceScreen({ jwt, user, onLogout }) { // <--- แก้ตรงนี้ (เพิ่ม user)
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null)

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);

      const res = await axios.get(
        `${URL_TRANSACTIONS}?filters[user][id][$eq]=${user.id}&sort=created:desc`
      );

      const items = res.data.data.map((item) => ({
        id: item.id,
        documentId: item.documentId,
        type: item.type,
        amount: item.amount,
        note: item.note,
        create: dayjs(item.created).format("DD/MM/YYYY - HH:mm"),
      }));

      setTransactions(items);
    } catch (err) {
      console.error("GET error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // ต้องรอให้มีทั้ง jwt และ user ก่อนถึงจะดึงข้อมูล
    if (!jwt || !user) return; // <--- แก้ตรงนี้ (เช็ค user ด้วย)

    axios.defaults.headers.common.Authorization = `Bearer ${jwt}`;
    fetchTransactions();
  }, [jwt, user]); // <--- แก้ตรงนี้ (เพิ่ม dependency user)

  const currentAmount = transactions.reduce((sum, tx) => {
    const sign = tx.type === "income" ? 1 : -1;
    return sum + sign * tx.amount;
  }, 0);

  const richGreeting = () => (
    <p style={{ color: "green" }}>คุณโคตรรวย เงินคงเหลือ {currentAmount}</p>
  );

  const poorGreeting = () => (
    <p style={{ color: "red" }}>อย่างจน... เงินคงเหลือ {currentAmount}</p>
  );

  const handleNoteChanged = (documentId, newNote) => {
    setTransactions((prev) =>
      prev.map((tx) =>
        tx.documentId === documentId ? { ...tx, note: newNote } : tx
      )
    );
  };


  const handleAddItem = async (itemData) => {
    try {
      setIsLoading(true);

      const payload = {
        data: {
          type: itemData.type,
          amount: Number(itemData.amount),
          note: itemData.note,
          created: new Date().toISOString(),
          user: user.id,
        },
      };

      const res = await axios.post(URL_TRANSACTIONS, payload);
      const saved = res.data.data;

      // ... code ส่วนแสดงผล ...
      const newTx = {
        id: saved.id,
        documentId: saved.documentId,
        type: saved.type,
        amount: saved.amount,
        note: saved.note,
        create: dayjs(saved.created).format("DD/MM/YYYY - HH:mm"),
      };

      setTransactions((prev) => [...prev, newTx]);
    } catch (err) {
      console.error("POST error:", err);
      console.log("Strapi Error Detail:", err.response?.data?.error);
    } finally {
      setIsLoading(false);
    }
    console.log("User ID ที่จะส่งไป:", user?.id);
    // ถ้ามันขึ้น undefined แสดงว่า App.js ไม่ได้ส่ง props user มาให้
  };

  // ลบ
  const handleDelete = async (documentId) => {
    try {
      setIsLoading(true);
      const target = transactions.find((tx) => tx.documentId === documentId);
      if (!target) {
        console.warn("Transaction not found for documentId:", documentId);
        return;
      }
      await axios.delete(`${URL_TRANSACTIONS}/${documentId}`);
      setTransactions((prev) => prev.filter((tx) => tx.documentId !== documentId));
    } catch (err) {
      console.error("DELETE error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateItem = async (item) => {
    try {
      setIsLoading(true);
      const payload = {
        data: {
          type: item.type,
          amount: item.amount,
          note: item.note,
        },
      };
      // ใช้ id ของ Strapi ใน URL
      const res = await axios.put(`${URL_TRANSACTIONS}/${item.documentId}`, payload);
      // const updated = res.data.data; // ไม่ได้ใช้
    } catch (err) {
      console.error("UPDATE error:", err);
    } finally {
      setIsLoading(false);
      fetchTransactions()
    }
  };

  const handleItemEdited = async (updatedItem) => {
    await updateItem(updatedItem);
    setEditingItem(null);
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
  };

  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expense;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Header */}
      <Header style={{ background: '#001529', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
          Finance App
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ color: "white" }}>
            <Clock />
          </div>

          <div style={{ width: '1px', height: '20px', background: '#666' }}></div>
          <Space>
            <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
            <Text style={{ color: 'white' }}>{user?.username}</Text>
          </Space>
          <Button type="primary" danger icon={<LogoutOutlined />} onClick={onLogout}>
            Logout
          </Button>
        </div>
      </Header>

      <Content style={{ padding: '24px', backgroundColor: '#f0f2f5' }}>

        {/* Row 1: Dashboard Cards (สรุปยอด) */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={8}>
            <Card bordered={false}>
              <Statistic
                title="เงินคงเหลือ (Balance)"
                value={balance}
                precision={2}
                valueStyle={{ color: balance >= 0 ? '#3f8600' : '#cf1322' }}
                prefix="฿"
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card bordered={false}>
              <Statistic
                title="รายรับรวม (Income)"
                value={income}
                precision={2}
                valueStyle={{ color: '#3f8600' }}
                prefix={<ArrowUpOutlined />}
                suffix="฿"
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card bordered={false}>
              <Statistic
                title="รายจ่ายรวม (Expense)"
                value={expense}
                precision={2}
                valueStyle={{ color: '#cf1322' }}
                prefix={<ArrowDownOutlined />}
                suffix="฿"
              />
            </Card>
          </Col>
        </Row>

        {/* Row 2: แบบฟอร์ม + ตาราง */}
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Card title="เพิ่มรายการใหม่" bordered={false} style={{ marginBottom: 16 }}>
              <AddItem onItemAdd={handleAddItem} />
            </Card>
          </Col>

          <Col xs={24}>
            <Card title="ประวัติการทำรายการ (Transaction History)" bordered={false}>
              <Spin spinning={isLoading}>
                <TransactionList
                  data={transactions}
                  // onNoteChanged ไม่จำเป็นแล้วเพราะเราใช้ปุ่ม Edit
                  onDelete={handleDelete}
                  onEdit={handleEditClick}
                />
              </Spin>
            </Card>
          </Col>
        </Row>

        {/* Modal แก้ไข (ซ่อนอยู่) */}
        <EditItem
          isOpen={!!editingItem}
          item={editingItem}
          onCancel={() => setEditingItem(null)}
          onItemEdited={handleItemEdited}
        />
      </Content>

      {/* --- ส่วน Footer --- */}
      <Footer
        style={{
          textAlign: 'center',
          backgroundColor: '#f0f2f5', // สีเดียวกับ Background ของ Content
          color: '#888' // สีตัวหนังสือเทาๆ
        }}
      >
        Finance App ©{new Date().getFullYear()} Created by Jetsada <br />
        <span style={{ fontSize: '12px' }}>Powered by React & Ant Design</span>
      </Footer>

    </Layout>
  );
}
export default FinanceScreen;