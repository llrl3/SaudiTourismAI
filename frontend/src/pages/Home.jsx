import React from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Bot, ImageIcon, ArrowLeft, Sparkles } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { destinations } from "@/data/destinations";
import DestinationCard from "@/components/DestinationCard";

const FeatureCard = ({ to, icon: Icon, title, desc, bg, fg, testid }) => {
  const navigate = useNavigate();

  return (
    <button
      data-testid={testid}
      onClick={() => navigate(to)}
      className="text-start rounded-3xl p-6 sm:p-7 w-full shadow-subtle hover:-translate-y-1 transition-transform active:scale-[0.98]"
      style={{ backgroundColor: bg }}
    >
      <span className="w-14 h-14 rounded-2xl bg-white/70 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7" style={{ color: fg }} />
      </span>

      <h3 className="text-xl font-bold" style={{ color: fg }}>
        {title}
      </h3>

      <p className="text-sm text-ink-soft mt-2 leading-relaxed">
        {desc}
      </p>

      <span
        className="inline-flex items-center gap-1 mt-4 text-sm font-semibold"
        style={{ color: fg }}
      >
        <ArrowLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
      </span>
    </button>
  );
};

const Home = () => {
  const { t, lang } = useApp();
  const navigate = useNavigate();

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="rounded-[32px] bg-brand-light p-7 sm:p-10 relative overflow-hidden">
        <div className="absolute -top-10 -end-10 w-40 h-40 rounded-full bg-white/40 blur-2xl" />

        <span className="inline-flex items-center gap-1.5 bg-white/70 text-brand text-xs font-semibold px-3 py-1.5 rounded-full">
          <Sparkles className="w-3.5 h-3.5" /> AI
        </span>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-ink mt-4 leading-tight">
          {t.appName}
        </h1>

        <p className="text-base sm:text-lg text-ink-soft mt-3 max-w-lg leading-relaxed">
          {t.heroSubtitle}
        </p>
      </section>

      {/* Feature cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <FeatureCard
          testid="feature-planner"
          to="/planner"
          icon={CalendarDays}
          title={t.features.planner.title}
          desc={t.features.planner.desc}
          bg="#E8F3ED"
          fg="#2B7A5F"
        />

        <FeatureCard
          testid="feature-chat"
          to="/chat"
          icon={Bot}
          title={t.features.chat.title}
          desc={t.features.chat.desc}
          bg="#EFE8F5"
          fg="#6D4C94"
        />

        <FeatureCard
          testid="feature-image"
          to="/image"
          icon={ImageIcon}
          title={t.features.image.title}
          desc={t.features.image.desc}
          bg="#FDF0E6"
          fg="#B3632A"
        />
      </section>

      {/* Explore */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-ink">
              {t.exploreTitle}
            </h2>

            <p className="text-sm text-ink-muted mt-1">
              {t.exploreSubtitle}
            </p>
          </div>

          <button
            data-testid="see-all-btn"
            onClick={() => navigate("/explore")}
            className="text-sm font-semibold text-brand hover:underline"
          >
            {t.seeAll}
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {destinations
            .filter((d) =>
              [
                "riyadh",
                "jeddah",
                "makkah",
                "madinah",
                "taif",
                "abha",
                "al-ula",
                "dammam",
                "khobar",
                "tabuk",
                "jazan",
                "hail",
              ].includes(d.id)
            )
            .map((d) => (
              <DestinationCard
                key={d.id}
                dest={d}
                variant="overlay"
              />
            ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
