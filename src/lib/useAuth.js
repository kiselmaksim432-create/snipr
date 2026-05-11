import { useState, useEffect, useCallback } from "react";
import { storage } from "./storage";
import { hashPassword, generateRefCode } from "./utils";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Восстановление сессии при загрузке
  useEffect(() => {
    const session = storage.get("session");
    if (session?.username) {
      const userData = storage.get(`user:${session.username}`);
      if (userData) setUser(userData);
    }
    setLoading(false);
  }, []);

  const login = useCallback((username, password) => {
    const userKey = `user:${username.toLowerCase()}`;
    const existing = storage.get(userKey);
    if (!existing) return { ok: false, error: "пользователь не найден" };
    if (existing.passwordHash !== hashPassword(password)) {
      return { ok: false, error: "неверный пароль" };
    }
    storage.set("session", { username: existing.username });
    setUser(existing);
    return { ok: true };
  }, []);

  const signup = useCallback((username, password, refCode) => {
    const uname = username.toLowerCase();
    const userKey = `user:${uname}`;
    if (storage.get(userKey)) return { ok: false, error: "логин уже занят" };

    let referredBy = null;
    if (refCode?.trim()) {
      const refLookup = storage.get(`refcode:${refCode.trim()}`);
      if (refLookup?.username && refLookup.username !== uname) {
        referredBy = refLookup.username;
      }
    }

    const newUser = {
      username: uname,
      passwordHash: hashPassword(password),
      createdAt: Date.now(),
      balance: 0,
      refCode: generateRefCode(uname),
      referredBy,
      referrals: [],
      referralEarnings: 0,
    };

    storage.set(userKey, newUser);
    storage.set(`refcode:${newUser.refCode}`, { username: newUser.username });

    if (referredBy) {
      const refUser = storage.get(`user:${referredBy}`);
      if (refUser) {
        refUser.referrals = [...(refUser.referrals || []), newUser.username];
        storage.set(`user:${referredBy}`, refUser);
      }
    }

    storage.set("session", { username: newUser.username });
    setUser(newUser);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    storage.delete("session");
    setUser(null);
  }, []);

  const refresh = useCallback(() => {
    if (!user) return;
    const fresh = storage.get(`user:${user.username}`);
    if (fresh) setUser(fresh);
  }, [user]);

  return { user, loading, login, signup, logout, refresh };
}
