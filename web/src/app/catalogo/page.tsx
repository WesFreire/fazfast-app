"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";

type Profissional = {
  id: number;
  nome: string;
  genero: "Masculino" | "Feminino" | "Outro" | "Prefiro não informar";
  formacao: string;
  anos: string[];
  materia: string;
  avaliacao: number;
  experiencia: number;
  imagem: string;
};

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

const ProfessionalCard: React.FC<{ profissional: Profissional }> = ({ profissional }) => {
  const { ref, controls } = useScrollReveal();

  const variants = {
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={controls}
      variants={variants}
      className="bg-white rounded-xl shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-200 p-6 text-center cursor-pointer"
    >
      <img
        src={profissional.imagem}
        alt={profissional.nome}
        className="mx-auto mb-4 rounded-md w-24 h-24 object-cover border-2 border-green-500"
      />
      <h3 className="font-semibold text-lg">{profissional.nome}</h3>
      <p className="text-sm text-gray-500 mb-2">{profissional.materia}</p>

      <p className="text-xs text-gray-600 mb-2">
        {profissional.experiencia} anos de experiência
      </p>

      <div className="flex justify-center items-center gap-2 text-gray-500 text-sm mb-2">
        <span className="px-2 py-1 rounded-md bg-gray-100 text-xs">{profissional.genero}</span>
        <span className="px-2 py-1 rounded-md bg-gray-100 text-xs">{profissional.formacao}</span>
      </div>

      <div className="flex justify-center items-center mb-3 text-yellow-500 text-sm">
        ★ {profissional.avaliacao.toFixed(1)}
      </div>

      <button className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition cursor-pointer">
        Contratar
      </button>
    </motion.div>
  );
};

