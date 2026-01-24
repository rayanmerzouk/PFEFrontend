import { useState,useEffect,useMemo } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Building2, Send, CheckCircle, Clock, XCircle, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import countryList from "react-select-country-list";

const DashboardCandidat = () => {

  
  // Données de démonstration


 
  
  const [applications] = useState([
    {
      id: 1,
      company: "TechCorp Solutions",
      position: "Développeur Full Stack",
      location: "Paris",
      status: "pending",
      date: "2024-01-15",
    },
    {
      id: 2,
      company: "Innovation Labs",
      position: "Ingénieur DevOps",
      location: "Lyon",
      status: "accepted",
      date: "2024-01-10",
    },
    {
      id: 3,
      company: "Digital Agency",
      position: "Designer UI/UX",
      location: "Remote",
      status: "rejected",
      date: "2024-01-05",
    },
  ]);

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === "pending").length,
    accepted: applications.filter(app => app.status === "accepted").length,
    rejected: applications.filter(app => app.status === "rejected").length,
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-secondary"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
      case "accepted":
        return <Badge className="bg-primary"><CheckCircle className="w-3 h-3 mr-1" />Acceptée</Badge>;
      case "rejected":
        return <Badge className="bg-destructive"><XCircle className="w-3 h-3 mr-1" />Refusée</Badge>;
      default:
        return null;
    }
  };

  return (


    
    <div className="min-h-screen flex flex-col flex-grow bg-gradient-to-b from-background to-muted/30  ">
      
      <Link to='/envoi'>Envoyer CV</Link>
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard Candidat</h1>
          <p className="text-lg text-muted-foreground">
            Gérez vos candidatures et suivez vos opportunités
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 hover:shadow-[var(--shadow-medium)] transition-[var(--transition-smooth)]">
            <CardHeader className="pb-3">
              <CardDescription>Total Candidatures</CardDescription>
              <CardTitle className="text-4xl">{stats.total}</CardTitle>
            </CardHeader>
            <CardContent>
              <Send className="w-8 h-8 text-primary" />
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-[var(--shadow-medium)] transition-[var(--transition-smooth)]">
            <CardHeader className="pb-3">
              <CardDescription>En attente</CardDescription>
              <CardTitle className="text-4xl">{stats.pending}</CardTitle>
            </CardHeader>
            <CardContent>
              <Clock className="w-8 h-8 text-secondary" />
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-[var(--shadow-medium)] transition-[var(--transition-smooth)]">
            <CardHeader className="pb-3">
              <CardDescription>Acceptées</CardDescription>
              <CardTitle className="text-4xl">{stats.accepted}</CardTitle>
            </CardHeader>
            <CardContent>
              <CheckCircle className="w-8 h-8 text-primary" />
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-[var(--shadow-medium)] transition-[var(--transition-smooth)]">
            <CardHeader className="pb-3">
              <CardDescription>Refusées</CardDescription>
              <CardTitle className="text-4xl">{stats.rejected}</CardTitle>
            </CardHeader>
            <CardContent>
              <XCircle className="w-8 h-8 text-destructive" />
            </CardContent>
          </Card>
        </div>

        {/* Action Button */}
        <div className="mb-8">
          <Button variant="hero" size="lg" className="gap-2">
            <Plus className="w-5 h-5" />
            Nouvelle candidature automatique
          </Button>
        </div>

        {/* Applications List */}
        <Card className="shadow-[var(--shadow-medium)]">
          <CardHeader>
            <CardTitle className="text-2xl">Mes Candidatures</CardTitle>
            <CardDescription>Liste de toutes vos candidatures envoyées</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-lg border-2 border-border hover:border-primary hover:shadow-[var(--shadow-soft)] transition-[var(--transition-smooth)] bg-card"
                >
                  <div className="flex items-start gap-4 mb-4 md:mb-0">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">{app.position}</h3>
                      <p className="text-muted-foreground">{app.company}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {app.location} • Envoyée le {new Date(app.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {getStatusBadge(app.status)}
                    <Button variant="outline" size="sm">
                      Détails
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      
    </div>
  );
};

export default DashboardCandidat;
