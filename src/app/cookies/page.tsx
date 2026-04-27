"use client";

import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";

export default function CookiesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Politique de cookies</h1>
          <div className="w-20 h-1 bg-primary mb-8"></div>
          <p className="text-gray-600 mb-4">
            Nous utilisons des cookies pour améliorer votre expérience sur notre site.
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li><strong>Cookies essentiels</strong> : nécessaires au fonctionnement du site.</li>
            <li><strong>Cookies analytiques</strong> : nous aident à comprendre comment vous utilisez le site.</li>
            <li><strong>Cookies marketing</strong> : pour personnaliser le contenu et les annonces.</li>
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
