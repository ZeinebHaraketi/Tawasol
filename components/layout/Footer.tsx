import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-dark text-white pt-16 pb-8 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Colonne 1: Branding */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <Image 
                  src="/logo.png" 
                  alt="Tawasol Logo" 
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-black tracking-tighter">
                TAWASOL<span className="text-secondary">.TN</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              La plateforme intelligente dédiée à l'accompagnement des étudiants en Tunisie. Simplifiez vos admissions et construisez votre avenir avec nous.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="p-2 rounded-full bg-white/5 hover:bg-primary transition-colors">
                <Facebook size={18} />
              </Link>
              <Link href="#" className="p-2 rounded-full bg-white/5 hover:bg-primary transition-colors">
                <Instagram size={18} />
              </Link>
              <Link href="#" className="p-2 rounded-full bg-white/5 hover:bg-primary transition-colors">
                <Linkedin size={18} />
              </Link>
            </div>
          </div>

          {/* Colonne 2: Plateforme */}
          <div>
            <h4 className="text-lg font-bold mb-6 border-l-4 border-primary pl-3">Plateforme</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">Rechercher une Université</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Guide des Procédures</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Bourses d'études</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Logements Étudiants</Link></li>
            </ul>
          </div>

          {/* Colonne 3: Liens Institutionnels */}
          <div>
            <h4 className="text-lg font-bold mb-6 border-l-4 border-secondary pl-3">Liens Utiles</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">Ministère de l'Enseignement Supérieur</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Orientation.tn</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Mesrs.tn</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Campus France Tunisie</Link></li>
            </ul>
          </div>

          {/* Colonne 4: Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6 border-l-4 border-brand-accent pl-3">Contact</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-secondary shrink-0" />
                <span>Centre Urbain Nord, Tunis, Tunisie</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-secondary shrink-0" />
                <span>+216 71 000 000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-secondary shrink-0" />
                <span>contact@tawasol.tn</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Barre de Copyright */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 uppercase tracking-widest">
          <p>© 2026 TAWASOL. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">Mentions Légales</Link>
            <Link href="#" className="hover:text-white transition-colors">Politique de Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}