import { useState } from "react";
import {
  Link2, MousePointerClick, DollarSign, Users, Scissors,
  Calendar, Copy, Check, ExternalLink, Trash2,
} from "lucide-react";
import { storage } from "../lib/storage";
import {
  generateShortCode, simulateClick, formatDate, formatMoney, BASE_URL,
} from "../lib/utils";

export default function LinksTab({ user, links, loading, onUpdate, totalClicks, totalRevenue, refreshUser }) {
  const [longUrl, setLongUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const handleCreate = () => {
    setError("");
    if (!longUrl.trim()) {
      setError("введите ссылку");
      return;
    }

    let url = longUrl.trim();
    if (!url.match(/^https?:\/\//)) url = "https://" + url;
    try {
      new URL(url);
    } catch {
      setError("невалидный URL");
      return;
    }

    const code = customAlias.trim() || generateShortCode();
    if (!/^[a-zA-Z0-9_-]+$/.test(code)) {
      setError("алиас: только буквы, цифры, _, -");
      return;
    }

    if (storage.get(`shortcode:${code}`)) {
      setError("такой алиас уже занят");
      return;
    }

    setCreating(true);
    const link = {
      id: code,
      shortCode: code,
      longUrl: url,
      owner: user.username,
      createdAt: Date.now(),
      clicks: [],
    };
    storage.set(`link:${user.username}:${code}`, link);
    storage.set(`shortcode:${code}`, { username: user.username, code });
    setLongUrl("");
    setCustomAlias("");
    setCreating(false);
    onUpdate();
  };

  const handleSimulateClick = (link) => {
    const click = simulateClick();
    const updated = { ...link, clicks: [...(link.clicks || []), click] };
    storage.set(`link:${user.username}:${link.shortCode}`, updated);

    const userData = storage.get(`user:${user.username}`);
    if (userData) {
      userData.balance = (userData.balance || 0) + click.revenue;
      storage.set(`user:${user.username}`, userData);

      // Реферальная комиссия 10%
      if (userData.referredBy) {
        const refUser = storage.get(`user:${userData.referredBy}`);
        if (refUser) {
          refUser.referralEarnings = (refUser.referralEarnings || 0) + click.revenue * 0.1;
          storage.set(`user:${userData.referredBy}`, refUser);
        }
      }
    }
    onUpdate();
    refreshUser();
  };

  const handleDelete = (link) => {
    if (!confirm(`удалить /${link.shortCode}?`)) return;
    storage.delete(`link:${user.username}:${link.shortCode}`);
    storage.delete(`shortcode:${link.shortCode}`);
    onUpdate();
  };

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {}
  };

  return (
    <div className="anim-up">
      <div className="font-mono text-xs text-stone-500 mb-2">[ панель / ссылки ]</div>
      <h1 className="font-display font-black text-4xl sm:text-5xl tracking-tight mb-8">
        Привет, <span className="italic font-serif font-normal text-lime-600">@{user.username}</span>.
      </h1>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-stone-900/10 border border-stone-900/10 mb-10">
        {[
          { label: "ссылок", value: links.length, icon: Link2 },
          { label: "переходов", value: totalClicks, icon: MousePointerClick },
          { label: "доход", value: formatMoney(totalRevenue), icon: DollarSign },
          { label: "рефералов", value: (user.referrals || []).length, icon: Users },
        ].map((s, i) => (
          <div key={i} className="bg-stone-50 p-4 sm:p-5">
            <div className="flex items-start justify-between mb-2">
              <s.icon className="w-4 h-4 text-stone-400" strokeWidth={1.5} />
              <span className="font-mono text-[10px] text-stone-400">0{i + 1}</span>
            </div>
            <div className="font-display font-black text-2xl sm:text-3xl">{s.value}</div>
            <div className="font-mono text-xs text-stone-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Create form */}
      <div className="bg-stone-900 text-stone-50 p-6 sm:p-8 mb-10 relative noise overflow-hidden">
        <div className="font-mono text-xs text-lime-400 mb-3 relative z-10">[ создать_новую_ссылку ]</div>
        <h2 className="font-display font-black text-2xl sm:text-3xl mb-6 relative z-10">
          Вставь ссылку. <span className="italic font-serif font-normal text-lime-400">Получи короткую.</span>
        </h2>
        <div className="space-y-4 relative z-10">
          <div>
            <label className="font-mono text-xs text-stone-400 block mb-1">длинная ссылка</label>
            <input
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder="https://example.com/very/long/path"
              className="w-full bg-transparent border-b-2 border-stone-50/30 py-2 font-mono text-sm focus:border-lime-400 outline-none transition-colors text-stone-50 placeholder:text-stone-500"
            />
          </div>
          <div>
            <label className="font-mono text-xs text-stone-400 block mb-1">
              кастомный алиас <span className="text-stone-500">(необязательно)</span>
            </label>
            <div className="flex items-center gap-2 border-b-2 border-stone-50/30 focus-within:border-lime-400 transition-colors">
              <span className="font-mono text-sm text-stone-500">{BASE_URL}/</span>
              <input
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                placeholder="my-link"
                className="flex-1 bg-transparent py-2 font-mono text-sm outline-none text-stone-50 placeholder:text-stone-500"
              />
            </div>
          </div>
          {error && <div className="font-mono text-xs text-red-400">⚠ {error}</div>}
          <button
            onClick={handleCreate}
            disabled={creating}
            className="w-full sm:w-auto bg-lime-400 text-stone-900 font-mono text-sm px-6 py-3 hover:bg-stone-50 transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
          >
            {creating ? "создание..." : "сократить"}
            <Scissors className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      </div>

      {/* Links list */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-2xl">Твои ссылки</h2>
          <span className="font-mono text-xs text-stone-500">{links.length} шт.</span>
        </div>

        {loading ? (
          <div className="font-mono text-sm text-stone-500 py-12 text-center">загрузка...</div>
        ) : links.length === 0 ? (
          <div className="border-2 border-dashed border-stone-300 py-16 text-center">
            <Link2 className="w-12 h-12 mx-auto mb-3 text-stone-300" strokeWidth={1} />
            <div className="font-display font-bold text-xl mb-1">Пока пусто</div>
            <div className="font-serif italic text-stone-500">Создай первую ссылку выше ↑</div>
          </div>
        ) : (
          <div className="space-y-3">
            {links.map((link, i) => {
              const linkRevenue = (link.clicks || []).reduce((s, c) => s + (c.revenue || 0), 0);
              const shortUrl = `${BASE_URL}/${link.shortCode}`;
              return (
                <div
                  key={link.id}
                  className="bg-stone-50 border border-stone-900/10 p-4 sm:p-5 hover:border-lime-500 transition-all anim-up"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <a
                          href={`/${link.shortCode}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-base sm:text-lg font-bold text-stone-900 truncate hover:text-lime-600 transition-colors"
                          title="открыть короткую ссылку"
                        >
                          {shortUrl}
                        </a>
                        <button
                          onClick={() => copyToClipboard(`${window.location.origin}/${link.shortCode}`, link.id)}
                          className="text-stone-500 hover:text-lime-600 transition-colors flex-shrink-0"
                          title="скопировать"
                        >
                          {copiedId === link.id ? (
                            <Check className="w-4 h-4 text-lime-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <a
                        href={link.longUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-stone-500 hover:text-stone-900 truncate flex items-center gap-1 group"
                      >
                        → {link.longUrl}
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </a>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1 text-right">
                      <div>
                        <div className="font-display font-black text-2xl leading-none">
                          {(link.clicks || []).length}
                        </div>
                        <div className="font-mono text-[10px] text-stone-500">переходов</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between flex-wrap gap-2 pt-3 border-t border-stone-900/10">
                    <div className="flex items-center gap-3 sm:gap-4 font-mono text-xs text-stone-500 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(link.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        {formatMoney(linkRevenue)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSimulateClick(link)}
                        className="font-mono text-xs px-3 py-1.5 border border-lime-500 text-lime-700 hover:bg-lime-500 hover:text-stone-900 transition-all"
                        title="симулировать переход (демо)"
                      >
                        +1 клик
                      </button>
                      <button
                        onClick={() => handleDelete(link)}
                        className="font-mono text-xs p-1.5 text-stone-400 hover:text-red-600 transition-colors"
                        title="удалить"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="font-mono text-[10px] text-stone-400 mt-6 text-center max-w-xl mx-auto leading-relaxed">
        ℹ кнопка «+1 клик» симулирует реальный переход — в боевом режиме клики засчитываются автоматически при заходе по короткой ссылке
      </div>
    </div>
  );
}
