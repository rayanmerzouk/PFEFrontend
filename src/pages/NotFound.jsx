import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[var(--app-bg)]">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.08),transparent_40%)]" />
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Erreur 404</p>
        <h1 className="mt-3 text-4xl font-display font-semibold text-slate-900">Page introuvable</h1>
        <p className="mt-4 text-sm text-slate-500">
          Le lien que vous cherchez n'existe pas ou a ete deplace.
        </p>
        <Link
          to="/"
          className="mt-6 rounded-2xl bg-[hsl(var(--primary))] px-4 py-2 text-sm font-semibold text-white"
        >
          Retour au tableau de bord
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
