import React from 'react';
import Image from 'next/image';
import { MapPin, ExternalLink } from 'lucide-react';
import { Gare as GareRoutiere } from '@/lib/types/gare.types';

type DetailHeaderProps = {
  station: GareRoutiere;
};

const DetailHeader = ({ station }: DetailHeaderProps) => {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${station.latitude},${station.longitude}`;

  return (
    <div className="rounded-lg overflow-hidden shadow-lg bg-white">
      <div className="relative h-64 md:h-80 w-full">
        <Image
          src={station.imageUrl ?? "/placeholder.png"}
          alt={`Photo de ${station.nom}`}
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">{station.nom}</h1>
          <div className="flex items-center text-sm text-gray-200 mt-2">
            <MapPin size={16} className="mr-2" />
            <span>{station.adresse}</span>
          </div>
        </div>
      </div>
      <div className="p-4 bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
           <div className={`text-sm font-bold py-1.5 px-3 rounded-full flex items-center ${
              station.estOuvert ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
            <span className={`h-2 w-2 rounded-full mr-2 ${station.estOuvert ? 'bg-green-500' : 'bg-red-500'}`}></span>
            {station.estOuvert ? 'Ouvert' : 'Fermé'}
          </div>
          {station.horaires && <span className="text-sm text-gray-600">{station.horaires}</span>}
        </div>
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 w-full md:w-auto"
        >
          Y aller
          <ExternalLink size={20} className="ml-2" />
        </a>
      </div>
    </div>
  );
};

export default DetailHeader;
