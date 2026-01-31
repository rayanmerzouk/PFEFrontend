const Footer = () => {
  return (
    <footer className="border-t border-slate-200/70 bg-[hsl(var(--card))]">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-6 text-sm text-slate-500 md:flex-row md:items-center lg:px-10">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--secondary))]" />
          <span>AutoCandidature • Plateforme de recrutement intelligent</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.18em] text-slate-400">
          <span>Confidentialite</span>
          <span>Support</span>
          <span>Statut systeme</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
