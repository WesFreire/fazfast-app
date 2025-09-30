"use client";

import React, { useRef } from "react";

const FazFastHome: React.FC = () => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = 200; // px por clique
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <img
            src="/Images/FazFastLogo.png"
            alt="FazFast Logo"
            className="h-10"
          />
          <nav className="hidden md:flex space-x-8 font-medium">
            <a href="#" className="hover:text-green-600 transition">
              Home
            </a>
            <a href="#" className="hover:text-green-600 transition">
              Sobre
            </a>
            <a href="#" className="hover:text-green-600 transition">
              Contato
            </a>
            <a href="#" className="hover:text-green-600 transition">
              Blog
            </a>
          </nav>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Buscar serviços..."
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <a
              href="#"
              className="relative text-gray-600 hover:text-green-600 transition"
            >
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
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center text-center text-white">
        <img
          src="/Images/Header.gif"
          alt="Header Banner"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-green-900/40" />
        <div className="relative z-10 px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Simplesmente Rápido: Onde Suas Necessidades Ganham Vida!
          </h1>
          <p className="max-w-2xl mx-auto mb-6 text-lg">
            Conectamos você aos melhores profissionais do Brasil para todos os
            tipos de serviços.
          </p>
          <button className="bg-green-600 text-white px-8 py-3 rounded-lg shadow hover:bg-green-700 transition">
            Explorar Serviços
          </button>
        </div>
      </section>

      {/* Category Slider */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Pesquisar por categoria
          </h2>
          <div className="relative">
            {/* Botão Esquerda */}
            <button
              onClick={() => scroll("left")}
              className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-white shadow p-2 rounded-full hover:bg-gray-100 z-10"
            >
              ◀
            </button>

            {/* Slider */}
            <div
              ref={sliderRef}
              className="flex space-x-6 overflow-x-auto scrollbar-hide scroll-smooth"
            >
              {[
                { name: "Culinária", img: "/Images/Culinaria.png" },
                { name: "Automotivo", img: "/Images/Automotivo.png" },
                { name: "Domésticos", img: "/Images/Domesticos.png" },
                { name: "Gerais", img: "/Images/Gerais.png" },
                { name: "Digital", img: "/Images/Digitais.png" },
                { name: "Educação", img: "/Images/Educação.png" },
                { name: "Domésticos", img: "/Images/Domesticos.png" },
                { name: "Gerais", img: "/Images/Gerais.png" },
                { name: "Digital", img: "/Images/Digitais.png" },
                { name: "Educação", img: "/Images/Educação.png" },
                { name: "Domésticos", img: "/Images/Domesticos.png" },
                { name: "Gerais", img: "/Images/Gerais.png" },
                { name: "Digital", img: "/Images/Digitais.png" },
                { name: "Educação", img: "/Images/Educação.png" },
              ].map((cat, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center bg-gray-100 rounded-xl p-6 hover:bg-gray-200 hover:shadow-md transition cursor-pointer min-w-[120px]"
                >
                  <img src={cat.img} alt={cat.name} className="w-10 h-10 mb-3" />
                  <span className="text-sm font-medium">{cat.name}</span>
                </div>
              ))}
            </div>

            {/* Botão Direita */}
            <button
              onClick={() => scroll("right")}
              className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white shadow p-2 rounded-full hover:bg-gray-100 z-10"
            >
              ▶
            </button>
          </div>
        </div>
      </section>

      {/* Professionals Grid */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Profissionais em destaque</h2>
            <div className="space-x-6 text-sm text-gray-600">
              <button className="hover:text-green-600">Destaques</button>
              <button className="hover:text-green-600">Novos</button>
              <button className="hover:text-green-600">Populares</button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 text-center"
              >
                <img
                  src="/Images/DwightProfile.png"
                  alt="Professional"
                  className="mx-auto mb-4 rounded-[25%] w-24 h-24 object-cover"
                />
                <div className="flex justify-center items-center mb-2">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1 text-gray-600 text-sm">5.0</span>
                </div>
                <h3 className="font-semibold text-lg">
                  Marcello Von Richthofen
                </h3>
                <p className="text-sm text-gray-500">Profissional</p>
                <button className="mt-4 bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition">
                  Contratar
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-gray-300 py-12 mt-12">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-green-600 mb-4">FazFast</h3>
            <p className="text-sm leading-relaxed">
              Plataforma de serviços sob demanda, conectando clientes e
              profissionais em todo o Brasil com qualidade e confiança.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Assistência ao Cliente</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:underline">
                  Buscar
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Recomendado
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Categorias
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Perguntas Frequentes
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Termos de Uso
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Conecte-se</h4>
            <div className="flex space-x-4 text-xl">
              <a href="#" className="hover:text-green-600">
                🐦
              </a>
              <a href="#" className="hover:text-green-600">
                📘
              </a>
              <a href="#" className="hover:text-green-600">
                📸
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} FazFast. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default FazFastHome;