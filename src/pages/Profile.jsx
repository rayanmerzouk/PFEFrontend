import { useEffect, useState } from "react";
import { User, Mail, Phone, ImagePlus } from "lucide-react";
import AppShell from "../components/layout/AppShell";
import api from "../lib/api";
import { getUserId } from "../lib/auth";
import defaultAvatar from "../assets/avatar-default.svg";
import { API_BASE_URL } from "../lib/api";

const Profile = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    nom: "",
    prenom: "",
    telephone: "",
    type: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const userId = getUserId();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get(`/utilisateurs/${userId}/`);
        const data = res.data;
        if (data?.photo_url && !data.photo_url.startsWith("http")) {
          data.photo_url = `${API_BASE_URL}${data.photo_url}`;
        }
        setFormData(data);
      } catch (err) {
        setFormData((prev) => ({ ...prev }));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0] || null;
    setPhotoFile(file);
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    } else {
      setPhotoPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return;
    setSaving(true);
    try {
      const payload = {
        email: formData.email,
        username: formData.username,
        nom: formData.nom,
        prenom: formData.prenom,
        telephone: formData.telephone,
      };

      const form = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          form.append(key, value);
        }
      });
      if (photoFile) {
        form.append("photoProfil", photoFile);
      }

      const res = await api.patch(`/utilisateurs/${userId}/`, form);
      if (res?.data?.user) {
        const data = res.data.user;
        if (data?.photo_url && !data.photo_url.startsWith("http")) {
          data.photo_url = `${API_BASE_URL}${data.photo_url}`;
        }
        setFormData(data);
        setPhotoPreview(null);
        setPhotoFile(null);
        if (data.photo_url) {
          window.dispatchEvent(
            new CustomEvent("profile:photo-updated", { detail: { photo_url: data.photo_url } })
          );
        }
      }
    } catch (err) {
      // silent
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell title="Profil" subtitle="Mettez a jour vos informations personnelles.">
      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <div className="rounded-3xl border border-slate-200 bg-[hsl(var(--card))] p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[hsl(var(--primary))] px-4 py-6 text-white">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Compte</p>
              <h2 className="mt-2 text-2xl font-display font-semibold">{formData.username || "Utilisateur"}</h2>
              <p className="mt-2 text-sm text-slate-300">{formData.type}</p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3">
              <div className="relative">
                <img
                  src={photoPreview || formData.photo_url || defaultAvatar}
                  alt="Profil"
                  className="h-14 w-14 rounded-full border border-white/40 object-cover"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 cursor-pointer">
                  <ImagePlus className="h-4 w-4" />
                  <input
                    name="photoProfil"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
                {(formData.photo_url || photoPreview) ? (
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const form = new FormData();
                        form.append("photoProfil", "");
                        const res = await api.patch(`/utilisateurs/${userId}/`, form);
                        if (res?.data?.user) {
                          setFormData(res.data.user);
                        }
                        setPhotoFile(null);
                        setPhotoPreview(null);
                        window.dispatchEvent(new CustomEvent("profile:photo-updated", { detail: { photo_url: "" } }));
                      } catch (err) {
                        // silent
                      }
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/20"
                    aria-label="Supprimer la photo"
                  >
                    ✕
                  </button>
                ) : null}
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {formData.email}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {formData.telephone || "Non renseigne"}
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-[hsl(var(--card))] p-6 shadow-sm">
          {loading ? (
            <div className="text-center text-slate-500">Chargement...</div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm text-slate-600">
                  Prenom
                  <input
                    name="prenom"
                    value={formData.prenom || ""}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                  />
                </label>
                <label className="text-sm text-slate-600">
                  Nom
                  <input
                    name="nom"
                    value={formData.nom || ""}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                  />
                </label>
              </div>
              <label className="text-sm text-slate-600">
                Username
                <input
                  name="username"
                  value={formData.username || ""}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                />
              </label>
              <label className="text-sm text-slate-600">
                Email
                <input
                  name="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                />
              </label>
              <label className="text-sm text-slate-600">
                Telephone
                <input
                  name="telephone"
                  value={formData.telephone || ""}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                />
              </label>
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-2xl bg-[hsl(var(--primary))] px-4 py-3 text-sm font-semibold text-white"
              >
                {saving ? "Sauvegarde..." : "Sauvegarder"}
              </button>
            </div>
          )}
        </form>
      </div>
    </AppShell>
  );
};

export default Profile;
