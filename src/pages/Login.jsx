import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, Lock, User } from "lucide-react";
import { toast } from "sonner";
import api from "../lib/api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    setIsLoading(true);

    api
      .post("/api/accessToken/", { username, password })
      .then((res) => {
        localStorage.setItem("accessToken", res.data.access);
        localStorage.setItem("refreshToken", res.data.refresh);
        toast.success("Connexion reussie.");
        navigate("/");
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          toast.error("Identifiants invalides.");
        } else {
          toast.error("Erreur de connexion.");
        }
      })
      .finally(() => setIsLoading(false));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="min-h-screen bg-[var(--app-bg)]">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_20%,hsl(var(--primary)/0.08),transparent_40%),radial-gradient(circle_at_90%_10%,hsl(var(--accent)/0.08),transparent_40%)]" />
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
              Centralisez vos candidatures et pilotez votre progression.
            </h1>
            <p className="mt-4 max-w-md text-base text-slate-600">
              Un espace unique pour automatiser les envois, suivre les statuts et agir vite.
            </p>
            <div className="mt-8 flex gap-4">
              <div className="rounded-2xl border border-slate-200 bg-[hsl(var(--card))] px-4 py-3 text-sm text-slate-600">
                + Visibilite sur vos envois
              </div>
              <div className="rounded-2xl border border-slate-200 bg-[hsl(var(--card))] px-4 py-3 text-sm text-slate-600">
                + Controle des relances
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-[hsl(var(--card))] p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Connexion</p>
                <h2 className="mt-2 text-2xl font-display font-semibold text-slate-900">Acces rapide</h2>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <Lock className="h-5 w-5 text-slate-500" />
              </div>
            </div>
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <label className="block text-sm text-slate-600">
                Nom utilisateur
                <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <User className="h-4 w-4 text-slate-400" />
                  <input
                    className="w-full bg-transparent text-sm outline-none"
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </label>
              <label className="block text-sm text-slate-600">
                Mot de passe
                <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <Lock className="h-4 w-4 text-slate-400" />
                  <input
                    className="w-full bg-transparent text-sm outline-none"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </label>
              <button
                type="submit"
                className="w-full rounded-2xl bg-[hsl(var(--primary))] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[hsl(var(--primary-dark))] disabled:opacity-70"
                disabled={isLoading}
              >
                {isLoading ? "Connexion..." : "Se connecter"}
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-slate-500">
              Pas encore de compte ?{" "}
              <Link to="/signup" className="font-semibold text-slate-900">
                Creer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
