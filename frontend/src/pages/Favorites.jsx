import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Compass } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { destinations } from "@/data/destinations";
import DestinationCard from "@/components/DestinationCard";

const Favorites = () => {
  const { t, favorites } = useApp();
  const navigate = useNavigate();
  const favDests = destinations.filter((d) => favorites.includes(d.id));

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <span className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center"><Heart className="w-6 h-6 text-red-500" /></span>
        <div>
          <h1 className="text-2xl font-extrabold text-ink">{t.favorites.title}</h1>
          <p className="text-sm text-ink-muted mt-1">{t.favorites.subtitle}</p>
        </div>
      </header>

      {favDests.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 shadow-subtle flex flex-col items-center gap-4 text-center" data-testid="favorites-empty">
          <span className="w-20 h-20 rounded-full bg-brand-light flex items-center justify-center"><Heart className="w-9 h-9 text-brand" /></span>
          <p className="text-ink-muted">{t.favorites.empty}</p>
          <button onClick={() => navigate("/explore")} className="bg-brand text-white rounded-full px-6 py-3 font-semibold hover:bg-brand-hover transition-colors active:scale-95 flex items-center gap-2">
            <Compass className="w-5 h-5" />{t.exploreTitle}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favDests.map((d) => <DestinationCard key={d.id} dest={d} variant="detailed" />)}
        </div>
      )}
    </div>
  );
};

export default Favorites;
