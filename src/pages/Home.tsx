import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, LogIn, LandPlot, Trophy, Users, Calendar } from 'lucide-react';

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-12 px-4">
        <h1 className="text-5xl font-bold text-green-700 mb-6">
          Bienvenue à l'AGSE Golf
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Rejoignez notre communauté de golfeurs passionnés et profitez d'avantages exclusifs
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/register"
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <UserPlus className="h-5 w-5" />
            S'inscrire
          </Link>
          <Link
            to="/login"
            className="bg-white text-green-600 border-2 border-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors flex items-center gap-2"
          >
            <LogIn className="h-5 w-5" />
            Se connecter
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 px-4 py-12">
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <LandPlot className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Parcours Négociés</h3>
          <p className="text-gray-600">
            Accédez à des tarifs préférentiels sur de nombreux parcours de golf partenaires.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Trophy className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Compétitions</h3>
          <p className="text-gray-600">
            Participez à nos tournois et événements exclusifs tout au long de l'année.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Users className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Communauté</h3>
          <p className="text-gray-600">
            Rejoignez une communauté dynamique de golfeurs et partagez votre passion.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-50 rounded-xl p-8 mt-8 mx-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-green-700 mb-2">
              Prêt à nous rejoindre ?
            </h2>
            <p className="text-gray-600">
              Inscrivez-vous dès maintenant et commencez à profiter de tous les avantages membres.
            </p>
          </div>
          <Link
            to="/register"
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors whitespace-nowrap"
          >
            Devenir membre
          </Link>
        </div>
      </div>
    </div>
  );
}