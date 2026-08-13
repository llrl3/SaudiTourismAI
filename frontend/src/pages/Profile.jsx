import React from "react";
import { User, Map, Bookmark, Settings, Globe, Info, ChevronLeft } from "lucide-react";
import { useApp } from "@/context/AppContext";

const Profile = () => {
  const { t, lang, toggleLang, favorites } = useApp();

  const rows = [
    { icon: Map, label: t.profile.trips, value: "0" },
    { icon: Bookmark, label: t.profile.saved, value: String(favorites.length) },
    { icon: Globe, label: t.profile.language, value: lang === "ar" ? "العربية" : "English", onClick: toggleLang },
    { icon: Settings, label: t.profile.settings },
    { icon: Info, label: t.profile.about },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-brand rounded-[32px] p-7 text-white flex items-center gap-4 shadow-floating">
        <span className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center"><User className="w-8 h-8" /></span>
        <div>
          <h1 className="text-xl font-extrabold">{t.profile.name}</h1>
          <p className="text-white/85 text-sm mt-0.5">{t.profile.desc}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-subtle overflow-hidden divide-y divide-line">
        {rows.map((r, i) => (
          <button key={i} data-testid={`profile-row-${i}`} onClick={r.onClick}
            className="w-full flex items-center gap-3 px-5 py-4 hover:bg-[#F8FAF9] transition-colors text-start">
            <span className="w-10 h-10 rounded-2xl bg-brand-light flex items-center justify-center"><r.icon className="w-5 h-5 text-brand" /></span>
            <span className="flex-1 font-medium text-ink">{r.label}</span>
            {r.value && <span className="text-sm text-ink-muted">{r.value}</span>}
            <ChevronLeft className="w-5 h-5 text-ink-muted rtl:rotate-0 ltr:rotate-180" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Profile;
