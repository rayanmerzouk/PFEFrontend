import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button"; // chemin relatif
import { Menu, X, Briefcase } from "lucide-react";
import { useState } from "react";


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-[var(--shadow-soft)] ">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-[var(--transition-smooth)]">
              <Briefcase className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">AutoCandidature</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-[var(--transition-smooth)] ${
                isActive('/') ? 'text-primary' : 'text-foreground hover:text-primary'
              }`}
            >
              Accueil
            </Link>
            <Link 
              to="/dashboard-candidat" 
              className={`text-sm font-medium transition-[var(--transition-smooth)] ${
                isActive('/dashboard-candidat') ? 'text-primary' : 'text-foreground hover:text-primary'
              }`}
            >
              Dashboard Candidat
            </Link>
            <Link 
              to="/dashboard-entreprise" 
              className={`text-sm font-medium transition-[var(--transition-smooth)] ${
                isActive('/dashboard-entreprise') ? 'text-primary' : 'text-foreground hover:text-primary'
              }`}
            >
              Dashboard Entreprise
            </Link>

          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Connexion</Button>
            </Link>
            <Link to="/signup">
              <Button variant="default">S'inscrire</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-muted"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <Link 
                to="/" 
                className={`text-sm font-medium px-4 py-2 rounded-md transition-[var(--transition-smooth)] ${
                  isActive('/') ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link 
                to="/dashboard-candidat" 
                className={`text-sm font-medium px-4 py-2 rounded-md transition-[var(--transition-smooth)] ${
                  isActive('/dashboard-candidat') ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard Candidat
              </Link>
              <Link 
                to="/dashboard-entreprise" 
                className={`text-sm font-medium px-4 py-2 rounded-md transition-[var(--transition-smooth)] ${
                  isActive('/dashboard-entreprise') ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard Entreprise
              </Link>
              <div className="flex flex-col gap-2 px-4 pt-4 border-t border-border">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Connexion</Button>
                </Link>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="default" className="w-full">S'inscrire</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
