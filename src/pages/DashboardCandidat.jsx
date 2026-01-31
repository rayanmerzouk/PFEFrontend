import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Send, FileText, CheckCircle2, Clock3, XCircle } from "lucide-react";
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

const statusBadge = (statut) => {
  const base = "rounded-full px-3 py-1 text-xs font-semibold";
  if (statut === "accepte") return `${base} bg-emerald-50 text-emerald-700`;
  if (statut === "refuse") return `${base} bg-rose-50 text-rose-700`;
  if (statut === "en_attente") return `${base} bg-amber-50 text-amber-700`;
  return `${base} bg-slate-100 text-slate-700`;
};

const DashboardCandidat = () => {
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
      title="Dashboard candidat"
      subtitle="Vision rapide sur vos CV, vos envois et vos statuts."
      actions={
        <Link
          to="/envoi"
          className="rounded-2xl bg-[hsl(var(--primary))] px-4 py-2 text-sm font-semibold text-white"
        >
          Lancer un envoi
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
            <StatCard label="Total CV" value={stats?.total_cvs ?? 0} icon={FileText} tone="bg-slate-100 text-slate-600" />
            <StatCard label="Total envois" value={stats?.total_envois ?? 0} icon={Send} tone="bg-slate-100 text-slate-600" />
            <StatCard label="Acceptes" value={stats?.envois_par_statut?.accepte ?? 0} icon={CheckCircle2} tone="bg-emerald-50 text-emerald-700" />
            <StatCard label="Refuses" value={stats?.envois_par_statut?.refuse ?? 0} icon={XCircle} tone="bg-rose-50 text-rose-700" />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="rounded-3xl border border-slate-200 bg-[hsl(var(--card))] p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Derniers envois</p>
                  <h3 className="text-xl font-display font-semibold text-slate-900">Suivi des candidatures</h3>
                </div>
                <Link to="/candidatures" className="text-sm font-semibold text-slate-700">
                  Voir tout
                </Link>
              </div>
              <div className="mt-6 space-y-3">
                {envois.slice(0, 6).map((envoi) => (
                  <div key={envoi.envoiId} className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{envoi.offre_titre}</p>
                      <p className="text-xs text-slate-500">{envoi.entreprise_nom}</p>
                    </div>
                    <span className={statusBadge(envoi.statut)}>{envoi.statut}</span>
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
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Taux reponse</p>
                <h3 className="text-2xl font-display font-semibold text-slate-900">
                  {stats?.taux_reponse ?? 0}%
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Combine les statuts en attente, acceptes et refuses.
                </p>
              </div>
              <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>En attente</span>
                  <span>{stats?.envois_par_statut?.en_attente ?? 0}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>Envoye</span>
                  <span>{stats?.envois_par_statut?.envoye ?? 0}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>Traite</span>
                  <span>{(stats?.envois_par_statut?.accepte ?? 0) + (stats?.envois_par_statut?.refuse ?? 0)}</span>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-3 text-xs text-slate-500">
                <Clock3 className="h-4 w-4" />
                Derniere mise a jour en temps reel.
              </div>
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
};

export default DashboardCandidat;
