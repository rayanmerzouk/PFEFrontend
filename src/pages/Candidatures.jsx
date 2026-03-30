import { useEffect, useState } from "react";
import { Clock3, CheckCircle2, XCircle } from "lucide-react";
import AppShell from "../components/layout/AppShell";
import api from "../lib/api";

const statusStyle = (statut) => {
  const base = "rounded-full px-3 py-1 text-xs font-semibold";
  if (statut === "accepte") return `${base} bg-emerald-50 text-emerald-700`;
  if (statut === "refuse") return `${base} bg-rose-50 text-rose-700`;
  if (statut === "en_attente") return `${base} bg-amber-50 text-amber-700`;
  return `${base} bg-slate-100 text-slate-700`;
};

const statusLabel = (statut) => {
  if (statut === "accepte") return "Acceptee";
  if (statut === "refuse") return "Refusee";
  if (statut === "en_attente") return "En attente";
  if (statut === "envoye") return "Envoyee";
  return statut;
};

const statusIcon = (statut) => {
  if (statut === "accepte") return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
  if (statut === "refuse") return <XCircle className="h-4 w-4 text-rose-600" />;
  if (statut === "en_attente") return <Clock3 className="h-4 w-4 text-amber-600" />;
  return <Clock3 className="h-4 w-4 text-slate-400" />;
};

const Candidatures = () => {
  const [envois, setEnvois] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get("/envois/");
        setEnvois(res.data?.envois || []);
      } catch (err) {
        setEnvois([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <AppShell title="Candidatures" subtitle="Suivez l'etat de vos envois.">
      <div className="rounded-3xl border border-slate-200 bg-[hsl(var(--card))] p-6 shadow-sm">
        {loading ? (
          <div className="text-center text-slate-500">Chargement...</div>
        ) : (
          <div className="space-y-3">
            {envois.map((envoi) => (
              <div key={envoi.envoiId} className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-slate-100 p-3">{statusIcon(envoi.statut)}</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{envoi.offre_titre}</p>
                    <p className="text-xs text-slate-500">{envoi.entreprise_nom}</p>
                  </div>
                </div>
                <span className={statusStyle(envoi.statut)}>{statusLabel(envoi.statut)}</span>
              </div>
            ))}
            {envois.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-500">
                Aucune candidature enregistree.
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default Candidatures;
