import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Sparkles, Users, Trophy } from "lucide-react";

const quizExamples = [
  "Quelle année Grand-Père a-t-il rencontré Grand-Mère ?",
  "Quel est le plat préféré de Tante Marie ?",
  "Où Papa a-t-il grandi ?",
  "Quel instrument jouait Grand-Mère ?",
];

export function QuizSection() {
  return (
    <section id="quiz" className="py-24 bg-gradient-hero relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      
      <div className="container px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 text-gold mb-4">
              <Brain className="w-4 h-4" />
              <span className="text-sm font-medium">Quiz IA Familial</span>
            </div>
            
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
              Jouez et <span className="text-gradient">apprenez</span> ensemble
            </h2>
            
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Notre IA génère des quiz personnalisés basés sur votre histoire familiale. 
              Parfait pour les réunions de famille ou les soirées jeux !
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-card shadow-soft">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">IA Intelligente</div>
                  <div className="text-sm text-muted-foreground">Questions uniques</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-xl bg-card shadow-soft">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">Multijoueur</div>
                  <div className="text-sm text-muted-foreground">Jusqu'à 10 joueurs</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-xl bg-card shadow-soft">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">Classement</div>
                  <div className="text-sm text-muted-foreground">Scores familiaux</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-xl bg-card shadow-soft">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">Adaptatif</div>
                  <div className="text-sm text-muted-foreground">Niveaux variés</div>
                </div>
              </div>
            </div>

            <Button variant="gold" size="lg">
              Lancer un quiz familial
            </Button>
          </div>

          {/* Visual */}
          <div className="relative">
            <Card variant="elevated" className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center">
                  <Brain className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground">Quiz en cours</h3>
                  <p className="text-sm text-muted-foreground">Question 3/10</p>
                </div>
              </div>

              <div className="space-y-3">
                {quizExamples.map((question, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      index === 0 
                        ? "border-primary bg-primary/5 shadow-soft" 
                        : "border-border bg-muted/30 opacity-50"
                    }`}
                  >
                    <p className={`text-sm ${index === 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                      {question}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div 
                        key={i} 
                        className="w-8 h-8 rounded-full bg-muted border-2 border-card flex items-center justify-center"
                      >
                        <span className="text-xs font-medium text-muted-foreground">{i}</span>
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">3 joueurs</span>
                </div>
                <div className="text-sm font-medium text-primary">Score: 240 pts</div>
              </div>
            </Card>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 rounded-2xl bg-gradient-gold shadow-glow animate-float flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-foreground" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
