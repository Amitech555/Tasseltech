import { Card, CardContent } from "@/components/ui/card";
import { Trees, Images, Mic, Brain, Cake, Share2 } from "lucide-react";

const features = [
  {
    icon: Trees,
    title: "Arbre Généalogique",
    description: "Construisez et visualisez votre histoire familiale avec un arbre interactif magnifique.",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: Images,
    title: "Albums Photos",
    description: "Organisez et partagez vos photos de famille avec des albums thématiques et chronologiques.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Mic,
    title: "Souvenirs Audio",
    description: "Enregistrez les voix et histoires de vos proches pour les conserver à jamais.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Brain,
    title: "Quiz IA Familial",
    description: "Des quiz amusants générés par IA pour tester vos connaissances familiales en groupe.",
    color: "text-gold",
    bgColor: "bg-gold/10",
  },
  {
    icon: Cake,
    title: "Rappels Anniversaires",
    description: "Ne manquez plus jamais un anniversaire avec nos notifications personnalisées.",
    color: "text-terracotta",
    bgColor: "bg-terracotta/10",
  },
  {
    icon: Share2,
    title: "Partage Familial",
    description: "Invitez tous les membres de votre famille à contribuer et accéder aux souvenirs.",
    color: "text-sage",
    bgColor: "bg-sage/10",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-gradient-hero">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Tout pour <span className="text-gradient">préserver</span> votre histoire
          </h2>
          <p className="text-lg text-muted-foreground">
            Une plateforme complète pour rassembler, organiser et partager vos souvenirs familiaux les plus précieux.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              variant="feature"
              className="animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className={`w-14 h-14 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-5`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
