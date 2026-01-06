import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Play, Pause, Clock } from "lucide-react";
import { useState } from "react";

const audioMemories = [
  {
    id: 1,
    title: "Histoire de Grand-Mère",
    duration: "5:32",
    author: "Marie Dupont",
    date: "15 Mars 2024",
  },
  {
    id: 2,
    title: "Chanson de notre enfance",
    duration: "3:15",
    author: "Papa",
    date: "22 Février 2024",
  },
  {
    id: 3,
    title: "Recette secrète de famille",
    duration: "8:47",
    author: "Tante Sophie",
    date: "10 Janvier 2024",
  },
];

export function AudioMemoriesSection() {
  const [playingId, setPlayingId] = useState<number | null>(null);

  return (
    <section id="audio" className="py-24 bg-background">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Visual */}
          <div className="relative">
            <div className="relative z-10">
              <Card variant="elevated" className="p-6">
                <div className="flex flex-col gap-4">
                  {audioMemories.map((audio) => (
                    <div 
                      key={audio.id}
                      className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer group"
                    >
                      <button 
                        className="w-12 h-12 rounded-full bg-gradient-warm flex items-center justify-center flex-shrink-0 shadow-soft group-hover:shadow-glow transition-shadow"
                        onClick={() => setPlayingId(playingId === audio.id ? null : audio.id)}
                      >
                        {playingId === audio.id ? (
                          <Pause className="w-5 h-5 text-primary-foreground" />
                        ) : (
                          <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
                        )}
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground truncate">{audio.title}</h4>
                        <p className="text-sm text-muted-foreground">{audio.author}</p>
                      </div>
                      
                      <div className="text-right flex-shrink-0">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          {audio.duration}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{audio.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
          </div>

          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent mb-4">
              <Mic className="w-4 h-4" />
              <span className="text-sm font-medium">Souvenirs Audio</span>
            </div>
            
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
              Les voix qui <span className="text-gradient">comptent</span>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Enregistrez et préservez les voix de vos proches. Histoires, chansons, 
              recettes transmises oralement... Chaque enregistrement devient un trésor.
            </p>

            <ul className="space-y-3 mb-8">
              {[
                "Enregistrement haute qualité",
                "Transcription automatique",
                "Organisation par thème",
                "Partage sécurisé",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>

            <Button variant="warm" size="lg" className="gap-2">
              <Mic className="w-5 h-5" />
              Enregistrer un souvenir
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
