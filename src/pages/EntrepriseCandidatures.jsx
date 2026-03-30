import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Eye, CalendarPlus, X } from "lucide-react";
import AppShell from "../components/layout/AppShell";
import api from "../lib/api";

const initialSlotForm = {
  startAt: "",
  mode: "visio",
  lieuOuLien: "",
  note: "",
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return date.toLocaleString("fr-FR");
};

const EntrepriseCandidatures = () => {
  const [envois, setEnvois] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [planningEnvoi, setPlanningEnvoi] = useState(null);
  const [slotForm, setSlotForm] = useState(initialSlotForm);
  const [draftSlots, setDraftSlots] = useState([]);
  const [creatingSlot, setCreatingSlot] = useState(false);

  const reservedSlots = envois
    .flatMap((envoi) =>
      (envoi.creneaux || [])
        .filter((slot) => slot.estReserve)
        .map((slot) => ({
          ...slot,
          envoiId: envoi.envoiId,
          candidat_nom: envoi.candidat_nom,
          offre_titre: envoi.offre_titre,
        }))
    )
    .sort((a, b) => new Date(a.startAt) - new Date(b.startAt));

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

  const openPlanning = (envoi) => {
    setPlanningEnvoi(envoi);
    setSlotForm(initialSlotForm);
  };

  const closePlanning = () => {
    setPlanningEnvoi(null);
    setSlotForm(initialSlotForm);
    setDraftSlots([]);
  };

  const updateStatus = async (envoiId, statut) => {
    setUpdatingId(envoiId);
    try {
      await api.patch(
        `/envois/${envoiId}/`,
        { statut },
        { successMessage: "Statut candidature mis a jour." }
      );
      await load();
    } catch (err) {
      toast.error("Echec mise a jour du statut.");
    } finally {
      setUpdatingId(null);
    }
  };

  const addDraftSlot = () => {
    if (!slotForm.startAt) {
      toast.error("Renseignez la date et l'heure de debut.");
      return;
    }
    setDraftSlots((prev) => [...prev, { ...slotForm }]);
    setSlotForm(initialSlotForm);
  };

  const createSlotsBatch = async () => {
    if (!planningEnvoi) return;
    if (draftSlots.length === 0) {
      toast.error("Ajoutez au moins un creneau avant envoi.");
      return;
    }
    setCreatingSlot(true);
    try {
      await api.post(
        `/envois/${planningEnvoi.envoiId}/creneaux/`,
        draftSlots,
        { successMessage: `${draftSlots.length} creneau(x) ajoute(s).` }
      );
      await load();
      const refreshed = (await api.get("/envois/")).data?.envois || [];
      setEnvois(refreshed);
      const updated = refreshed.find((e) => e.envoiId === planningEnvoi.envoiId) || null;
      setPlanningEnvoi(updated);
      setSlotForm(initialSlotForm);
      setDraftSlots([]);
    } catch (err) {
      toast.error("Echec creation des creneaux.");
    } finally {
      setCreatingSlot(false);
    }
  };

  return (
    <AppShell title="Candidatures" subtitle="Traitez les candidatures recues et planifiez les entretiens.">
      <div className="rounded-3xl border border-slate-200 bg-[hsl(var(--card))] p-6 shadow-sm">
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Creneaux reserves</p>
          {reservedSlots.length === 0 ? (
            <p className="mt-2 text-sm text-emerald-700/80">Aucun creneau reserve par un candidat.</p>
          ) : (
            <div className="mt-3 space-y-2">
              {reservedSlots.map((slot) => (
                <div key={`reserved-ent-${slot.creneauId}`} className="rounded-xl border border-emerald-200 bg-white px-3 py-2 text-xs">
                  <p className="font-semibold text-slate-700">{formatDate(slot.startAt)}</p>
                  <p className="mt-1 text-slate-600">{slot.candidat_nom} - {slot.offre_titre}</p>
                  <p className="mt-1 text-slate-500">
                    {slot.mode} {slot.lieuOuLien ? `- ${slot.lieuOuLien}` : ""} {slot.duree_minutes ? `- ${slot.duree_minutes} min` : ""}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

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
                  <button
                    type="button"
                    onClick={() => {
                      if (envoi.cv_fichier_url) {
                        window.open(envoi.cv_fichier_url, "_blank", "noopener,noreferrer");
                      } else {
                        toast.error("CV introuvable pour cette candidature.");
                      }
                    }}
                    className="rounded-full border border-slate-200 px-3 py-2 hover:bg-slate-50"
                    title="Voir le CV"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => openPlanning(envoi)}
                    className="rounded-full border border-slate-200 px-3 py-2 hover:bg-slate-50"
                    title="Planifier entretien"
                    disabled={envoi.statut !== "accepte"}
                  >
                    <CalendarPlus className="h-4 w-4" />
                  </button>
                  <select
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs"
                    value={envoi.statut}
                    onChange={(e) => updateStatus(envoi.envoiId, e.target.value)}
                    disabled={updatingId === envoi.envoiId}
                  >
                    <option value="envoye">Envoye</option>
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

      {planningEnvoi && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-[hsl(var(--card))] p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Planifier un entretien</h3>
                <p className="text-xs text-slate-500">{planningEnvoi.candidat_nom} - {planningEnvoi.offre_titre}</p>
              </div>
              <button onClick={closePlanning} className="rounded-full border border-slate-200 p-2 hover:bg-slate-50">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="text-xs text-slate-600">
                Debut
                <input
                  type="datetime-local"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  value={slotForm.startAt}
                  onChange={(e) => setSlotForm((prev) => ({ ...prev, startAt: e.target.value }))}
                />
              </label>
              <label className="text-xs text-slate-600">
                Mode
                <select
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  value={slotForm.mode}
                  onChange={(e) => setSlotForm((prev) => ({ ...prev, mode: e.target.value }))}
                >
                  <option value="visio">Visio</option>
                  <option value="site">Sur site</option>
                </select>
              </label>
              <label className="text-xs text-slate-600">
                Lieu ou lien
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  value={slotForm.lieuOuLien}
                  onChange={(e) => setSlotForm((prev) => ({ ...prev, lieuOuLien: e.target.value }))}
                  placeholder="Salle, adresse ou lien meet"
                />
              </label>
              <label className="text-xs text-slate-600 md:col-span-2">
                Note
                <textarea
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  rows={2}
                  value={slotForm.note}
                  onChange={(e) => setSlotForm((prev) => ({ ...prev, note: e.target.value }))}
                />
              </label>
            </div>

            <div className="mt-4 flex justify-end">
              <div className="flex gap-2">
                <button
                  onClick={addDraftSlot}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Ajouter a la liste
                </button>
                <button
                  onClick={createSlotsBatch}
                  disabled={creatingSlot}
                  className="rounded-xl bg-[hsl(var(--primary))] px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
                >
                  {creatingSlot ? "Envoi..." : `Envoyer (${draftSlots.length})`}
                </button>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <p className="text-xs font-semibold text-slate-700">Creneaux en preparation</p>
              {draftSlots.length === 0 ? (
                <p className="text-xs text-slate-500">Aucun creneau ajoute a la liste.</p>
              ) : (
                draftSlots.map((slot, idx) => (
                  <div key={`draft-${idx}`} className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs">
                    <span className="font-semibold text-slate-700">
                      {formatDate(slot.startAt)} ({slot.mode})
                    </span>
                    <button
                      onClick={() => setDraftSlots((prev) => prev.filter((_, i) => i !== idx))}
                      className="rounded-lg border border-blue-200 px-2 py-1 text-blue-700 hover:bg-blue-100"
                    >
                      Retirer
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="mt-5 space-y-2">
              {(planningEnvoi.creneaux || []).length === 0 ? (
                <p className="text-xs text-slate-500">Aucun creneau propose.</p>
              ) : (
                (planningEnvoi.creneaux || []).map((slot) => (
                  <div key={slot.creneauId} className="rounded-xl border border-slate-100 px-3 py-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700">
                        {formatDate(slot.startAt)}
                      </span>
                      <span className={`rounded-full px-2 py-1 ${slot.estReserve ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}`}>
                        {slot.estReserve ? `Reserve par ${slot.reserve_par_nom || "candidat"}` : "Disponible"}
                      </span>
                    </div>
                    <p className="mt-1 text-slate-500">
                      {slot.mode} {slot.lieuOuLien ? `- ${slot.lieuOuLien}` : ""}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
};

export default EntrepriseCandidatures;
