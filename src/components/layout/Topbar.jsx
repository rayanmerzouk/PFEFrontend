import { useEffect, useState } from "react";
import { getTokenPayload } from "../../lib/auth";
import defaultAvatar from "../../assets/avatar-default.svg";
import { API_BASE_URL } from "../../lib/api";

const Topbar = ({ title, subtitle, actions }) => {
  const payload = getTokenPayload();
  const username = payload?.username || "Utilisateur";
  const isConnected = Boolean(payload);
  const userId = payload?.user_id || payload?.userId || payload?.id;
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    if (!userId) return;
    const loadPhoto = () => {
      fetch(`${API_BASE_URL}/utilisateurs/${userId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.photo_url) {
            const url = data.photo_url.startsWith("http")
              ? data.photo_url
              : `${API_BASE_URL}${data.photo_url}`;
            setPhotoUrl(url);
          }
        })
        .catch(() => null);
    };

    loadPhoto();
    const onPhotoUpdate = (e) => {
      if (e?.detail?.photo_url) {
        const url = e.detail.photo_url.startsWith("http")
          ? e.detail.photo_url
          : `${API_BASE_URL}${e.detail.photo_url}`;
        setPhotoUrl(url);
      }
    };
    window.addEventListener("profile:photo-updated", onPhotoUpdate);
    return () => window.removeEventListener("profile:photo-updated", onPhotoUpdate);
  }, [userId]);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-[hsl(var(--card))]/80 backdrop-blur">
      <div className="flex items-center justify-between px-6 py-4 lg:px-10">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">AutoCandidature</p>
          <h1 className="text-2xl font-display font-semibold text-slate-900">{title}</h1>
          {subtitle ? <p className="text-sm text-slate-500">{subtitle}</p> : null}
        </div>
        <div className="flex items-center gap-4">
          {actions}
          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-[hsl(var(--card))] px-3 py-1.5 text-sm text-slate-700 shadow-sm md:flex">
            <span className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500" : "bg-slate-300"}`} />
            <img
              src={photoUrl || defaultAvatar}
              alt="Profil"
              className="h-6 w-6 rounded-full object-cover border border-slate-200"
            />
            <span>{username}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
