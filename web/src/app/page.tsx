"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const FazFastHome: React.FC = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const sliderRef = useRef<HTMLDivElement>(null);
  const [profissionais, setProfissionais] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [filtro, setFiltro] = useState("Destaques");

  const ordenarProfissionais = () => {
    let lista = [...profissionais];

    if (filtro === "Destaques") {
      return lista.sort((a, b) => b.avaliacao_media - a.avaliacao_media);
    }

    if (filtro === "Novos") {
      return lista.sort(
        (a, b) =>
          new Date(b.data_criacao).getTime() - new Date(a.data_criacao).getTime()
      );
    }

    if (filtro === "Populares") {
      return lista.sort((a, b) => b.total_servicos - a.total_servicos);
    }

    return lista;
  };

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = 200;
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/profissionais/");
        const data = await res.json();

        const dadosFormatados = data.map((prof: any) => ({
          ...prof,
          avaliacao_media: prof.avaliacao_media ?? 0,
          total_servicos: prof.total_servicos ?? 0,
          data_criacao: prof.data_criacao ?? new Date().toISOString(),
        }));

        setProfissionais(dadosFormatados);
      } catch (err) {
        console.error("Erro ao carregar profissionais:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    router.push("/login");
  };

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
            <Image
              src="/Images/FazFastLogo.png"
              alt="FazFast Logo"
              width={160}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && search.trim() !== "") {
                  router.push(`/catalogo?search=${encodeURIComponent(search)}`);
                }
              }}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 hidden md:block"
            />

            <Link href="/login" className="p-2 rounded-xl hover:bg-green-100 transition-all">
              <Image
                src="/Images/login.png"
                alt="Login"
                width={28}
                height={28}
                className="opacity-80 hover:opacity-100 transition"
              />
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl hover:bg-red-100 transition-all cursor-pointer"
            >
              <Image
                src="/Images/logout.png"
                alt="Logout"
                width={28}
                height={28}
                className="opacity-80 hover:opacity-100 transition"
              />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center text-center text-white overflow-hidden">
        <motion.img
          src="/Images/Header.gif"
          alt="Header Banner"
          className="absolute top-0 left-0 w-full h-full object-cover scale-105"
          initial={{ scale: 1 }}
          animate={{ scale: 1.1 }}
          transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-green-900/40" />
        <motion.div
          className="relative z-10 px-6"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Simplesmente Rápido: Onde Suas Necessidades Ganham Vida!
          </h1>
          <p className="max-w-2xl mx-auto mb-6 text-lg">
            Conectamos você aos melhores profissionais do Brasil para todos os tipos de serviços.
          </p>

          <Link href="/catalogo">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="bg-green-600 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-green-700 transition inline-block cursor-pointer"
            >
              Explorar Serviços
            </motion.div>
          </Link>
        </motion.div>
      </section>

      {/* Category Slider */}
      <motion.section
        className="bg-white py-12"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Pesquisar por categoria</h2>

          <div className="relative">
            <button
              onClick={() => scroll("left")}
              className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-white shadow p-2 rounded-full hover:bg-gray-100 z-10"
            >
              ◀
            </button>

            <motion.div
              ref={sliderRef}
              className="flex space-x-6 overflow-x-hidden overflow-y-hidden scrollbar-hide scroll-smooth"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {[
                { name: "Culinária", img: "/Images/Culinaria.png" },
                { name: "Automotivo", img: "/Images/Automotivo.png" },
                { name: "Domésticos", img: "/Images/Domesticos.png" },
                { name: "Gerais", img: "/Images/Gerais.png" },
                { name: "Digital", img: "/Images/Digitais.png" },
                { name: "Educação", img: "/Images/Educação.png" },
              ].map((cat, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => router.push(`/catalogo?categoria=${encodeURIComponent(cat.name)}`)}
                  className="flex flex-col items-center bg-gray-100 rounded-xl p-6 hover:bg-gray-200 hover:shadow-md transition cursor-pointer min-w-[200px]"
                >
                  <img src={cat.img} alt={cat.name} className="w-7 h-7 mb-3" />
                  <span className="text-sm font-medium">{cat.name}</span>
                </motion.div>
              ))}
            </motion.div>

            <button
              onClick={() => scroll("right")}
              className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white shadow p-2 rounded-full hover:bg-gray-100 z-10"
            >
              ▶
            </button>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="bg-gray-50 py-12"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
      >
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Profissionais em destaque</h2>

            <div className="space-x-6 text-sm text-gray-600">
              {["Destaques", "Novos", "Populares"].map((item) => (
                <button
                  key={item}
                  onClick={() => setFiltro(item)}
                  className={`cursor-pointer hover:text-green-600 transition-colors duration-300 ${
                    filtro === item ? "text-green-600 font-semibold" : ""
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <p className="text-gray-600 text-center">Carregando...</p>
          ) : (
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {ordenarProfissionais().map((prof) => (
                <motion.div
                  key={prof.id}
                  variants={fadeInUp}
                  whileHover={{ y: -5, boxShadow: "0 10px 15px rgba(0,0,0,0.1)" }}
                  className="bg-white rounded-xl shadow transition p-6 text-center cursor-pointer"
                >
                  <img
                    src={
                      prof?.usuario?.foto_perfil
                        ? prof.usuario.foto_perfil
                        : "/Images/DwightProfile.png"
                    }
                    alt={prof.usuario?.username || "Profissional"}
                    className="mx-auto mb-4 rounded-[25%] w-24 h-24 object-cover"
                  />

                  <div className="flex justify-center items-center mb-2">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1 text-gray-600 text-sm">
                      {prof.avaliacao_media || "5.0"}
                    </span>
                  </div>

                  <h3 className="font-semibold text-lg">
                    {prof.usuario?.username || "Profissional"}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {prof.especialidades?.join(", ") || "Profissional"}
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="mt-4 bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition cursor-pointer"
                  >
                    Contratar
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Footer */}
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
                  <a href="#" className="hover:text-green-600 transition-colors duration-300">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h4 className="font-semibold mb-4 text-white">Conecte-se</h4>
            <div className="flex space-x-4">
              {[{ alt: "X", img: "/Images/X_Logo.png" }, { alt: "TikTok", img: "/Images/TikTok_Logo.png" }, { alt: "Instagram", img: "/Images/Instagram_Logo.png" }].map((social) => (
                <a key={social.alt} href="#" aria-label={social.alt} className="transition-transform duration-300 hover:scale-110">
                  <img src={social.img} alt={social.alt} className="h-8 w-8 object-contain" />
                </a>
              ))}
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

export default FazFastHome;
