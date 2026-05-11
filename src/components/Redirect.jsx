import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { storage } from "../lib/storage";
import { simulateClick } from "../lib/utils";
import { Scissors } from "lucide-react";

// Фейковый редирект — в боевом режиме это сделает сервер ещё до загрузки JS.
// Здесь имитируем: показываем заставку, регистрируем клик, редиректим.
export default function Redirect() {
  const { code } = useParams();
  const [status, setStatus] = useState("checking"); // checking | found | not_found
  const [target, setTarget] = useState(null);

  useEffect(() => {
    const lookup = storage.get(`shortcode:${code}`);
    if (!lookup) {
      setStatus("not_found");
      return;
    }
    const link = storage.get(`link:${lookup.username}:${code}`);
    if (!link) {
      setStatus("not_found");
      return;
    }

    // Регистрируем клик
    const click = simulateClick();
    click.ts = Date.now();
    link.clicks = [...(link.clicks || []), click];
    storage.set(`link:${lookup.username}:${code}`, link);

    // Зачисляем доход + реф-комиссию
    const owner = storage.get(`user:${lookup.username}`);
    if (owner) {
      owner.balance = (owner.balance || 0) + click.revenue;
      storage.set(`user:${lookup.username}`, owner);
      if (owner.referredBy) {
        const refUser = storage.get(`user:${owner.referredBy}`);
        if (refUser) {
          refUser.referralEarnings = (refUser.referralEarnings || 0) + click.revenue * 0.1;
          storage.set(`user:${owner.referredBy}`, refUser);
        }
      }
    }

    setTarget(link.longUrl);
    setStatus("found");

    // Редирект через 2 секунды (имитация рекламной заставки)
    const t = setTimeout(() => {
      window.location.href = link.longUrl;
    }, 2000);
    return () => clearTimeout(t);
  }, [code]);

  if (status === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center grid-bg">
        <div className="font-mono text-sm text-stone-500 animate-pulse">проверка_ссылки...</div>
      </div>
    );
  }

  if (status === "not_found") {
    return (
      <div className="min-h-screen flex items-center justify-center grid-bg p-6">
        <div className="text-center max-w-md anim-up">
          <div className="font-display font-black text-7xl sm:text-9xl tracking-tighter mb-4">404</div>
          <div className="font-serif italic text-2xl text-stone-600 mb-6">
            Ссылка <span className="font-mono not-italic text-stone-900">/{code}</span> не существует
          </div>
          <Link
            to="/"
            className="inline-block bg-stone-900 text-stone-50 font-mono text-sm px-6 py-3 hover:bg-lime-500 hover:text-stone-900 transition-all"
          >
            ← на главную
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-900 text-stone-50 flex items-center justify-center p-6 relative noise overflow-hidden">
      <div className="text-center max-w-lg relative z-10 anim-scale">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-8 h-8 bg-lime-400 flex items-center justify-center rotate-3">
            <Scissors className="w-4 h-4 text-stone-900" strokeWidth={2.5} />
          </div>
          <span className="font-display font-black text-xl">
            SNIPR<span className="text-lime-400">.</span>
          </span>
        </div>
        <div className="font-mono text-xs text-lime-400 mb-2">[ редирект через 2 секунды ]</div>
        <h1 className="font-display font-black text-3xl sm:text-4xl mb-4 tracking-tight">
          Переходим на:
        </h1>
        <div className="font-mono text-xs sm:text-sm text-stone-400 break-all mb-8">{target}</div>
        <div className="w-full h-1 bg-stone-800 overflow-hidden">
          <div className="h-full bg-lime-400 origin-left" style={{ animation: "growBar 2s linear forwards" }} />
        </div>
        <style>{`
          @keyframes growBar {
            from { transform: scaleX(0); }
            to { transform: scaleX(1); }
          }
        `}</style>
        <div className="mt-6 font-serif italic text-stone-500 text-sm">
          не редиректит? <a href={target} className="text-lime-400 underline">кликни сюда</a>
        </div>
      </div>
    </div>
  );
}
