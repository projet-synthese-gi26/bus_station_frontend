"use client";

import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Politique de confidentialité</h1>
          <div className="w-20 h-1 bg-primary mb-8"></div>
          <p className="text-gray-600 mb-4">
            Votre vie privée est importante pour nous. Cette politique décrit comment nous collectons, utilisons et protégeons vos informations.
          </p>
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Collecte des informations</h2>
          <p className="text-gray-600 mb-4">
            Nous collectons des informations que vous nous fournissez directement, telles que votre nom, email, et autres données nécessaires à la prestation de nos services.
          </p>
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Utilisation des informations</h2>
          <p className="text-gray-600 mb-4">
            Nous utilisons vos informations pour améliorer nos services, communiquer avec vous et personnaliser votre expérience.
          </p>
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Protection des données</h2>
          <p className="text-gray-600 mb-4">
            Nous mettons en place des mesures de sécurité pour protéger vos informations contre l&#39;accès non autorisé.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
