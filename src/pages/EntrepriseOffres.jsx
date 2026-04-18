import { useEffect, useState } from "react";
import {
  Plus, ToggleLeft, ToggleRight, Trash2,
  Briefcase, MapPin, Globe, Wrench, GraduationCap,
  BadgeDollarSign, Clock, Languages, Tag,
} from "lucide-react";
import { toast } from "sonner";
import AppShell from "../components/layout/AppShell";
import api from "../lib/api";

const initialForm = {
  titre: "",
  domaine: "",
  specialite: "",
  type_contrat: "cdi",
  mode_travail: "site",
  niveau: "",
  experience_min: "",
  salaire_min: "",
  etude_min: "aucun",
  ville: "",
  pays: "Algerie",
  tags: "",
};

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[hsl(var(--primary)/0.4)] focus:bg-white transition-all";

const selectClass = inputClass;

const Field = ({ icon: Icon, children }) => (
  <div className="relative group">
    <Icon
      size={15}
      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[hsl(var(--primary))] transition-colors pointer-events-none"
    />
    {children}
  </div>
);

const EntrepriseOffres = () => {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/entreprise/offres/");
      setOffres(res.data?.offres || []);
    } catch (err) {
      console.log(err.response?.data);
      setOffres([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const set = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  // ✅ CREATE (backend safe, UI unchanged)
  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        titre: form.titre,
        domaine: form.domaine,
        specialite: form.specialite || null,

        type_contrat: form.type_contrat,
        mode_travail: form.mode_travail,

        niveau: form.niveau || null,
        etude_min: form.etude_min || "aucun",

        experience_min: form.experience_min
          ? parseInt(form.experience_min)
          : null,

        salaire_min: form.salaire_min
          ? parseInt(form.salaire_min)
          : null,

        ville: form.ville || null,
        pays: form.pays || "Algerie",
        tags: form.tags || null,
      };

      await api.post("/entreprise/offres/", payload);

      setForm(initialForm);
      await load();

      toast.success("Offre créée avec succès");
    } catch (err) {
      console.log(err.response?.data);
      toast.error("Erreur lors de la création");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleRecevoir = async (id, current) => {
    try {
      await api.patch(`/offres/${id}/toggle-recevoir/`, {
        recevoirCandidatures: !current,
      });

      setOffres((prev) =>
        prev.map((o) =>
          o.offreId === id
            ? { ...o, recevoirCandidatures: !current }
            : o
        )
      );
    } catch {
      toast.error("Erreur toggle");
    }
  };

  const archiveOffer = async (id) => {
    try {
      await api.delete(`/offres/${id}/`);

      setOffres((prev) =>
        prev.map((o) =>
          o.offreId === id ? { ...o, estArchivee: true } : o
        )
      );

      toast.success("Offre archivée");
    } catch {
      toast.error("Erreur archive");
    }
  };

  return (
    <AppShell title="Offres entreprise" subtitle="Créez et pilotez vos offres.">

      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">

        {/* FORMULAIRE (UI INCHANGÉE) */}
        <form
          onSubmit={handleCreate}
          className="rounded-3xl border border-slate-200 bg-[hsl(var(--card))] p-6 shadow-sm space-y-3"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
            Nouvelle offre
          </p>

          <Field icon={Briefcase}>
            <input
              className={`${inputClass} pl-11`}
              placeholder="Titre *"
              value={form.titre}
              onChange={set("titre")}
              required
            />
          </Field>

          <Field icon={Briefcase}>
            <input
              className={`${inputClass} pl-11`}
              placeholder="Domaine *"
              value={form.domaine}
              onChange={set("domaine")}
              required
            />
          </Field>

          <Field icon={Wrench}>
            <input
              className={`${inputClass} pl-11`}
              placeholder="Spécialité"
              value={form.specialite}
              onChange={set("specialite")}
            />
          </Field>

          {/* SELECT CONTRAT / MODE (inchangé) */}
          <div className="grid grid-cols-2 gap-3">
            <select
              className={selectClass}
              value={form.type_contrat}
              onChange={set("type_contrat")}
            >
              <option value="cdi">CDI</option>
              <option value="cdd">CDD</option>
              <option value="stage">Stage</option>
              <option value="freelance">Freelance</option>
              <option value="alternance">Alternance</option>
            </select>

            <select
              className={selectClass}
              value={form.mode_travail}
              onChange={set("mode_travail")}
            >
              <option value="site">Site</option>
              <option value="hybride">Hybride</option>
              <option value="remote">Remote</option>
            </select>
          </div>

          {/* SELECT NIVEAU / ETUDE (important demandé) */}
          <div className="grid grid-cols-2 gap-3">

            <select
              className={selectClass}
              value={form.niveau}
              onChange={set("niveau")}
            >
              <option value="">Niveau</option>
              <option value="junior">Junior</option>
              <option value="intermediaire">Intermédiaire</option>
              <option value="senior">Senior</option>
              <option value="lead">Lead</option>
              <option value="manager">Manager</option>
            </select>

            <select
              className={selectClass}
              value={form.etude_min}
              onChange={set("etude_min")}
            >
              <option value="aucun">Aucun</option>
              <option value="bac">Bac</option>
              <option value="licence">Licence</option>
              <option value="master">Master</option>
              <option value="doctorat">Doctorat</option>
            </select>

          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field icon={Clock}>
              <input
                className={`${inputClass} pl-11`}
                type="number"
                placeholder="Expérience min"
                value={form.experience_min}
                onChange={set("experience_min")}
              />
            </Field>

            <Field icon={BadgeDollarSign}>
              <input
                className={`${inputClass} pl-11`}
                type="number"
                placeholder="Salaire min"
                value={form.salaire_min}
                onChange={set("salaire_min")}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field icon={MapPin}>
              <input
                className={`${inputClass} pl-11`}
                placeholder="Ville"
                value={form.ville}
                onChange={set("ville")}
              />
            </Field>

            <Field icon={Globe}>
              <input
                className={`${inputClass} pl-11`}
                placeholder="Pays"
                value={form.pays}
                onChange={set("pays")}
              />
            </Field>
          </div>

          <Field icon={Tag}>
            <input
              className={`${inputClass} pl-11`}
              placeholder="Tags"
              value={form.tags}
              onChange={set("tags")}
            />
          </Field>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[hsl(var(--primary))] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            <Plus size={16} />
            {submitting ? "Création..." : "Créer l'offre"}
          </button>
        </form>

        {/* LISTE (STRICTEMENT IDENTIQUE À TON DESIGN) */}
        <div className="rounded-3xl border border-slate-200 bg-[hsl(var(--card))] p-6 shadow-sm">
          {loading ? (
            <div className="text-center text-slate-500">Chargement...</div>
          ) : (
            <div className="space-y-3">
              {offres.map((offre) => (
                <div
                  key={offre.offreId}
                  className={`rounded-2xl border px-4 py-3 transition-all ${
                    offre.estArchivee
                      ? "border-slate-100 bg-slate-50 opacity-50"
                      : "border-slate-100"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {offre.titre}
                      </p>
                      <p className="text-xs text-slate-500">
                        {offre.domaine}
                        {offre.specialite ? ` · ${offre.specialite}` : ""}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!offre.estArchivee && (
                        <>
                          <button onClick={() => toggleRecevoir(offre.offreId, offre.recevoirCandidatures)}>
                            {offre.recevoirCandidatures ? <ToggleRight /> : <ToggleLeft />}
                          </button>

                          <button onClick={() => archiveOffer(offre.offreId)}>
                            <Trash2 />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {offres.length === 0 && (
                <div className="text-center text-sm text-slate-500">
                  Aucune offre créée.
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </AppShell>
  );
};

export default EntrepriseOffres;