const Menu: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const searchFromHome = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(searchFromHome);

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    router.push("/login");
  };

  const [profissionais, setProfissionais] = useState<Profissional[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const r = await fetch("http://127.0.0.1:8000/api/profissionais/");
        const data = await r.json();

        const convertidos: Profissional[] = data.map((p: any) => ({
          id: p.id,
          nome: p.usuario.username,
          genero:
            p.usuario.genero?.charAt(0).toUpperCase() +
              p.usuario.genero?.slice(1) || "Prefiro não informar",

          formacao: p.formacao ?? "Não informado",
          anos: p.anos ?? [],
          materia: p.especialidades?.[0] ?? "Não informado",
          avaliacao: p.avaliacao_media ?? 0,

          experiencia: p.experiencia_anos ?? 0,

          imagem:
            p.usuario.foto_perfil && p.usuario.foto_perfil !== ""
              ? p.usuario.foto_perfil
              : "/Images/DwightProfile.png",
        }));

        setProfissionais(convertidos);
      } catch (err) {
        console.log("Erro ao carregar API:", err);
      }
    }

    loadData();
  }, []);

  const [filtros, setFiltros] = useState({
    categoria: "",
    genero: [] as string[],
    avaliacaoMin: 0,
    experienciaMin: 0,
    ordenacao: "avaliacao",
  });

  const toggleGenero = (valor: string) => {
    setFiltros((prev) => ({
      ...prev,
      genero: prev.genero.includes(valor)
        ? prev.genero.filter((x) => x !== valor)
        : [...prev.genero, valor],
    }));
  };

  const makeRangeBackground = (value: number, min: number, max: number) => {
    const pct = ((value - min) / (max - min)) * 100;

    return `linear-gradient(90deg, #16a34a ${pct}%, #e6e6e6 ${pct}%)`;
  };

  const profissionaisFiltrados = profissionais
    .filter(
      (p) =>
        searchTerm === "" ||
        p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.materia.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(
      (p) =>
        filtros.categoria === "" ||
        p.materia.toLowerCase().includes(filtros.categoria.toLowerCase())
    )
    .filter((p) =>
      filtros.genero.length ? filtros.genero.includes(p.genero) : true
    )
    .filter((p) => p.avaliacao >= filtros.avaliacaoMin)
    .filter((p) => p.experiencia >= filtros.experienciaMin)
    .sort((a, b) => {
      if (filtros.ordenacao === "avaliacao") return b.avaliacao - a.avaliacao;
      if (filtros.ordenacao === "nome") return a.nome.localeCompare(b.nome);
      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 font-sans text-gray-800 overflow-x-hidden">
      {/* HEADER */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="backdrop-blur-md bg-white/90 shadow-lg sticky top-0 z-50"
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <Image
              src="/Images/FazFastLogo.png"
              alt="FazFast Logo"
              width={160}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* nav */}
          <nav className="hidden md:flex space-x-8 font-medium">
            <Link
              href="/"
              className="text-gray-600 hover:text-green-600 transition-colors duration-300 border-b-2 border-transparent hover:border-green-600 pb-1"
            >
              Home
            </Link>

            <Link
              href="/catalogo"
              className="text-gray-600 hover:text-green-600 transition-colors duration-300 border-b-2 border-transparent hover:border-green-600 pb-1"
            >
              Catalogo
            </Link>

            <Link
              href="/perfilusuario"
              className="text-gray-600 hover:text-green-600 transition-colors duration-300 border-b-2 border-transparent hover:border-green-600 pb-1"
            >
              Perfil
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Buscar serviços..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (searchTerm.trim() === "") {
                    window.history.replaceState(null, "", "/catalogo");
                  } else {
                    window.history.replaceState(
                      null,
                      "",
                      `/catalogo?search=${searchTerm}`
                    );
                  }
                }
              }}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 hidden md:block"
            />

            <Link href="/login" className="p-2 rounded-xl hover:bg-green-100 transition-all">
              <Image src="/Images/login.png" alt="Login" width={28} height={28} />
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl hover:bg-red-100 transition-all cursor-pointer"
            >
              <Image src="/Images/logout.png" alt="Logout" width={28} height={28} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* BREADCRUMB */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-6 py-6"
      >
        <div className="text-sm text-gray-500 mb-2">
          Home &gt; <span className="text-green-600">Catalogo</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Encontre Profissionais</h1>
        <p className="text-gray-500 mt-1 text-sm">Use os filtros ao lado para refinar sua busca.</p>
      </motion.div>

      {/* LAYOUT */}
      <div className="container mx-auto px-6 pb-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* SIDEBAR */}
        <aside className="md:col-span-1 bg-white p-5 rounded-xl shadow h-fit sticky top-24 space-y-5">
          {/* Categoria */}
          <div>
            <h4 className="font-semibold mb-2">Categoria</h4>
            <input
              type="text"
              placeholder="Pesquisar..."
              value={filtros.categoria}
              onChange={(e) =>
                setFiltros({ ...filtros, categoria: e.target.value })
              }
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <h4 className="font-semibold mb-2">Gênero</h4>

            {["Masculino", "Feminino", "Outro", "Prefiro não informar"].map((g) => (
              <label key={g} className="flex items-center space-x-2 text-sm mb-1">
                <input
                  type="checkbox"
                  checked={filtros.genero.includes(g)}
                  onChange={() => toggleGenero(g)}
                />
                <span>{g}</span>
              </label>
            ))}
          </div>

          <div>
            <h4 className="font-semibold mb-2">Avaliação mínima</h4>

            <input
              type="range"
              min={0}
              max={5}
              step={0.5}
              value={filtros.avaliacaoMin}
              onChange={(e) =>
                setFiltros({
                  ...filtros,
                  avaliacaoMin: Number(e.target.value),
                })
              }
              className="w-full slider-green"
              style={{ background: makeRangeBackground(filtros.avaliacaoMin, 0, 5) }}
            />

            <p className="text-sm text-gray-500 mt-1">
              A partir de ⭐ {filtros.avaliacaoMin.toFixed(1)}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Experiência mínima (anos)</h4>

            <input
              type="range"
              min={0}
              max={30}
              step={1}
              value={filtros.experienciaMin}
              onChange={(e) =>
                setFiltros({
                  ...filtros,
                  experienciaMin: Number(e.target.value),
                })
              }
              className="w-full slider-green"
              style={{ background: makeRangeBackground(filtros.experienciaMin, 0, 30) }}
            />

            <p className="text-sm text-gray-500 mt-1">
              {filtros.experienciaMin} anos ou mais
            </p>
          </div>
        </aside>

        {/* CONTEÚDO */}
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
            {profissionaisFiltrados.map((prof) => (
              <ProfessionalCard key={prof.id} profissional={prof} />
            ))}
          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-black text-gray-300 py-12 mt-12">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <img src="/Images/FazFastLogo_Inv.png" alt="FazFast Logo" className="h-12 mb-4" />
            <p className="text-sm leading-relaxed">
              Plataforma de serviços sob demanda, conectando clientes e profissionais em todo o Brasil com qualidade e confiança.
            </p>
          </div>

          <nav>
            <h4 className="font-semibold mb-4 text-white">Assistência ao Cliente</h4>
            <ul className="space-y-2 text-sm">
              {["Buscar", "Recomendado", "Categorias", "Perguntas Frequentes", "Termos de Uso"].map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-green-600 transition-colors duration-200">
                    {link}
                  </a>
                </li>
              ))}
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
          © {new Date().getFullYear()} <span className="text-white font-semibold">FazFast</span>. Todos os direitos reservados.
        </div>
      </footer>

      <style jsx>{`
        /* Base do track (quando não preenchido) */
        input[type="range"].slider-green {
          -webkit-appearance: none;
          appearance: none;
          height: 8px;
          border-radius: 999px;
          background: #e6e6e6; /* fallback */
          outline: none;
        }

        /* Chrome/Safari/Webkit thumb */
        input[type="range"].slider-green::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #16a34a; /* verde principal */
          border: 3px solid white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          cursor: pointer;
          margin-top: -5px; /* centraliza no track de 8px */
        }

        /* Firefox thumb */
        input[type="range"].slider-green::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #16a34a;
          border: 3px solid white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          cursor: pointer;
        }

        /* Firefox track: keep neutral - actual fill handled by inline background */
        input[type="range"].slider-green::-moz-range-track {
          height: 8px;
          border-radius: 999px;
          background: transparent;
        }

        /* Edge / IE - try to style fallback */
        input[type="range"].slider-green::-ms-fill-lower {
          background: #16a34a;
          border-radius: 999px;
        }
        input[type="range"].slider-green::-ms-fill-upper {
          background: #e6e6e6;
          border-radius: 999px;
        }
      `}</style>
    </div>
  );
};

export default Menu;
