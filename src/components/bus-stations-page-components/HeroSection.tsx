import React from 'react';

const HeroSection = () => {
  return (
    <div
      className="relative bg-cover bg-center h-64 rounded-lg overflow-hidden"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1570125909248-7753b2a44d82?q=80&w=2070&auto=format&fit=crop')" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white text-center px-4">
          Trouvez Votre Point de Départ
        </h1>
      </div>
    </div>
  );
};

export default HeroSection;
