import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Link2, Scissors, BarChart3, Users, Wallet, LogOut,
} from "lucide-react";
import { storage } from "../lib/storage";
import { formatDate, formatMoney } from "../lib/utils";
import LinksTab from "../tabs/LinksTab";
import AnalyticsTab from "../tabs/AnalyticsTab";
import WalletTab from "../tabs/WalletTab";
import ReferralsTab from "../tabs/ReferralsTab";

export default function Dashboard({ user, logout, refreshUser }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("links");
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const loadLinks = () => {
    setLoading(true);
    const keys = storage.list(`link:${user.username}:`);
    const linksData = keys.map((k) => storage.get(k)).filter(Boolean);
    linksData.sort((a, b) => b.createdAt - a.createdAt);
    setLinks(linksData);
    setLoading(false);
  };

  useEffect(() => {
    loadLinks();
  }, [user.username]);

  const totalClicks = useMemo(
    () => links.reduce((s, l) => s + (l.clicks?.length || 0), 0),
    [links]
  );

  const totalRevenue = useMemo(
    () => links.reduce((s, l) => s + (l.clicks || []).reduce((cs, c) => cs + (c.revenue || 0), 0), 0),
    [links]
  );

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { id: "links", icon: Link2, label: "мои ссылки", count: links.length },
    { id: "analytics", icon: BarChart3, label: "аналитика" },
    {
      id: "wallet",
      icon: Wallet,
      label: "кошелёк",
      value: formatMoney((user.balance || 0) + (user.referralEarnings || 0)),
    },
    { id: "referrals", icon: Users, label: "рефералы", count: (user.referrals || []).length },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Mobile header */}
      <header className="lg:hidden border-b border-stone-900/10 bg-stone-50 p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-stone-900 flex items-center justify-center rotate-3">
            <Scissors className="w-3.5 h-3.5 text-lime-400" strokeWidth={2.5} />
          </div>
          <span className="font-display font-black text-lg">
            SNIPR<span className="text-lime-500">.</span>
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="font-mono text-xs px-3 py-2 border border-stone-900"
        >
          {sidebarOpen ? "× закрыть" : "☰ меню"}
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "block" : "hidden"
        } lg:block lg:w-72 border-r border-stone-900/10 bg-stone-50 lg:min-h-screen lg:sticky lg:top-0 z-30`}
      >
        <div className="p-6 hidden lg:block">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-stone-900 flex items-center justify-center rotate-3">
              <Scissors className="w-4 h-4 text-lime-400" strokeWidth={2.5} />
            </div>
            <span className="font-display font-black text-xl">
              SNIPR<span className="text-lime-500">.</span>
            </span>
          </div>
        </div>

        <div className="p-4 lg:p-6 lg:pt-2 border-b border-stone-900/10">
          <div className="font-mono text-xs text-stone-500 mb-1">залогинен_как</div>
          <div className="font-display font-bold text-lg truncate">@{user.username}</div>
          <div className="font-serif italic text-stone-500 text-sm mt-1">
            с {formatDate(user.createdAt)}
          </div>
        </div>

        <nav className="p-4 lg:p-6 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 font-mono text-sm transition-all ${
                activeTab === item.id
                  ? "bg-stone-900 text-lime-400"
                  : "hover:bg-stone-200/50 text-stone-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4" strokeWidth={1.5} />
                {item.label}
              </div>
              {item.count !== undefined && (
                <span className="text-xs opacity-60">{item.count}</span>
              )}
              {item.value !== undefined && (
                <span className="text-xs opacity-60">{item.value}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 lg:p-6 border-t border-stone-900/10 lg:border-t-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 font-mono text-sm text-stone-600 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" strokeWidth={1.5} />
            выйти
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-10">
          {activeTab === "links" && (
            <LinksTab
              user={user}
              links={links}
              loading={loading}
              onUpdate={loadLinks}
              totalClicks={totalClicks}
              totalRevenue={totalRevenue}
              refreshUser={refreshUser}
            />
          )}
          {activeTab === "analytics" && (
            <AnalyticsTab links={links} totalClicks={totalClicks} totalRevenue={totalRevenue} />
          )}
          {activeTab === "wallet" && (
            <WalletTab user={user} refreshUser={refreshUser} />
          )}
          {activeTab === "referrals" && <ReferralsTab user={user} />}
        </div>
      </main>
    </div>
  );
}
