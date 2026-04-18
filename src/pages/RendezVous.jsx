import { useEffect, useMemo, useState } from "react";
import { CalendarCheck2, Clock3, MapPin, X } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import AppShell from "../components/layout/AppShell";
import api from "../lib/api";
import { getUserRole } from "../lib/auth";

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleString("fr-FR");
};

const ConfirmAnnulerModal = ({ slot, onClose, onConfirm, loading }) => {
  if (!slot) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => { if (e.target === e.currentTarget && !loading) onClose(); }}
    >
      <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-[hsl(var(--card))] p-6 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 mb-4">
            <X className="h-7 w-7 text-rose-600" />
          </div>
          <h2 className="text-lg font-display font-semibold text-slate-900 mb-1">
            Annuler ce rendez-vous ?
          </h2>
          <p className="text-sm text-slate-500 mb-2">
            {slot.offre_titre}
          </p>
          <div className="w-full rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 mb-6 text-left">
            <p className="text-sm font-semibold text-rose-800">
              {new Date(slot.startAt).toLocaleDateString("fr-FR", {
                weekday: "long", day: "numeric", month: "long", year: "numeric",
              })}
            </p>
            <p className="text-xs text-rose-700 mt-1">
              {new Date(slot.startAt).toLocaleTimeString("fr-FR", {
                hour: "2-digit", minute: "2-digit",
              })}
            </p>
            <p className="text-xs text-rose-600 mt-1">
              {slot.mode === "visio" ? "Visioconférence" : "Sur site"}
              {slot.lieuOuLien ? ` — ${slot.lieuOuLien}` : ""}
            </p>
          </div>
          <p className="text-xs text-slate-400 mb-6">
            Cette action est irréversible. Le créneau redeviendra disponible.
          </p>
          <div className="flex w-full gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-2xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              Garder
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="flex-[2] rounded-2xl bg-rose-600 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-40"
            >
              {loading ? "Annulation..." : "Confirmer l'annulation"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const RendezVous = () => {
  const role = getUserRole();
  const [envois, setEnvois] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slotToCancel, setSlotToCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);

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

  const handleAnnuler = async () => {
    if (!slotToCancel) return;
    setCancelling(true);
    try {
      await api.post(`/creneaux/${slotToCancel.creneauId}/annuler/`);
      toast.success("Rendez-vous annulé.");
      setSlotToCancel(null);
      await load();
    } catch {
      toast.error("Erreur lors de l'annulation.");
    } finally {
      setCancelling(false);
    }
  };

  const subtitle =
    role === "entreprise"
      ? "Consultez les entretiens réservés par les candidats."
      : "Consultez tous vos entretiens réservés.";

  return (
    <AppShell title="Rendez-vous" subtitle={subtitle}>
      <div className="rounded-3xl border border-slate-200 bg-[hsl(var(--card))] p-6 shadow-sm">
        {loading ? (
          <div className="text-center text-slate-500">Chargement...</div>
        ) : rendezVous.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-500">
            Aucun rendez-vous réservé.
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
                        ? slot.candidat_nom || slot.reserve_par_nom || "Candidat"
                        : slot.entreprise_nom}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Réservé
                    </span>
                    <button
                      type="button"
                      onClick={() => setSlotToCancel(slot)}
                      className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-100"
                    >
                      Annuler
                    </button>
                  </div>
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

      <ConfirmAnnulerModal
        slot={slotToCancel}
        onClose={() => !cancelling && setSlotToCancel(null)}
        onConfirm={handleAnnuler}
        loading={cancelling}
      />
    </AppShell>
  );
};

export default RendezVous;