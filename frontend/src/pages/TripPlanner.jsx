import React, { useState } from "react";
import {
  CalendarDays,
  MapPin,
  Clock,
  Sparkles,
  Users,
  Calendar,
  Sun,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { destinations } from "@/data/destinations";
import { generateItinerary } from "@/lib/api";
import { toast } from "sonner";

const TripPlanner = () => {
  const { t, lang } = useApp();

  const [form, setForm] = useState({
    people: 2,
    days: 3,
    has_children: false,
    start_time: "09:00",
    trip_type: "family",
    city: "jeddah",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const typeMap = {
    relax: t.planner.types.relax,
    adventure: t.planner.types.adventure,
    culture: t.planner.types.culture,
    family: t.planner.types.family,
  };

  const cityName = (id) =>
    destinations.find((d) => d.id === id)?.name.ar || id;

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // تحويل الوقت إلى نظام 12 ساعة بصيغة ص / م
  const formatTime12 = (time) => {
    if (!time) return "";

    const value = String(time).trim();

    // إذا كان الوقت بصيغة AM / PM
    const ampmMatch = value.match(
      /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i
    );

    if (ampmMatch) {
      let hour = Number(ampmMatch[1]);
      const minutes = ampmMatch[2];
      const period = ampmMatch[3].toUpperCase() === "PM" ? "م" : "ص";

      if (hour === 0) hour = 12;
      else if (hour > 12) hour -= 12;

      return `${hour}:${minutes} ${period}`;
    }

    // إذا كان الوقت بصيغة 24 ساعة مثل 13:30
    const match = value.match(/(\d{1,2}):(\d{2})/);

    if (!match) return value;

    let hour = Number(match[1]);
    const minutes = match[2];

    const period = hour >= 12 ? "م" : "ص";

    if (hour === 0) hour = 12;
    else if (hour > 12) hour -= 12;

    return `${hour}:${minutes} ${period}`;
  };

  const submit = async () => {
    setLoading(true);
    setResult(null);

    try {
      const data = await generateItinerary({
        city: cityName(form.city),
        people: Number(form.people),
        days: Number(form.days),
        has_children: form.has_children,
        start_time: form.start_time,
        trip_type: typeMap[form.trip_type],
      });

      setResult(data);
    } catch (e) {
      toast.error(t.errors.ai);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>{t.planner.title}</h1>
      <p>{t.planner.subtitle}</p>

      <div className="bg-white rounded-3xl p-6 shadow-subtle space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label={t.planner.people} icon={Users}>
            <input
              data-testid="input-people"
              type="number"
              min="1"
              value={form.people}
              onChange={(e) => set("people", e.target.value)}
              className="input-soft"
            />
          </Field>

          <Field label={t.planner.days} icon={Calendar}>
            <input
              data-testid="input-days"
              type="number"
              min="1"
              max="10"
              value={form.days}
              onChange={(e) => set("days", e.target.value)}
              className="input-soft"
            />
          </Field>

          <Field label={t.planner.startTime} icon={Sun}>
            <select
              data-testid="input-start"
              value={form.start_time}
              onChange={(e) => set("start_time", e.target.value)}
              className="input-soft"
            >
              {[
                ["00:00", "12:00 ص"],
                ["01:00", "1:00 ص"],
                ["02:00", "2:00 ص"],
                ["03:00", "3:00 ص"],
                ["04:00", "4:00 ص"],
                ["05:00", "5:00 ص"],
                ["06:00", "6:00 ص"],
                ["07:00", "7:00 ص"],
                ["08:00", "8:00 ص"],
                ["09:00", "9:00 ص"],
                ["10:00", "10:00 ص"],
                ["11:00", "11:00 ص"],
                ["12:00", "12:00 م"],
                ["13:00", "1:00 م"],
                ["14:00", "2:00 م"],
                ["15:00", "3:00 م"],
                ["16:00", "4:00 م"],
                ["17:00", "5:00 م"],
                ["18:00", "6:00 م"],
                ["19:00", "7:00 م"],
                ["20:00", "8:00 م"],
                ["21:00", "9:00 م"],
                ["22:00", "10:00 م"],
                ["23:00", "11:00 م"],
              ].map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>

          <Field label={t.planner.city} icon={MapPin}>
            <select
              data-testid="input-city"
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
              className="input-soft"
            >
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name[lang]}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label={t.planner.children}>
          <div className="flex gap-3">
            {[
              { v: false, l: t.planner.no },
              { v: true, l: t.planner.yes },
            ].map((o) => (
              <button
                key={String(o.v)}
                data-testid={`children-${o.v}`}
                onClick={() => set("has_children", o.v)}
                className={`flex-1 py-3 rounded-2xl font-semibold text-sm transition-colors ${
                  form.has_children === o.v
                    ? "bg-brand text-white"
                    : "bg-[#F8FAF9] text-ink-soft"
                }`}
              >
                {o.l}
              </button>
            ))}
          </div>
        </Field>

        <Field label={t.planner.tripType}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {Object.entries(typeMap).map(([k, l]) => (
              <button
                key={k}
                data-testid={`type-${k}`}
                onClick={() => set("trip_type", k)}
                className={`py-3 rounded-2xl font-semibold text-sm transition-colors ${
                  form.trip_type === k
                    ? "bg-brand-light text-brand ring-2 ring-brand/30"
                    : "bg-[#F8FAF9] text-ink-soft"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </Field>

        <button
          data-testid="generate-itinerary-btn"
          onClick={submit}
          disabled={loading}
          className="w-full bg-brand text-white rounded-full py-4 font-bold hover:bg-brand-hover transition-colors active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Sparkles className="w-5 h-5 animate-pulse" />
              {t.planner.generating}
            </>
          ) : (
            t.planner.cta
          )}
        </button>
      </div>

      {loading && <ItinerarySkeleton />}

      {result && (
        <div className="space-y-5" data-testid="itinerary-result">
          {result.title && (
            <h2 className="text-xl font-bold text-ink text-center">
              {result.title}
            </h2>
          )}

          {(result.days || []).map((day, di) => (
            <div
              key={di}
              className="bg-white rounded-3xl p-5 shadow-subtle"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="w-9 h-9 rounded-full bg-brand text-white flex items-center justify-center font-bold text-sm">
                  {day.day || di + 1}
                </span>

                <h3 className="font-bold text-ink">
                  {t.planner.day} {day.day || di + 1}
                </h3>
              </div>

              <div className="space-y-3">
                {(day.items || []).map((item, ii) => (
                  <div key={ii} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-bold text-brand bg-brand-light rounded-full px-2.5 py-1 whitespace-nowrap">
                        {formatTime12(item.time)}
                      </span>

                      {ii < day.items.length - 1 && (
                        <span className="w-0.5 flex-1 bg-line my-1" />
                      )}
                    </div>

                    <div className="flex-1 bg-[#F8FAF9] rounded-2xl p-4 mb-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-bold text-ink flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-brand" />
                          {item.place}
                        </h4>
                      </div>

                      <p className="text-sm font-medium text-feat-blueText mt-1">
                        {item.activity}
                      </p>

                      <p className="text-sm text-ink-soft mt-1.5 leading-relaxed">
                        {item.description}
                      </p>

                      {item.duration && (
                        <span className="inline-flex items-center gap-1 text-xs text-ink-muted mt-2">
                          <Clock className="w-3.5 h-3.5" />
                          {item.duration}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .input-soft {
          background: #F8FAF9;
          border: none;
          border-radius: 1rem;
          padding: 0.85rem 1rem;
          width: 100%;
          font-family: inherit;
          font-size: 0.95rem;
          color: #1A2E26;
          outline: none;
        }

        .input-soft:focus {
          box-shadow: 0 0 0 2px rgba(43,122,95,0.2);
        }
      `}</style>
    </div>
  );
};

const Field = ({ label, icon: Icon, children }) => (
  <div>
    <div className="flex items-center gap-2 mb-2 font-semibold text-ink">
      {Icon && <Icon className="w-4 h-4" />}
      {label}
    </div>
    {children}
  </div>
);

const ItinerarySkeleton = () => (
  <div className="bg-white rounded-3xl p-5 shadow-subtle">
    <div className="animate-pulse space-y-4">
      <div className="h-5 bg-gray-200 rounded w-1/3" />
      <div className="h-16 bg-gray-200 rounded-2xl" />
      <div className="h-16 bg-gray-200 rounded-2xl" />
      <div className="h-16 bg-gray-200 rounded-2xl" />
    </div>
  </div>
);

export default TripPlanner;