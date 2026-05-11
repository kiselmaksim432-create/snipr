import { Scissors, BarChart3, Users, Wallet, Globe, Zap, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Top bar */}
      <header className="border-b border-stone-900/10 bg-stone-50/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-stone-900 flex items-center justify-center rotate-3">
              <Scissors className="w-4 h-4 text-lime-400" strokeWidth={2.5} />
            </div>
            <span className="font-display font-black text-xl tracking-tight">
              SNIPR<span className="text-lime-500">.</span>
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="font-mono text-xs sm:text-sm px-3 py-2 hover:text-lime-600 transition-colors"
            >
              вход
            </Link>
            <Link
              to="/signup"
              className="font-mono text-xs sm:text-sm bg-stone-900 text-stone-50 px-4 py-2 hover:bg-lime-500 hover:text-stone-900 transition-all"
            >
              начать →
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative grid-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-32">
          <div className="anim-up">
            <div className="font-mono text-xs text-stone-500 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-lime-500 rounded-full animate-pulse" />
              сервис_активен · v2.4.1
            </div>
            <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-9xl leading-[0.85] tracking-tighter mb-8">
              ссылки.
              <br />
              <span className="italic font-serif font-normal">короче.</span>
              <br />
              <span className="text-lime-500">умнее.</span>
            </h1>
            <p className="font-serif text-xl sm:text-2xl lg:text-3xl text-stone-600 max-w-2xl leading-tight mb-10 italic">
              Сокращайте, отслеживайте, монетизируйте. Один сервис для всего, что вы делаете со ссылками.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/signup"
                className="group bg-stone-900 text-stone-50 font-mono text-sm px-6 py-4 flex items-center justify-center gap-2 hover:bg-lime-500 hover:text-stone-900 transition-all"
              >
                создать аккаунт
                <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="font-mono text-sm px-6 py-4 border border-stone-900 hover:bg-stone-900 hover:text-stone-50 transition-all text-center"
              >
                у меня есть аккаунт
              </Link>
            </div>
          </div>
        </div>

        {/* Marquee */}
        <div className="border-y border-stone-900/10 py-4 bg-stone-900 text-stone-50 overflow-hidden">
          <div className="marquee flex gap-8 whitespace-nowrap font-mono text-sm">
            {Array(2).fill(null).map((_, i) => (
              <div key={i} className="flex gap-8 items-center">
                <span>► АНАЛИТИКА В РЕАЛЬНОМ ВРЕМЕНИ</span>
                <span className="text-lime-400">◆</span>
                <span>► МОНЕТИЗАЦИЯ ПО CPM</span>
                <span className="text-lime-400">◆</span>
                <span>► РЕФЕРАЛЬНАЯ ПРОГРАММА 10%</span>
                <span className="text-lime-400">◆</span>
                <span>► QR-КОДЫ ВКЛЮЧЕНЫ</span>
                <span className="text-lime-400">◆</span>
                <span>► БЕСПЛАТНО НАВСЕГДА</span>
                <span className="text-lime-400">◆</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="font-mono text-xs text-stone-500 mb-3">[ возможности ]</div>
        <h2 className="font-display font-black text-3xl sm:text-5xl tracking-tight mb-12 max-w-3xl">
          Не просто <span className="italic font-serif font-normal text-lime-600">сократитель</span>. Полноценная платформа.
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-stone-900/10 border border-stone-900/10">
          {[
            { icon: Scissors, title: "Сокращение", desc: "Длинная ссылка → 6 символов. Кастомные алиасы. QR-код в один клик." },
            { icon: BarChart3, title: "Аналитика", desc: "Переходы, география, устройства, источники. Всё на одном дашборде." },
            { icon: Wallet, title: "Монетизация", desc: "Зарабатывайте на каждом переходе. Прозрачная статистика доходов." },
            { icon: Users, title: "Рефералы", desc: "Приглашайте друзей — получайте 10% от их доходов на счёт." },
            { icon: Globe, title: "Без границ", desc: "Работает везде, где есть интернет. Глобальная инфраструктура." },
            { icon: Zap, title: "Скорость", desc: "Редирект менее чем за 50 мс. Никаких задержек для ваших читателей." },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-stone-50 p-6 sm:p-8 hover:bg-lime-50 transition-colors group cursor-default anim-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start justify-between mb-6">
                <f.icon className="w-6 h-6 text-stone-900 group-hover:text-lime-600 transition-colors" strokeWidth={1.5} />
                <span className="font-mono text-xs text-stone-400">0{i + 1}</span>
              </div>
              <h3 className="font-display font-bold text-2xl mb-2">{f.title}</h3>
              <p className="font-serif text-stone-600 leading-snug">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-stone-900 text-stone-50 relative noise overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 relative z-10">
          <div className="font-mono text-xs text-lime-400 mb-3">[ начни_сейчас ]</div>
          <h2 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight mb-8 max-w-4xl">
            Первая ссылка через <span className="italic font-serif font-normal text-lime-400">30 секунд</span>.
          </h2>
          <Link
            to="/signup"
            className="group bg-lime-400 text-stone-900 font-mono text-sm px-6 py-4 inline-flex items-center gap-2 hover:bg-stone-50 transition-all"
          >
            зарегистрироваться бесплатно
            <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-stone-900/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs text-stone-500">
          <div>© 2026 SNIPR — все права отрезаны</div>
          <div className="flex gap-4">
            <span>v2.4.1</span>
            <span>·</span>
            <span>статус: ◉ онлайн</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
