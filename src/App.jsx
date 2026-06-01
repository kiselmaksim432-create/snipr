// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./lib/useAuth"; // Проверьте правильность пути!
import Landing from "./components/Landing";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import Redirect from "./components/Redirect";
import React from 'react';

export default function App() {
  let authData;
  try {
    authData = useAuth();
  } catch (error) {
    console.error("Ошибка при вызове useAuth:", error);
    return <div style={{padding: '20px', color: 'red'}}>Ошибка загрузки данных пользователя. Проверьте консоль.</div>;
  }

  const { user, loading, login, signup, logout, refresh } = authData || {};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-mono text-sm text-stone-500 animate-pulse">загрузка_</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Все ваши маршруты остаются без изменений */}
      <Route
        path="/"
        element={user ? <Navigate to="/app/dashboard" replace /> : <Landing />}
      />
      <Route
        path="/login"
        element={
          user ? <Navigate to="/app/dashboard" replace /> :
            <Auth mode="login" login={login} signup={signup} />
        }
      />
      <Route
        path="/signup"
        element={
          user ? <Navigate to="/app/dashboard" replace /> :
            <Auth mode="signup" login={login} signup={signup} />
        }
      />
      <Route
        path="/app/dashboard"
        element={
          user ? <Dashboard user={user} logout={logout} refreshUser={refresh} />
               : <Navigate to="/login" replace />
        }
      />
      <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />
      <Route path="/:code" element={<Redirect />} />
    </Routes>
  );
}
