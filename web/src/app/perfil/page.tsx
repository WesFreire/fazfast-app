"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const reviews = [
  { id: 1, nome: "Oscar Cunha", nota: 5, comentario: "Excelente profissional!", data: "2 semanas atrás" },
  { id: 2, nome: "Rachel Andrade", nota: 5, comentario: "Explicações claras e didáticas.", data: "3 semanas atrás" },
  { id: 3, nome: "Eric Braga", nota: 5, comentario: "Super recomendo.", data: "1 mês atrás" },
];

const PerfilProfissional: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
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
            <a href="#" className="relative text-gray-600 hover:text-green-600 transition">
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

      <div className="w-full min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="max-w-6xl mx-auto px-4 pt-6 pb-4 text-sm text-gray-500 flex items-center gap-1">
          <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
          <span>›</span>
          <Link href="/educacao" className="hover:text-green-600 transition-colors">Educação</Link>
          <span>›</span>
          <span className="text-gray-800 font-medium">Marcelo Pereira da Silva</span>
        </div>

        {/* Top Section */}
        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Foto */}
          <div className="w-full flex justify-center md:justify-start">
            <div className="relative w-120 h-130 rounded-lg overflow-hidden shadow-md">
              <Image
                src="/Images/DwightProfile.png"
                alt="Foto do Professor"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Informações */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                  Marcelo Pereira da Silva
                </h1>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500 text-lg">★</span>
                  <span className="text-sm font-medium text-gray-700">5.0</span>
                </div>
              </div>
              <p className="text-gray-600 mt-1 text-lg">Professor(a) de Química</p>

              <div className="mt-3 flex items-center gap-2">
                <span className="text-green-600 font-medium text-sm flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  Verificado
                </span>
              </div>

              {/* Tipos de Aula */}
              <div className="mt-4 flex gap-2">
                <button className="px-4 py-2 rounded-md border text-gray-700 bg-white hover:bg-gray-50">
                  Presencial
                </button>
                <button className="px-4 py-2 rounded-md border text-white bg-green-600 hover:bg-green-700">
                  Online
                </button>
              </div>

              {/* Tempo de ensino e formação */}
              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <div className="flex flex-col bg-gray-100 rounded-md px-3 py-2">
                  <span className="text-gray-800 font-semibold">Tempo de Ensino</span>
                  <span className="text-gray-600">2 Anos</span>
                </div>
                <div className="flex flex-col bg-gray-100 rounded-md px-3 py-2">
                  <span className="text-gray-800 font-semibold">Formação</span>
                  <span className="text-gray-600">Harvard University</span>
                </div>
              </div>

              {/* Bio curta */}
              <p className="mt-4 text-gray-700 text-sm leading-relaxed max-w-lg">
                Olá! Sou Marcelo Pereira da Silva, professor de Química apaixonado por ensinar e inspirar.
                Formado pela Universidade de Harvard, trago conhecimento e experiência para tornar a química acessível e fascinante!
              </p>

              {/* Botão Contatar */}
              <div className="mt-5">
                <button className="w-full md:w-auto px-6 py-2 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors">
                  Contatar
                </button>
              </div>
            </div>

            {/* Modalidade */}
            <div className="mt-6 flex items-center gap-2 text-gray-700 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8c-1.657 0-3 .895-3 2v4c0 1.105 1.343 2 3 2s3-.895 3-2v-4c0-1.105-1.343-2-3-2z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 10a7 7 0 0114 0v4a7 7 0 01-14 0v-4z"
                />
              </svg>
              <span>Atende em <strong>Híbrido</strong></span>
            </div>
          </div>
        </div>

        {/* Seção Introdução */}
        <div className="max-w-6xl mx-auto px-4 py-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Introdução</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Olá! Sou o Marcelo, professor de Química dedicado a inspirar e ensinar.
            Graduado pela Universidade de Harvard, com mestrado e doutorado em Química Orgânica,
            trago uma sólida formação acadêmica e anos de experiência em pesquisa e ensino.
            Minha missão é tornar a química envolvente, acessível e relevante para todos os alunos,
            conectando teoria à prática com paixão e clareza.
          </p>

          {/* Detalhes */}
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-3 border-b border-gray-200">
              <div className="px-4 py-3 font-medium text-gray-800">Detalhe 1</div>
              <div className="px-4 py-3 text-gray-600 col-span-1 md:col-span-2 border-l border-gray-200">
                Informação 1
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 border-b border-gray-200">
              <div className="px-4 py-3 font-medium text-gray-800">Detalhe 2</div>
              <div className="px-4 py-3 text-gray-600 col-span-1 md:col-span-2 border-l border-gray-200">
                Informação 2
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3">
              <div className="px-4 py-3 font-medium text-gray-800">Adicional</div>
              <div className="px-4 py-3 text-gray-600 col-span-1 md:col-span-2 border-l border-gray-200">
                Pós-Graduação — Mestrado
              </div>
            </div>
          </div>
        </div>

        {/* Avaliações */}
        <div className="container mx-auto px-6 mb-12">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg text-gray-900 font-semibold mb-4">Avaliações</h2>

            {/* Resumo */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div className="flex items-center mb-4 md:mb-0">
                <span className="text-5xl font-bold mr-3 text-yellow-500">5.0</span>
                <div>
                  <div className="flex text-yellow-500 text-xl mb-1">★★★★★</div>
                  <span className="text-gray-500 text-sm">3 avaliações</span>
                </div>
              </div>

              <div className="flex-1 max-w-md space-y-1">
                {[5, 4, 3, 2, 1].map((nota) => (
                  <div key={nota} className="flex items-center text-sm text-gray-500">
                    <span className="w-6">{nota}</span>
                    <div className="flex-1 bg-gray-200 h-2 rounded mx-2">
                      {nota === 5 && <div className="bg-green-600 h-2 rounded w-full"></div>}
                    </div>
                    <span>{nota === 5 ? "100%" : "0%"}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lista de Reviews */}
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="border-t pt-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-gray-600">{r.nome}</span>
                    <span className="text-yellow-500 text-sm">★★★★★</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-1">{r.comentario}</p>
                  <span className="text-xs text-gray-400">{r.data}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Professores Relacionados */}
        <div className="container mx-auto px-6 mb-16">
          <h2 className="text-lg text-gray-900 font-semibold mb-4">Professores Relacionados</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow p-4 text-center hover:shadow-lg transition">
                <Image
                  src="/Images/DwightProfile.png"
                  alt="prof"
                  width={96}
                  height={96}
                  className="mx-auto w-24 h-24 rounded-md object-cover border-2 border-green-500 mb-2"
                />
                <p className="font-semibold text-gray-700 text-sm">Marcelo Pereira da Silva</p>
                <p className="text-xs text-gray-500 mb-2">Professor(a) de Química</p>
                <button className="w-full bg-black text-white text-sm py-1 rounded hover:bg-gray-800 transition">
                  Contratar
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-black text-gray-300 py-12 mt-12">
          <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-green-600 mb-4">FazFast</h3>
              <p className="text-sm leading-relaxed">
                Plataforma de serviços sob demanda, conectando clientes e profissionais em todo o Brasil com qualidade e confiança.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Assistência ao Cliente</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:underline">Buscar</a></li>
                <li><a href="#" className="hover:underline">Recomendado</a></li>
                <li><a href="#" className="hover:underline">Categorias</a></li>
                <li><a href="#" className="hover:underline">Perguntas Frequentes</a></li>
                <li><a href="#" className="hover:underline">Termos de Uso</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Conecte-se</h4>
              <div className="flex space-x-4 text-xl">
                <a href="#" className="hover:text-green-600">🐦</a>
                <a href="#" className="hover:text-green-600">📘</a>
                <a href="#" className="hover:text-green-600">📸</a>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} FazFast. Todos os direitos reservados.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default PerfilProfissional;
