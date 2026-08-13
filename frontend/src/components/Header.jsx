import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Bell, Menu, Globe } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { destinations } from "@/data/destinations";
import { useNavigate } from "react-router-dom";
import {
  Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";

const Header = () => {
  const { t, lang, toggleLang } = useApp();
  const navigate = useNavigate();

  const links = [
    { to: "/", label: t.nav.home },
    { to: "/explore", label: t.nav.explore },
    { to: "/planner", label: t.features.planner.title },
    { to: "/chat", label: t.features.chat.title },
    { to: "/image", label: t.features.image.title },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <Link to="/" data-testid="header-logo" className="flex items-center gap-2 shrink-0">
          <span className="w-9 h-9 rounded-2xl bg-brand flex items-center justify-center shadow-subtle">
            <MapPin className="w-5 h-5 text-white" />
          </span>
          <span className="text-lg font-bold text-ink">{t.appName}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              data-testid={`nav-link-${l.to}`}
              className="px-4 py-2 rounded-full text-sm font-medium text-ink-soft hover:text-brand hover:bg-brand-light transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <button
            data-testid="lang-toggle"
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold text-brand bg-brand-light hover:bg-brand-light/70 transition-colors active:scale-95"
          >
            <Globe className="w-4 h-4" />
            {lang === "ar" ? "EN" : "عربي"}
          </button>
          <button data-testid="notifications-btn" className="w-10 h-10 rounded-full hover:bg-brand-light flex items-center justify-center transition-colors relative">
            <Bell className="w-5 h-5 text-ink-soft" />
            <span className="absolute top-2 end-2 w-2 h-2 rounded-full bg-orange-400" />
          </button>

          <Sheet>
            <SheetTrigger asChild>
              <button data-testid="menu-btn" className="w-10 h-10 rounded-full hover:bg-brand-light flex items-center justify-center transition-colors">
                <Menu className="w-5 h-5 text-ink-soft" />
              </button>
            </SheetTrigger>
            <SheetContent side={lang === "ar" ? "right" : "left"} className="w-72 font-sans">
              <SheetHeader>
                <SheetTitle className="text-start text-ink">{t.appName}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-1">
                {links.map((l) => (
                  <button
                    key={l.to}
                    data-testid={`menu-link-${l.to}`}
                    onClick={() => navigate(l.to)}
                    className="text-start px-4 py-3 rounded-2xl text-ink hover:bg-brand-light transition-colors"
                  >
                    {l.label}
                  </button>
                ))}
                <div className="mt-4 mb-2 text-xs font-semibold text-ink-muted px-4">{t.exploreTitle}</div>
                {destinations.slice(0, 4).map((d) => (
                  <button
                    key={d.id}
                    onClick={() => navigate(`/destination/${d.id}`)}
                    className="text-start px-4 py-2.5 rounded-2xl text-ink-soft text-sm hover:bg-brand-light transition-colors"
                  >
                    {d.name[lang]}
                  </button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
