import React, { useState, useRef } from "react";
import { ImageIcon, Camera, Images, FileUp, Sparkles, MapPin, Info, Activity, Compass, X, Gauge } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { analyzeImage } from "@/lib/api";
import { toast } from "sonner";

const ImageAnalysis = () => {
  const { t } = useApp();
  const [image, setImage] = useState(null);
  const [question, setQuestion] = useState(t.image.questions[0]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const captureRef = useRef(null);
  const galleryRef = useRef(null);
  const fileRef = useRef(null);

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!/image\/(jpeg|jpg|png|webp)/.test(f.type)) { toast.error("الرجاء اختيار صورة JPG أو PNG أو WEBP"); return; }
    const reader = new FileReader();
    reader.onload = () => { setImage(reader.result); setResult(null); };
    reader.readAsDataURL(f);
  };

  const analyze = async () => {
    if (!image) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await analyzeImage(image, question);
      setResult(data);
    } catch (e) {
      toast.error(t.errors.ai);
    } finally {
      setLoading(false);
    }
  };

  const UploadBtn = ({ icon: Icon, label, inputRef, capture, testid }) => (
    <>
      <button data-testid={testid} onClick={() => inputRef.current?.click()}
        className="flex flex-col items-center gap-2 bg-feat-orange rounded-2xl py-5 flex-1 hover:opacity-80 transition-opacity active:scale-95">
        <Icon className="w-6 h-6 text-feat-orangeText" />
        <span className="text-xs font-semibold text-feat-orangeText">{label}</span>
      </button>
      <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" capture={capture} onChange={onFile} className="hidden" />
    </>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header className="flex items-start gap-3">
        <span className="w-12 h-12 rounded-2xl bg-feat-orange flex items-center justify-center shrink-0"><ImageIcon className="w-6 h-6 text-feat-orangeText" /></span>
        <div>
          <h1 className="text-2xl font-extrabold text-ink">{t.image.title}</h1>
          <p className="text-sm text-ink-muted mt-1">{t.image.subtitle}</p>
        </div>
      </header>

      {!image ? (
        <div className="bg-white rounded-3xl p-6 shadow-subtle">
          <div className="border-2 border-dashed border-line rounded-2xl py-10 flex flex-col items-center gap-2 mb-4">
            <span className="w-16 h-16 rounded-full bg-feat-orange flex items-center justify-center"><ImageIcon className="w-8 h-8 text-feat-orangeText" /></span>
            <p className="text-ink-muted text-sm mt-2">{t.image.empty}</p>
          </div>
          <div className="flex gap-3">
            <UploadBtn testid="capture-btn" icon={Camera} label={t.image.capture} inputRef={captureRef} capture="environment" />
            <UploadBtn testid="gallery-btn" icon={Images} label={t.image.gallery} inputRef={galleryRef} />
            <UploadBtn testid="file-btn" icon={FileUp} label={t.image.file} inputRef={fileRef} />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-4 shadow-subtle">
          <div className="relative rounded-2xl overflow-hidden">
            <img src={image} alt="preview" className="w-full max-h-80 object-cover" data-testid="image-preview" />
            <button data-testid="remove-image-btn" onClick={() => { setImage(null); setResult(null); }}
              className="absolute top-3 end-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center active:scale-90 transition-transform">
              <X className="w-5 h-5 text-ink" />
            </button>
          </div>
        </div>
      )}

      {image && (
        <>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            {t.image.questions.map((q, i) => (
              <button key={i} data-testid={`question-${i}`} onClick={() => setQuestion(q)}
                className={`whitespace-nowrap text-sm font-medium px-4 py-2.5 rounded-full transition-colors ${question === q ? "bg-feat-orangeText text-white" : "bg-feat-orange text-feat-orangeText"}`}>
                {q}
              </button>
            ))}
          </div>

          <button data-testid="analyze-btn" onClick={analyze} disabled={loading}
            className="w-full bg-feat-orangeText text-white rounded-full py-4 font-bold hover:opacity-90 transition-opacity active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2">
            {loading ? <><Sparkles className="w-5 h-5 animate-pulse" />{t.image.analyzing}</> : t.image.analyze}
          </button>
        </>
      )}

      {loading && (
        <div className="bg-white rounded-3xl p-6 shadow-subtle animate-pulse space-y-3">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-14 bg-[#F8FAF9] rounded-2xl" />)}
        </div>
      )}

      {result && (
        <div className="space-y-3" data-testid="analysis-result">
          <ResultRow icon={MapPin} color="brand" title={t.image.result.place} value={result.place} />
          {result.confidence != null && (
            <div className="bg-white rounded-3xl p-5 shadow-subtle">
              <div className="flex items-center gap-2 mb-2 text-ink font-bold"><Gauge className="w-5 h-5 text-feat-blueText" />{t.image.result.confidence}</div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2.5 bg-[#F8FAF9] rounded-full overflow-hidden">
                  <div className="h-full bg-brand rounded-full transition-all" style={{ width: `${Math.min(100, Math.max(0, result.confidence))}%` }} />
                </div>
                <span className="text-sm font-bold text-brand">{Math.round(result.confidence)}%</span>
              </div>
            </div>
          )}
          <ResultRow icon={Info} color="blue" title={t.image.result.description} value={result.description} />
          <ResultRow icon={Info} color="orange" title={t.image.result.info} value={result.tourist_info} />
          <ResultList icon={Activity} color="green" title={t.image.result.activities} items={result.activities} />
          <ResultList icon={Compass} color="purple" title={t.image.result.nearby} items={result.nearby} />
        </div>
      )}
    </div>
  );
};

const colorMap = {
  brand: "bg-brand-light text-brand",
  blue: "bg-feat-blue text-feat-blueText",
  orange: "bg-feat-orange text-feat-orangeText",
  green: "bg-brand-light text-brand",
  purple: "bg-feat-purple text-feat-purpleText",
};

const ResultRow = ({ icon: Icon, color, title, value }) => {
  if (!value) return null;
  return (
    <div className="bg-white rounded-3xl p-5 shadow-subtle">
      <div className="flex items-center gap-2 mb-2">
        <span className={`w-8 h-8 rounded-full flex items-center justify-center ${colorMap[color]}`}><Icon className="w-4 h-4" /></span>
        <h3 className="font-bold text-ink">{title}</h3>
      </div>
      <p className="text-ink-soft leading-relaxed text-[15px]">{value}</p>
    </div>
  );
};

const ResultList = ({ icon: Icon, color, title, items }) => {
  if (!items || !items.length) return null;
  return (
    <div className="bg-white rounded-3xl p-5 shadow-subtle">
      <div className="flex items-center gap-2 mb-3">
        <span className={`w-8 h-8 rounded-full flex items-center justify-center ${colorMap[color]}`}><Icon className="w-4 h-4" /></span>
        <h3 className="font-bold text-ink">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-2 text-ink-soft text-[15px]">
            <span className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${colorMap[color].split(" ")[0]}`} />{it}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ImageAnalysis;
