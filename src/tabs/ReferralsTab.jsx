import { useState } from "react";
import { Sparkles, Hash, Copy, Check, Share2, Users, Award, ChevronRight } from "lucide-react";

export default function ReferralsTab({ user }) {
  const [copied, setCopied] = useState(false);
  const refLink = `${window.location.origin}/?ref=${user.refCode}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(refLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="anim-up">
      <div className="font-mono text-xs text-stone-500 mb-2">[ панель / рефералы ]</div>
      <h1 className="font-display font-black text-4xl sm:text-5xl tracking-tight mb-8">
        Зови <span className="italic font-serif font-normal text-lime-600">друзей</span>.
      </h1>

      {/* Hero card */}
      <div className="bg-lime-400 text-stone-900 p-6 sm:p-10 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10">
          <Sparkles className="w-48 h-48" strokeWidth={1} />
        </div>
        <div className="relative">
          <div className="font-mono text-xs mb-2">[ программа_лояльности ]</div>
          <div className="font-display font-black text-5xl sm:text-7xl mb-2 tracking-tighter">10%</div>
          <div className="font-serif italic text-xl sm:text-2xl mb-6 max-w-md">
            от заработка каждого приглашённого — навсегда на ваш счёт.
          </div>
          <div className="grid grid-cols-3 gap-4 max-w-md">
            <div>
              <div className="font-display font-black text-2xl">{(user.referrals || []).length}</div>
              <div className="font-mono text-[10px]">приглашено</div>
            </div>
            <div>
              <div className="font-display font-black text-2xl">{(user.referralEarnings || 0).toFixed(2)}₽</div>
              <div className="font-mono text-[10px]">заработано</div>
            </div>
            <div>
              <div className="font-display font-black text-2xl">∞</div>
              <div className="font-mono text-[10px]">срок</div>
            </div>
          </div>
        </div>
      </div>

      {/* Ref link */}
      <div className="bg-stone-50 border border-stone-900/10 p-6 mb-6">
        <div className="font-mono text-xs text-stone-500 mb-2">[ твоя_реферальная_ссылка ]</div>
        <div className="flex items-center gap-2 mb-4">
          <Hash className="w-5 h-5 text-stone-400 flex-shrink-0" />
          <code className="font-mono text-sm sm:text-base font-bold flex-1 truncate">{refLink}</code>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={copy}
            className="flex-1 bg-stone-900 text-stone-50 font-mono text-sm py-3 px-4 hover:bg-lime-500 hover:text-stone-900 transition-all flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" /> скопировано!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> скопировать
              </>
            )}
          </button>
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(refLink)}&text=${encodeURIComponent(
              "Сокращай ссылки и зарабатывай на них →"
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 border border-stone-900 font-mono text-sm py-3 px-4 hover:bg-stone-900 hover:text-stone-50 transition-all flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" /> поделиться
          </a>
        </div>
      </div>

      {/* Code */}
      <div className="bg-stone-50 border border-stone-900/10 p-6 mb-6">
        <div className="font-mono text-xs text-stone-500 mb-2">[ или_просто_код ]</div>
        <div className="font-display font-black text-3xl sm:text-4xl tracking-tighter mb-1">{user.refCode}</div>
        <div className="font-serif italic text-stone-600">введи этот код при регистрации</div>
      </div>

      {/* Referrals list */}
      <div className="bg-stone-50 border border-stone-900/10 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-xl">Твои рефералы</h2>
          <Award className="w-5 h-5 text-lime-600" />
        </div>
        {(user.referrals || []).length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-10 h-10 mx-auto mb-2 text-stone-300" strokeWidth={1} />
            <div className="font-display font-bold mb-1">Ещё никого нет</div>
            <div className="font-serif italic text-stone-500 text-sm">Поделись ссылкой выше, чтобы пригласить</div>
          </div>
        ) : (
          <div className="space-y-2">
            {(user.referrals || []).map((ref, i) => (
              <div key={ref} className="flex items-center justify-between py-2 border-b border-stone-900/5 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-stone-900 text-lime-400 font-mono text-xs flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-mono text-sm font-bold">@{ref}</div>
                    <div className="font-mono text-[10px] text-stone-500">активен</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-300" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
