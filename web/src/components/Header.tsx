"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const Header: React.FC = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleLogout = () => {
    // Remove tokens de autenticação
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    // Redireciona para login
    router.push("/login");
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && search.trim() !== "") {
      router.push(`/catalogo?search=${encodeURIComponent(search)}`);
    }
  };

  return (
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

        {/* Menu Desktop */}
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
          {/* Link inteligente: leva para perfil de usuário ou profissional dependendo do contexto, 
              mas por padrão vai para usuario que tem o botão de troca */}
          <Link
            href="/perfilusuario"
            className="text-gray-600 hover:text-green-600 transition-colors duration-300 border-b-2 border-transparent hover:border-green-600 pb-1"
          >
            Perfil
          </Link>
        </nav>

        {/* Área da Direita */}
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Buscar serviços..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 hidden md:block"
          />

          <Link
            href="/perfilusuario"
            className="p-2 rounded-xl hover:bg-green-100 transition-all"
            title="Meu Perfil"
          >
            <Image
              src="/Images/login.png" // Usando o ícone que você indicou como login para ir ao perfil
              alt="Perfil"
              width={28}
              height={28}
              className="opacity-80 hover:opacity-100 transition"
            />
          </Link>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl hover:bg-red-100 transition-all cursor-pointer"
            title="Sair"
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
  );
};

export default Header;