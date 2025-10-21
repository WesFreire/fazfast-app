"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { useRouter } from "next/navigation";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
};

const buttonVariants: Variants = {
  hover: { scale: 1.05, boxShadow: "0 8px 25px rgba(34, 197, 94, 0.3)" },
  tap: { scale: 0.95 },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const orders = [
  { id: 1, title: "Aula de Química Orgânica", provider: "Marcelo Pereira", status: "Concluído", date: "10/10/2025" },
  { id: 2, title: "Consultoria de Física", provider: "Ana Souza", status: "Em Andamento", date: "15/10/2025" },
];

const services = [
  { id: 1, title: "Aulas de Química Online", category: "Educação", price: "R$ 50/h", status: "Ativo" },
  { id: 2, title: "Consultoria em Química Orgânica", category: "Educação", price: "R$ 80/h", status: "Ativo" },
];

const reviews = [
  { id: 1, nome: "Oscar Cunha", nota: 5, comentario: "Excelente profissional!", data: "2 semanas atrás" },
  { id: 2, nome: "Rachel Andrade", nota: 5, comentario: "Explicações claras e didáticas.", data: "3 semanas atrás" },
];

const PerfilUsuario: React.FC = () => {
  const router = useRouter();
  const [mode, setMode] = useState<"cliente" | "profissional">("cliente");
  const [formData, setFormData] = useState({
    name: "João Silva",
    email: "joao.silva@exemplo.com",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "E-mail é obrigatório.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "E-mail inválido.";
    }
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres.";
    }
    if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Perfil atualizado:", formData);
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      setErrors({ submit: "Erro ao atualizar perfil. Tente novamente." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStars = (nota: number) => {
    return "★".repeat(nota) + "☆".repeat(5 - nota);
  };

  const statusColors = {
    Concluído: "text-green-600",
    "Em Andamento": "text-blue-600",
    Ativo: "text-green-600",
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
            {["Home", "Catálogo", "Perfil"].map((item) => (
              <Link
                key={item}
                href="#"
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
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent hidden md:block"
            />
          </div>
        </div>
      </motion.header>

      {/* Offset for fixed header */}
      <div className="h-20"></div>

      {/* Profile Section */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-6 py-12 w-full"
      >
        {/* Toggle Mode */}
        <motion.div variants={fadeInUp} className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 flex justify-center space-x-4 mb-12 border border-white/20">
          {["cliente", "profissional"].map((tipo) => (
            <motion.button
              key={tipo}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className={`px-8 py-3 rounded-2xl font-semibold transition-all duration-300 relative overflow-hidden group ${
                mode === tipo 
                  ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setMode(tipo as "cliente" | "profissional")}
            >
              {mode === tipo && (
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 opacity-20 animate-pulse" />
              )}
              <span className="relative z-10">{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Cliente Section */}
        {mode === "cliente" && (
          <motion.div 
            variants={staggerContainer} 
            initial="hidden" 
            animate="visible" 
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-gray-900 mb-2">Perfil do Cliente</motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-600 mb-12">Gerencie suas informações e acompanhe seus pedidos.</motion.p>
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Formulário */}
              <motion.form onSubmit={handleProfileUpdate} variants={cardVariants} className="space-y-6">
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700">Nome Completo</label>
                  <input 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-0 transition-all duration-300 bg-gray-50/50 text-gray-800 placeholder-gray-500 ${
                      errors.name 
                        ? "border-red-300 focus:border-red-500" 
                        : "border-gray-200 focus:border-green-500"
                    }`} 
                  />
                  {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700">E-mail</label>
                  <input 
                    name="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    type="email" 
                    className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-0 transition-all duration-300 bg-gray-50/50 text-gray-800 placeholder-gray-500 ${
                      errors.email 
                        ? "border-red-300 focus:border-red-500" 
                        : "border-gray-200 focus:border-green-500"
                    }`} 
                  />
                  {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4 space-y-1">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700">Nova Senha</label>
                    <input 
                      name="password" 
                      type="password" 
                      placeholder="Nova senha" 
                      value={formData.password} 
                      onChange={handleInputChange} 
                      className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-0 transition-all duration-300 bg-gray-50/50 text-gray-800 placeholder-gray-500 ${
                        errors.password 
                          ? "border-red-300 focus:border-red-500" 
                          : "border-gray-200 focus:border-green-500"
                      }`} 
                    />
                    {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700">Confirmar Senha</label>
                    <input 
                      name="confirmPassword" 
                      type="password" 
                      placeholder="Confirmar" 
                      value={formData.confirmPassword} 
                      onChange={handleInputChange} 
                      className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-0 transition-all duration-300 bg-gray-50/50 text-gray-800 placeholder-gray-500 ${
                        errors.confirmPassword 
                          ? "border-red-300 focus:border-red-500" 
                          : "border-gray-200 focus:border-green-500"
                      }`} 
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
                  </div>
                </div>
                {errors.submit && <p className="text-red-500 text-sm text-center">{errors.submit}</p>}
                <motion.button 
                  variants={buttonVariants} 
                  whileHover="hover" 
                  whileTap="tap" 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-lg transition-all duration-300"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Atualizando...
                    </span>
                  ) : (
                    "Atualizar Perfil"
                  )}
                </motion.button>
              </motion.form>

              {/* Histórico */}
              <motion.div variants={cardVariants}>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Histórico de Pedidos</h3>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <motion.div
                      key={order.id}
                      variants={cardVariants}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="p-6 bg-gray-50/50 rounded-2xl border border-gray-200 cursor-pointer hover:border-green-500 transition-all duration-300 shadow-sm"
                    >
                      <h4 className="font-semibold text-gray-900 mb-1">{order.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">Prestador: {order.provider}</p>
                      <div className="flex justify-between items-center">
                        <span className={`text-sm font-medium ${statusColors[order.status as keyof typeof statusColors] || "text-gray-500"}`}>
                          {order.status}
                        </span>
                        <span className="text-xs text-gray-500">{order.date}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Profissional Section */}
        {mode === "profissional" && (
          <motion.div 
            variants={staggerContainer} 
            initial="hidden" 
            animate="visible" 
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-gray-900 mb-2">Perfil Profissional</motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-600 mb-12">Mostre seu talento e atraia mais clientes.</motion.p>
            <div className="grid lg:grid-cols-3 gap-12 mb-12">
              {/* Info */}
              <motion.div variants={cardVariants} className="lg:col-span-2">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">{formData.name}</h3>
                    <div className="text-yellow-500 text-2xl mb-3">{getStars(5)}</div>
                    <p className="text-gray-600 mb-4">Professor(a) de Química</p>
                    <p className="text-sm text-gray-700 leading-relaxed max-w-md">
                      Sou um professor apaixonado por ensinar. Transformo química em algo fácil e envolvente!
                    </p>
                  </div>
                  <motion.button 
                    variants={buttonVariants} 
                    whileHover="hover" 
                    whileTap="tap" 
                    onClick={() => router.push("/criar-servico")} 
                    className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:from-green-700 hover:to-green-800 transition-all duration-300"
                  >
                    Criar Novo Serviço
                  </motion.button>
                </div>
              </motion.div>

              {/* Foto */}
              <motion.div variants={cardVariants} className="relative w-64 h-64 mx-auto lg:mx-0 rounded-full overflow-hidden shadow-2xl border-4 border-white">
                <Image src="/Images/DwightProfile.png" alt="Foto do Profissional" fill className="object-cover" />
              </motion.div>
            </div>

            {/* Serviços */}
            <motion.div variants={cardVariants}>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Seus Serviços</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {services.map((service) => (
                  <motion.div
                    key={service.id}
                    variants={cardVariants}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="p-6 bg-gray-50/50 rounded-2xl border border-gray-200 cursor-pointer hover:border-green-500 transition-all duration-300 shadow-sm"
                  >
                    <h4 className="font-semibold text-gray-900 mb-2">{service.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{service.category}</p>
                    <p className={`text-lg font-bold ${statusColors[service.status as keyof typeof statusColors] || "text-gray-800"}`}>
                      {service.price}
                    </p>
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mt-2 ${statusColors[service.status as keyof typeof statusColors] || "bg-gray-200"}`}>
                      {service.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Avaliações */}
            <motion.div variants={cardVariants} className="mt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Avaliações</h3>
              <div className="space-y-6">
                {reviews.map((review) => (
                  <motion.div 
                    key={review.id} 
                    variants={cardVariants}
                    whileHover={{ x: 10 }}
                    className="p-6 bg-gray-50/50 rounded-2xl border border-gray-200 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="font-semibold text-gray-900">{review.nome}</span>
                      <span className="text-yellow-500 text-lg">{getStars(review.nota)}</span>
                    </div>
                    <p className="text-gray-700 mb-3">{review.comentario}</p>
                    <span className="text-xs text-gray-500">{review.data}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>

     {/* Footer */}
      <footer className="bg-black text-gray-300 py-12 mt-12">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Logo & Description */}
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

          {/* Links */}
          <nav>
            <h4 className="font-semibold mb-4 text-white">Assistência ao Cliente</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-green-600 transition-colors duration-200">Buscar</a></li>
              <li><a href="#" className="hover:text-green-600 transition-colors duration-200">Recomendado</a></li>
              <li><a href="#" className="hover:text-green-600 transition-colors duration-200">Categorias</a></li>
              <li><a href="#" className="hover:text-green-600 transition-colors duration-200">Perguntas Frequentes</a></li>
              <li><a href="#" className="hover:text-green-600 transition-colors duration-200">Termos de Uso</a></li>
            </ul>
          </nav>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Conecte-se</h4>
            <div className="flex space-x-4">
              <a href="#" aria-label="X (Twitter)" className="transition-transform hover:scale-110">
                <img src="/Images/X_Logo.png" alt="X" className="h-8 w-8 object-contain" />
              </a>
              <a href="#" aria-label="TikTok" className="transition-transform hover:scale-110">
                <img src="/Images/TikTok_Logo.png" alt="TikTok" className="h-8 w-8 object-contain" />
              </a>
              <a href="#" aria-label="Instagram" className="transition-transform hover:scale-110">
                <img src="/Images/Instagram_Logo.png" alt="Instagram" className="h-8 w-8 object-contain" />
              </a>
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

export default PerfilUsuario;