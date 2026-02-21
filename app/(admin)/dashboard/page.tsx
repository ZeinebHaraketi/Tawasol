import { db } from "@/db";
import { users, universities, applications, faculties } from "@/db/schema";
import { count, desc, eq } from "drizzle-orm";
import { Card, CardContent } from "@/components/ui/card";
import { Users, School, GraduationCap, ArrowUpRight, Clock, CheckCircle2, XCircle } from "lucide-react";
import Image from "next/image";

export default async function DashboardPage() {
  // 1. DATA FETCHING (Réel & Parallèle)
  const [userCount, univCount, appCount, recentApps] = await Promise.all([
    db.select({ value: count() }).from(users),
    db.select({ value: count() }).from(universities),
    db.select({ value: count() }).from(applications),
    db.query.applications.findMany({
      limit: 5,
      orderBy: [desc(applications.submittedAt)],
      with: {
        userId: true, // Pour le nom de l'étudiant
        facultyId: true, // Pour le nom de la faculté
      },
    }),
  ]);

  const stats = [
    { 
      label: "Étudiants", 
      value: userCount[0].value, 
      icon: Users, 
      gradient: "from-blue-500/10 to-blue-600/5", 
      iconCol: "text-blue-600",
      description: "Inscrits cette année" 
    },
    { 
      label: "Universités", 
      value: univCount[0].value, 
      icon: School, 
      gradient: "from-secondary/10 to-secondary/5", 
      iconCol: "text-secondary",
      description: "Partenaires actifs" 
    },
    { 
      label: "Dossiers", 
      value: appCount[0].value, 
      icon: GraduationCap, 
      gradient: "from-primary/10 to-primary/5", 
      iconCol: "text-primary",
      description: "En cours de traitement" 
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* SECTION TITRE */}
      <div>
        <h2 className="text-3xl font-black text-dark tracking-tight">Vue d'ensemble</h2>
        <p className="text-gray-500 font-medium">Statistiques en temps réel de la plateforme Tawasol.</p>
      </div>

      {/* STATS CARDS AVEC GLASSMORPHISM & GRADIENTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((s, i) => (
          <Card key={i} className={`relative overflow-hidden border-none shadow-xl shadow-gray-200/50 bg-linear-to-br ${s.gradient} rounded-4xl`}>
            <CardContent className="p-8">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">{s.label}</p>
                  <h3 className="text-4xl font-black text-dark">{s.value}</h3>
                </div>
                <div className={`p-4 bg-white rounded-2xl shadow-sm ${s.iconCol}`}>
                  <s.icon size={24} />
                </div>
              </div>
              <div className="mt-6 flex items-center text-xs font-bold text-gray-400 gap-1">
                <ArrowUpRight size={14} className="text-secondary" />
                <span>{s.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* DERNIÈRES ACTIVITÉS & ACTIONS RAPIDES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* TABLEAU DES ACTIVITÉS (2/3 de large) */}
        <div className="lg:col-span-2 bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center">
            <h3 className="text-xl font-black text-dark flex items-center gap-2">
              <Clock className="text-secondary" size={20} />
              Dossiers Récents
            </h3>
            <button className="text-sm font-bold text-secondary hover:text-dark transition-colors">Voir tout</button>
          </div>
          
          <div className="divide-y divide-gray-50">
            {recentApps.length > 0 ? (
              recentApps.map((app: any) => (
                <div key={app.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-dark">
                      {app.userId.firstName[0]}{app.userId.lastName[0]}
                    </div>
                    <div>
                      <p className="font-bold text-dark">{app.userId.firstName} {app.userId.lastName}</p>
                      <p className="text-xs text-gray-500 font-medium italic">{app.facultyId.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      app.status === 'valide' ? 'bg-secondary/10 text-secondary' : 
                      app.status === 'refuse' ? 'bg-primary/10 text-primary' : 
                      'bg-orange-100 text-orange-600'
                    }`}>
                      {app.status}
                    </span>
                    <p className="text-xs text-gray-400 font-medium">
                      {new Date(app.submittedAt).toLocaleDateString('fr-TN')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-20 text-center text-gray-400 font-medium">
                Aucune candidature enregistrée pour le moment.
              </div>
            )}
          </div>
        </div>

        {/* ACTIONS RAPIDES (1/3 de large) */}
        <div className="space-y-6">
          <div className="bg-dark rounded-4xl p-8 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
            <h4 className="text-lg font-bold mb-4 relative z-10">Actions Rapides</h4>
            <div className="space-y-3 relative z-10">
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-all text-left px-4 flex justify-between items-center group">
                Ajouter une Université
                <School size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-all text-left px-4 flex justify-between items-center group">
                Publier une Bourse
                <GraduationCap size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="bg-secondary rounded-[2.5rem] p-8 text-white flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase opacity-80">Support Technique</p>
              <p className="text-lg font-black italic">Besoin d'aide ?</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}