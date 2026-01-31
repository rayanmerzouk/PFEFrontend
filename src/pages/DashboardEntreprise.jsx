import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, ClipboardCheck, Layers, UserCheck } from "lucide-react";
import AppShell from "../components/layout/AppShell";
import api from "../lib/api";

const StatCard = ({ label, value, icon: Icon, tone }) => (
  <div className="rounded-3xl border border-slate-200 bg-[hsl(var(--card))] p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <div className={`rounded-2xl px-3 py-2 text-xs ${tone}`}>{value}</div>
    </div>
    <div className="mt-6 flex items-center gap-3">
      <div className="rounded-2xl bg-slate-100 p-3">
        <Icon className="h-5 w-5 text-slate-700" />
      </div>
      <p className="text-3xl font-display font-semibold text-slate-900">{value}</p>
    </div>
  </div>
);

const DashboardEntreprise = () => {
  const [stats, setStats] = useState(null);
  const [envois, setEnvois] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [statsRes, envoiRes] = await Promise.all([
          api.get("/dashboard/stats/"),
          api.get("/envois/"),
        ]);
        setStats(statsRes.data);
        setEnvois(envoiRes.data?.envois || []);
      } catch (err) {
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <AppShell
      title="Dashboard entreprise"
      subtitle="Suivi rapide des offres et candidatures en cours."
      actions={
        <Link
          to="/entreprise/offres"
          className="rounded-2xl bg-[hsl(var(--primary))] px-4 py-2 text-sm font-semibold text-white"
        >
          Gerer les offres
        </Link>
      }
    >
      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-[hsl(var(--card))] p-10 text-center text-slate-500">
          Chargement...
        </div>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-4">
            <StatCard label="Offres" value={stats?.total_offres ?? 0} icon={Layers} tone="bg-slate-100 text-slate-600" />
            <StatCard label="Candidatures" value={stats?.total_candidatures ?? 0} icon={Briefcase} tone="bg-slate-100 text-slate-600" />
            <StatCard
              label="Non traitees"
              value={stats?.candidatures_non_traitees ?? 0}
              icon={ClipboardCheck}
              tone="bg-amber-50 text-amber-700"
            />
            <StatCard
              label="Acceptees"
              value={stats?.candidatures_par_statut?.accepte ?? 0}
              icon={UserCheck}
              tone="bg-emerald-50 text-emerald-700"
            />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="rounded-3xl border border-slate-200 bg-[hsl(var(--card))] p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Dernieres candidatures</p>
                  <h3 className="text-xl font-display font-semibold text-slate-900">Pipeline en cours</h3>
                </div>
                <Link to="/entreprise/candidatures" className="text-sm font-semibold text-slate-700">
                  Voir tout
                </Link>
              </div>
              <div className="mt-6 space-y-3">
                {envois.slice(0, 6).map((envoi) => (
                  <div key={envoi.envoiId} className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{envoi.candidat_nom}</p>
                      <p className="text-xs text-slate-500">{envoi.offre_titre}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {envoi.statut}
                    </span>
                  </div>
                ))}
                {envois.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                    Aucune candidature pour le moment.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-[hsl(var(--card))] p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Statuts</p>
              <h3 className="mt-2 text-xl font-display font-semibold text-slate-900">Distribution</h3>
              <div className="mt-6 space-y-3">
                {Object.entries(stats?.candidatures_par_statut || {}).map(([statut, count]) => (
                  <div key={statut} className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3">
                    <span className="text-sm text-slate-600">{statut}</span>
                    <span className="text-sm font-semibold text-slate-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
};

export default DashboardEntreprise;
