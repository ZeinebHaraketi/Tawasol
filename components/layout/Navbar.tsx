"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  LogOut,
  User,
  Settings,
  CreditCard,
  LayoutDashboard,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  const initial = session?.user?.name?.charAt(0).toUpperCase() || "U";
  const role = (session?.user as any)?.role;

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* LOGO SECTION */}
        <div className="flex items-center gap-2">
          <div className="relative w-12 h-12">
            <Image
              src="/logo.png"
              alt="Tawasol Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="text-xl font-bold text-dark tracking-tight">
            Tawasol<span className="text-secondary">.tn</span>
          </span>
        </div>

        {/* LINKS (Bureau uniquement) */}
        <div className="hidden md:flex gap-8 font-medium text-dark/70">
          <Link href="#" className="hover:text-primary transition-colors">
            Universités
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            Procédure
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            Bourses
          </Link>
        </div>

        {/* ACTION BUTTONS / USER DROPDOWN */}
        <div className="flex items-center gap-3">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 bg-gray-50 p-1.5 pr-4 rounded-full border border-gray-100 cursor-pointer hover:bg-gray-100 transition-all select-none">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-secondary flex items-center justify-center text-white font-black shadow-inner border-2 border-white">
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name}
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span>{initial}</span>
                    )}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-bold text-dark leading-none">
                      {session.user.name.split(" ")[0]}
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium capitalize">
                      {role || "Étudiant"}
                    </span>
                  </div>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-56 mt-2 rounded-2xl p-2 shadow-xl border-gray-100"
                align="end"
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-bold leading-none">
                      {session.user.name}
                    </p>
                    <p className="text-xs leading-none text-gray-500">
                      {session.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-2" />

                <DropdownMenuItem
                  className="rounded-xl cursor-pointer py-2.5"
                  onClick={() => router.push("/student/profile")}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Mon Profil</span>
                </DropdownMenuItem>

                <DropdownMenuItem className="rounded-xl cursor-pointer py-2.5">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Paramètres</span>
                </DropdownMenuItem>

                {/* Redirection dynamique selon le rôle pour le dashboard */}
                <Link
                  href={
                    role === "admin"
                      ? "/dashboard"
                      : role === "professor"
                        ? "/professor/home"
                        : "/student/home"
                  }
                >
                  <DropdownMenuItem className="rounded-xl cursor-pointer py-2.5">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Tableau de bord</span>
                  </DropdownMenuItem>
                </Link>

                <DropdownMenuSeparator className="my-2" />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="rounded-xl cursor-pointer py-2.5 text-primary focus:bg-primary/5 focus:text-primary"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Se déconnecter</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="text-dark">
                  Connexion
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-secondary text-white rounded-full px-6">
                  Mon Espace
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
