"use client";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  School,
  FileText,
  Users,
  Bell,
  LogOut,
  Search,
  UserIcon,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useEffect } from "react";

const menuItems = [
  { label: "Tableau de bord", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Universités", icon: School, href: "/admin/universities" },
  { label: "Candidatures", icon: FileText, href: "/admin/applications" },
  { label: "Étudiants", icon: Users, href: "/admin/users" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // 1. Récupération de la session en temps réel
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  if (isPending) return <p>Chargement...</p>;
  // if (!session) return null;
  if (!session || (session.user as any).role !== "admin") {
    router.push("/login");
    return null;
  }
  // 2. Fonction de déconnexion
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Déconnexion réussie");
          router.push("/login");
        },
      },
    });
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafb]">
      {/* SIDEBAR CREATIVE (FLOTTANTE) */}
      <aside className="w-72 p-6 hidden md:flex flex-col">
        <div className="bg-dark rounded-4xl flex-1 flex flex-col shadow-2xl shadow-dark/20 relative overflow-hidden">
          {/* Décoration subtile en arrière-plan de la sidebar */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full -mr-16 -mt-16 blur-2xl" />

          {/* LOGO SECTION */}
          <div className="p-8 mb-4">
            <Link href="/" className="flex flex-col items-center gap-3 group">
              <div className="relative w-16 h-16 p-2 bg-white rounded-2xl shadow-xl transition-transform group-hover:rotate-6">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  fill
                  className="object-contain p-2"
                />
              </div>
              <div className="text-center">
                <span className="text-xl font-black text-white tracking-tighter block">
                  TAWASOL<span className="text-secondary">.</span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">
                  Admin Panel
                </span>
              </div>
            </Link>
          </div>

          {/* MENU */}
          <nav className="flex-1 px-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 hover:bg-white/5 relative overflow-hidden text-gray-400 hover:text-white"
              >
                {/* Indicateur actif (on pourra ajouter une logique pathname ici) */}
                <div className="absolute left-0 w-1 h-6 bg-secondary scale-y-0 group-hover:scale-y-100 transition-transform origin-center rounded-r-full" />

                <item.icon
                  size={22}
                  className="transition-colors group-hover:text-secondary"
                />
                <span className="font-semibold text-sm tracking-wide">
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>

          {/* USER CARD VERSION MINI DANS SIDEBAR */}
          <div className="p-4 mt-auto">
            <div className="bg-white/5 rounded-3xl p-4 border border-white/5">
              <button
                onClick={handleSignOut}
                className="flex items-center justify-center gap-3 w-full py-2 text-sm font-bold text-primary hover:bg-primary/10 rounded-xl transition-colors"
              >
                <LogOut size={18} />
                <span>Quitter</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col p-6 pl-0">
        {/* HEADER STYLE "GLASS" */}
        <header className="h-20 bg-white/70 backdrop-blur-md border border-white rounded-3xl mb-6 flex items-center justify-between px-8 shadow-sm">
          <div className="flex items-center gap-4 bg-gray-100/50 px-4 py-2 rounded-xl border border-gray-100">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un dossier..."
              className="bg-transparent border-none focus:outline-none text-sm w-64 text-dark"
            />
          </div>

          <div className="flex items-center gap-6">
            <ModeToggle />

            <button className="relative p-2 text-gray-400 hover:text-secondary transition-colors">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white" />
            </button>

            <div className="h-10 w-px bg-gray-200" />

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-right">
                  <p className="text-sm font-black text-dark leading-none capitalize">
                    {session?.user && (session.user as any).firstName
                      ? `${(session.user as any).firstName} ${(session.user as any).lastName}`
                      : session?.user?.name || "Chargement..."}
                  </p>
                  <p className="text-[10px] font-bold text-secondary uppercase tracking-tighter">
                    {(session?.user as any)?.role || "student"}
                  </p>
                </div>
              </div>
              <div className="relative group">
                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-secondary to-dark p-0.5 shadow-lg transition-transform group-hover:scale-105">
                  <div className="w-full h-full rounded-[calc(1rem-2px)] bg-white flex items-center justify-center overflow-hidden">
                    {/* On pourra mettre imageProfile ici plus tard */}
                    {/* <Users className="text-dark" size={20} /> */}
                    {session?.user.image ? (
                      <Image
                        src={session.user.image}
                        alt="Profil"
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <UserIcon className="text-dark" size={20} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENU DE LA PAGE AVEC RADIUS UNI */}
        <div className="flex-1 overflow-auto rounded-(--radius-uni) bg-white border border-gray-100 shadow-sm p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
