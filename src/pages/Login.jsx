import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Briefcase } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Fonction unique pour gérer la connexion
  const handleLogin = () => {
    setIsLoading(true);

    axios.post("http://localhost:8000/api/accessToken/", {
      username: username,
      password: password
    })
    .then((res) => {
      // Stockage des tokens
      localStorage.setItem("accessToken", res.data.access);
      localStorage.setItem("refreshToken", res.data.refresh);

      toast.success("Connexion réussie !");
      navigate("/envoi");
    })
    .catch((err) => {
      console.error(err);
      if (err.response && err.response.status === 401) {
        toast.error("Nom d'utilisateur ou mot de passe incorrect");
      } else if (err.response && err.response.data) {
        toast.error(JSON.stringify(err.response.data));
      } else {
        toast.error("Erreur lors de la connexion au serveur");
      }
    })
    .finally(() => setIsLoading(false));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(); // Appel de la fonction login
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
          <CardTitle className="text-3xl font-bold">Connexion</CardTitle>
          <CardDescription className="text-base">
            Connectez-vous à votre compte AutoCandidature
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-foreground">
                Nom d'utilisateur
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Votre nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Mot de passe
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base"
              disabled={isLoading}
            >
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Pas encore de compte ?{" "}
              <Link to="/signup" className="text-primary font-medium hover:underline">
                S'inscrire
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
