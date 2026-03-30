import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Video, ArrowLeft } from "lucide-react";
import AppShell from "../components/layout/AppShell";
import api from "../lib/api";

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleString("fr-FR");
};

const MeetingRoom = () => {
  const { creneauId } = useParams();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMeeting = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/creneaux/${creneauId}/meeting/`);
        setMeeting(res.data || null);
      } catch (err) {
        setError("Impossible de charger les informations de reunion.");
      } finally {
        setLoading(false);
      }
    };
    if (creneauId) loadMeeting();
  }, [creneauId]);

  return (
    <AppShell
      title="Entretien en ligne"
      subtitle="Rejoignez votre rendez-vous directement depuis la plateforme."
      actions={
        <button
          onClick={() => navigate("/rendez-vous")}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </button>
      }
    >
      <div className="rounded-3xl border border-slate-200 bg-[hsl(var(--card))] p-6 shadow-sm">
        {loading ? (
          <div className="text-center text-slate-500">Chargement...</div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>
        ) : !meeting ? (
          <div className="text-center text-slate-500">Aucune reunion disponible.</div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3">
              <div className="text-sm text-slate-700">
                <p className="font-semibold">Debut: {formatDate(meeting.start_at)}</p>
                <p className="text-xs text-slate-500">Fin: {formatDate(meeting.end_at)}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${meeting.can_join ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                {meeting.can_join ? "Acces ouvert" : "Acces limite (10 min avant)"}
              </span>
            </div>

            {meeting.can_join ? (
              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <iframe
                  src={meeting.meeting_url}
                  title={`meeting-${meeting.creneauId}`}
                  className="h-[72vh] w-full"
                  allow="camera; microphone; display-capture; fullscreen"
                />
              </div>
            ) : (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                L'entretien sera accessible 10 minutes avant l'heure de debut.
              </div>
            )}

            <a
              href={meeting.meeting_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-4 py-2 text-sm font-semibold text-white"
            >
              <Video className="h-4 w-4" />
              Ouvrir dans un nouvel onglet
            </a>
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default MeetingRoom;
