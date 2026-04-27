"use client";

import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";

export default function TermsAndConditionsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Terms and Conditions</h1>
          <div className="w-20 h-1 bg-primary mb-8"></div>
          <div >
  <h1 className="text-gray-600 mb-4">Conditions Générales d&#39;Utilisation</h1>

  <p>Bienvenue sur Bus Station !</p>

  <p>En utilisant notre plateforme de réservation et d&#39;achat de billets de voyage, vous acceptez les présentes conditions générales. Merci de les lire attentivement.</p>

  <h2>1. Utilisation du Service</h2>
  <p>Notre site vous permet de rechercher, réserver et acheter des billets pour différents moyens de transport (avion, train, bus) ainsi que d&#39;autres services liés au voyage. Vous vous engagez à utiliser notre plateforme de manière légale et respectueuse.</p>

  <h2>2. Compte Utilisateur</h2>
  <p>Pour accéder à certaines fonctionnalités, vous devez créer un compte. Vous êtes responsable de la confidentialité de vos informations de connexion et de toutes les activités associées à votre compte.</p>

  <h2>3. Paiements et Réservations</h2>
  <p>Toutes les réservations sont soumises à disponibilité. Les paiements doivent être effectués via nos méthodes sécurisées. Une fois le paiement validé, une confirmation vous sera envoyée.</p>

  <h2>4. Politique d&#39;Annulation et de Remboursement</h2>
  <p>Les conditions d&#39;annulation, modification ou remboursement dépendent du fournisseur de service (compagnies aériennes, ferroviaires, etc.) et seront clairement indiquées lors de la réservation.</p>

  <h2>5. Propriété Intellectuelle</h2>
  <p>Tous les contenus présents sur notre site (textes, images, logos, etc.) sont notre propriété ou celle de nos partenaires et sont protégés par les lois sur la propriété intellectuelle.</p>

  <h2>6. Limitation de Responsabilité</h2>
  <p>Nous faisons de notre mieux pour fournir des informations exactes, mais nous ne garantissons pas l&#39;absence d&#39;erreurs. Nous ne sommes pas responsables des dommages directs ou indirects liés à l&#39;utilisation de notre service.</p>

  <h2>7. Modifications des Conditions</h2>
  <p>Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications seront effectives dès leur publication sur notre site.</p>

  <h2>8. Droit Applicable</h2>
  <p>Ces conditions sont régies par les lois en vigueur dans [ton pays, ex: la France].</p>

  <p>En utilisant notre plateforme, vous confirmez votre acceptation de ces termes.</p>
</div>

        </div>
      </main>
      <Footer />
    </>
  );
}