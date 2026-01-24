import { Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-muted border-t border-border fixed bottom-0 w-full h-20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">AutoCandidature</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Plateforme de candidature automatisée qui simplifie le processus de recrutement pour les candidats et les entreprises.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-[var(--transition-smooth)]">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-sm text-muted-foreground hover:text-primary transition-[var(--transition-smooth)]">
                  Connexion
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-sm text-muted-foreground hover:text-primary transition-[var(--transition-smooth)]">
                  S'inscrire
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">support@autocandidature.com</li>
              <li className="text-sm text-muted-foreground">+33 1 23 45 67 89</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AutoCandidature. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
