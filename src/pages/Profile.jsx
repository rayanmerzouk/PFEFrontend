import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { User, Mail, Phone, MapPin, Briefcase, Save } from "lucide-react";
import { toast } from "sonner";


const Profile = () => {
  const [formData, setFormData] = useState({
    name: "Jean Dupont",
    email: "jean.dupont@exemple.com",
    phone: "+33 6 12 34 56 78",
    location: "Paris, France",
    position: "Développeur Full Stack",
    bio: "Passionné par le développement web avec 5 ans d'expérience en React et Node.js.",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulation de sauvegarde - À remplacer par l'appel API réel
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Profil mis à jour avec succès !");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du profil");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Mon Profil</h1>
          <p className="text-lg text-muted-foreground">
            Gérez vos informations personnelles et vos préférences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <Card className="lg:col-span-1 shadow-[var(--shadow-medium)] h-fit">
            <CardHeader className="text-center">
              <div className="mx-auto w-32 h-32 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center mb-4">
                <User className="w-16 h-16 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">{formData.name}</CardTitle>
              <CardDescription className="text-base">{formData.position}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Mail className="w-5 h-5 text-primary" />
                  <span>{formData.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Phone className="w-5 h-5 text-primary" />
                  <span>{formData.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>{formData.location}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Edit Profile Form */}
          <Card className="lg:col-span-2 shadow-[var(--shadow-medium)]">
            <CardHeader>
              <CardTitle className="text-2xl">Informations personnelles</CardTitle>
              <CardDescription>Mettez à jour vos informations de profil</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-foreground flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      Nom complet
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" />
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      Téléphone
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="location" className="text-sm font-medium text-foreground flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      Localisation
                    </label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="position" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-primary" />
                    Poste recherché
                  </label>
                  <Input
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="bio" className="text-sm font-medium text-foreground">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button 
                    type="submit" 
                    className="gap-2"
                    disabled={isLoading}
                  >
                    <Save className="w-4 h-4" />
                    {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
                  </Button>
                  <Button type="button" variant="outline">
                    Annuler
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      
    </div>
  );
};

export default Profile;
