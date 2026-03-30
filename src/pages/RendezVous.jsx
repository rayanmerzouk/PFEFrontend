import { useEffect, useMemo, useState } from "react";
import { CalendarCheck2, Clock3, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import api from "../lib/api";
import { getUserRole } from "../lib/auth";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return date.toLocaleString("fr-FR");
};

const RendezVous = () => {
  const role = getUserRole();
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

  const rendezVous = useMemo(() => {
    return envois
      .flatMap((envoi) =>
        (envoi.creneaux || [])
          .filter((slot) => slot.estReserve)
          .map((slot) => ({
            ...slot,
            envoiId: envoi.envoiId,
            offre_titre: envoi.offre_titre,
            entreprise_nom: envoi.entreprise_nom,
            candidat_nom: envoi.candidat_nom,
          }))
      )
      .sort((a, b) => new Date(a.startAt) - new Date(b.startAt));
  }, [envois]);

  const subtitle =
    role === "entreprise"
      ? "Consultez les entretiens reserves par les candidats."
      : "Consultez tous vos entretiens reserves.";

  return (
    <AppShell title="Rendez-vous" subtitle={subtitle}>
      <div className="rounded-3xl border border-slate-200 bg-[hsl(var(--card))] p-6 shadow-sm">
        {loading ? (
          <div className="text-center text-slate-500">Chargement...</div>
        ) : rendezVous.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-500">
            Aucun rendez-vous reserve.
          </div>
        ) : (
          <div className="space-y-3">
            {rendezVous.map((slot) => (
              <div key={`rdv-${slot.creneauId}`} className="rounded-2xl border border-slate-100 px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{slot.offre_titre}</p>
                    <p className="text-xs text-slate-500">
                      {role === "entreprise"
                        ? `${slot.candidat_nom || slot.reserve_par_nom || "Candidat"}`
                        : slot.entreprise_nom}
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Reserve
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
                    <CalendarCheck2 className="h-3.5 w-3.5" />
                    {formatDate(slot.startAt)}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
                    <Clock3 className="h-3.5 w-3.5" />
                    {slot.duree_minutes || 60} min
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {slot.mode} {slot.lieuOuLien ? `- ${slot.lieuOuLien}` : ""}
                  </span>
                  <Link
                    to={`/rendez-vous/${slot.creneauId}/meeting`}
                    className="inline-flex items-center gap-1 rounded-full bg-[hsl(var(--primary))] px-3 py-1 text-white"
                  >
                    Rejoindre
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default RendezVous;
