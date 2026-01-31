import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Briefcase, Clock3, Layers } from "lucide-react";
import AppShell from "../components/layout/AppShell";
import api from "../lib/api";

const OfferDetail = () => {
  const { id } = useParams();
  const [offre, setOffre] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/offres/${id}/`);
        setOffre(res.data);
      } catch (err) {
        setOffre(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  return (
    <AppShell
      title="Detail offre"
      subtitle="Consultez les informations avant envoi."
      actions={
        <Link to="/envoi" className="rounded-2xl bg-[hsl(var(--primary))] px-4 py-2 text-sm font-semibold text-white">
          Envoyer un CV
        </Link>
      }
    >
      <div className="rounded-3xl border border-slate-200 bg-[hsl(var(--card))] p-8 shadow-sm">
        {loading ? (
          <div className="text-center text-slate-500">Chargement...</div>
        ) : offre ? (
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{offre.entreprise_nom}</p>
            <h2 className="mt-2 text-3xl font-display font-semibold text-slate-900">{offre.titre}</h2>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
              <span className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                {offre.domaine}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {offre.ville || "N/A"}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1">{offre.type_contrat}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1">{offre.mode_travail}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1">Relance {offre.relance_days ?? 7}j</span>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
              <div className="space-y-6">
                <section className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
                  <h3 className="text-lg font-display font-semibold text-slate-900">Description</h3>
                  <p className="mt-3 text-sm text-slate-600">{offre.description || "Non renseignee."}</p>
                </section>
                <section className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
                  <h3 className="text-lg font-display font-semibold text-slate-900">Missions</h3>
                  <p className="mt-3 text-sm text-slate-600">{offre.missions || "Non renseigne."}</p>
                </section>
                <section className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
                  <h3 className="text-lg font-display font-semibold text-slate-900">Profil recherche</h3>
                  <p className="mt-3 text-sm text-slate-600">{offre.profil_recherche || "Non renseigne."}</p>
                </section>
              </div>
              <aside className="space-y-4">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Meta</p>
                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <div className="flex items-center justify-between">
                      <span>Niveau</span>
                      <span className="font-semibold text-slate-900">{offre.niveau || "N/A"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Etude min</span>
                      <span className="font-semibold text-slate-900">{offre.etude_min || "N/A"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Experience min</span>
                      <span className="font-semibold text-slate-900">{offre.experience_min ?? "N/A"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Salaire min</span>
                      <span className="font-semibold text-slate-900">{offre.salaire_min ?? "N/A"}</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Layers className="h-4 w-4" />
                    Tags
                  </div>
                  <p className="mt-2 text-sm text-slate-700">{offre.tags || "Aucun tag."}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-[hsl(var(--card))] p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock3 className="h-4 w-4" />
                    Derniere mise a jour automatique
                  </div>
                  <Link
                    to="/envoi"
                    className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-[hsl(var(--primary))] px-4 py-3 text-sm font-semibold text-white"
                  >
                    Envoyer un CV maintenant
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-500">Offre introuvable.</div>
        )}
      </div>
    </AppShell>
  );
};

export default OfferDetail;
