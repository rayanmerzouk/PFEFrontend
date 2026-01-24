import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Briefcase, CheckCircle, Users, Zap } from "lucide-react";
import heroImage from "../assets/hero-image.jpg";
const Home = () => {
  const features = [
    {
      icon: <Zap className="w-12 h-12 text-primary" />,
      title: "Candidature Automatisée",
      description: "Postulez automatiquement à des centaines d'offres en quelques clics",
    },
    {
      icon: <Users className="w-12 h-12 text-primary" />,
      title: "Matching Intelligent",
      description: "Notre algorithme connecte les meilleurs talents aux entreprises",
    },
    {
      icon: <CheckCircle className="w-12 h-12 text-primary" />,
      title: "Suivi en Temps Réel",
      description: "Suivez l'état de vos candidatures depuis votre dashboard",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                <Briefcase className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Plateforme de Recrutement Innovante</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Simplifiez votre
                <span className="text-primary"> Recherche d'Emploi</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-xl">
                AutoCandidature automatise vos candidatures et connecte les talents aux opportunités. 
                Gagnez du temps, trouvez l'emploi idéal.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/signup">
                  <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                    Commencer Gratuitement
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                    Se connecter
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-foreground">1000+</div>
                  <div className="text-sm text-muted-foreground">Candidats actifs</div>
                </div>
                <div className="h-12 w-px bg-border" />
                <div>
                  <div className="text-3xl font-bold text-foreground">500+</div>
                  <div className="text-sm text-muted-foreground">Entreprises partenaires</div>
                </div>
                <div className="h-12 w-px bg-border" />
                <div>
                  <div className="text-3xl font-bold text-foreground">95%</div>
                  <div className="text-sm text-muted-foreground">Taux de satisfaction</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary-dark/20 rounded-2xl blur-3xl" />
              <img 
                src={heroImage} 
                alt="Hero" 
                className="relative rounded-2xl shadow-[var(--shadow-large)] w-full h-auto transform hover:scale-[1.02] transition-[var(--transition-smooth)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Pourquoi choisir AutoCandidature ?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Une plateforme complète qui transforme votre expérience de recherche d'emploi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="border-2 hover:border-primary hover:shadow-[var(--shadow-medium)] transition-[var(--transition-smooth)] bg-card"
              >
                <CardHeader>
                  <div className="mb-4 p-3 bg-primary/10 rounded-xl w-fit">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-2xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary-dark to-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-primary-foreground mb-6">
            Prêt à transformer votre carrière ?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers de professionnels qui ont trouvé leur emploi idéal grâce à AutoCandidature
          </p>
          <Link to="/signup">
            <Button 
              size="lg" 
              className="bg-background text-primary hover:bg-background/90 text-lg px-8 py-6 shadow-[var(--shadow-large)]"
            >
              S'inscrire maintenant
            </Button>
          </Link>
        </div>
      </section>

      
    </div>
  );
};

export default Home;
