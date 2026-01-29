import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  Send, CheckCircle, Loader2, FileText, Briefcase, 
  MapPin, Search, CheckSquare, AlertCircle, Upload, X, Maximize2, Globe
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Configuration Icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const API_BASE_URL = 'http://127.0.0.1:8000';

const fastNormalize = (str) => 
  (str || "").toString().toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[\s-]/g, "");

const Envoi = () => {
  const [cvs, setCvs] = useState([]);
  const [selectedCV, setSelectedCV] = useState(null);
  const [allEntreprises, setAllEntreprises] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  // États des filtres
  const [domaine, setDomaine] = useState('');
  const [ville, setVille] = useState('');
  const [pays, setPays] = useState('');
  const [debouncedFilters, setDebouncedFilters] = useState({ domaine: '', ville: '', pays: '' });

  const [showMapPicker, setShowMapPicker] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const api = axios.create({ baseURL: API_BASE_URL });
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters({ domaine, ville, pays });
    }, 300);
    return () => clearTimeout(handler);
  }, [domaine, ville, pays]);

  const loadData = async () => {
    try {
      const [cvRes, entRes] = await Promise.all([api.get('/cvs/'), api.get('/entreprises/')]);
      // Support des formats d'objets ou tableaux directs
      const entData = entRes.data.entreprises || entRes.data;
      const cvData = cvRes.data.cvs || cvRes.data;

      const optimizedData = entData.map(ent => ({
        ...ent,
        _normSecteur: fastNormalize(ent.secteur),
        _normVille: fastNormalize(ent.ville),
        _normPays: fastNormalize(ent.pays)
      }));
      setCvs(cvData);
      setAllEntreprises(optimizedData);
    } catch (err) { console.error(err); }
    finally { setIsFetching(false); }
  };

  useEffect(() => { loadData(); }, []);

  const filteredEntreprises = useMemo(() => {
    const { domaine: d, ville: v, pays: p } = debouncedFilters;
    const nD = fastNormalize(d); const nV = fastNormalize(v); const nP = fastNormalize(p);

    return allEntreprises.filter(ent => {
      if (!ent.recevoirCandidatures) return false;
      if (nD && !ent._normSecteur.includes(nD)) return false;
      if (nV && !ent._normVille.includes(nV)) return false;
      if (nP && !ent._normPays.includes(nP)) return false;
      return true;
    });
  }, [allEntreprises, debouncedFilters]);

  // Sélection auto au filtrage
  useEffect(() => {
    setSelectedIds(filteredEntreprises.map(e => e.entrepriseId));
  }, [filteredEntreprises]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== 'application/pdf') return;
    setUploading(true);
    const formData = new FormData();
    formData.append('fichier', file);
    formData.append('nom', file.name);
    formData.append('type', 'cv');
    try {
      await api.post('/cvs/', formData);
      loadData();
      setMessage({ type: 'success', text: "CV ajouté à votre profil." });
    } catch (err) { setMessage({ type: 'error', text: "Erreur lors de l'upload." }); }
    finally { setUploading(false); setTimeout(() => setMessage({ type: '', text: '' }), 4000); }
  };

  const handleEnvoyer = async () => {
    if (!selectedCV || selectedIds.length === 0) return;
    setLoading(true);
    try {
      // UTILISATION DE LA LOGIQUE PAR IDS SÉLECTIONNÉS
      await api.post('/envois/', { 
        cv_id: selectedCV, 
        entreprise_ids: selectedIds 
      });
      setMessage({ type: 'success', text: `CV envoyé avec succès à ${selectedIds.length} entreprises.` });
    } catch (err) { setMessage({ type: 'error', text: "L'envoi a échoué." }); }
    finally { setLoading(false); setTimeout(() => setMessage({ type: '', text: '' }), 5000); }
  };

  const MapEvents = () => {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        setSelectedLocation([lat, lng]);
        const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const d = await r.json();
        if(d.address) {
          setVille(d.address.city || d.address.town || "");
          setPays(d.address.country || "");
        }
      }
    });
    return selectedLocation ? <Marker position={selectedLocation} /> : null;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLONNE GAUCHE */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <label className="group block cursor-pointer">
              <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-blue-100 rounded-[2rem] bg-blue-50/20 group-hover:bg-blue-50 transition-all">
                <div className="p-4 bg-white rounded-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform">
                  {uploading ? <Loader2 className="animate-spin text-blue-600" size={32}/> : <Upload className="text-blue-600" size={32}/>}
                </div>
                <span className="font-black text-slate-700">Choisir un CV</span>
                <input type="file" className="hidden" onChange={handleUpload} accept=".pdf" />
              </div>
            </label>

            <div className="mt-6 space-y-2 max-h-40 overflow-y-auto px-1">
              {cvs.map(cv => (
                <div key={cv.cvId} onClick={() => setSelectedCV(cv.cvId)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer flex justify-between items-center transition-all ${selectedCV === cv.cvId ? 'border-blue-500 bg-blue-50/50' : 'border-slate-50 hover:border-slate-200'}`}>
                  <div className="flex items-center gap-3 truncate">
                    <FileText size={16} className={selectedCV === cv.cvId ? 'text-blue-600' : 'text-slate-300'}/>
                    <span className="text-xs font-black truncate">{cv.nom}</span>
                  </div>
                  {selectedCV === cv.cvId && <CheckCircle size={16} className="text-blue-600" />}
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-3">
            <h3 className="font-black text-lg flex items-center gap-2 px-2 mb-4"><Search className="text-blue-600" size={20}/> Ciblage</h3>
            
            <div className="relative group">
                <Briefcase size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                <input className="w-full pl-11 pr-5 py-4 bg-slate-50 rounded-2xl outline-none text-sm border border-transparent focus:border-blue-200 focus:bg-white transition-all" placeholder="Secteur..." value={domaine} onChange={e => setDomaine(e.target.value)} />
            </div>

            <div className="relative group">
                <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                <input className="w-full pl-11 pr-5 py-4 bg-slate-50 rounded-2xl outline-none text-sm border border-transparent focus:border-blue-200 focus:bg-white transition-all" placeholder="Ville..." value={ville} onChange={e => setVille(e.target.value)} />
            </div>

            <div className="relative group">
                <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                <input className="w-full pl-11 pr-5 py-4 bg-slate-50 rounded-2xl outline-none text-sm border border-transparent focus:border-blue-200 focus:bg-white transition-all" placeholder="Pays..." value={pays} onChange={e => setPays(e.target.value)} />
            </div>

            <div onClick={() => setShowMapPicker(true)} className="group relative h-32 w-full rounded-[2rem] overflow-hidden cursor-pointer border-4 border-white shadow-inner mt-4">
              <div className="absolute inset-0 z-10 bg-blue-900/5 group-hover:bg-transparent transition-all flex items-center justify-center">
                <div className="bg-white px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-2">
                  <Maximize2 size={12} className="text-blue-600" />
                  <span className="text-[9px] font-black uppercase">Carte</span>
                </div>
              </div>
              <MapContainer center={[36.1905, 5.4107]} zoom={10} zoomControl={false} dragging={false} scrollWheelZoom={false} style={{ height: '100%', width: '100%', pointerEvents: 'none' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              </MapContainer>
            </div>
          </div>
          
          <button disabled={loading || !selectedCV || selectedIds.length === 0} onClick={handleEnvoyer}
            className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 disabled:bg-slate-200 transition-all flex items-center justify-center gap-3">
            {loading ? <Loader2 className="animate-spin" /> : <Send size={20}/>} DIFFUSER ({selectedIds.length})
          </button>
        </div>
        
        {/* COLONNE DROITE */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-[3rem] shadow-sm h-[800px] flex flex-col overflow-hidden border border-slate-100">
            <div className="p-10 border-b flex justify-between items-center">
              <h2 className="text-3xl font-black">Entreprises</h2>
              <div className="bg-blue-600 text-white px-6 py-2 rounded-2xl text-xs font-black shadow-lg italic">{filteredEntreprises.length} MATCHS</div>
            </div>
            <div className="flex-1 overflow-y-auto p-10 bg-slate-50/30">
              {isFetching ? (
                <div className="flex flex-col items-center justify-center h-full"><Loader2 className="animate-spin text-blue-600" size={40}/></div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredEntreprises.map(ent => (
                    <div key={ent.entrepriseId} onClick={() => setSelectedIds(prev => prev.includes(ent.entrepriseId) ? prev.filter(id => id !== ent.entrepriseId) : [...prev, ent.entrepriseId])}
                      className={`group p-6 rounded-[2.2rem] bg-white border-2 transition-all flex justify-between items-center cursor-pointer ${selectedIds.includes(ent.entrepriseId) ? 'border-blue-500 shadow-xl shadow-blue-50' : 'border-transparent hover:border-slate-200'}`}>
                      <div className="overflow-hidden pr-2">
                        <h4 className="font-black text-slate-800 text-lg leading-tight truncate uppercase">{ent.nomEntreprise}</h4>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-black rounded-md uppercase tracking-wider">{ent.secteur}</span>
                          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1"><MapPin size={10} /> {ent.ville}</span>
                          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1"><Globe size={10} className="text-blue-300" /> {ent.pays}</span>
                        </div>
                      </div>
                      <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center transition-all ${selectedIds.includes(ent.entrepriseId) ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-200'}`}>
                        <CheckSquare size={24}/>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL CARTE */}
      {showMapPicker && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-md z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-4xl overflow-hidden h-[80vh] flex flex-col">
            <div className="p-8 border-b flex justify-between items-center">
              <h3 className="text-2xl font-black">Zone de recherche</h3>
              <button onClick={() => setShowMapPicker(false)} className="p-4 hover:bg-slate-100 rounded-2xl"><X/></button>
            </div>
            <div className="flex-1 z-0">
              <MapContainer center={[36.1905, 5.4107]} zoom={12} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapEvents />
              </MapContainer>
            </div>
            <div className="p-8 bg-slate-50 border-t flex justify-end">
              <button onClick={() => setShowMapPicker(false)} className="px-12 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg">VALIDER</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {message.text && (
        <div className={`fixed bottom-8 right-8 z-[9999] flex items-center gap-4 px-6 py-5 rounded-[2rem] shadow-2xl border-l-[10px] ${message.type === 'success' ? 'bg-white border-green-500' : 'bg-white border-red-500'}`}>
          <div className={`p-3 rounded-full ${message.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            {message.type === 'success' ? <CheckCircle size={24}/> : <AlertCircle size={24}/>}
          </div>
          <div>
            <h5 className="font-black text-slate-800 text-sm uppercase">{message.type === 'success' ? 'Succès' : 'Erreur'}</h5>
            <p className="text-xs text-slate-500 font-bold">{message.text}</p>
          </div>
          <button onClick={() => setMessage({type:'', text:''})} className="ml-4 text-slate-300"><X size={18}/></button>
        </div>
      )}
    </div>
  );
};

export default Envoi;