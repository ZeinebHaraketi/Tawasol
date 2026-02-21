import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, PenTool, ClipboardList, ShieldCheck } from "lucide-react";

const services = [
  {
    title: "Orientation IA",
    desc: "Trouvez la filière idéale selon votre profil et vos notes du bac.",
    icon: Search,
    color: "bg-primary/10 text-primary"
  },
  {
    title: "Dossier Unique",
    desc: "Un seul espace pour postuler à toutes les universités tunisiennes.",
    icon: PenTool,
    color: "bg-secondary/10 text-secondary"
  },
  {
    title: "Traduction & Vérification",
    desc: "Vérification certifiée de vos documents pour les dossiers internationaux.",
    icon: ClipboardList,
    color: "bg-brand-accent/10 text-brand-accent" // Utilise #b96a60
  },
  {
    title: "Suivi Garanti",
    desc: "Notifications en temps réel sur l'avancement de votre admission.",
    icon: ShieldCheck,
    color: "bg-dark/10 text-dark"
  }
];

export default function Services() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">Un parcours simplifié de A à Z</h2>
          <p className="text-gray-600">Tout ce dont vous avez besoin pour réussir votre inscription universitaire en un seul endroit.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <Card key={i} className="border-none shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${s.color}`}>
                  <s.icon size={24} />
                </div>
                <CardTitle className="text-xl font-bold">{s.title}</CardTitle>
                <CardDescription className="pt-2">{s.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}