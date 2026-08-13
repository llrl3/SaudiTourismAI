import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Heart } from "lucide-react";
import { useApp } from "@/context/AppContext";

const DestinationCard = ({ dest, variant = "overlay" }) => {
  const { lang, t, isFavorite, toggleFavorite } = useApp();
  const navigate = useNavigate();
  const fav = isFavorite(dest.id);

  const imageUrl =
    dest.image ||
    "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1200&q=80";

  if (variant === "overlay") {
    return (
      <button
        data-testid={`dest-card-${dest.id}`}
        onClick={() => navigate(`/destination/${dest.id}`)}
        className="relative rounded-3xl overflow-hidden h-44 sm:h-52 w-full text-start group shadow-subtle hover:-translate-y-1 transition-transform"
      >
        <img
          src={imageUrl}
          alt={dest.name[lang]}
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1200&q=80";
          }}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

        <span
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(dest.id);
          }}
          className="absolute top-3 end-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center active:scale-90 transition-transform"
        >
          <Heart
            className={`w-4.5 h-4.5 ${
              fav ? "fill-red-500 text-red-500" : "text-ink-soft"
            }`}
          />
        </span>

        <div className="absolute bottom-0 inset-x-0 p-4 text-white">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            <span className="text-lg font-bold">{dest.name[lang]}</span>
          </div>
          <span className="text-xs text-white/85">{dest.region[lang]}</span>
        </div>
      </button>
    );
  }

  return (
    <div
      data-testid={`dest-card-${dest.id}`}
      className="bg-white rounded-3xl overflow-hidden shadow-subtle hover:shadow-floating hover:-translate-y-1 transition-all"
    >
      <div className="relative h-40">
        <img
          src={imageUrl}
          alt={dest.name[lang]}
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1200&q=80";
          }}
          className="w-full h-full object-cover"
        />

        <span
          onClick={() => toggleFavorite(dest.id)}
          className="absolute top-3 end-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
        >
          <Heart
            className={`w-4 h-4 ${
              fav ? "fill-red-500 text-red-500" : "text-ink-soft"
            }`}
          />
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-1.5 text-ink">
          <MapPin className="w-4 h-4 text-brand" />
          <h3 className="text-lg font-bold">{dest.name[lang]}</h3>
        </div>

        <p className="text-xs text-ink-muted mt-0.5">{dest.region[lang]}</p>

        <p className="text-sm text-ink-soft mt-2 leading-relaxed line-clamp-2">
          {dest.desc[lang]}
        </p>

        <button
          data-testid={`explore-btn-${dest.id}`}
          onClick={() => navigate(`/destination/${dest.id}`)}
          className="mt-4 w-full bg-brand-light text-brand rounded-full py-2.5 font-semibold text-sm hover:bg-brand hover:text-white transition-colors active:scale-95"
        >
          {t.explore}
        </button>
      </div>
    </div>
  );
};

export default DestinationCard;
