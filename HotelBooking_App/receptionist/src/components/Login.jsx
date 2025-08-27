import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:8080/api/employee/login", {
        email: form.email.trim(),
        password: form.password,
        portal: "qtks",
      });
      if (res.data?.success) {
        const { accessToken, employee } = res.data;
        login(employee, accessToken);
        navigate("/", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
      <form onSubmit={onSubmit} className="bg-white rounded-xl shadow p-6 w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold text-center">Đăng nhập QTKS</h1>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={onChange}
          placeholder="Email"
          className="w-full border rounded px-3 py-2"
          disabled={loading}
          autoComplete="email"
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={onChange}
          placeholder="Mật khẩu"
          className="w-full border rounded px-3 py-2"
          disabled={loading}
          autoComplete="current-password"
        />
        <button
          type="submit"
          disabled={loading || !form.email || !form.password}
          className="w-full bg-blue-600 text-white rounded py-2 disabled:bg-gray-400"
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
};

export default Login;


