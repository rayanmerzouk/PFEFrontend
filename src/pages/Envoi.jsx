import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  Send, CheckCircle, Loader2, FileText, Briefcase, 
  MapPin, Building2, Search, CheckSquare, AlertCircle 
} from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:8000';

const Envoi = () => {
  // --- ÉTATS ---
  const [cvs, setCvs] = useState([]);
  const [selectedCV, setSelectedCV] = useState(null);
  const [allEntreprises, setAllEntreprises] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [domaine, setDomaine] = useState('');
  const [localisation, setLocalisation] = useState('');
  const [isFetching, setIsFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // --- AXIOS CONFIG ---
  const api = axios.create({ baseURL: API_BASE_URL });
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // --- CHARGEMENT ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const [cvRes, entRes] = await Promise.all([
          api.get('/cvs/'),
          api.get('/entreprises/')
        ]);
        setCvs(cvRes.data);
        setAllEntreprises(entRes.data);
      } catch (err) {
        console.error("Erreur API:", err);
      } finally {
        setIsFetching(false);
      }
    };
    loadData();
  }, []);

  // --- MOTEUR DE FILTRAGE INSTANTANÉ ---
  const normalize = (str) => 
    (str || "").toString().toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const filteredEntreprises = useMemo(() => {
    return allEntreprises.filter(ent => {
      // 1. CONDITION CRITIQUE : Seules les entreprises avec recevoirCandidatures = true
      const peutRecevoir = ent.recevoirCandidatures === true;
      if (!peutRecevoir) return false;

      // 2. FILTRE SECTEUR (Dès la 1ère lettre)
      const matchSecteur = domaine.length === 0 || 
        normalize(ent.secteur).includes(normalize(domaine));

      // 3. FILTRE VILLE
      const matchLieu = localisation.length === 0 || 
        normalize(ent.localisation).includes(normalize(localisation));

      return matchSecteur && matchLieu;
    });
  }, [allEntreprises, domaine, localisation]);

  // Synchronisation des IDs sélectionnés
  useEffect(() => {
    setSelectedIds(filteredEntreprises.map(e => e.entrepriseId));
  }, [filteredEntreprises]);

  // --- ENVOI ---
  const handleEnvoyer = async () => {
    if (!selectedCV || selectedIds.length === 0) return;
    setLoading(true);
    try {
      await api.post('/envois/', { cv_id: selectedCV, entreprises_ids: selectedIds });
      setMessage({ type: 'success', text: `Candidatures envoyées à ${selectedIds.length} entreprises !` });
      setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    } catch (err) {
      setMessage({ type: 'error', text: "Une erreur est survenue lors de l'envoi." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans antialiased text-slate-900">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SIDEBAR GAUCHE */}
        <div className="lg:col-span-4 space-y-6">
          {/* CV */}
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200/60">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <FileText className="text-blue-600" size={20}/> Choisir un CV
            </h3>
            <div className="space-y-3">
              {cvs.map(cv => (
                <div 
                  key={cv.cvId}
                  onClick={() => setSelectedCV(cv.cvId)}
                  className={`group p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    selectedCV === cv.cvId ? 'border-blue-500 bg-blue-50/50' : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'
                  }`}
                >
                  <span className={`text-sm font-bold ${selectedCV === cv.cvId ? 'text-blue-700' : 'text-slate-600'}`}>{cv.nom}</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedCV === cv.cvId ? 'border-blue-500 bg-blue-500' : 'border-slate-300'}`}>
                    {selectedCV === cv.cvId && <div className="w-2 h-2 bg-white rounded-full"/>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RECHERCHE */}
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200/60">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Search className="text-blue-600" size={20}/> Ciblage
            </h3>
            <div className="space-y-4">
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                <input 
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 border border-slate-100 transition-all font-medium"
                  placeholder="Secteur (ex: Informatique)"
                  value={domaine}
                  onChange={e => setDomaine(e.target.value)}
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                <input 
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 border border-slate-100 transition-all font-medium"
                  placeholder="Ville (ex: Alger)"
                  value={localisation}
                  onChange={e => setLocalisation(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button 
            disabled={loading || selectedIds.length === 0 || !selectedCV}
            onClick={handleEnvoyer}
            className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 disabled:bg-slate-200 disabled:shadow-none transition-all flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Send size={20}/>}
            DIFFUSER ({selectedIds.length})
          </button>
        </div>

        {/* LISTE DROITE */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 flex flex-col h-[750px] overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-slate-800">Entreprises disponibles</h2>
                <p className="text-slate-400 text-sm font-bold flex items-center gap-1">
                  <Building2 size={14}/> Uniquement celles acceptant les candidatures
                </p>
              </div>
              <div className="bg-blue-50 text-blue-600 px-5 py-2 rounded-2xl font-black text-sm border border-blue-100">
                {filteredEntreprises.length} Matchs
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 bg-slate-50/30">
              {isFetching ? (
                <div className="flex flex-col items-center justify-center h-full gap-3">
                  <Loader2 className="animate-spin text-blue-600" size={32}/>
                  <span className="font-bold text-slate-400">Récupération des données...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filteredEntreprises.map(ent => (
                    <div 
                      key={ent.entrepriseId}
                      onClick={() => setSelectedIds(prev => prev.includes(ent.entrepriseId) ? prev.filter(id => id !== ent.entrepriseId) : [...prev, ent.entrepriseId])}
                      className={`group p-5 rounded-3xl bg-white border-2 transition-all duration-200 cursor-pointer flex justify-between items-center ${
                        selectedIds.includes(ent.entrepriseId) ? 'border-blue-500 shadow-md ring-4 ring-blue-50' : 'border-transparent shadow-sm hover:border-slate-200'
                      }`}
                    >
                      <div className="space-y-1">
                        <h4 className="font-black text-slate-800 leading-tight">{ent.nomEntreprise}</h4>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{ent.secteur}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{ent.localisation}</span>
                        </div>
                      </div>
                      <CheckSquare className={selectedIds.includes(ent.entrepriseId) ? 'text-blue-500' : 'text-slate-200'} size={24}/>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* NOTIFICATIONS TACTILES */}
      {message.text && (
        <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-8 py-4 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-5 ${
          message.type === 'success' ? 'bg-slate-900 text-white' : 'bg-red-500 text-white'
        }`}>
          {message.type === 'success' ? <CheckCircle className="text-green-400"/> : <AlertCircle/>}
          <span className="font-bold">{message.text}</span>
        </div>
      )}
    </div>
  );
};

export default Envoi;