import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";

export default function SearchUniv() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="bg-secondary rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl shadow-secondary/30">
          {/* Décoration de fond */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-white max-w-md">
              <h2 className="text-3xl font-black mb-4 uppercase">Trouve ta future université</h2>
              <p className="text-white/80">Recherche parmi plus de 180 facultés, instituts et écoles d'ingénieurs en Tunisie.</p>
            </div>
            
            <div className="w-full lg:max-w-2xl bg-white p-2 rounded-2xl flex flex-col md:flex-row gap-2 shadow-inner">
              <div className="flex-1 flex items-center px-4 border-b md:border-b-0 md:border-r border-gray-100">
                <Search className="text-gray-400 mr-2" size={20} />
                <Input placeholder="Filière, spécialité..." className="border-none focus-visible:ring-0 text-dark" />
              </div>
              <div className="flex-1 flex items-center px-4">
                <MapPin className="text-gray-400 mr-2" size={20} />
                <Input placeholder="Ville (Tunis, Sousse...)" className="border-none focus-visible:ring-0 text-dark" />
              </div>
              <Button className="bg-primary hover:bg-deep text-white px-8 h-12 rounded-xl font-bold">
                Rechercher
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}