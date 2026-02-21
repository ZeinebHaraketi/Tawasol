import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-linear-to-l from-secondary/5 to-transparent rounded-l-full blur-3xl" />
      
      <div className="container mx-auto px-6 text-center lg:text-left grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6">
            <Sparkles size={16} />
            <span>L'intelligence au service de ton avenir</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-black text-dark leading-[1.1]">
            Simplifie ton parcours <br />
            <span className="text-primary italic">Universitaire.</span>
          </h1>
          
          <p className="mt-6 text-lg text-dark/60 max-w-xl leading-relaxed">
            Tawasol est la plateforme intelligente qui centralise tes demandes d'admission, tes bourses et ton orientation en Tunisie.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button size="lg" className="bg-primary hover:bg-deep h-14 px-8 text-lg rounded-2xl shadow-xl shadow-primary/20">
              Créer mon dossier
              <ArrowRight className="ml-2" size={20} />
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-2xl border-dark/10 hover:bg-dark/5">
              Explorer les facultés
            </Button>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-secondary/20 rounded-[2.5rem] rotate-3 group-hover:rotate-1 transition-transform" />
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop" 
            alt="Students" 
            className="relative rounded-[2.5rem] shadow-2xl grayscale-20 group-hover:grayscale-0 transition-all border-4 border-white"
          />
        </div>
      </div>
    </section>
  );
}