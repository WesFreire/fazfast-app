"use client";

import React, { useState } from "react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import Link from "next/link";

const GerarQRCode: React.FC = () => {
  const [profissional, setProfissional] = useState("Nome do Profissional");
  const url = "https://w.app/p0txyq"; // ✅ Link fixo

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
          <div className="flex items-center space-x-2 text-green-600">
            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-green-600 text-white text-xs">1</div>
            <span>Contato</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <div className="w-6 h-6 rounded-full flex items-center justify-center border border-gray-300 text-xs">2</div>
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
      <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-gray-800 mb-8 text-center"
        >
           QR Code do WhatsApp do Profissional.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg"
        >

          <div className="flex flex-col items-center">
            <p className="mb-3 text-sm text-gray-600 text-center">
              Escaneie para entrar em contato com <strong>{profissional}</strong> no WhatsApp
            </p>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-white p-4 border rounded-xl shadow-md mb-4"
            >
              <QRCodeSVG value={url} size={200} />
            </motion.div>
            <div className="flex flex-col space-y-3 w-full">
              <button
                onClick={() => navigator.clipboard.writeText(url)}
                className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
              >
                Copiar link
              </button>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gray-800 text-white text-center rounded-md hover:bg-gray-900 transition-colors font-medium"
              >
                Abrir link
              </a>
            </div>
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

export default GerarQRCode;