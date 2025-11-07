"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

const DefinicaoDeValores: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<"aceitar" | "negociar" | null>(null);
  const valorProposto = 523;

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
          <div className="flex items-center space-x-2 text-green-600">
            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-green-600 text-white text-xs">2</div>
            <span>Definir valores</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <div className="w-6 h-6 rounded-full flex items-center justify-center border border-gray-300 text-xs">3</div>
            <span>Endereço</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <div className="w-6 h-6 rounded-full flex items-center justify-center border border-gray-300 text-xs">4</div>
            <span>Pagamento</span>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-gray-800 text-center mb-8"
        >
          Definição de Valores
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-8 space-y-8"
        >
          <p className="text-gray-700 text-center text-lg">
            O valor definido por <strong>Marcelo Von Richtofen</strong> foi de{" "}
            <span className="text-green-600 font-bold text-2xl">R$ {valorProposto},00</span>
          </p>

          <div className="space-y-5">
            {/* Opção Aceitar */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedOption("aceitar")}
              className={`flex items-center justify-between border rounded-lg text-gray-900 p-5 cursor-pointer transition shadow-sm ${
                selectedOption === "aceitar"
                  ? "border-green-600 bg-green-50"
                  : "border-gray-300 bg-white"
              }`}
            >
              <div>
                <span className="font-semibold block">Aceitar</span>
                <span className="text-gray-600 text-sm">Aceitar valor proposto pelo profissional</span>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                  selectedOption === "aceitar" ? "border-green-600" : "border-gray-400"
                }`}
              >
                {selectedOption === "aceitar" && (
                  <div className="w-2.5 h-2.5 bg-green-600 rounded-full"></div>
                )}
              </div>
            </motion.div>

            {/* Opção Negociar */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedOption("negociar")}
              className={`flex items-center justify-between border rounded-lg p-5 cursor-pointer transition shadow-sm ${
                selectedOption === "negociar"
                  ? "border-green-600 bg-green-50"
                  : "border-gray-300 bg-white"
              }`}
            >
              <div>
                <span className="font-semibold block text-gray-900">Negociar</span>
                <span className="text-gray-600 text-sm">Voltar para a área de negociação de valores</span>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                  selectedOption === "negociar" ? "border-green-600" : "border-gray-400"
                }`}
              >
                {selectedOption === "negociar" && (
                  <div className="w-2.5 h-2.5 bg-green-600 rounded-full"></div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Botões */}
          <div className="flex justify-between mt-10">
            <button className="px-6 py-2 border border-gray-400 rounded-md hover:bg-gray-100 transition font-medium text-gray-600">
              Voltar
            </button>
            <button
              disabled={!selectedOption}
              className={`px-6 py-2 rounded-md font-medium transition ${
                !selectedOption
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              Próximo
            </button>
          </div>
        </motion.div>
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
              <li><a href="#" className="hover:text-green-600 transition-colors duration-200">Buscar</a></li>
              <li><a href="#" className="hover:text-green-600 transition-colors duration-200">Recomendado</a></li>
              <li><a href="#" className="hover:text-green-600 transition-colors duration-200">Categorias</a></li>
              <li><a href="#" className="hover:text-green-600 transition-colors duration-200">Perguntas Frequentes</a></li>
              <li><a href="#" className="hover:text-green-600 transition-colors duration-200">Termos de Uso</a></li>
            </ul>
          </nav>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Conecte-se</h4>
            <div className="flex space-x-4">
              <a href="#" aria-label="X (Twitter)" className="transition-transform hover:scale-110">
                <img src="/Images/X_Logo.png" alt="X" className="h-8 w-8 object-contain" />
              </a>
              <a href="#" aria-label="TikTok" className="transition-transform hover:scale-110">
                <img src="/Images/TikTok_Logo.png" alt="TikTok" className="h-8 w-8 object-contain" />
              </a>
              <a href="#" aria-label="Instagram" className="transition-transform hover:scale-110">
                <img src="/Images/Instagram_Logo.png" alt="Instagram" className="h-8 w-8 object-contain" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} <span className="text-white font-semibold">FazFast</span>. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default DefinicaoDeValores;