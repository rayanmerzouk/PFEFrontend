import { useEffect, useState } from "react";
import { FileText, Upload, Trash2, Eye, ShieldCheck, ShieldX, Clock3, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import AppShell from "../components/layout/AppShell";
import api from "../lib/api";

const MAX_CV_SIZE_MB = 10;
const MAX_CV_SIZE_BYTES = MAX_CV_SIZE_MB * 1024 * 1024;

const Cvs = () => {
  const [cvs, setCvs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reportCv, setReportCv] = useState(null);

  const getAiTone = (cv) => {
    if (cv.ai_status === "validated") {
      return {
        label: "Valide IA",
        badge: "bg-emerald-100 text-emerald-700",
        border: "border-emerald-200",
        icon: <ShieldCheck className="h-4 w-4" />,
      };
    }
    if (cv.ai_status === "rejected") {
      return {
        label: "Refuse IA",
        badge: "bg-red-100 text-red-700",
        border: "border-red-200",
        icon: <ShieldX className="h-4 w-4" />,
      };
    }
    return {
      label: "En attente IA",
      badge: "bg-amber-100 text-amber-700",
      border: "border-amber-200",
      icon: <Clock3 className="h-4 w-4" />,
    };
  };

  const getRecommendations = (cv) => {
    const recs = [];
    if ((cv.ai_score || 0) < 60) recs.push("Ajoutez plus de contenu sur experience, formation et competences.");
    if (!cv.ai_has_photo) recs.push("Ajoutez une photo professionnelle recente et bien cadree.");
    if ((cv.ai_notes || "").includes("sections=0") || (cv.ai_notes || "").includes("sections=1")) {
      recs.push("Structurez le CV avec des sections visibles: Contact, Experience, Formation, Competences.");
    }
    if ((cv.ai_notes || "").includes("keywords=0") || (cv.ai_notes || "").includes("keywords=1")) {
      recs.push("Renforcez le vocabulaire metier (technologies, outils, missions, resultats).");
    }
    if (recs.length === 0) recs.push("CV valide. Vous pouvez l'utiliser pour les envois.");
    return recs;
  };

  const loadCvs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/cvs/");
      setCvs(res.data?.cvs || []);
    } catch (err) {
      setCvs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCvs();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ];
    const ext = `.${(file.name.split(".").pop() || "").toLowerCase()}`;
    const allowedExt = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png", ".jfif"];
    if (!allowed.includes(file.type) && !allowedExt.includes(ext)) {
      toast.error("Echec upload CV", {
        description: "Format non supporte. Utilisez PDF, DOC, DOCX, JPEG, PNG ou JFIF.",
      });
      return;
    }

    if (file.size > MAX_CV_SIZE_BYTES) {
      const fileSizeMb = (file.size / (1024 * 1024)).toFixed(2);
      toast.error("Echec upload CV", {
        description: `Fichier trop volumineux (${fileSizeMb} MB). Taille maximale: ${MAX_CV_SIZE_MB} MB.`,
      });
      return;
    }

    const formData = new FormData();
    formData.append("fichier", file);
    formData.append("nom", file.name);
    formData.append("type", "cv");

    setUploading(true);
    try {
      await api.post("/cvs/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        successMessage: "CV ajoute avec succes.",
      });
      await loadCvs();
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (cvId) => {
    try {
      await api.delete(`/cvs/${cvId}/`, {
        successMessage: "CV supprime avec succes.",
      });
      setCvs((prev) => prev.filter((cv) => cv.cvId !== cvId));
    } catch (err) {
      // silent
    }
  };

  const handlePreview = async (cvId) => {
    try {
      const res = await api.get(`/cvs/${cvId}/`);
      if (res.data?.fichier_url) {
        window.open(res.data.fichier_url, "_blank");
      }
    } catch (err) {
      // silent
    }
  };

  return (
    <AppShell
      title="Mes CV"
      subtitle="Centralisez vos versions et preparez vos envois."
      actions={
        <label className="cursor-pointer rounded-2xl bg-[hsl(var(--primary))] px-4 py-2 text-sm font-semibold text-white">
          {uploading ? "Upload..." : "Ajouter un CV"}
          <input type="file" className="hidden" onChange={handleUpload} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.jfif" />
        </label>
      }
    >
      <div className="rounded-3xl border border-slate-200 bg-[hsl(var(--card))] p-6 shadow-sm">
        {loading ? (
          <div className="text-center text-slate-500">Chargement...</div>
        ) : (
          <div className="space-y-3">
            {cvs.map((cv) => (
              <div key={cv.cvId} className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-slate-100 p-3">
                    <FileText className="h-5 w-5 text-slate-700" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{cv.nom}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <p className="text-xs text-slate-500">{cv.type}</p>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${getAiTone(cv).badge}`}>
                        {getAiTone(cv).icon}
                        {getAiTone(cv).label}
                      </span>
                      <span className="text-xs font-semibold text-slate-600">Score: {cv.ai_score ?? 0}/100</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <button
                    onClick={() => setReportCv(cv)}
                    className="rounded-full border border-slate-200 px-3 py-1 hover:bg-blue-50 hover:text-blue-700"
                    title="Voir rapport IA"
                  >
                    <Sparkles className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handlePreview(cv.cvId)}
                    className="rounded-full border border-slate-200 px-3 py-1 hover:bg-slate-50"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cv.cvId)}
                    className="rounded-full border border-slate-200 px-3 py-1 hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            {cvs.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-500">
                Aucun CV ajoute. Importez votre premier document.
                <div className="mt-4 flex justify-center">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-[hsl(var(--primary))] px-4 py-2 text-sm font-semibold text-white">
                    <Upload className="h-4 w-4" />
                    Ajouter un CV
                    <input type="file" className="hidden" onChange={handleUpload} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.jfif" />
                  </label>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {reportCv && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 p-4">
          <div className={`w-full max-w-2xl rounded-3xl border bg-[hsl(var(--card))] p-6 shadow-2xl ${getAiTone(reportCv).border}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-display font-semibold text-slate-900">Rapport IA du CV</h3>
                <p className="mt-1 text-sm text-slate-500">{reportCv.nom}</p>
              </div>
              <button
                onClick={() => setReportCv(null)}
                className="rounded-full border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${getAiTone(reportCv).badge}`}>
                {getAiTone(reportCv).icon}
                {getAiTone(reportCv).label}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                Score IA: {reportCv.ai_score ?? 0}/100
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                Photo detectee: {reportCv.ai_has_photo ? "Oui" : "Non"}
              </span>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-semibold text-slate-800">Recommandations</h4>
              <ul className="mt-2 space-y-2 text-sm text-slate-600">
                {getRecommendations(reportCv).map((rec, idx) => (
                  <li key={`${reportCv.cvId}-rec-${idx}`} className="rounded-xl bg-slate-50 px-3 py-2">
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-semibold text-slate-800">Details techniques IA</h4>
              <p className="mt-2 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
                {reportCv.ai_notes || "Aucun detail disponible."}
              </p>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
};

export default Cvs;
