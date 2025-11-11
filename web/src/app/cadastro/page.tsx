"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const CadastroPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    papel: "cliente", // valor padrão
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          password2: formData.confirmPassword,
          papel: formData.papel,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Usuário criado com sucesso!");
        router.push("/login");
      } else {
        console.error("Erro:", data);
        const errorMessage =
          data.detail ||
          Object.values(data).flat().join("\n") ||
          "Erro ao criar conta. Verifique os dados e tente novamente.";
        alert(errorMessage);
      }
    } catch (error) {
      console.error("Erro de conexão:", error);
      alert("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 font-sans text-gray-800 overflow-x-hidden">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto px-6 py-16 flex-grow"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          {/* Lado esquerdo */}
          <div className="md:w-1/2 p-10 bg-black text-white flex flex-col justify-center">
            <img
              src="/Images/FazFastLogo_Inv.png"
              alt="FazFast Logo"
              className="h-20 mb-15"
            />
            <h1 className="text-4xl font-bold mb-4 tracking-tight">
              Junte-se ao FazFast!
            </h1>
            <p className="text-base leading-relaxed max-w-md">
              Crie sua conta e comece a oferecer ou contratar serviços de forma
              rápida, segura e confiável!
            </p>
          </div>

          {/* Lado direito */}
          <div className="md:w-1/2 p-10 bg-white">
            <h2 className="text-3xl font-semibold text-gray-900 mb-8">
              Criar Conta
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome de usuário */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nome de Usuário
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Seu nome de usuário"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition bg-gray-50 text-gray-800"
                  required
                />
              </div>

              {/* Email */}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition bg-gray-50 text-gray-800"
                  required
                />
              </div>

              {/* Papel */}
              <div>
                <label
                  htmlFor="papel"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tipo de Conta
                </label>
                <select
                  id="papel"
                  name="papel"
                  value={formData.papel}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-gray-800"
                  required
                >
                  <option value="cliente">Cliente</option>
                  <option value="profissional">Profissional</option>
                </select>
              </div>

              {/* Senha */}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition bg-gray-50 text-gray-800"
                  required
                />
              </div>

              {/* Confirmar Senha */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirme sua senha"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition bg-gray-50 text-gray-800"
                  required
                />
              </div>

              {/* Botão */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-lg shadow-sm disabled:opacity-70"
              >
                {loading ? "Cadastrando..." : "Cadastrar"}
              </motion.button>
            </form>

            {/* Link para login */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Já tem uma conta?
                <Link
                  href="/login"
                  className="ml-2 text-green-600 hover:text-green-700 font-medium transition"
                >
                  Faça login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CadastroPage;
