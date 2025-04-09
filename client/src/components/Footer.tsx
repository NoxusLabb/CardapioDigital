import React from 'react';
import { Link } from 'wouter';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Coluna 1 - Informações de contato */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-primary" />
                <span>(11) 5555-5555</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-primary" />
                <a href="mailto:contato@restaurante.com" className="hover:text-primary transition-colors">
                  contato@restaurante.com
                </a>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-primary mt-1" />
                <span>Av. Paulista, 1000<br />São Paulo, SP, 01310-100</span>
              </li>
              <li className="flex items-start">
                <Clock className="h-5 w-5 mr-2 text-primary mt-1" />
                <div>
                  <p>Segunda a Sexta: 11:30 - 23:00</p>
                  <p>Sábado e Domingo: 11:30 - 00:00</p>
                </div>
              </li>
            </ul>
          </div>
          
          {/* Coluna 2 - Links rápidos */}
          <div>
            <h3 className="text-xl font-bold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">Início</Link>
              </li>
              <li>
                <Link href="/cardapio" className="hover:text-primary transition-colors">Cardápio</Link>
              </li>
              <li>
                <Link href="/reservas" className="hover:text-primary transition-colors">Reservas</Link>
              </li>
              <li>
                <Link href="/eventos" className="hover:text-primary transition-colors">Eventos</Link>
              </li>
              <li>
                <Link href="/sobre" className="hover:text-primary transition-colors">Sobre Nós</Link>
              </li>
              <li>
                <Link href="/contato" className="hover:text-primary transition-colors">Contato</Link>
              </li>
            </ul>
          </div>
          
          {/* Coluna 3 - Siga-nos */}
          <div>
            <h3 className="text-xl font-bold mb-4">Siga-nos</h3>
            <div className="flex space-x-4 mb-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
            <p className="text-sm text-gray-400">
              Assine nossa newsletter para receber novidades e promoções exclusivas.
            </p>
            <div className="mt-3">
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Seu e-mail" 
                  className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-l focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary flex-grow"
                />
                <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-r transition-colors">
                  Assinar
                </button>
              </div>
            </div>
          </div>
          
          {/* Coluna 4 - Informações adicionais */}
          <div>
            <h3 className="text-xl font-bold mb-4">Informações</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/politica-privacidade" className="hover:text-primary transition-colors">Política de Privacidade</Link>
              </li>
              <li>
                <Link href="/termos-condicoes" className="hover:text-primary transition-colors">Termos e Condições</Link>
              </li>
              <li>
                <Link href="/formas-pagamento" className="hover:text-primary transition-colors">Formas de Pagamento</Link>
              </li>
              <li>
                <Link href="/delivery" className="hover:text-primary transition-colors">Delivery</Link>
              </li>
              <li>
                <Link href="/parceiros" className="hover:text-primary transition-colors">Parceiros</Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Parte inferior - copyright */}
        <div className="border-t border-gray-800 mt-10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400 mb-4 md:mb-0">
              &copy; {currentYear} Restaurante Sabor Brasileiro. Todos os direitos reservados.
            </p>
            <p className="text-sm text-gray-400">
              Desenvolvido com ❤️ por <a href="#" className="text-primary hover:underline">Equipe Cardápio Digital</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}