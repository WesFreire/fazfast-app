"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { getUserData } from "@/services/auth";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);

  try {
    console.log("➡️ Iniciando login com:", formData);

    const response = await fetch("http://localhost:8000/api/token/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Erro no login:", errorData);
      setError(errorData.detail || "E-mail ou senha incorretos.");
      return;
    }

    const data = await response.json();
    console.log("✅ Login bem-sucedido:", data);

    // Salva tokens em cookies
    document.cookie = `access=${data.access}; path=/; SameSite=Lax;`;
    document.cookie = `refresh=${data.refresh}; path=/; SameSite=Lax;`;

    // Busca os dados do usuário
    const profileResponse = await fetch("http://localhost:8000/api/me/", {
      headers: { Authorization: `Bearer ${data.access}` },
    });

    if (!profileResponse.ok) {
      console.error("❌ Erro ao buscar perfil:", profileResponse.status);
      setError("Erro ao carregar dados do usuário.");
      return;
    }

    const userData = await profileResponse.json();
    console.log("👤 Dados do usuário:", userData);

    // Redireciona conforme o papel do usuário
    if (userData.papel_ativo === "cliente") {
      router.push("/perfilusuario");
      return;
    }

    if (userData.papel_ativo === "profissional") {
      router.push("/perfilprofissional");
      return;
    }

// Caso padrão
console.log("➡️ Redirecionando para /perfil");
router.push("/perfil");


  } catch (err) {
    console.error("⚠️ Erro de conexão:", err);
    setError("Erro ao conectar ao servidor.");
  }
};



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 font-sans text-gray-800 overflow-x-hidden">
      {/* Main Container */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto px-6 py-16 flex-grow"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          {/* Left Side - Branding */}
          <div className="md:w-1/2 p-10 bg-black text-white flex flex-col justify-center">
            <img src="/Images/FazFastLogo_Inv.png" alt="FazFast Logo" className="h-20 mb-15" />
            <h1 className="text-4xl font-bold mb-4 tracking-tight">
              Bem-vindo de Volta!
            </h1>
            <p className="text-base leading-relaxed max-w-md">
              Entre para conectar-se com os melhores profissionais do Brasil e encontrar serviços incríveis.
            </p>
          </div>

          {/* Right Side - Form */}
          <div className="md:w-1/2 p-10 bg-white">
            <h2 className="text-3xl font-semibold text-gray-900 mb-8">
              Login
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="seu.email@exemplo.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition bg-gray-50 text-gray-800 placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Digite sua senha"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition bg-gray-50 text-gray-800 placeholder-gray-400"
                  required
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-lg shadow-sm"
              >
                Entrar
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Ainda não tem uma conta?
                <Link
                  href="/cadastro"
                  className="ml-2 text-green-600 hover:text-green-700 font-medium transition"
                >
                  Cadastre-se
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link
                href="/esqueci-senha"
                className="text-sm text-gray-500 hover:text-green-600 transition"
              >
                Esqueceu sua senha?
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
