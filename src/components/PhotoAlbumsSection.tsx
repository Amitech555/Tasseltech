import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Images, Heart, Calendar, Plus } from "lucide-react";

const albums = [
  {
    id: 1,
    title: "Vacances d'été 2024",
    count: 48,
    cover: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    title: "Noël en famille",
    count: 32,
    cover: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    title: "Mariage de Marie",
    count: 156,
    cover: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop",
  },
  {
    id: 4,
    title: "Enfance",
    count: 89,
    cover: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop",
  },
];

export function PhotoAlbumsSection() {
  return (
    <section id="albums" className="py-24 bg-muted/30">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary mb-4">
            <Images className="w-4 h-4" />
            <span className="text-sm font-medium">Albums Photos</span>
          </div>
          
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Vos plus beaux <span className="text-gradient">moments</span>
          </h2>
          
          <p className="text-lg text-muted-foreground">
            Organisez vos photos dans des albums thématiques et partagez-les avec toute la famille.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {albums.map((album, index) => (
            <Card 
              key={album.id} 
              variant="feature" 
              className="group overflow-hidden cursor-pointer animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img 
                  src={album.cover} 
                  alt={album.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-background">
                  <Heart className="w-4 h-4 text-accent" />
                </button>
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium text-foreground truncate">{album.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{album.count} photos</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Button variant="outline" size="lg" className="gap-2">
            <Plus className="w-5 h-5" />
            Créer un nouvel album
          </Button>
        </div>
      </div>
    </section>
  );
}
