import { Shield, Lock, Users, Eye, Server, Key } from "lucide-react";

const trustFeatures = [
  {
    icon: Lock,
    title: "Données chiffrées",
    description: "Toutes vos données sont chiffrées de bout en bout. Personne, pas même nous, ne peut y accéder."
  },
  {
    icon: Users,
    title: "Contrôle familial",
    description: "Un membre Maître par famille contrôle qui peut voir et modifier les souvenirs partagés."
  },
  {
    icon: Eye,
    title: "Zéro accès développeur",
    description: "Notre architecture garantit que même les développeurs n'ont aucun accès à vos documents personnels."
  },
  {
    icon: Key,
    title: "Vous êtes propriétaire",
    description: "Vos données vous appartiennent. Exportez ou supprimez tout à tout moment, sans condition."
  },
  {
    icon: Server,
    title: "Hébergement sécurisé",
    description: "Serveurs européens conformes RGPD avec sauvegardes automatiques et redondantes."
  },
  {
    icon: Shield,
    title: "Accès sur invitation",
    description: "Seuls les membres de votre famille que vous invitez peuvent accéder à votre espace."
  }
];

export function TrustSection() {
  return (
    <section id="securite" className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 mb-6">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">Protection maximale</span>
          </div>
          
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
            Vos souvenirs sont <span className="text-gradient">sacrés</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Nous avons conçu Tasseltech avec une obsession : protéger votre vie privée. 
            Vos photos, documents et souvenirs familiaux restent <strong>strictement privés</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {trustFeatures.map((feature, index) => (
            <div 
              key={index}
              className="group p-6 rounded-2xl bg-background border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Trust badge */}
        <div className="mt-16 flex flex-col items-center">
          <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-background border border-green-500/20 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <Lock className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-left">
              <p className="font-medium text-foreground text-sm">Engagement de confidentialité</p>
              <p className="text-xs text-muted-foreground">
                Aucun accès à vos données, même en cas de demande légale sans votre consentement
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
