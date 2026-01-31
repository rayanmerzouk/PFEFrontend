import { useEffect, useState } from "react";
import AppShell from "../components/layout/AppShell";
import api from "../lib/api";

const EntrepriseCandidatures = () => {
  const [envois, setEnvois] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

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

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (envoiId, statut) => {
    setUpdatingId(envoiId);
    try {
      await api.patch(`/envois/${envoiId}/`, { statut });
      setEnvois((prev) => prev.map((e) => (e.envoiId === envoiId ? { ...e, statut } : e)));
    } catch (err) {
      // silent
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <AppShell title="Candidatures" subtitle="Traitez les candidatures recues.">
      <div className="rounded-3xl border border-slate-200 bg-[hsl(var(--card))] p-6 shadow-sm">
        {loading ? (
          <div className="text-center text-slate-500">Chargement...</div>
        ) : (
          <div className="space-y-3">
            {envois.map((envoi) => (
              <div key={envoi.envoiId} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{envoi.candidat_nom}</p>
                  <p className="text-xs text-slate-500">{envoi.offre_titre}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <select
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs"
                    value={envoi.statut}
                    onChange={(e) => updateStatus(envoi.envoiId, e.target.value)}
                    disabled={updatingId === envoi.envoiId}
                  >
                    <option value="en_attente">En attente</option>
                    <option value="accepte">Accepte</option>
                    <option value="refuse">Refuse</option>
                  </select>
                  <span className="rounded-full bg-slate-100 px-3 py-1">{envoi.cv_nom}</span>
                </div>
              </div>
            ))}
            {envois.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-500">
                Aucune candidature recue.
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default EntrepriseCandidatures;
