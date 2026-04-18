import { useEffect, useState } from "react";
import { Clock3, CheckCircle2, XCircle, CalendarCheck2 } from "lucide-react";
import { toast } from "sonner";
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

// Retourne le créneau réservé d'un envoi s'il existe
const getCreneauReserve = (envoi) =>
  (envoi.creneaux || []).find((c) => c.estReserve) || null;

// Retourne true si l'envoi a des créneaux disponibles (non réservés)
const hasCreneauxDisponibles = (envoi) =>
  (envoi.creneaux || []).some((c) => !c.estReserve);

const formatCreneauLabel = (creneau) => {
  if (!creneau) return null;
  const date = new Date(creneau.startAt).toLocaleDateString("fr-FR", {
    day: "numeric", month: "short", year: "numeric",
  });
  const heure = new Date(creneau.startAt).toLocaleTimeString("fr-FR", {
    hour: "2-digit", minute: "2-digit",
  });
  return `${date} à ${heure}`;
};

const CreneauxModal = ({ envoi, onClose, onConfirm }) => {
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [confirming, setConfirming] = useState(false);

  if (!envoi) return null;

  const creneauxDisponibles = (envoi.creneaux || []).filter((c) => !c.estReserve);
  const creneauChoisi = creneauxDisponibles.find((c) => c.creneauId === selected);

  const handleConfirm = async () => {
    setConfirming(true);
    await onConfirm(selected);
    setConfirmed(true);
    setConfirming(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => { if (e.target === e.currentTarget && !confirming) onClose(); }}
    >
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-[hsl(var(--card))] p-6 shadow-xl">

        {confirmed ? (
          <div className="flex flex-col items-center py-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mb-4">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-lg font-display font-semibold text-slate-900 mb-1">
              Créneau confirmé !
            </h2>
            <p className="text-sm text-slate-500 mb-3">
              Vous avez choisi le créneau du
            </p>
            {creneauChoisi && (
              <div className="w-full rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 mb-4">
                <p className="text-sm font-semibold text-emerald-800">
                  {new Date(creneauChoisi.startAt).toLocaleDateString("fr-FR", {
                    weekday: "long", day: "numeric", month: "long", year: "numeric",
                  })}
                </p>
                <p className="text-xs text-emerald-700 mt-1">
                  {new Date(creneauChoisi.startAt).toLocaleTimeString("fr-FR", {
                    hour: "2-digit", minute: "2-digit",
                  })}
                  {creneauChoisi.endAt && (
                    <> → {new Date(creneauChoisi.endAt).toLocaleTimeString("fr-FR", {
                      hour: "2-digit", minute: "2-digit",
                    })}</>
                  )}
                </p>
                <p className="text-xs text-emerald-600 mt-1">
                  {creneauChoisi.mode === "visio" ? "Visioconférence" : "Sur site"}
                  {creneauChoisi.lieuOuLien ? ` — ${creneauChoisi.lieuOuLien}` : ""}
                </p>
              </div>
            )}
            <p className="text-xs text-slate-400 mb-6">
              Retrouvez votre entretien dans la section{" "}
              <span className="font-semibold text-slate-600">Rendez-vous</span>.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-2xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Fermer
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Créneaux disponibles</p>
                <h2 className="text-lg font-display font-semibold text-slate-900 mt-1">
                  {envoi.offre_titre}
                </h2>
                <p className="text-sm text-slate-500">{envoi.entreprise_nom}</p>
              </div>
              <button
                onClick={onClose}
                className="rounded-xl bg-slate-100 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-slate-500 mb-4">
              Choisissez le créneau qui vous convient pour votre entretien.
            </p>

            <div className="space-y-3 mb-6">
              {creneauxDisponibles.map((creneau) => (
                <button
                  key={creneau.creneauId}
                  type="button"
                  onClick={() => setSelected(creneau.creneauId)}
                  className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                    selected === creneau.creneauId
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {new Date(creneau.startAt).toLocaleDateString("fr-FR", {
                          weekday: "long", day: "numeric", month: "long", year: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {new Date(creneau.startAt).toLocaleTimeString("fr-FR", {
                          hour: "2-digit", minute: "2-digit",
                        })}
                        {creneau.endAt && (
                          <> → {new Date(creneau.endAt).toLocaleTimeString("fr-FR", {
                            hour: "2-digit", minute: "2-digit",
                          })}</>
                        )}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {creneau.mode === "visio" ? "Visioconférence" : "Sur site"}
                        {creneau.lieuOuLien ? ` — ${creneau.lieuOuLien}` : ""}
                      </p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                      selected === creneau.creneauId
                        ? "border-emerald-500 bg-emerald-500"
                        : "border-slate-300"
                    }`}>
                      {selected === creneau.creneauId && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-2xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={!selected || confirming}
                onClick={handleConfirm}
                className="flex-[2] rounded-2xl bg-emerald-600 py-2.5 text-sm font-semibold text-white disabled:opacity-40 hover:bg-emerald-700"
              >
                {confirming ? "Confirmation..." : "Confirmer ce créneau"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const Candidatures = () => {
  const [envois, setEnvois] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalEnvoi, setModalEnvoi] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/envois/");
      setEnvois(res.data?.envois || []);
    } catch {
      setEnvois([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleConfirmCreneau = async (creneauId) => {
    try {
      await api.post(`/creneaux/${creneauId}/reserver/`);
      await load();
    } catch {
      toast.error("Erreur lors de la confirmation du créneau.");
    }
  };

  // Bannière : envois avec créneaux disponibles ET pas encore de créneau réservé
  const enAttenteDeChoix = envois.filter(
    (e) => hasCreneauxDisponibles(e) && !getCreneauReserve(e)
  );

  return (
    <AppShell title="Candidatures" subtitle="Suivez l'état de vos envois.">

      {!loading && enAttenteDeChoix.length > 0 && (
        <div className="mb-6 rounded-3xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <CalendarCheck2 className="h-5 w-5 text-amber-600" />
            <h3 className="text-sm font-semibold text-amber-800">
              Créneaux à confirmer ({enAttenteDeChoix.length})
            </h3>
          </div>
          <div className="space-y-3">
            {enAttenteDeChoix.map((envoi) => (
              <div
                key={`creneau-${envoi.envoiId}`}
                className="flex items-center justify-between rounded-2xl border border-amber-200 bg-white px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{envoi.offre_titre}</p>
                  <p className="text-xs text-slate-500">{envoi.entreprise_nom}</p>
                  <p className="text-xs text-amber-600 mt-1">
                    {(envoi.creneaux || []).filter((c) => !c.estReserve).length} créneau(x) proposé(s)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setModalEnvoi(envoi)}
                  className="rounded-2xl bg-amber-500 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-600"
                >
                  Choisir
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-[hsl(var(--card))] p-6 shadow-sm">
        {loading ? (
          <div className="text-center text-slate-500">Chargement...</div>
        ) : (
          <div className="space-y-3">
            {envois.map((envoi) => {
              const creneauReserve = getCreneauReserve(envoi);
              const disponibles = hasCreneauxDisponibles(envoi);

              return (
                <div
                  key={envoi.envoiId}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-slate-100 p-3">
                      {statusIcon(envoi.statut)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{envoi.offre_titre}</p>
                      <p className="text-xs text-slate-500">{envoi.entreprise_nom}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    {creneauReserve ? (
                      // Créneau déjà réservé → afficher date/heure en vert
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        <CalendarCheck2 className="h-3.5 w-3.5" />
                        Rendez-vous · {formatCreneauLabel(creneauReserve)}
                      </span>
                    ) : disponibles ? (
                      // Créneaux disponibles mais pas encore choisi
                      <button
                        type="button"
                        onClick={() => setModalEnvoi(envoi)}
                        className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 hover:bg-amber-100"
                      >
                        Choisir un créneau
                      </button>
                    ) : null}
                    <span className={statusStyle(envoi.statut)}>
                      {statusLabel(envoi.statut)}
                    </span>
                  </div>
                </div>
              );
            })}
            {envois.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-500">
                Aucune candidature enregistrée.
              </div>
            )}
          </div>
        )}
      </div>

      <CreneauxModal
        envoi={modalEnvoi}
        onClose={() => setModalEnvoi(null)}
        onConfirm={handleConfirmCreneau}
      />
    </AppShell>
  );
};

export default Candidatures;