import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Côté gauche : Formulaire */}
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">{children}</div>
      </div>

      {/* Côté droit : Visuel avec Image */}
      <div className="hidden lg:flex relative items-center justify-center overflow-hidden bg-dark">
        {/* Image de fond */}
        <Image
          src="/campus1.png" // Chemin local direct
          alt="Campus Universitaire"
          fill
          className="object-cover opacity-60"
          priority
        />

        {/* Overlay avec tes couleurs de palette */}
        {/* Note: bg-linear-to-br est spécifique à Tailwind 4 */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/40 via-dark/60 to-secondary/40 z-10" />

        {/* Message de bienvenue superposé à l'image */}
        <div className="relative z-20 text-center p-12 max-w-lg">
          <div className="inline-block px-4 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-medium mb-6 border border-white/20">
            Plateforme Officielle
          </div>
          <h2 className="text-5xl font-black text-white mb-6 leading-tight drop-shadow-2xl">
            Ouvrez les portes de votre{" "}
            <span className="text-secondary">réussite</span>.
          </h2>
          <p className="text-gray-200 text-lg font-medium drop-shadow-md">
            L'intelligence artificielle au service de votre orientation
            universitaire en Tunisie.
          </p>
        </div>

        {/* Rappel des formes organiques du logo (cercles flous) */}
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-secondary rounded-full blur-3xl opacity-30 z-15" />
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary rounded-full blur-3xl opacity-30 z-15" />
      </div>
    </div>
  );
}
