"use client";

import React, { useState } from "react";

type Profissional = {
  id: number;
  nome: string;
  genero: "Masculino" | "Feminino";
  formacao: string;
  anos: string[];
  materia: string;
  avaliacao: number;
  imagem: string;
};

const mockProfissionais: Profissional[] = [
  {
    id: 1,
    nome: "Marcelo Pereira Araujo",
    genero: "Masculino",
    formacao: "Licenciatura",
    anos: ["Fundamental", "Médio"],
    materia: "Matemática",
    avaliacao: 4.9,
    imagem: "/Images/DwightProfile.png",
  },
  {
    id: 2,
    nome: "Ana Costa",
    genero: "Feminino",
    formacao: "Mestrado",
    anos: ["Médio", "Superior"],
    materia: "Biologia",
    avaliacao: 5.0,
    imagem: "/Images/DwightProfile.png",
  },
  {
    id: 3,
    nome: "João Pereira",
    genero: "Masculino",
    formacao: "Doutorado",
    anos: ["Superior"],
    materia: "História",
    avaliacao: 4.7,
    imagem: "/Images/DwightProfile.png",
  },
  // Adicione mais mock se quiser
];

const menu: React.FC = () => {
  const [filtros, setFiltros] = useState({
    materia: "",
    anos: [] as string[],
    formacao: [] as string[],
    genero: [] as string[],
    ordenacao: "avaliacao",
  });

  const toggleFiltroArray = (tipo: "anos" | "formacao" | "genero", valor: string) => {
    setFiltros((prev) => {
      const arr = prev[tipo];
      return {
        ...prev,
        [tipo]: arr.includes(valor) ? arr.filter((v) => v !== valor) : [...arr, valor],
      };
    });
  };

  const profissionaisFiltrados = mockProfissionais
    .filter((p) =>
      p.materia.toLowerCase().includes(filtros.materia.toLowerCase())
    )
    .filter((p) =>
      filtros.anos.length > 0 ? filtros.anos.some((a) => p.anos.includes(a)) : true
    )
    .filter((p) =>
      filtros.formacao.length > 0 ? filtros.formacao.includes(p.formacao) : true
    )
    .filter((p) =>
      filtros.genero.length > 0 ? filtros.genero.includes(p.genero) : true
    )
    .sort((a, b) => {
      if (filtros.ordenacao === "avaliacao") return b.avaliacao - a.avaliacao;
      if (filtros.ordenacao === "nome") return a.nome.localeCompare(b.nome);
      return 0;
    });

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

      {/* Breadcrumb + Título */}
      <div className="container mx-auto px-6 py-6">
        <div className="text-sm text-gray-500 mb-2">
          Home &gt; <span className="text-green-600">Educação</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-800">
          Encontre Professores de Educação
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Use os filtros ao lado para refinar sua busca.
        </p>
      </div>

      {/* Conteúdo principal */}
      <div className="container mx-auto px-6 pb-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="md:col-span-1 bg-white p-5 rounded-xl shadow h-fit sticky top-24 space-y-5">
          {/* Matéria */}
          <div>
            <h4 className="font-semibold mb-2">Matéria</h4>
            <input
              type="text"
              placeholder="Pesquisar..."
              value={filtros.materia}
              onChange={(e) => setFiltros({ ...filtros, materia: e.target.value })}
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Anos */}
          <div>
            <h4 className="font-semibold mb-2">Anos de Ensino</h4>
            {["Fundamental", "Médio", "Superior"].map((ano) => (
              <label key={ano} className="flex items-center space-x-2 text-sm mb-1">
                <input
                  type="checkbox"
                  checked={filtros.anos.includes(ano)}
                  onChange={() => toggleFiltroArray("anos", ano)}
                />
                <span>{ano}</span>
              </label>
            ))}
          </div>

          {/* Formação */}
          <div>
            <h4 className="font-semibold mb-2">Formação</h4>
            {["Licenciatura", "Mestrado", "Doutorado"].map((form) => (
              <label key={form} className="flex items-center space-x-2 text-sm mb-1">
                <input
                  type="checkbox"
                  checked={filtros.formacao.includes(form)}
                  onChange={() => toggleFiltroArray("formacao", form)}
                />
                <span>{form}</span>
              </label>
            ))}
          </div>

          {/* Gênero */}
          <div>
            <h4 className="font-semibold mb-2">Gênero</h4>
            {["Masculino", "Feminino"].map((g) => (
              <label key={g} className="flex items-center space-x-2 text-sm mb-1">
                <input
                  type="checkbox"
                  checked={filtros.genero.includes(g)}
                  onChange={() => toggleFiltroArray("genero", g)}
                />
                <span>{g}</span>
              </label>
            ))}
          </div>
        </aside>

        {/* Grid */}
        <main className="md:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-gray-600">
              {profissionaisFiltrados.length} profissionais encontrados
            </p>
            <select
              value={filtros.ordenacao}
              onChange={(e) =>
                setFiltros({ ...filtros, ordenacao: e.target.value })
              }
              className="border rounded-md px-3 py-2 text-sm focus:ring-green-500 focus:outline-none"
            >
              <option value="avaliacao">Por avaliação</option>
              <option value="nome">Por nome (A-Z)</option>
            </select>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {profissionaisFiltrados.map((prof) => (
              <div
                key={prof.id}
                className="bg-white rounded-xl shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-200 p-6 text-center"
              >
                <img
                  src={prof.imagem}
                  alt={prof.nome}
                  className="mx-auto mb-4 rounded-md w-24 h-24 object-cover border-2 border-green-500"
                />
                <h3 className="font-semibold text-lg">{prof.nome}</h3>
                <p className="text-sm text-gray-500 mb-2">{prof.materia}</p>
                <div className="flex justify-center items-center mb-3 text-yellow-500 text-sm">
                  ★ {prof.avaliacao.toFixed(1)}
                </div>
                <button className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition">
                  Contratar
                </button>
              </div>
            ))}
          </div>

          {/* Paginação */}
          <div className="flex justify-center mt-8 space-x-2">
            <button className="px-3 py-1 rounded-full border hover:bg-gray-100">‹</button>
            <button className="px-4 py-1 rounded-full bg-green-600 text-white">1</button>
            <button className="px-3 py-1 rounded-full border hover:bg-gray-100">2</button>
            <button className="px-3 py-1 rounded-full border hover:bg-gray-100">…</button>
            <button className="px-3 py-1 rounded-full border hover:bg-gray-100">12</button>
            <button className="px-3 py-1 rounded-full border hover:bg-gray-100">›</button>
          </div>
        </main>
      </div>

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
  );
};

export default menu;
