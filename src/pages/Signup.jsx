import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    type: "candidat",
    nom: "",
    prenom: "",
    telephone: "",
    adresse: "",
    dateNaissance: "",
    photoProfil: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === "photoProfil") {
      setFormData({ ...formData, photoProfil: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation simple
    if (formData.password !== formData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères");
      setIsLoading(false);
      return;
    }

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) data.append(key, value);
      });

      const response = await axios.post(
        "http://localhost:8000/utilisateurs/",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("Inscription réussie !");
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />

      <Card className="w-full max-w-md relative shadow-[var(--shadow-large)]">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center">
              <Briefcase className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Inscription</CardTitle>
          <CardDescription className="text-base">
            Créez votre compte AutoCandidature
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Type d'utilisateur</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full h-12 border rounded px-2"
              >
                <option value="candidat">Candidat</option>
                <option value="entreprise">Entreprise</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-foreground">Nom d'utilisateur</label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="nom" className="text-sm font-medium text-foreground">Nom</label>
              <Input
                id="nom"
                name="nom"
                type="text"
                value={formData.nom}
                onChange={handleChange}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="prenom" className="text-sm font-medium text-foreground">Prénom</label>
              <Input
                id="prenom"
                name="prenom"
                type="text"
                value={formData.prenom}
                onChange={handleChange}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="dateNaissance" className="text-sm font-medium text-foreground">Date de naissance</label>
              <Input
                id="dateNaissance"
                name="dateNaissance"
                type="date"
                value={formData.dateNaissance}
                onChange={handleChange}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="telephone" className="text-sm font-medium text-foreground">Téléphone</label>
              <Input
                id="telephone"
                name="telephone"
                type="text"
                value={formData.telephone}
                onChange={handleChange}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="adresse" className="text-sm font-medium text-foreground">Adresse</label>
              <Input
                id="adresse"
                name="adresse"
                type="text"
                value={formData.adresse}
                onChange={handleChange}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">Mot de passe</label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">Confirmer le mot de passe</label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="photoProfil" className="text-sm font-medium text-foreground">Photo de profil</label>
              <Input
                id="photoProfil"
                name="photoProfil"
                type="file"
                onChange={handleChange}
              />
            </div>

            <Button type="submit" className="w-full h-12" disabled={isLoading}>
              {isLoading ? "Inscription..." : "S'inscrire"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Déjà un compte ? <Link to="/login" className="text-primary font-medium hover:underline">Se connecter</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
