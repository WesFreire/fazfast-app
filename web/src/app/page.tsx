"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

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
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = 200;
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 overflow-x-hidden">
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
            Conectamos você aos melhores profissionais do Brasil para todos os
            tipos de serviços.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="bg-green-600 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-green-700 transition"
          >
            Explorar Serviços
          </motion.button>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Pesquisar por categoria
          </h2>
          <div className="relative">
            <button
              onClick={() => scroll("left")}
              className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-white shadow p-2 rounded-full hover:bg-gray-100 z-10"
            >
              ◀
            </button>

            <motion.div
              ref={sliderRef}
              className="flex space-x-6 overflow-x-hidden scrollbar-hide scroll-smooth"
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

      {/* Professionals Grid */}
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
                  className="hover:text-green-600 transition-colors duration-300"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {Array.from({ length: 8 }).map((_, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -5, boxShadow: "0 10px 15px rgba(0,0,0,0.1)" }}
                className="bg-white rounded-xl shadow transition p-6 text-center"
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
                  Marcello Pereira Araujo
                </h3>
                <p className="text-sm text-gray-500">Profissional</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="mt-4 bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition"
                >
                  Contratar
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-black text-gray-300 py-12 mt-12">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
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
          <nav>
            <h4 className="font-semibold mb-4 text-white">
              Assistência ao Cliente
            </h4>
            <ul className="space-y-2 text-sm">
              {["Buscar", "Recomendado", "Categorias", "Perguntas Frequentes", "Termos de Uso"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="hover:text-green-600 transition-colors duration-300"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h4 className="font-semibold mb-4 text-white">Conecte-se</h4>
            <div className="flex space-x-4">
              {[
                { alt: "X", img: "/Images/X_Logo.png" },
                { alt: "TikTok", img: "/Images/TikTok_Logo.png" },
                { alt: "Instagram", img: "/Images/Instagram_Logo.png" },
              ].map((social) => (
                <a
                  key={social.alt}
                  href="#"
                  aria-label={social.alt}
                  className="transition-transform duration-300 hover:scale-110"
                >
                  <img
                    src={social.img}
                    alt={social.alt}
                    className="h-8 w-8 object-contain"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()}{" "}
          <span className="text-white font-semibold">FazFast</span>. Todos os
          direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default FazFastHome;