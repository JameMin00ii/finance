import { useState, useEffect } from "react";
import "./App.css";
import LoginScreen from "./components/LoginScreen";
import RegisterScreen from "./components/RegisterScreen";
import FinanceScreen from "./FinanceScreen";
import axios from "axios";
import { Routes, Route, Navigate } from "react-router-dom";

axios.defaults.baseURL = "http://localhost:1337";

function App() {
  const [jwt, setJwt] = useState(null);
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (token, userData, remember) => {

    if (remember) {
      console.log("จำฉัน → ใช้ localStorage");
    } else {
      console.log("ไม่จำ → ใช้ sessionStorage");
    }
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem("jwt", token);
    storage.setItem("user", JSON.stringify(userData));

    // ตั้งค่า axios header
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;

    setJwt(token);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();

    delete axios.defaults.headers.common.Authorization;

    setJwt(null);
    setUser(null);
  };


  useEffect(() => {
    const storedJwt = localStorage.getItem("jwt");
    const storedUser = localStorage.getItem("user");

    if (storedJwt) {
      setJwt(storedJwt);
      axios.defaults.headers.common.Authorization = `Bearer ${storedJwt}`;
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const RequireAuth = ({ children }) => {
    if (!jwt) {

      return <Navigate to="/login" replace />;
    }
    return children;
  };


  return (
    <Routes>
      <Route
        path="/login"
        element={
          jwt ? <Navigate to="/" replace /> : <LoginScreen onLoginSuccess={handleLoginSuccess} />
        }
      />

      <Route
        path="/register"
        element={
          jwt ? <Navigate to="/" replace /> : <RegisterScreen />
        }
      />

      <Route
        path="/"
        element={
          <RequireAuth>
            <FinanceScreen jwt={jwt} user={user} onLogout={handleLogout} />
          </RequireAuth>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
