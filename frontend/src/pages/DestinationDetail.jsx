import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, ArrowRight, Clock, Sparkles, Heart, Check } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { getDestination } from "@/data/destinations";
import { getDestinationSuggestions } from "@/lib/api";

const DestinationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang, t, isFavorite, toggleFavorite } = useApp();
  const dest = getDestination(id);
  const [ai, setAi] = useState(null);
  const [loadingAi, setLoadingAi] = useState(true);

  useEffect(() => {
    let active = true;
    setLoadingAi(true);
    setAi(null);
    if (dest) {
      getDestinationSuggestions(dest.name.ar)
        .then((d) => active && setAi(d.suggestions || []))
        .catch(() => active && setAi([]))
        .finally(() => active && setLoadingAi(false));
    }
    return () => { active = false; };
  }, [id]);

  if (!dest) return <div className="text-center py-20 text-ink-muted">غير موجود</div>;
  const fav = isFavorite(dest.id);

  return (
    <div className="space-y-6" data-testid="destination-detail">
      <div className="relative rounded-[32px] overflow-hidden h-56 sm:h-72">
        <img src={dest.image} alt={dest.name[lang]} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <button onClick={() => navigate(-1)} className="absolute top-4 start-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center active:scale-90 transition-transform">
          <ArrowRight className="w-5 h-5 text-ink rtl:rotate-0 ltr:rotate-180" />
        </button>
        <button
          data-testid="detail-fav-btn"
          onClick={() => toggleFavorite(dest.id)}
          className="absolute top-4 end-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center active:scale-90 transition-transform"
        >
          <Heart className={`w-5 h-5 ${fav ? "fill-red-500 text-red-500" : "text-ink"}`} />
        </button>
        <div className="absolute bottom-0 inset-x-0 p-5 text-white">
          <h1 className="text-3xl font-extrabold">{dest.name[lang]}</h1>
          <span className="flex items-center gap-1.5 text-sm text-white/90 mt-1"><MapPin className="w-4 h-4" />{dest.region[lang]}</span>
        </div>
      </div>

      <Section title={t.detail.about}>
        <p className="text-ink-soft leading-relaxed">{dest.desc[lang]}</p>
      </Section>

      <div className="grid sm:grid-cols-2 gap-4">
        <Section title={t.detail.attractions}>
          <ul className="space-y-2.5">
            {dest.attractions[lang].map((a, i) => (
              <li key={i} className="flex items-center gap-2.5 text-ink-soft">
                <span className="w-6 h-6 rounded-full bg-feat-blue flex items-center justify-center shrink-0"><MapPin className="w-3.5 h-3.5 text-feat-blueText" /></span>
                {a}
              </li>
            ))}
          </ul>
        </Section>
        <Section title={t.detail.activities}>
          <ul className="space-y-2.5">
            {dest.activities[lang].map((a, i) => (
              <li key={i} className="flex items-center gap-2.5 text-ink-soft">
                <span className="w-6 h-6 rounded-full bg-brand-light flex items-center justify-center shrink-0"><Check className="w-3.5 h-3.5 text-brand" /></span>
                {a}
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <Section title={t.detail.duration}>
        <span className="inline-flex items-center gap-2 bg-feat-orange text-feat-orangeText font-semibold px-4 py-2 rounded-full">
          <Clock className="w-4 h-4" />{dest.duration[lang]}
        </span>
      </Section>

      <Section title={t.detail.aiSuggestions} accent>
        {loadingAi ? (
          <div className="flex items-center gap-2 text-ink-muted"><Sparkles className="w-4 h-4 animate-pulse text-feat-purpleText" />{t.detail.loadingAi}</div>
        ) : ai && ai.length ? (
          <ul className="space-y-2.5">
            {ai.map((s, i) => (
              <li key={i} className="flex items-start gap-2.5 text-ink-soft">
                <span className="w-6 h-6 rounded-full bg-feat-purple flex items-center justify-center shrink-0 mt-0.5"><Sparkles className="w-3.5 h-3.5 text-feat-purpleText" /></span>
                {s}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-ink-muted text-sm">{t.errors.ai}</p>
        )}
      </Section>

      <button
        data-testid="map-btn"
        onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(dest.name.ar)}`, "_blank")}
        className="w-full bg-brand text-white rounded-full py-4 font-semibold hover:bg-brand-hover transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
      >
        <MapPin className="w-5 h-5" />{t.detail.map}
      </button>
    </div>
  );
};

const Section = ({ title, children, accent }) => (
  <section className={`rounded-3xl p-6 shadow-subtle ${accent ? "bg-feat-purple/40" : "bg-white"}`}>
    <h2 className="text-lg font-bold text-ink mb-3">{title}</h2>
    {children}
  </section>
);

export default DestinationDetail;
