import { Users, School, FileCheck, Globe } from "lucide-react";

const stats = [
  { label: "Étudiants inscrits", value: "25K+", icon: Users, color: "text-primary" },
  { label: "Universités partenaires", value: "180+", icon: School, color: "text-secondary" },
  { label: "Dossiers traités", value: "100K+", icon: FileCheck, color: "text-primary" },
  { label: "Nationalités", value: "12", icon: Globe, color: "text-secondary" },
];

export default function Stats() {
  return (
    <section className="bg-dark py-16 text-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center space-y-3">
              <div className={`p-3 rounded-full bg-white/5 ${stat.color}`}>
                <stat.icon size={28} />
              </div>
              <h3 className="text-4xl font-black">{stat.value}</h3>
              <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}