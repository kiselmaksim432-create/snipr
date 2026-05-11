import { useMemo } from "react";
import { MousePointerClick, DollarSign, Globe, TrendingUp, BarChart3 } from "lucide-react";
import { formatMoney, formatTime, BASE_URL } from "../lib/utils";

export default function AnalyticsTab({ links, totalClicks, totalRevenue }) {
  const allClicks = useMemo(() => {
    return links
      .flatMap((l) => (l.clicks || []).map((c) => ({ ...c, shortCode: l.shortCode })))
      .sort((a, b) => b.ts - a.ts);
  }, [links]);

  const byCountry = useMemo(() => {
    const map = {};
    allClicks.forEach((c) => {
      map[c.country] = (map[c.country] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [allClicks]);

  const byDevice = useMemo(() => {
    const map = {};
    allClicks.forEach((c) => {
      map[c.device] = (map[c.device] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [allClicks]);

  const last7Days = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      const start = d.getTime();
      const end = start + 86400000;
      const count = allClicks.filter((c) => c.ts >= start && c.ts < end).length;
      days.push({
        label: d.toLocaleDateString("ru-RU", { weekday: "short" }),
        count,
        date: d,
      });
    }
    const max = Math.max(...days.map((d) => d.count), 1);
    return days.map((d) => ({ ...d, pct: (d.count / max) * 100 }));
  }, [allClicks]);

  const topLinks = useMemo(() => {
    return [...links]
      .map((l) => ({ ...l, clickCount: (l.clicks || []).length }))
      .sort((a, b) => b.clickCount - a.clickCount)
      .slice(0, 5);
  }, [links]);

  return (
    <div className="anim-up">
      <div className="font-mono text-xs text-stone-500 mb-2">[ панель / аналитика ]</div>
      <h1 className="font-display font-black text-4xl sm:text-5xl tracking-tight mb-8">
        Цифры <span className="italic font-serif font-normal text-lime-600">не врут</span>.
      </h1>

      {/* Top stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-stone-900/10 border border-stone-900/10 mb-10">
        {[
          { label: "переходы", value: totalClicks, icon: MousePointerClick },
          { label: "доход общий", value: formatMoney(totalRevenue), icon: DollarSign },
          { label: "стран", value: byCountry.length, icon: Globe },
          { label: "ссылок активно", value: links.filter((l) => (l.clicks || []).length > 0).length, icon: TrendingUp },
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

      {totalClicks === 0 ? (
        <div className="border-2 border-dashed border-stone-300 py-16 text-center">
          <BarChart3 className="w-12 h-12 mx-auto mb-3 text-stone-300" strokeWidth={1} />
          <div className="font-display font-bold text-xl mb-1">Данных пока нет</div>
          <div className="font-serif italic text-stone-500">Когда появятся переходы — появится аналитика</div>
        </div>
      ) : (
        <>
          {/* Chart - last 7 days */}
          <div className="bg-stone-50 border border-stone-900/10 p-6 sm:p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-xl">Переходы / 7 дней</h2>
              <span className="font-mono text-xs text-stone-500">по_дням</span>
            </div>
            <div className="flex items-end gap-2 sm:gap-4 h-48">
              {last7Days.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="font-mono text-[10px] text-stone-500">{d.count}</div>
                  <div
                    className="w-full bg-stone-900 hover:bg-lime-500 transition-colors relative group"
                    style={{ height: `${Math.max(d.pct, 2)}%` }}
                  >
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 font-mono text-[10px] bg-stone-900 text-stone-50 px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {d.date.toLocaleDateString("ru-RU")}
                    </div>
                  </div>
                  <div className="font-mono text-xs text-stone-500 capitalize">{d.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Countries */}
            <div className="bg-stone-50 border border-stone-900/10 p-6">
              <h2 className="font-display font-bold text-xl mb-4">География</h2>
              <div className="space-y-2">
                {byCountry.slice(0, 6).map(([country, count]) => {
                  const pct = (count / totalClicks) * 100;
                  return (
                    <div key={country} className="font-mono text-sm">
                      <div className="flex justify-between mb-1">
                        <span>{country}</span>
                        <span className="text-stone-500">
                          {count} <span className="text-stone-400 text-xs">({pct.toFixed(0)}%)</span>
                        </span>
                      </div>
                      <div className="h-1.5 bg-stone-200 relative">
                        <div className="absolute inset-y-0 left-0 bg-lime-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Devices */}
            <div className="bg-stone-50 border border-stone-900/10 p-6">
              <h2 className="font-display font-bold text-xl mb-4">Устройства</h2>
              <div className="space-y-2">
                {byDevice.map(([device, count]) => {
                  const pct = (count / totalClicks) * 100;
                  return (
                    <div key={device} className="font-mono text-sm">
                      <div className="flex justify-between mb-1">
                        <span className="capitalize">{device}</span>
                        <span className="text-stone-500">
                          {count} <span className="text-stone-400 text-xs">({pct.toFixed(0)}%)</span>
                        </span>
                      </div>
                      <div className="h-1.5 bg-stone-200 relative">
                        <div className="absolute inset-y-0 left-0 bg-stone-900" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Top links */}
          {topLinks.length > 0 && (
            <div className="bg-stone-50 border border-stone-900/10 p-6 mb-6">
              <h2 className="font-display font-bold text-xl mb-4">Топ ссылок</h2>
              <div className="space-y-2">
                {topLinks.map((l, i) => (
                  <div key={l.id} className="flex items-center gap-3 py-2 border-b border-stone-900/5 last:border-0">
                    <div className="font-display font-black text-2xl text-stone-300 w-8">{i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-sm font-bold truncate">{BASE_URL}/{l.shortCode}</div>
                      <div className="font-mono text-xs text-stone-500 truncate">{l.longUrl}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-display font-black text-xl">{l.clickCount}</div>
                      <div className="font-mono text-[10px] text-stone-500">кликов</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent clicks */}
          <div className="bg-stone-50 border border-stone-900/10 p-6">
            <h2 className="font-display font-bold text-xl mb-4">Последние переходы</h2>
            <div className="space-y-1 max-h-80 overflow-y-auto">
              {allClicks.slice(0, 20).map((c, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-2 py-2 border-b border-stone-900/5 last:border-0 font-mono text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="text-stone-400 flex-shrink-0">{formatTime(c.ts)}</span>
                    <span className="font-bold truncate">/{c.shortCode}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 text-stone-500 flex-shrink-0">
                    <span className="hidden sm:inline">{c.country}</span>
                    <span className="hidden sm:inline">·</span>
                    <span>{c.device}</span>
                    <span className="hidden sm:inline">·</span>
                    <span className="text-lime-700 hidden sm:inline">+{c.revenue.toFixed(3)}₽</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
