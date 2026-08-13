import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Compass, Heart, MessageCircle, User } from "lucide-react";
import { useApp } from "@/context/AppContext";

const BottomNav = () => {
  const { t } = useApp();
  const items = [
    { to: "/", icon: Home, label: t.nav.home },
    { to: "/explore", icon: Compass, label: t.nav.explore },
    { to: "/favorites", icon: Heart, label: t.nav.favorites },
    { to: "/chat", icon: MessageCircle, label: t.nav.chats },
    { to: "/profile", icon: User, label: t.nav.profile },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-line rounded-t-3xl shadow-[0_-4px_20px_rgb(0,0,0,0.04)]">
      <div className="flex justify-around items-center h-[72px] px-2 max-w-md mx-auto">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            data-testid={`bottomnav-${to}`}
            className="flex flex-col items-center gap-1 flex-1"
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex items-center justify-center w-11 h-8 rounded-full transition-colors ${
                    isActive ? "bg-brand-light" : ""
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-colors ${isActive ? "text-brand" : "text-ink-muted"}`} />
                </span>
                <span className={`text-[11px] transition-colors ${isActive ? "text-brand font-semibold" : "text-ink-muted"}`}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
