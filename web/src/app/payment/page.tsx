"use client";

import React, { useState } from "react";
import Image from "next/image";

const PagamentoPage: React.FC = () => {
  const [metodoPagamento, setMetodoPagamento] = useState("credito");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
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
              placeholder="Buscar..."
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button className="text-gray-600 hover:text-green-600 transition">
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

      {/* Steps */}
      <div className="bg-white border-b py-4">
        <div className="container mx-auto flex justify-center space-x-10 text-sm font-medium">
          <div className="flex items-center space-x-2 text-gray-400">
            <div className="w-6 h-6 rounded-full flex items-center justify-center border border-gray-300 text-xs">1</div>
            <span>Address</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <div className="w-6 h-6 rounded-full flex items-center justify-center border border-gray-300 text-xs">2</div>
            <span>Shipping</span>
          </div>
          <div className="flex items-center space-x-2 text-black">
            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-black text-white text-xs">3</div>
            <span>Payment</span>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <main className="flex-1 container mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Summary */}
        <div className="bg-white shadow-md rounded-lg p-6 h-fit">
          <h2 className="text-lg text-gray-900 font-semibold mb-4">Summary</h2>

          <div className="flex items-center justify-between border rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-3">
              <Image
                src="/Images/user-placeholder.png"
                alt="Profissional"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="font-medium">Marcelo Von Richtofen</span>
            </div>
            <span className="font-semibold">R$ 170</span>
          </div>

          <div className="text-sm text-gray-700 space-y-2 mb-4">
            <p><strong>Endereço:</strong> Rua Savanna Oliveira, 183, Bairro Lua Amena</p>
            <p><strong>Método de pagamento:</strong> Cartão de Crédito</p>
          </div>

          <div className="border-t pt-4 text-sm space-y-2">
            <div className="flex text-gray-900 justify-between">
              <span>Subtotal</span>
              <span>R$ 170</span>
            </div>
            <div className="flex text-gray-900 justify-between">
              <span>Taxa de Serviço FazFast</span>
              <span>R$ 10</span>
            </div>
            <div className="flex text-gray-900 justify-between font-semibold text-base pt-2">
              <span>Total</span>
              <span>R$ 180</span>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div>
          <h2 className="text-lg text-gray-900 font-semibold mb-4">Pagamento</h2>
          {/* Tabs */}
          <div className="flex space-x-4 mb-6 border-b">
            <button
              onClick={() => setMetodoPagamento("credito")}
              className={`pb-2 ${metodoPagamento === "credito" ? "border-b-2 border-black font-medium text-gray-900" : "text-gray-500"}`}
            >
              Cartão de Crédito
            </button>
            <button
              onClick={() => setMetodoPagamento("paypal")}
              className={`pb-2 ${metodoPagamento === "paypal" ? "border-b-2 border-black font-medium text-gray-900" : "text-gray-500"}`}
            >
              PayPal
            </button>
            <button
              onClick={() => setMetodoPagamento("debito")}
              className={`pb-2 ${metodoPagamento === "debito" ? "border-b-2 border-black font-medium text-gray-900" : "text-gray-500"}`}
            >
              Cartão de Débito
            </button>
          </div>

          {metodoPagamento === "credito" && (
            <div>
              <div className="bg-black rounded-xl p-4 mb-6 flex justify-center items-center">
                <Image
                  src="/Images/Cardholder.png"
                  alt="Cartão de Crédito"
                  width={337}
                  height={190}
                  className="rounded-lg"
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-gray-300 py-12 mt-12">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-green-600 mb-4">FazFast</h3>
            <p className="text-sm leading-relaxed">
              Somos uma plataforma de serviços sob demanda, orgulhosamente sediada no Brasil. Sem localização fixa, a FazFast conecta prestadores de serviços e clientes em todo o país.
            </p>
            <div className="flex space-x-4 mt-4 text-xl">
              <a href="#" className="hover:text-green-600">🐦</a>
              <a href="#" className="hover:text-green-600">📘</a>
              <a href="#" className="hover:text-green-600">📸</a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Assistência ao Cliente</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:underline">Termos de serviço</a></li>
              <li><a href="#" className="hover:underline">Retorno/Reembolso</a></li>
              <li><a href="#" className="hover:underline">Garantia</a></li>
              <li><a href="#" className="hover:underline">Perguntas frequentes</a></li>
              <li><a href="#" className="hover:underline">Termos de uso</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} FazFast. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default PagamentoPage;
