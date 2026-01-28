import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  Send, CheckCircle, Loader2, FileText, Briefcase, 
  MapPin, Building2, Search, CheckSquare, AlertCircle, Upload
} from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:8000';

const Envoi = () => {
  // --- ÉTATS DONNÉES ---
  const [cvs, setCvs] = useState([]);
  const [selectedCV, setSelectedCV] = useState(null);
  const [allEntreprises, setAllEntreprises] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  // --- ÉTATS FILTRES ---
  const [domaine, setDomaine] = useState('');
  const [localisation, setLocalisation] = useState('');

  // --- ÉTATS UI ---
  const [isFetching, setIsFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // --- CONFIGURATION AXIOS ---
  const api = axios.create({ baseURL: API_BASE_URL });
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // --- CHARGEMENT DES DONNÉES ---
  const loadData = async () => {
    try {
      const [cvRes, entRes] = await Promise.all([
        api.get('/cvs/'),
        api.get('/entreprises/')
      ]);
      setCvs(cvRes.data);
      setAllEntreprises(entRes.data);
    } catch (err) {
      console.error("Erreur de chargement:", err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- FONCTION UPLOAD ---
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setMessage({ type: 'error', text: 'Seul le format PDF est accepté.' });
      return;
    }
    const userData = JSON.parse(localStorage.getItem('user'));
    const userId = userData?.id || userData?.pk;
    const formData = new FormData();
    formData.append('fichier', file);
    formData.append('nom', file.name);
    formData.append('user', userId);       
    formData.append('type', 'CV');   
    setUploading(true);
    try {
      await api.post('/cvs/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMessage({ type: 'success', text: "CV ajouté !" });
      loadData();
    } catch (err) {
      setMessage({ type: 'error', text: "Erreur lors de l'ajout." });
    } finally {
      setUploading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  // --- FILTRAGE INTELLIGENT ---
  const normalize = (str) => 
    (str || "").toString().toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const filteredEntreprises = useMemo(() => {
    return allEntreprises.filter(ent => {
      if (ent.recevoirCandidatures !== true) return false;
      const matchSecteur = domaine.length === 0 || normalize(ent.secteur).includes(normalize(domaine));
      const matchLieu = localisation.length === 0 || normalize(ent.localisation).includes(normalize(localisation));
      return matchSecteur && matchLieu;
    });
  }, [allEntreprises, domaine, localisation]);

  useEffect(() => {
    setSelectedIds(filteredEntreprises.map(e => e.entrepriseId));
  }, [filteredEntreprises]);

  // --- ENVOI PARFAIT ---
  const handleEnvoyer = async () => {
    if (!selectedCV) {
      setMessage({ type: 'error', text: "Veuillez sélectionner un CV." });
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/envois/', { 
        cv_id: selectedCV,
        domaine: domaine.trim(),
        localisation: localisation.trim()
      });
      setMessage({ type: 'success', text: `Succès ! Diffusé à ${response.data.count} entreprises.` });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } catch (err) {
      setMessage({ type: 'error', text: "L'envoi a échoué." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FE] p-4 md:p-10 text-slate-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border-2 border-dashed border-slate-200 hover:border-blue-400 transition-all">
            <label className="flex flex-col items-center justify-center cursor-pointer py-2">
              <div className="bg-blue-50 p-3 rounded-full text-blue-600 mb-2">
                {uploading ? <Loader2 className="animate-spin" size={24}/> : <Upload size={24}/>}
              </div>
              <span className="font-bold text-sm">Ajouter un nouveau CV (PDF)</span>
              <input type="file" className="hidden" onChange={handleUpload} accept=".pdf" />
            </label>
          </div>
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <FileText className="text-blue-600" size={20}/> Mes CV
            </h3>
            <div className="space-y-3 max-h-52 overflow-y-auto pr-2">
              {cvs.map(cv => (
                <div key={cv.cvId} onClick={() => setSelectedCV(cv.cvId)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${selectedCV === cv.cvId ? 'border-blue-500 bg-blue-50/40' : 'border-slate-50 bg-slate-50/50'}`}>
                  <span className="text-sm font-bold truncate">{cv.nom}</span>
                  {selectedCV === cv.cvId && <CheckCircle className="text-blue-500" size={18} />}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Search className="text-blue-600" size={20}/> Ciblage
            </h3>
            <div className="space-y-4">
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18}/>
                <input className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Secteur..." value={domaine} onChange={e => setDomaine(e.target.value)} />
              </div>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18}/>
                <input className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Ville..." value={localisation} onChange={e => setLocalisation(e.target.value)} />
              </div>
            </div>
          </div>
          <button disabled={loading || !selectedCV || selectedIds.length === 0} onClick={handleEnvoyer}
            className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black shadow-xl hover:bg-blue-700 disabled:bg-slate-200 transition-all flex items-center justify-center gap-3">
            {loading ? <Loader2 className="animate-spin" /> : <Send size={20}/>}
            DIFFUSER À {selectedIds.length} CIBLES
          </button>
        </div>
        <div className="lg:col-span-8">
          <div className="bg-white rounded-[2.5rem] shadow-sm h-[750px] flex flex-col overflow-hidden border border-slate-100">
            <div className="p-8 border-b flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black">Entreprises</h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Acceptant les candidatures</p>
              </div>
              <div className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-black">{filteredEntreprises.length} MATCHS</div>
            </div>
            <div className="flex-1 overflow-y-auto p-8 bg-slate-50/30">
              {isFetching ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 font-bold">
                   <Loader2 className="animate-spin text-blue-600 mb-2" size={32}/> Synchronisation...
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredEntreprises.map(ent => (
                    <div key={ent.entrepriseId} onClick={() => setSelectedIds(prev => prev.includes(ent.entrepriseId) ? prev.filter(id => id !== ent.entrepriseId) : [...prev, ent.entrepriseId])}
                      className={`p-5 rounded-3xl bg-white border-2 transition-all flex justify-between items-center cursor-pointer ${selectedIds.includes(ent.entrepriseId) ? 'border-blue-500 shadow-md' : 'border-transparent shadow-sm'}`}>
                      <div className="overflow-hidden">
                        <h4 className="font-black text-slate-800 truncate">{ent.nomEntreprise}</h4>
                        <p className="text-[10px] font-black text-blue-500 uppercase">{ent.secteur}</p>
                        <p className="text-[10px] font-bold text-slate-400">{ent.localisation}</p>
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
      {message.text && (
        <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-8 py-4 rounded-2xl shadow-2xl animate-bounce ${message.type === 'success' ? 'bg-slate-900 text-white' : 'bg-red-600 text-white'}`}>
          {message.type === 'success' ? <CheckCircle className="text-green-400"/> : <AlertCircle/>}
          <span className="font-bold">{message.text}</span>
        </div>
      )}
    </div>
  );
};

export default Envoi;