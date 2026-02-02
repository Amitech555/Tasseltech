import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
      
      <div className="container px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Heart className="w-4 h-4" />
            <span className="text-sm font-medium">Rejoignez des milliers de familles</span>
          </div>
          
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Commencez à créer votre <span className="text-gradient">héritage familial</span>
          </h2>
          
          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Inscrivez-vous gratuitement et commencez à préserver vos souvenirs les plus précieux 
            dès aujourd'hui. Votre famille vous remerciera.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="warm" size="lg" className="gap-2 w-full sm:w-auto" asChild>
              <Link to="/auth">
                Créer mon espace gratuit
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Voir la démo
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            Gratuit pour toujours • Pas de carte bancaire requise
          </p>
        </div>
      </div>
    </section>
  );
}
