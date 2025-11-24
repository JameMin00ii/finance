import { useState, useEffect } from "react";
import TransactionList from "./components/TransactionList";
import dayjs from "dayjs";
import { Spin, Divider, Button } from "antd";
import Clock from "./components/Clock";
import AddItem from "./components/AddItem";
import axios from "axios";
import EditItem from "./components/EditItem";

axios.defaults.baseURL = "http://localhost:1337";

const URL_TRANSACTIONS = "http://localhost:1337/api/transactions";

function FinanceScreen({ jwt, onLogout }) {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null)

  console.log("JWT:", jwt);
  console.log("Axios Authorization:", axios.defaults.headers.common.Authorization);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(URL_TRANSACTIONS);

      const items = res.data.data.map((item) => ({
        id: item.id,                                   // ใช้ id ของ Strapiไว้ยิง API
        documentId: item.documentId,        // uuid / documentId ไว้ใช้ใน React
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
    if (!jwt) return;
    axios.defaults.headers.common.Authorization = `Bearer ${jwt}`;
    fetchTransactions();
  }, [jwt]);

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
        },
      };

      const res = await axios.post(URL_TRANSACTIONS, payload);
      const saved = res.data.data;

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
    } finally {
      setIsLoading(false);
    }
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
      const updated = res.data.data;

    } catch (err) {
      console.error("UPDATE error:", err);
    } finally {
      setIsLoading(false);
      fetchTransactions()
    }
  };

  const handleItemEdited = async (updatedItem) => {
    await updateItem(updatedItem);
    setEditingItem(null); // ปิด modal
  };

  const handleEditClick = (item) => {
    setEditingItem(item); // ไม่ null → เปิด Modal
  };

  return (
    <div className="App">

      <div style={{ textAlign: "right", width: "100%", paddingRight: 20 }}>
        <Button type="primary" danger onClick={onLogout}>
          Logout
        </Button>
      </div>

      <Clock />

      <header className="App-header">
        <AddItem onItemAdd={handleAddItem} />

        <Divider />
        {currentAmount >= 20000 && richGreeting()}
        {currentAmount < 20000 && poorGreeting()}
        <Divider />

        <Spin spinning={isLoading}>
          <TransactionList
            data={transactions}
            onNoteChanged={handleNoteChanged}
            onDelete={handleDelete}
            onEdit={handleEditClick}

          />
        </Spin>

        <EditItem
          isOpen={!!editingItem}       
          item={editingItem}
          onCancel={() => setEditingItem(null)}
          onItemEdited={handleItemEdited}
        />

      </header>
    </div>
  );
}
export default FinanceScreen;
