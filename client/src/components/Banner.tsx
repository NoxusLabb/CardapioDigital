import React from 'react';

export default function Banner() {
  return (
    <div className="bg-gradient-to-r from-primary to-primary/70 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Círculos decorativos no fundo */}
      <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-white/10 blur-xl"></div>
      <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-white/10 blur-lg"></div>
      <div className="absolute top-40 left-1/2 w-16 h-16 rounded-full bg-white/10 blur-md"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Sabores que encantam, momentos que ficam
          </h1>
          <p className="text-white/90 text-lg mb-8">
            Descubra nossa seleção de pratos preparados com ingredientes frescos e muita paixão pela culinária. Do tradicional ao contemporâneo, uma experiência gastronômica inesquecível.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-white text-primary font-bold py-3 px-6 rounded-full hover:bg-gray-100 transition-colors">
              Ver Cardápio
            </button>
            <button className="bg-transparent text-white border border-white py-3 px-6 rounded-full hover:bg-white/10 transition-colors">
              Fazer Reserva
            </button>
          </div>
          
          <div className="mt-8 flex items-center">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                4.8
              </div>
              <img className="w-8 h-8 rounded-full border-2 border-primary" src="https://randomuser.me/api/portraits/women/32.jpg" alt="Avatar" />
              <img className="w-8 h-8 rounded-full border-2 border-primary" src="https://randomuser.me/api/portraits/men/44.jpg" alt="Avatar" />
              <img className="w-8 h-8 rounded-full border-2 border-primary" src="https://randomuser.me/api/portraits/women/63.jpg" alt="Avatar" />
            </div>
            <div className="ml-4 text-white">
              <p className="font-medium">+1500 avaliações</p>
              <p className="text-sm text-white/80">Clientes satisfeitos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}