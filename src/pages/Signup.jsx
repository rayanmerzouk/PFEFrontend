import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Briefcase, UserPlus } from "lucide-react";
import { toast } from "sonner";
import api from "../lib/api";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password_confirm: "",
    type: "candidat",
    nom: "",
    prenom: "",
    telephone: "",
    nomEntreprise: "",
    secteur: "",
    ville: "",
    pays: "Algerie",
    dateNaissance: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.password_confirm) {
      toast.error("Les mots de passe ne correspondent pas.");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caracteres.");
      setIsLoading(false);
      return;
    }

    try {
      if (formData.type === "entreprise" && !formData.nomEntreprise.trim()) {
        toast.error("Le nom de l'entreprise est obligatoire.");
        setIsLoading(false);
        return;
      }

      const userPayload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password_confirm: formData.password_confirm,
        type: formData.type,
        nom: formData.nom || "",
        prenom: formData.type === "candidat" ? formData.prenom || "" : "",
        telephone: formData.telephone || "",
        dateNaissance: formData.type === "candidat" ? formData.dateNaissance || "" : "",
      };

      const userForm = new FormData();
      Object.entries(userPayload).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          userForm.append(key, value);
        }
      });

      await api.post("/utilisateurs/", userForm, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (formData.type === "entreprise") {
        const loginRes = await api.post("/api/accessToken/", {
          username: formData.username,
          password: formData.password,
        });
        localStorage.setItem("accessToken", loginRes.data.access);
        localStorage.setItem("refreshToken", loginRes.data.refresh);

        await api.post("/entreprises/", {
          nomEntreprise: formData.nomEntreprise,
          secteur: formData.secteur || "",
          ville: formData.ville || "",
          pays: formData.pays || "Algerie",
          recevoirCandidatures: true,
        });

        toast.success("Entreprise creee avec succes.");
        navigate("/dashboard-entreprise");
        return;
      }

      toast.success("Inscription reussie.");
      navigate("/login");
    } catch (error) {
      console.error(error);
      const apiError =
        error?.response?.data && typeof error.response.data === "object"
          ? JSON.stringify(error.response.data)
          : "Erreur lors de l'inscription.";
      toast.error(apiError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--app-bg)]">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_15%,hsl(var(--primary)/0.08),transparent_40%),radial-gradient(circle_at_80%_10%,hsl(var(--secondary)/0.08),transparent_40%)]" />
      <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6">
        <div className="grid w-full gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div className="hidden flex-col justify-center lg:flex">
            <div className="flex items-center gap-3 text-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[hsl(var(--primary))] text-white">
                <Briefcase className="h-6 w-6" />
              </div>
              <span className="text-xl font-display font-semibold">AutoCandidature</span>
            </div>
            <h1 className="mt-8 text-4xl font-display font-semibold leading-tight text-slate-900">
              Creez un compte pour automatiser vos candidatures.
            </h1>
            <p className="mt-4 max-w-md text-base text-slate-600">
              Acces rapide, suivi clair, et productivite maximale des le premier jour.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-[hsl(var(--card))] p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Inscription</p>
                <h2 className="mt-2 text-2xl font-display font-semibold text-slate-900">Creer un compte</h2>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <UserPlus className="h-5 w-5 text-slate-500" />
              </div>
            </div>
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <label className="block text-sm text-slate-600">
                Type
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                >
                  <option value="candidat">Candidat</option>
                  <option value="entreprise">Entreprise</option>
                </select>
              </label>
              {formData.type === "candidat" ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    name="prenom"
                    placeholder="Prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                  />
                  <input
                    name="nom"
                    placeholder="Nom"
                    value={formData.nom}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                  />
                </div>
              ) : (
                <>
                  <input
                    name="nomEntreprise"
                    placeholder="Nom de l'entreprise"
                    value={formData.nomEntreprise}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                    required
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      name="secteur"
                      placeholder="Secteur d'activite"
                      value={formData.secteur}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                    />
                    <input
                      name="ville"
                      placeholder="Ville"
                      value={formData.ville}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                    />
                  </div>
                  <input
                    name="pays"
                    placeholder="Pays"
                    value={formData.pays}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                  />
                </>
              )}
              <input
                name="username"
                placeholder="Nom utilisateur"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
              />
              <input
                name="telephone"
                placeholder="Telephone"
                value={formData.telephone}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
              />
              {formData.type === "candidat" && (
                <input
                  name="dateNaissance"
                  type="date"
                  value={formData.dateNaissance}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                />
              )}
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  name="password"
                  type="password"
                  placeholder="Mot de passe"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                />
                <input
                  name="password_confirm"
                  type="password"
                  placeholder="Confirmer"
                  value={formData.password_confirm}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-2xl bg-[hsl(var(--primary))] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[hsl(var(--primary-dark))] disabled:opacity-70"
                disabled={isLoading}
              >
                {isLoading ? "Inscription..." : "Creer le compte"}
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-slate-500">
              Deja un compte ?{" "}
              <Link to="/login" className="font-semibold text-slate-900">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
