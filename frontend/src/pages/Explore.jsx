import React from "react";
import { useApp } from "@/context/AppContext";
import { destinations } from "@/data/destinations";
import DestinationCard from "@/components/DestinationCard";

const Explore = () => {
  const { t } = useApp();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-ink">{t.exploreTitle}</h1>
        <p className="text-sm text-ink-muted mt-1">{t.exploreSubtitle}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" data-testid="explore-grid">
        {destinations.map((d) => (
          <DestinationCard key={d.id} dest={d} variant="detailed" />
        ))}
      </div>
    </div>
  );
};

export default Explore;
