"use client";

import React, { useState } from "react";
import Image from "next/image";
import {QRCodeSVG} from "qrcode.react";

const GerarQRCode: React.FC = () => {
  const [url, setUrl] = useState("");
  const [profissional, setProfissional] = useState("Nome do Profissional");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Image
            src="/Images/FazFastLogo.png"
            alt="FazFast Logo"
            width={120}
            height={40}
            className="h-10 w-auto"
          />
          <nav className="hidden md:flex space-x-8 font-medium">
            <a href="#" className="hover:text-green-600 transition">Home</a>
            <a href="#" className="hover:text-green-600 transition">Sobre</a>
            <a href="#" className="hover:text-green-600 transition">Contato</a>
            <a href="#" className="hover:text-green-600 transition">Blog</a>
          </nav>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Buscar serviços..."
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button className="relative text-gray-600 hover:text-green-600 transition">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-2.3 2.3c-.6.6-.2 1.7.7 1.7H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Etapas */}
      <div className="bg-white border-b py-4">
        <div className="container mx-auto flex justify-center space-x-10 text-sm font-medium">
          <div className="flex items-center space-x-2 text-green-600">
            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-green-600 text-white text-xs">1</div>
            <span>Gerar QR Code</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <div className="w-6 h-6 rounded-full flex items-center justify-center border border-gray-300 text-xs">2</div>
            <span>Revisar</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <div className="w-6 h-6 rounded-full flex items-center justify-center border border-gray-300 text-xs">3</div>
            <span>Finalizar</span>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <main className="flex-1 container mx-auto px-4 py-10 flex flex-col items-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Gerar QR Code para contato via WhatsApp
        </h1>

        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
          <label className="block mb-4">
            <span className="text-gray-700 font-medium">Link ou número do WhatsApp:</span>
            <input
              type="text"
              placeholder="https://wa.me/55XXXXXXXXXX"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mt-1 block w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </label>

          <label className="block mb-6">
            <span className="text-gray-700 font-medium">Nome do profissional:</span>
            <input
              type="text"
              placeholder="Ex: Marcelo Pereira"
              value={profissional}
              onChange={(e) => setProfissional(e.target.value)}
              className="mt-1 block w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </label>

          {url ? (
            <div className="flex flex-col items-center">
              <p className="mb-2 text-sm text-gray-600">
                Escaneie para entrar em contato com <strong>{profissional}</strong>
              </p>
              <div className="bg-white p-4 border rounded-md mb-4">
                <QRCodeSVG value={url} size={180} />
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(url)}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                Copiar link
              </button>
            </div>
          ) : (
            <p className="text-center text-gray-500">Digite um link para gerar o QR Code</p>
          )}
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

export default GerarQRCode;
