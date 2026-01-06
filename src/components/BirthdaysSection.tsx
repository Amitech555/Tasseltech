import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cake, Bell, Calendar, Gift } from "lucide-react";

const upcomingBirthdays = [
  { name: "Marie Dupont", date: "15 Janvier", daysLeft: 3, avatar: "M" },
  { name: "Pierre Martin", date: "22 Janvier", daysLeft: 10, avatar: "P" },
  { name: "Sophie Laurent", date: "28 Janvier", daysLeft: 16, avatar: "S" },
  { name: "Lucas Bernard", date: "5 Février", daysLeft: 24, avatar: "L" },
];

export function BirthdaysSection() {
  return (
    <section id="birthdays" className="py-24 bg-muted/30">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Visual */}
          <div className="order-2 lg:order-1">
            <Card variant="elevated" className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-terracotta/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-terracotta" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    Prochains anniversaires
                  </h3>
                </div>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  Voir tout
                </Button>
              </div>

              <div className="space-y-3">
                {upcomingBirthdays.map((birthday, index) => (
                  <div 
                    key={birthday.name}
                    className="flex items-center gap-4 p-4 rounded-xl bg-background hover:shadow-soft transition-all duration-300 group"
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-display font-semibold text-primary-foreground ${
                      index === 0 ? "bg-gradient-warm" : "bg-muted"
                    }`}>
                      {index === 0 ? (
                        <span className="text-lg">{birthday.avatar}</span>
                      ) : (
                        <span className="text-lg text-muted-foreground">{birthday.avatar}</span>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{birthday.name}</h4>
                      <p className="text-sm text-muted-foreground">{birthday.date}</p>
                    </div>
                    
                    <div className="text-right">
                      {birthday.daysLeft <= 7 ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
                          <Gift className="w-3.5 h-3.5" />
                          {birthday.daysLeft} jours
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">{birthday.daysLeft} jours</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bell className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground text-sm">Rappels activés</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Vous serez notifié 7 jours et 1 jour avant chaque anniversaire
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-terracotta/10 text-terracotta mb-4">
              <Cake className="w-4 h-4" />
              <span className="text-sm font-medium">Rappels Anniversaires</span>
            </div>
            
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
              N'oubliez plus <span className="text-gradient">jamais</span>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Recevez des rappels personnalisés pour tous les anniversaires familiaux. 
              Planifiez vos cadeaux et célébrations à l'avance.
            </p>

            <ul className="space-y-4 mb-8">
              {[
                { icon: Bell, text: "Notifications push et email" },
                { icon: Calendar, text: "Synchronisation calendrier" },
                { icon: Gift, text: "Suggestions de cadeaux" },
              ].map((item) => (
                <li key={item.text} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-card shadow-soft flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-terracotta" />
                  </div>
                  <span className="text-foreground font-medium">{item.text}</span>
                </li>
              ))}
            </ul>

            <Button variant="warm" size="lg">
              Configurer les rappels
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
