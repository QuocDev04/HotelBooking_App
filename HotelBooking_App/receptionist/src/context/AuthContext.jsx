import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const reqId = axios.interceptors.request.use((config) => {
      const t = localStorage.getItem("qtks_token");
      if (t) config.headers.Authorization = `Bearer ${t}`;
      return config;
    });
    const resId = axios.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response?.status === 401) {
          logout();
        }
        return Promise.reject(err);
      }
    );
    return () => {
      axios.interceptors.request.eject(reqId);
      axios.interceptors.response.eject(resId);
    };
  }, []);

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem("qtks_token");
      const savedUser = localStorage.getItem("qtks_user");
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      localStorage.removeItem("qtks_token");
      localStorage.removeItem("qtks_user");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem("qtks_token", accessToken);
    localStorage.setItem("qtks_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("qtks_token");
    localStorage.removeItem("qtks_user");
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    logout,
    isAuthenticated: () => !!(user && token),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


