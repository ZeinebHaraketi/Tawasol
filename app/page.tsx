import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/layout/Hero";
import Stats from "@/components/Stats";
import Services from "@/components/Services";
import SearchUniv from "@/components/SearchUniv";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Stats />
      <Services />
      <SearchUniv />
      <Footer />
      
      {/* Footer à venir */}
      <footer className="py-10 text-center text-dark/40 border-t">
        © 2026 Tawasol Tunisie - La porte de votre succès.
      </footer>
    </main>
  );
}