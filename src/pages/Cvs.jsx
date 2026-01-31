import { useEffect, useState } from "react";
import { FileText, Upload, Trash2, Eye } from "lucide-react";
import AppShell from "../components/layout/AppShell";
import api from "../lib/api";

const Cvs = () => {
  const [cvs, setCvs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

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

    const formData = new FormData();
    formData.append("fichier", file);
    formData.append("nom", file.name);
    formData.append("type", "cv");

    setUploading(true);
    try {
      await api.post("/cvs/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await loadCvs();
    } catch (err) {
      setUploading(false);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (cvId) => {
    try {
      await api.delete(`/cvs/${cvId}/`);
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
          <input type="file" className="hidden" onChange={handleUpload} accept=".pdf,.doc,.docx" />
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
                    <p className="text-xs text-slate-500">{cv.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
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
                    <input type="file" className="hidden" onChange={handleUpload} accept=".pdf,.doc,.docx" />
                  </label>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default Cvs;
