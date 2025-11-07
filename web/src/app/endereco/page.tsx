"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const EscolherEndereco: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(null);

  const addresses = [
    {
      id: 1,
      title: "Casa",
      description: "Rua das Palmeiras, 123 - Centro, Patos - PB, 58700-000",
    },
    {
      id: 2,
      title: "Trabalho",
      description: "Av. Brasil, 456 - Jardim Europa, Patos - PB, 58701-200",
    },
    {
      id: 3,
      title: "Adicionar novo endereço",
      description: "Cadastrar um endereço adicional para o serviço.",
      isNew: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 font-sans text-gray-800 overflow-x-hidden">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="backdrop-blur-md bg-white/90 shadow-lg sticky top-0 z-50"
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <Image src="/Images/FazFastLogo.png" alt="FazFast Logo" width={160} height={40} className="h-10 w-auto" priority />
          </Link>
          <nav className="hidden md:flex space-x-8 font-medium">
            {["Home", "Catalogo", "Perfil"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-gray-600 hover:text-green-600 transition-colors duration-300 border-b-2 border-transparent hover:border-green-600 pb-1"
              >
                {item}
              </Link>
            ))}
          </nav>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Buscar serviços..."
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 hidden md:block"
            />
          </div>
        </div>
      </motion.header>

      {/* Etapas */}
      <div className="bg-white border-b py-4">
        <div className="container mx-auto flex justify-center space-x-10 text-sm font-medium">
          <div className="flex items-center space-x-2 text-gray-400">
            <div className="w-6 h-6 rounded-full flex items-center justify-center border border-gray-300 text-xs">1</div>
            <span>Contato</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <div className="w-6 h-6 rounded-full flex items-center justify-center border border-gray-300 text-xs">2</div>
            <span>Definir valores</span>
          </div>
          <div className="flex items-center space-x-2 text-green-600">
            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-green-600 text-white text-xs">3</div>
            <span>Endereço</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <div className="w-6 h-6 rounded-full flex items-center justify-center border border-gray-300 text-xs">4</div>
            <span>Pagamento</span>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <main className="flex-1 container mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-8">
          Selecione seu endereço para o serviço
        </h1>

        <div className="max-w-2xl mx-auto space-y-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              onClick={() => !addr.isNew && setSelected(addr.id)}
              className={`bg-white border rounded-lg p-4 flex justify-between items-center cursor-pointer transition hover:shadow-md ${
                selected === addr.id ? "border-green-600" : "border-gray-300"
              }`}
            >
              <div>
                <p className="font-semibold text-lg text-gray-700">{addr.title}</p>
                <p className="text-gray-600 text-sm">{addr.description}</p>
              </div>
              {!addr.isNew ? (
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selected === addr.id ? "border-green-600" : "border-gray-400"
                  }`}
                >
                  {selected === addr.id && (
                    <div className="w-2.5 h-2.5 bg-green-600 rounded-full"></div>
                  )}
                </div>
              ) : (
                <button className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition">
                  Adicionar
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Botões de navegação */}
        <div className="max-w-2xl mx-auto flex justify-between mt-10">
          <button className="px-6 py-2 border border-gray-400 text-gray-700 rounded-md hover:bg-gray-100 transition">
            Voltar
          </button>
          <button
            disabled={selected === null}
            className={`px-6 py-2 rounded-md transition ${
              selected === null
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            Próximo
          </button>
        </div>
      </main>

{/* Footer */}
<footer className="bg-black text-gray-300 py-12 mt-12">
  <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
    {/* Logo & Description */}
    <div>
      <img
        src="/Images/FazFastLogo_Inv.png"
        alt="FazFast Logo"
        className="h-12 mb-4"
      />
      <p className="text-sm leading-relaxed">
        Plataforma de serviços sob demanda, conectando clientes e
        profissionais em todo o Brasil com qualidade e confiança.
      </p>
    </div>

    {/* Links */}
    <nav>
      <h4 className="font-semibold mb-4 text-white">Assistência ao Cliente</h4>
      <ul className="space-y-2 text-sm">
        <li>
          <a href="#" className="hover:text-green-600 transition-colors duration-200">
            Buscar
          </a>
        </li>
        <li>
          <a href="#" className="hover:text-green-600 transition-colors duration-200">
            Recomendado
          </a>
        </li>
        <li>
          <a href="#" className="hover:text-green-600 transition-colors duration-200">
            Categorias
          </a>
        </li>
        <li>
          <a href="#" className="hover:text-green-600 transition-colors duration-200">
            Perguntas Frequentes
          </a>
        </li>
        <li>
          <a href="#" className="hover:text-green-600 transition-colors duration-200">
            Termos de Uso
          </a>
        </li>
      </ul>
    </nav>

    {/* Social Media */}
    <div>
      <h4 className="font-semibold mb-4 text-white">Conecte-se</h4>
      <div className="flex space-x-4">
        <a href="#" aria-label="X (Twitter)" className="transition-transform duration-200 hover:scale-110">
          <img src="/Images/X_Logo.png" alt="X" className="h-8 w-8 object-contain" />
        </a>
        <a href="#" aria-label="TikTok" className="transition-transform duration-200 hover:scale-110">
          <img src="/Images/TikTok_Logo.png" alt="TikTok" className="h-8 w-8 object-contain" />
        </a>
        <a href="#" aria-label="Instagram" className="transition-transform duration-200 hover:scale-110">
          <img src="/Images/Instagram_Logo.png" alt="Instagram" className="h-8 w-8 object-contain" />
        </a>
      </div>
    </div>
  </div>

  {/* Bottom line */}
  <div className="mt-10 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
    © {new Date().getFullYear()} <span className="text-white font-semibold">FazFast</span>. Todos os direitos reservados.
  </div>
</footer>

    </div>
  );
};

export default EscolherEndereco;
