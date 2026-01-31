import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, MapPin, Briefcase } from "lucide-react";
import AppShell from "../components/layout/AppShell";
import api from "../lib/api";

const Offers = () => {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    q: "",
    domaine: "",
    specialite: "",
    ville: "",
    pays: "",
    type_contrat: "",
    mode_travail: "",
  });

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/offres/");
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

  const filtered = useMemo(() => {
    return offres.filter((offre) => {
      if (filters.q) {
        const q = filters.q.toLowerCase();
        const hay = `${offre.titre} ${offre.poste || ""} ${offre.tags || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (filters.domaine && !offre.domaine?.toLowerCase().includes(filters.domaine.toLowerCase())) return false;
      if (filters.specialite && !offre.specialite?.toLowerCase().includes(filters.specialite.toLowerCase())) return false;
      if (filters.ville && !offre.ville?.toLowerCase().includes(filters.ville.toLowerCase())) return false;
      if (filters.pays && !offre.pays?.toLowerCase().includes(filters.pays.toLowerCase())) return false;
      if (filters.type_contrat && !offre.type_contrat?.toLowerCase().includes(filters.type_contrat.toLowerCase())) return false;
      if (filters.mode_travail && !offre.mode_travail?.toLowerCase().includes(filters.mode_travail.toLowerCase())) return false;
      return true;
    });
  }, [offres, filters]);

  return (
    <AppShell
      title="Offres"
      subtitle="Explorez les offres publiees et preparez vos envois."
      actions={
        <Link to="/envoi" className="rounded-2xl bg-[hsl(var(--primary))] px-4 py-2 text-sm font-semibold text-white">
          Envoyer un CV
        </Link>
      }
    >
      <div className="mb-6 grid gap-4 rounded-3xl border border-slate-200 bg-[hsl(var(--card))] p-5 shadow-sm lg:grid-cols-[1.2fr_repeat(3,1fr)]">
        <label className="relative flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            className="w-full bg-transparent outline-none"
            placeholder="Recherche globale"
            value={filters.q}
            onChange={(e) => setFilters((prev) => ({ ...prev, q: e.target.value }))}
          />
        </label>
        <input
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
          placeholder="Domaine"
          value={filters.domaine}
          onChange={(e) => setFilters((prev) => ({ ...prev, domaine: e.target.value }))}
        />
        <input
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
          placeholder="Ville"
          value={filters.ville}
          onChange={(e) => setFilters((prev) => ({ ...prev, ville: e.target.value }))}
        />
        <input
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
          placeholder="Type contrat"
          value={filters.type_contrat}
          onChange={(e) => setFilters((prev) => ({ ...prev, type_contrat: e.target.value }))}
        />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-[hsl(var(--card))] p-6 shadow-sm">
        {loading ? (
          <div className="text-center text-slate-500">Chargement...</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((offre) => (
              <Link
                to={`/offres/${offre.offreId}`}
                key={offre.offreId}
                className="rounded-3xl border border-slate-100 bg-slate-50/50 p-5 transition hover:border-slate-200 hover:bg-[hsl(var(--card))]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{offre.entreprise_nom}</p>
                    <h3 className="mt-2 text-lg font-display font-semibold text-slate-900">{offre.titre}</h3>
                  </div>
                  <span className="rounded-full bg-[hsl(var(--primary))] px-3 py-1 text-xs text-white">
                    {offre.type_contrat?.toUpperCase()}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    {offre.domaine}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {offre.ville || "N/A"}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1">{offre.mode_travail}</span>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <Filter className="h-4 w-4" />
                  Relance {offre.relance_days ?? 7}j
                </div>
              </Link>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full rounded-2xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-500">
                Aucune offre ne correspond aux filtres.
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default Offers;
