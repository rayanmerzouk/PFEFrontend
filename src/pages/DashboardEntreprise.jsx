import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { User, FileText, MapPin, Briefcase, Search, Filter } from "lucide-react";


const DashboardEntreprise = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Données de démonstration
  const [candidates] = useState([
    {
      id: 1,
      name: "Marie Dubois",
      position: "Développeur Full Stack",
      location: "Paris",
      domain: "Informatique",
      experience: "5 ans",
      skills: ["React", "Node.js", "TypeScript"],
    },
    {
      id: 2,
      name: "Thomas Martin",
      position: "Ingénieur DevOps",
      location: "Lyon",
      domain: "Infrastructure",
      experience: "3 ans",
      skills: ["Docker", "Kubernetes", "AWS"],
    },
    {
      id: 3,
      name: "Sophie Bernard",
      position: "Designer UI/UX",
      location: "Remote",
      domain: "Design",
      experience: "4 ans",
      skills: ["Figma", "Adobe XD", "User Research"],
    },
  ]);

  const stats = {
    totalCandidates: candidates.length,
    newThisWeek: 5,
    interviews: 3,
    hired: 1,
  };

  const filteredCandidates = candidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard Entreprise</h1>
          <p className="text-lg text-muted-foreground">
            Gérez vos candidatures reçues et trouvez les meilleurs talents
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 hover:shadow-[var(--shadow-medium)] transition-[var(--transition-smooth)]">
            <CardHeader className="pb-3">
              <CardDescription>Total Candidats</CardDescription>
              <CardTitle className="text-4xl">{stats.totalCandidates}</CardTitle>
            </CardHeader>
            <CardContent>
              <User className="w-8 h-8 text-primary" />
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-[var(--shadow-medium)] transition-[var(--transition-smooth)]">
            <CardHeader className="pb-3">
              <CardDescription>Nouveaux cette semaine</CardDescription>
              <CardTitle className="text-4xl">{stats.newThisWeek}</CardTitle>
            </CardHeader>
            <CardContent>
              <FileText className="w-8 h-8 text-primary" />
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-[var(--shadow-medium)] transition-[var(--transition-smooth)]">
            <CardHeader className="pb-3">
              <CardDescription>Entretiens prévus</CardDescription>
              <CardTitle className="text-4xl">{stats.interviews}</CardTitle>
            </CardHeader>
            <CardContent>
              <Briefcase className="w-8 h-8 text-secondary" />
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-[var(--shadow-medium)] transition-[var(--transition-smooth)]">
            <CardHeader className="pb-3">
              <CardDescription>Recrutements</CardDescription>
              <CardTitle className="text-4xl">{stats.hired}</CardTitle>
            </CardHeader>
            <CardContent>
              <User className="w-8 h-8 text-primary" />
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, poste ou domaine..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
          <Button variant="outline" size="lg" className="gap-2">
            <Filter className="w-5 h-5" />
            Filtres avancés
          </Button>
        </div>

        {/* Candidates List */}
        <Card className="shadow-[var(--shadow-medium)]">
          <CardHeader>
            <CardTitle className="text-2xl">CV Reçus</CardTitle>
            <CardDescription>Liste des candidatures reçues pour vos offres</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredCandidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-lg border-2 border-border hover:border-primary hover:shadow-[var(--shadow-soft)] transition-[var(--transition-smooth)] bg-card"
                >
                  <div className="flex items-start gap-4 mb-4 md:mb-0">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-foreground">{candidate.name}</h3>
                      <p className="text-muted-foreground">{candidate.position}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {candidate.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {candidate.experience}
                        </span>
                        <Badge variant="secondary">{candidate.domain}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {candidate.skills.map((skill, index) => (
                          <Badge key={index} className="bg-primary/10 text-primary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button variant="default" size="sm">
                      Voir le CV
                    </Button>
                    <Button variant="outline" size="sm">
                      Contacter
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

export default DashboardEntreprise;
