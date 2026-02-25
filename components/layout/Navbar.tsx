import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* LOGO SECTION */}
        <div className="flex items-center gap-2">
          <div className="relative w-12 h-12 transition-transform group-hover:scale-105">
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

        {/* LINKS */}
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

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-3">
          {/* REDIRECTION VERS LOGIN */}
          <Link href="/login">
            <Button
              variant="ghost"
              className="text-dark hover:text-amber-50 cursor-pointer"
            >
              Connexion
            </Button>
          </Link>

          {/* REDIRECTION VERS REGISTER (Optionnel mais recommandé pour "Mon Espace") */}
          <Link href="/register">
            <Button className="bg-secondary hover:bg-secondary/90 text-white rounded-full px-6 shadow-md shadow-secondary/20 cursor-pointer">
              Mon Espace
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
