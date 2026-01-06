import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, User, Users } from "lucide-react";

const familyMembers = [
  { id: 1, name: "Grand-Père", generation: 1, position: "left" },
  { id: 2, name: "Grand-Mère", generation: 1, position: "right" },
  { id: 3, name: "Papa", generation: 2, position: "left" },
  { id: 4, name: "Maman", generation: 2, position: "right" },
  { id: 5, name: "Moi", generation: 3, position: "center" },
  { id: 6, name: "Frère", generation: 3, position: "left" },
  { id: 7, name: "Sœur", generation: 3, position: "right" },
];

export function FamilyTreeSection() {
  return (
    <section id="family-tree" className="py-24 bg-background">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 text-secondary mb-4">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">Arbre Généalogique</span>
            </div>
            
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
              Visualisez votre <span className="text-gradient">histoire familiale</span>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Créez un arbre généalogique interactif pour explorer vos racines. 
              Ajoutez des photos, dates et anecdotes pour chaque membre de votre famille.
            </p>

            <ul className="space-y-3 mb-8">
              {[
                "Ajout illimité de membres",
                "Photos et biographies détaillées",
                "Connexions et relations familiales",
                "Export et partage facile",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center">
                    <ChevronRight className="w-3 h-3 text-secondary" />
                  </div>
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>

            <Button variant="warm" size="lg">
              Créer mon arbre
            </Button>
          </div>

          {/* Visual */}
          <div className="order-1 lg:order-2">
            <Card variant="elevated" className="p-8 relative overflow-hidden">
              {/* Decorative lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                <line x1="50%" y1="80" x2="35%" y2="160" stroke="hsl(var(--border))" strokeWidth="2" />
                <line x1="50%" y1="80" x2="65%" y2="160" stroke="hsl(var(--border))" strokeWidth="2" />
                <line x1="35%" y1="200" x2="50%" y2="280" stroke="hsl(var(--border))" strokeWidth="2" />
                <line x1="65%" y1="200" x2="50%" y2="280" stroke="hsl(var(--border))" strokeWidth="2" />
              </svg>
              
              <div className="relative z-10 flex flex-col items-center gap-12">
                {/* Generation 1 */}
                <div className="flex justify-center gap-8">
                  <TreeNode name="Grand-Père" />
                  <TreeNode name="Grand-Mère" />
                </div>
                
                {/* Generation 2 */}
                <div className="flex justify-center gap-8">
                  <TreeNode name="Papa" />
                  <TreeNode name="Maman" />
                </div>
                
                {/* Generation 3 */}
                <div className="flex justify-center gap-4">
                  <TreeNode name="Frère" size="sm" />
                  <TreeNode name="Moi" highlight />
                  <TreeNode name="Sœur" size="sm" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

function TreeNode({ 
  name, 
  highlight = false, 
  size = "default" 
}: { 
  name: string; 
  highlight?: boolean; 
  size?: "sm" | "default";
}) {
  const sizeClasses = size === "sm" ? "w-16 h-16" : "w-20 h-20";
  const textSize = size === "sm" ? "text-xs" : "text-sm";
  
  return (
    <div className="flex flex-col items-center gap-2">
      <div 
        className={`${sizeClasses} rounded-full flex items-center justify-center transition-all duration-300 ${
          highlight 
            ? "bg-gradient-warm shadow-glow" 
            : "bg-muted hover:bg-primary/10"
        }`}
      >
        <User className={`${size === "sm" ? "w-6 h-6" : "w-8 h-8"} ${highlight ? "text-primary-foreground" : "text-muted-foreground"}`} />
      </div>
      <span className={`${textSize} font-medium ${highlight ? "text-primary" : "text-foreground"}`}>
        {name}
      </span>
    </div>
  );
}
