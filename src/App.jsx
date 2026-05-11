import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./lib/useAuth";
import Landing from "./components/Landing";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import Redirect from "./components/Redirect";

export default function App() {
  const { user, loading, login, signup, logout, refresh } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-mono text-sm text-stone-500 animate-pulse">загрузка_</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Главная — лендинг (или редирект на дашборд если залогинен) */}
      <Route
        path="/"
        element={user ? <Navigate to="/app/dashboard" replace /> : <Landing />}
      />

      {/* Авторизация */}
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

      {/* Приложение под /app/* */}
      <Route
        path="/app/dashboard"
        element={
          user ? <Dashboard user={user} logout={logout} refreshUser={refresh} />
               : <Navigate to="/login" replace />
        }
      />
      <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />

      {/* Короткие ссылки — всё, что в корне на один сегмент */}
      <Route path="/:code" element={<Redirect />} />
    </Routes>
  );
}
