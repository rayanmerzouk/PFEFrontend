import { useEffect, useState } from "react";
import { Plus, ToggleLeft, ToggleRight, Trash2, Edit3 } from "lucide-react";
import AppShell from "../components/layout/AppShell";
import api from "../lib/api";

const EntrepriseOffres = () => {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    titre: "",
    domaine: "",
    type_contrat: "cdi",
    mode_travail: "site",
    ville: "",
    pays: "Algerie",
  });

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/entreprise/offres/");
      setOffres(res.data?.offres || []);
    } catch (err) {
      setOffres([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/entreprise/offres/", form);
      setForm((prev) => ({ ...prev, titre: "", domaine: "" }));
      await load();
    } catch (err) {
      // silent
    }
  };

  const toggleRecevoir = async (offreId, current) => {
    try {
      await api.patch(`/offres/${offreId}/toggle-recevoir/`, {
        recevoirCandidatures: !current,
      });
      setOffres((prev) =>
        prev.map((o) => (o.offreId === offreId ? { ...o, recevoirCandidatures: !current } : o))
      );
    } catch (err) {
      // silent
    }
  };

  const archiveOffer = async (offreId) => {
    try {
      await api.delete(`/offres/${offreId}/`);
      setOffres((prev) => prev.map((o) => (o.offreId === offreId ? { ...o, estArchivee: true } : o)));
    } catch (err) {
      // silent
    }
  };

  return (
    <AppShell title="Offres entreprise" subtitle="Creez et pilotez vos offres.">
      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <form onSubmit={handleCreate} className="rounded-3xl border border-slate-200 bg-[hsl(var(--card))] p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Nouvelle offre</p>
          <div className="mt-4 space-y-3">
            <input
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
              placeholder="Titre"
              value={form.titre}
              onChange={(e) => setForm((prev) => ({ ...prev, titre: e.target.value }))}
              required
            />
            <input
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
              placeholder="Domaine"
              value={form.domaine}
              onChange={(e) => setForm((prev) => ({ ...prev, domaine: e.target.value }))}
              required
            />
            <div className="grid gap-3 md:grid-cols-2">
              <select
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                value={form.type_contrat}
                onChange={(e) => setForm((prev) => ({ ...prev, type_contrat: e.target.value }))}
              >
                <option value="cdi">CDI</option>
                <option value="cdd">CDD</option>
                <option value="stage">Stage</option>
                <option value="freelance">Freelance</option>
                <option value="alternance">Alternance</option>
              </select>
              <select
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                value={form.mode_travail}
                onChange={(e) => setForm((prev) => ({ ...prev, mode_travail: e.target.value }))}
              >
                <option value="site">Sur site</option>
                <option value="hybride">Hybride</option>
                <option value="remote">Remote</option>
              </select>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <input
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                placeholder="Ville"
                value={form.ville}
                onChange={(e) => setForm((prev) => ({ ...prev, ville: e.target.value }))}
              />
              <input
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                placeholder="Pays"
                value={form.pays}
                onChange={(e) => setForm((prev) => ({ ...prev, pays: e.target.value }))}
              />
            </div>
            <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[hsl(var(--primary))] px-4 py-3 text-sm font-semibold text-white">
              <Plus className="h-4 w-4" /> Ajouter
            </button>
          </div>
        </form>

        <div className="rounded-3xl border border-slate-200 bg-[hsl(var(--card))] p-6 shadow-sm">
          {loading ? (
            <div className="text-center text-slate-500">Chargement...</div>
          ) : (
            <div className="space-y-3">
              {offres.map((offre) => (
                <div key={offre.offreId} className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{offre.titre}</p>
                    <p className="text-xs text-slate-500">{offre.domaine}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <button
                      onClick={() => toggleRecevoir(offre.offreId, offre.recevoirCandidatures)}
                      className="rounded-full border border-slate-200 px-3 py-1 hover:bg-slate-50"
                    >
                      {offre.recevoirCandidatures ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => archiveOffer(offre.offreId)}
                      className="rounded-full border border-slate-200 px-3 py-1 hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <span className="rounded-full bg-slate-100 px-3 py-1">{offre.estPubliee ? "Publiee" : "Brouillon"}</span>
                    <Edit3 className="h-4 w-4 text-slate-400" />
                  </div>
                </div>
              ))}
              {offres.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-500">
                  Aucune offre creee.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
};

export default EntrepriseOffres;
