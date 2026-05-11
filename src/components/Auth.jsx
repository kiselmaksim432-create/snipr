import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Eye, EyeOff, ArrowUpRight } from "lucide-react";

export default function Auth({ mode, login, signup }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [refCode, setRefCode] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Автоподстановка реф-кода из URL
  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) setRefCode(ref);
  }, [searchParams]);

  const handleSubmit = () => {
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("заполни все поля");
      return;
    }
    if (username.length < 3) {
      setError("логин минимум 3 символа");
      return;
    }
    if (password.length < 4) {
      setError("пароль минимум 4 символа");
      return;
    }
    setBusy(true);
    const result = mode === "login" ? login(username, password) : signup(username, password, refCode);
    if (!result.ok) {
      setError(result.error);
      setBusy(false);
      return;
    }
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Левая часть — декор */}
      <div className="hidden lg:flex bg-stone-900 text-stone-50 p-12 relative noise overflow-hidden flex-col justify-between">
        <Link
          to="/"
          className="font-mono text-sm text-stone-400 hover:text-lime-400 transition-colors flex items-center gap-2 w-fit relative z-10"
        >
          ← на_главную
        </Link>
        <div className="relative z-10">
          <div className="font-mono text-xs text-lime-400 mb-3">[ snipr_v2.4.1 ]</div>
          <h2 className="font-display font-black text-6xl xl:text-7xl tracking-tighter leading-[0.9] mb-6">
            Сокращай.
            <br />
            <span className="italic font-serif font-normal text-lime-400">Считай.</span>
            <br />
            Зарабатывай.
          </h2>
          <p className="font-serif text-xl text-stone-400 italic max-w-md">
            Каждый клик — это данные. Каждая ссылка — возможность.
          </p>
        </div>
        <div className="font-mono text-xs text-stone-500 relative z-10 grid grid-cols-2 gap-y-2">
          <div>► uptime</div>
          <div className="text-lime-400">99.97%</div>
          <div>► clicks_total</div>
          <div className="text-lime-400">2.4M+</div>
          <div>► users</div>
          <div className="text-lime-400">12,847</div>
        </div>
      </div>

      {/* Правая часть — форма */}
      <div className="flex items-center justify-center p-6 sm:p-12 grid-bg">
        <div className="w-full max-w-md anim-scale">
          <Link
            to="/"
            className="lg:hidden font-mono text-sm text-stone-500 hover:text-lime-600 transition-colors flex items-center gap-2 mb-8"
          >
            ← назад
          </Link>

          <div className="font-mono text-xs text-stone-500 mb-3">
            [ {mode === "login" ? "вход" : "регистрация"} ]
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl tracking-tight mb-2">
            {mode === "login" ? "С возвращением." : "Поехали."}
          </h1>
          <p className="font-serif text-stone-600 text-lg italic mb-8">
            {mode === "login" ? "Введите данные ниже." : "Создайте аккаунт за 10 секунд."}
          </p>

          <div className="space-y-4">
            <div>
              <label className="font-mono text-xs text-stone-500 block mb-1">логин</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="w-full bg-transparent border-b-2 border-stone-900 py-2 px-0 font-mono text-base focus:border-lime-500 outline-none transition-colors"
                placeholder="username"
                autoFocus
              />
            </div>
            <div>
              <label className="font-mono text-xs text-stone-500 block mb-1">пароль</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full bg-transparent border-b-2 border-stone-900 py-2 pr-8 px-0 font-mono text-base focus:border-lime-500 outline-none transition-colors"
                  placeholder="••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-0 top-2 text-stone-500 hover:text-stone-900"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {mode === "signup" && (
              <div>
                <label className="font-mono text-xs text-stone-500 block mb-1">
                  реферальный код <span className="text-stone-400">(не обязательно)</span>
                </label>
                <input
                  value={refCode}
                  onChange={(e) => setRefCode(e.target.value.trim())}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full bg-transparent border-b-2 border-stone-900 py-2 px-0 font-mono text-base focus:border-lime-500 outline-none transition-colors"
                  placeholder="abcd1234"
                />
              </div>
            )}

            {error && (
              <div className="font-mono text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2">
                ⚠ {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={busy}
              className="w-full bg-stone-900 text-stone-50 font-mono text-sm py-4 hover:bg-lime-500 hover:text-stone-900 transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
            >
              {busy ? "обработка..." : mode === "login" ? "войти" : "создать_аккаунт"}
              <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
            </button>

            <div className="text-center pt-4">
              <Link
                to={mode === "login" ? "/signup" : "/login"}
                className="font-mono text-xs text-stone-500 hover:text-lime-600 transition-colors"
              >
                {mode === "login"
                  ? "→ нет аккаунта? зарегистрироваться"
                  : "→ уже есть аккаунт? войти"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
