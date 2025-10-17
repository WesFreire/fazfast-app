"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

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
];

// ✅ Hook de scroll reveal (sem libs externas)
function useScrollReveal() {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            controls.start("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [controls]);

    return { ref, controls };
}

const Menu: React.FC = () => {
  const [filtros, setFiltros] = useState({
    materia: "",
    anos: [] as string[],
    formacao: [] as string[],
    genero: [] as string[],
    ordenacao: "avaliacao",
  });

  const toggleFiltroArray = (tipo: "anos" | "formacao" | "genero", valor: string) => {
    setFiltros((prev) => ({
      ...prev,
      [tipo]: prev[tipo].includes(valor)
        ? prev[tipo].filter((v) => v !== valor)
        : [...prev[tipo], valor],
    }));
  };

  const profissionaisFiltrados = mockProfissionais
    .filter((p) => p.materia.toLowerCase().includes(filtros.materia.toLowerCase()))
    .filter((p) => (filtros.anos.length ? filtros.anos.some((a) => p.anos.includes(a)) : true))
    .filter((p) => (filtros.formacao.length ? filtros.formacao.includes(p.formacao) : true))
    .filter((p) => (filtros.genero.length ? filtros.genero.includes(p.genero) : true))
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
          <img src="/Images/FazFastLogo.png" alt="FazFast Logo" className="h-10" />
          <nav className="hidden md:flex space-x-8 font-medium">
            {["Home", "Sobre", "Contato", "Blog"].map((item) => (
              <a key={item} href="#" className="hover:text-green-600 transition">
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Buscar serviços..."
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <a href="#" className="relative text-gray-600 hover:text-green-600 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-6 py-6"
      >
        <div className="text-sm text-gray-500 mb-2">
          Home &gt; <span className="text-green-600">Educação</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Encontre Professores de Educação</h1>
        <p className="text-gray-500 mt-1 text-sm">Use os filtros ao lado para refinar sua busca.</p>
      </motion.div>

      {/* Conteúdo */}
      <div className="container mx-auto px-6 pb-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="md:col-span-1 bg-white p-5 rounded-xl shadow h-fit sticky top-24 space-y-5">
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

          {[
            { title: "Anos de Ensino", key: "anos", values: ["Fundamental", "Médio", "Superior"] },
            { title: "Formação", key: "formacao", values: ["Licenciatura", "Mestrado", "Doutorado"] },
            { title: "Gênero", key: "genero", values: ["Masculino", "Feminino"] },
          ].map((section) => (
            <div key={section.key}>
              <h4 className="font-semibold mb-2">{section.title}</h4>
              {section.values.map((val) => (
                <label key={val} className="flex items-center space-x-2 text-sm mb-1">
                  <input
                    type="checkbox"
                    checked={(filtros as any)[section.key].includes(val)}
                    onChange={() => toggleFiltroArray(section.key as any, val)}
                  />
                  <span>{val}</span>
                </label>
              ))}
            </div>
          ))}
        </aside>

        {/* Grid de cards com scroll reveal */}
        <main className="md:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-gray-600">
              {profissionaisFiltrados.length} profissionais encontrados
            </p>
            <select
              value={filtros.ordenacao}
              onChange={(e) => setFiltros({ ...filtros, ordenacao: e.target.value })}
              className="border rounded-md px-3 py-2 text-sm focus:ring-green-500 focus:outline-none"
            >
              <option value="avaliacao">Por avaliação</option>
              <option value="nome">Por nome (A-Z)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {profissionaisFiltrados.map((prof) => {
              const { ref, controls } = useScrollReveal();
              return (
                <motion.div
                  key={prof.id}
                  ref={ref}
                  initial={{ opacity: 0, y: 40 }}
                  animate={controls}
                  variants={{
                    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
                  }}
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
                </motion.div>
              );
            })}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-black text-gray-300 py-12 mt-12">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <img src="/Images/FazFastLogo_Inv.png" alt="FazFast Logo" className="h-12 mb-4" />
            <p className="text-sm leading-relaxed">
              Plataforma de serviços sob demanda, conectando clientes e profissionais em todo o
              Brasil com qualidade e confiança.
            </p>
          </div>

          <nav>
            <h4 className="font-semibold mb-4 text-white">Assistência ao Cliente</h4>
            <ul className="space-y-2 text-sm">
              {["Buscar", "Recomendado", "Categorias", "Perguntas Frequentes", "Termos de Uso"].map(
                (link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-green-600 transition-colors duration-200">
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </nav>

          <div>
            <h4 className="font-semibold mb-4 text-white">Conecte-se</h4>
            <div className="flex space-x-4">
              {["X_Logo.png", "TikTok_Logo.png", "Instagram_Logo.png"].map((icon, i) => (
                <a key={i} href="#" className="transition-transform duration-200 hover:scale-110">
                  <img src={`/Images/${icon}`} alt={icon} className="h-8 w-8 object-contain" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()}{" "}
          <span className="text-white font-semibold">FazFast</span>. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default Menu;