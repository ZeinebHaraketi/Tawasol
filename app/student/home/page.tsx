"use client";

import { Search, GraduationCap, Globe, BookOpen, ArrowRight, Star, MapPin, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

// Données fictives pour le rendu
const popularUnis = [
  { id: 1, name: "Esprit", city: "Ariana", image: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=600", type: "Privée", rating: 4.8 },
  { id: 2, name: "IHEC Carthage", city: "Tunis", image: "https://images.unsplash.com/photo-1541339907198-e08759df9a13?q=80&w=600", type: "Publique", rating: 4.5 },
  { id: 3, name: "ENIT", city: "Tunis", image: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=600", type: "Publique", rating: 4.7 },
];

export default function StudentHomePage() {
  const { data: session } = authClient.useSession();
  const firstName = session?.user?.name?.split(" ")[0] || "Étudiant";

  return (
    <div className="pb-20 space-y-24">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-16 pb-10 overflow-hidden">
        <div className="absolute top-0 -left-20 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-pulse" />
        
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-full text-secondary text-sm font-bold animate-bounce">
            <Zap size={16} />
            Bienvenue sur Tawasol, {firstName} !
          </div>

          <h1 className="text-6xl md:text-7xl font-black text-dark tracking-tighter leading-[0.9]">
            Propulsez votre <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">carrière académique</span>
          </h1>
          
          <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto">
            La plateforme centrale pour vos inscriptions universitaires en Tunisie. Simple, rapide et 100% gratuit.
          </p>

          {/* BARRE DE RECHERCHE AMÉLIORÉE */}
          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute inset-0 bg-secondary/30 rounded-3xl blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <div className="relative flex items-center bg-white border border-gray-100 rounded-3xl p-3 shadow-2xl">
              <div className="flex-1 flex items-center px-4 border-r border-gray-100">
                <Search className="text-gray-400 mr-3" size={22} />
                <Input 
                  placeholder="Quelle spécialité ou faculté ?" 
                  className="border-none focus-visible:ring-0 text-lg bg-transparent p-0"
                />
              </div>
              <Button className="bg-dark hover:bg-black text-white h-14 px-10 rounded-2xl font-bold ml-2 transition-all">
                Explorer
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* --- ACTIONS RAPIDES (CARTES) --- */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "Universités", icon: GraduationCap, color: "bg-primary", desc: "Trouvez l'établissement qui vous correspond le mieux." },
          { title: "Bourses", icon: Globe, color: "bg-secondary", desc: "Découvrez les aides financières disponibles ce mois-ci." },
          { title: "Candidatures", icon: BookOpen, color: "bg-dark", desc: "Suivez l'avancement de vos dossiers en direct." }
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group">
            <div className={`w-16 h-16 ${item.color} text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-inherit/20`}>
              <item.icon size={32} />
            </div>
            <h3 className="text-2xl font-bold text-dark">{item.title}</h3>
            <p className="text-gray-500 mt-3 leading-relaxed">{item.desc}</p>
            <div className="mt-6 flex items-center text-secondary font-black text-sm uppercase tracking-wider">
              Découvrir <ArrowRight size={18} className="ml-2 group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        ))}
      </section>

      {/* --- SECTION UNIVERSITÉS POPULAIRES --- */}
      <section className="space-y-8">
        <div className="flex items-end justify-between px-2">
          <div>
            <h2 className="text-3xl font-black text-dark tracking-tight">Universités Populaires</h2>
            <p className="text-gray-500 font-medium">Les établissements les plus consultés cette semaine</p>
          </div>
          <Button variant="outline" className="rounded-xl font-bold border-gray-200">Voir tout</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {popularUnis.map((uni) => (
            <div key={uni.id} className="group bg-white rounded-4xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all">
              <div className="relative h-56 w-full overflow-hidden">
                <Image src={uni.image} alt={uni.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-secondary shadow-sm">
                  {uni.type}
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xl font-black text-dark leading-tight">{uni.name}</h4>
                    <div className="flex items-center text-gray-400 mt-1">
                      <MapPin size={14} className="mr-1" />
                      <span className="text-xs font-bold uppercase">{uni.city}</span>
                    </div>
                  </div>
                  <div className="flex items-center bg-yellow-50 text-yellow-600 px-2 py-1 rounded-lg">
                    <Star size={14} fill="currentColor" className="mr-1" />
                    <span className="text-sm font-bold">{uni.rating}</span>
                  </div>
                </div>
                <Button className="w-full bg-gray-50 hover:bg-secondary hover:text-white text-dark font-bold py-6 rounded-2xl transition-colors border-none">
                  Voir les formations
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- BANNER BOURSE (NOUVEAU COMPOSANT) --- */}
      <section className="bg-dark rounded-[3rem] p-12 relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full -mr-32 -mt-32 blur-[80px]" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 text-secondary font-bold text-sm bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <Clock size={16} />
              Offre limitée : J-5 avant la clôture
            </div>
            <h2 className="text-4xl font-black leading-tight">Bourse d'Excellence <br /> Tawasol 2026</h2>
            <p className="text-gray-400 text-lg">Nous finançons les frais d'inscription des 10 meilleurs dossiers cette année. Tentez votre chance !</p>
          </div>
          <Button className="bg-secondary hover:bg-white hover:text-dark text-dark font-black px-12 py-8 text-xl rounded-3xl transition-all shadow-2xl shadow-secondary/20">
            Postuler maintenant
          </Button>
        </div>
      </section>
    </div>
  );
}