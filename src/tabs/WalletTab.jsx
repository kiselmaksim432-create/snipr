import { useState } from "react";
import { ArrowUpRight, DollarSign, Gift } from "lucide-react";
import { storage } from "../lib/storage";
import { formatMoney } from "../lib/utils";

export default function WalletTab({ user, refreshUser }) {
  const [withdrawing, setWithdrawing] = useState(false);
  const [message, setMessage] = useState("");

  const adRevenue = user.balance || 0;
  const refRevenue = user.referralEarnings || 0;
  const total = adRevenue + refRevenue;
  const minWithdraw = 100;

  const handleWithdraw = () => {
    if (total < minWithdraw) {
      setMessage(`минимальная сумма для вывода: ${formatMoney(minWithdraw)}`);
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    setWithdrawing(true);
    const userData = storage.get(`user:${user.username}`);
    if (userData) {
      userData.balance = 0;
      userData.referralEarnings = 0;
      userData.lastWithdraw = Date.now();
      storage.set(`user:${user.username}`, userData);
      refreshUser();
      setMessage(`✓ заявка на вывод ${formatMoney(total)} принята (демо)`);
      setTimeout(() => setMessage(""), 4000);
    }
    setWithdrawing(false);
  };

  return (
    <div className="anim-up">
      <div className="font-mono text-xs text-stone-500 mb-2">[ панель / кошелёк ]</div>
      <h1 className="font-display font-black text-4xl sm:text-5xl tracking-tight mb-8">
        Твои <span className="italic font-serif font-normal text-lime-600">деньги</span>.
      </h1>

      {/* Big balance */}
      <div className="bg-stone-900 text-stone-50 p-6 sm:p-10 mb-6 relative noise overflow-hidden">
        <div className="relative z-10">
          <div className="font-mono text-xs text-lime-400 mb-2">[ доступный_баланс ]</div>
          <div className="font-display font-black text-5xl sm:text-7xl lg:text-8xl tracking-tighter mb-2">
            {total.toFixed(2)}<span className="text-lime-400">₽</span>
          </div>
          <div className="font-serif italic text-stone-400 text-lg sm:text-xl mb-6">
            готовы к выводу с {formatMoney(minWithdraw)}
          </div>
          <button
            onClick={handleWithdraw}
            disabled={withdrawing || total < minWithdraw}
            className="bg-lime-400 text-stone-900 font-mono text-sm px-6 py-3 hover:bg-stone-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 group"
          >
            {withdrawing ? "обработка..." : "вывести средства"}
            <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
          </button>
          {message && <div className="mt-4 font-mono text-xs text-lime-400">{message}</div>}
        </div>
      </div>

      {/* Breakdown */}
      <div className="grid sm:grid-cols-2 gap-px bg-stone-900/10 border border-stone-900/10 mb-6">
        <div className="bg-stone-50 p-6">
          <div className="flex items-start justify-between mb-3">
            <DollarSign className="w-5 h-5 text-stone-400" strokeWidth={1.5} />
            <span className="font-mono text-[10px] text-stone-400">источник_01</span>
          </div>
          <div className="font-mono text-xs text-stone-500 mb-1">реклама в ссылках</div>
          <div className="font-display font-black text-3xl">{formatMoney(adRevenue)}</div>
          <div className="font-serif italic text-sm text-stone-500 mt-2">заработано на показах</div>
        </div>
        <div className="bg-stone-50 p-6">
          <div className="flex items-start justify-between mb-3">
            <Gift className="w-5 h-5 text-stone-400" strokeWidth={1.5} />
            <span className="font-mono text-[10px] text-stone-400">источник_02</span>
          </div>
          <div className="font-mono text-xs text-stone-500 mb-1">рефералы (10%)</div>
          <div className="font-display font-black text-3xl">{formatMoney(refRevenue)}</div>
          <div className="font-serif italic text-sm text-stone-500 mt-2">
            от {(user.referrals || []).length} приглашённых
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="border-l-2 border-lime-500 pl-4 py-2">
        <div className="font-display font-bold text-lg mb-1">Как это работает</div>
        <div className="font-serif text-stone-600 leading-relaxed">
          Каждый переход по вашей ссылке показывает короткую рекламу перед редиректом и приносит вам от{" "}
          <span className="font-mono text-sm">0.001₽</span> до{" "}
          <span className="font-mono text-sm">0.05₽</span>. Вывод от{" "}
          <span className="font-mono text-sm">{formatMoney(minWithdraw)}</span> на карту, СБП или криптокошелёк — в течение 24 часов.
        </div>
      </div>
    </div>
  );
}
