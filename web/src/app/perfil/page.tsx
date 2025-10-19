"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const reviews = [
  { id: 1, nome: "Oscar Cunha", nota: 5, comentario: "Excelente profissional!", data: "2 semanas atrás" },
  { id: 2, nome: "Rachel Andrade", nota: 5, comentario: "Explicações claras e didáticas.", data: "3 semanas atrás" },
  { id: 3, nome: "Eric Braga", nota: 5, comentario: "Super recomendo.", data: "1 mês atrás" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const PerfilProfissional: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-md sticky top-0 z-50"
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Image
            src="/Images/FazFastLogo.png"
            alt="FazFast Logo"
            width={120}
            height={40}
            className="h-10 w-auto"
          />
          <nav className="hidden md:flex space-x-8 font-medium">
            {["Home", "Sobre", "Contato", "Blog"].map((item) => (
              <a
                key={item}
                href="#"
                className="hover:text-green-600 transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Buscar serviços..."
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition"
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
      </motion.header>

      <div className="w-full bg-white">
        {/* Breadcrumb */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="max-w-6xl mx-auto px-4 pt-6 pb-4 text-sm text-gray-500 flex items-center gap-1"
        >
          <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
          <span>›</span>
          <Link href="/menu" className="hover:text-green-600 transition-colors">Educação</Link>
          <span>›</span>
          <span className="text-gray-800 font-medium">Marcelo Pereira da Silva</span>
        </motion.div>

        {/* Top Section */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Foto */}
          <div className="w-full flex justify-center md:justify-start">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative w-72 h-80 rounded-lg overflow-hidden shadow-lg"
            >
              <Image
                src="/Images/DwightProfile.png"
                alt="Foto do Professor"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>

          {/* Informações */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-semibold text-gray-900">
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
                <button className="px-4 py-2 rounded-md border text-gray-700 bg-white hover:bg-gray-50 transition">
                  Presencial
                </button>
                <button className="px-4 py-2 rounded-md border text-white bg-green-600 hover:bg-green-700 transition">
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
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full md:w-auto px-6 py-2 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
                >
                  Contatar
                </motion.button>
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
        </motion.div>

        {/* Introdução */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          className="max-w-6xl mx-auto px-4 py-10"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Introdução</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Olá! Sou o Marcelo, professor de Química dedicado a inspirar e ensinar.
            Graduado pela Universidade de Harvard, com mestrado e doutorado em Química Orgânica,
            trago uma sólida formação acadêmica e anos de experiência em pesquisa e ensino.
          </p>

          <div className="overflow-hidden rounded-lg border border-gray-200 divide-y">
            {[
              ["Detalhe 1", "Informação 1"],
              ["Detalhe 2", "Informação 2"],
              ["Adicional", "Pós-Graduação — Mestrado"],
            ].map(([titulo, info], i) => (
              <div key={i} className="grid grid-cols-2 md:grid-cols-3">
                <div className="px-4 py-3 font-medium text-gray-800 bg-gray-50">{titulo}</div>
                <div className="px-4 py-3 text-gray-600 col-span-1 md:col-span-2 border-l border-gray-200">
                  {info}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Avaliações */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
          className="container mx-auto px-6 mb-12"
        >
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg text-gray-900 font-semibold mb-4">Avaliações</h2>
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

            <div className="space-y-4">
              {reviews.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="border-t pt-4"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-gray-600">{r.nome}</span>
                    <span className="text-yellow-500 text-sm">★★★★★</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-1">{r.comentario}</p>
                  <span className="text-xs text-gray-400">{r.data}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Professores Relacionados */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 }}
          className="container mx-auto px-6 mb-16"
        >
          <h2 className="text-lg text-gray-900 font-semibold mb-4">Professores Relacionados</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl shadow p-4 text-center hover:shadow-lg transition"
              >
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
              </motion.div>
            ))}
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
                Plataforma de serviços sob demanda, conectando clientes e profissionais em todo o Brasil com qualidade e confiança.
              </p>
            </div>

            <nav>
              <h4 className="font-semibold mb-4 text-white">Assistência ao Cliente</h4>
              <ul className="space-y-2 text-sm">
                {["Buscar", "Recomendado", "Categorias", "Perguntas Frequentes", "Termos de Uso"].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-green-600 transition-colors duration-200">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h4 className="font-semibold mb-4 text-white">Conecte-se</h4>
              <div className="flex space-x-4">
                {[
                  { src: "/Images/X_Logo.png", alt: "X (Twitter)" },
                  { src: "/Images/TikTok_Logo.png", alt: "TikTok" },
                  { src: "/Images/Instagram_Logo.png", alt: "Instagram" },
                ].map((social) => (
                  <a
                    key={social.alt}
                    href="#"
                    aria-label={social.alt}
                    className="transition-transform duration-200 hover:scale-110"
                  >
                    <img src={social.src} alt={social.alt} className="h-8 w-8 object-contain" />
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
    </div>
  );
};

export default PerfilProfissional;