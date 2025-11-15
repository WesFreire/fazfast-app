"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { useRouter } from "next/navigation";

// Animações
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2, delayChildren: 0.1 } },
};

const buttonVariants: Variants = {
  hover: { scale: 1.05, boxShadow: "0 8px 25px rgba(34, 197, 94, 0.3)" },
  tap: { scale: 0.95 },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// Dados mock
const orders = [
  { id: 1, title: "Aula de Química Orgânica", provider: "Marcelo Pereira", status: "Concluído", date: "10/10/2025" },
  { id: 2, title: "Consultoria de Física", provider: "Ana Souza", status: "Em Andamento", date: "15/10/2025" },
  { id: 3, title: "Consultoria de Matemática", provider: "Suzane Louise", status: "Cancelado", date: "15/10/2025" },
];

const PerfilUsuario: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "João Silva",
    email: "joao.silva@exemplo.com",
    password: "",
    confirmPassword: "",
    profileImage: "/Images/DwightProfile.png",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório.";
    if (!formData.email.trim()) newErrors.email = "E-mail é obrigatório.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "E-mail inválido.";
    if (formData.password && formData.password.length < 6) newErrors.password = "Senha deve ter pelo menos 6 caracteres.";
    if (formData.password && formData.password !== formData.confirmPassword) newErrors.confirmPassword = "As senhas não coincidem.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profileImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Perfil atualizado:", formData);
      setEditMode(false);
    } catch (error) {
      setErrors({ submit: "Erro ao atualizar perfil." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      Concluído: "bg-green-100 text-green-800",
      "Em Andamento": "bg-yellow-100 text-yellow-800",
      "Cancelado": "bg-red-100 text-red-800",
      Ativo: "bg-green-100 text-green-800",
      Encerrado: "bg-red-100 text-red-800",
    };
    return <span className={`px-3 py-1 text-xs font-medium rounded-full ${styles[status] || "bg-gray-100 text-gray-700"}`}>{status}</span>;
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

            {/* Login Icon */}
            <Link
              href="/login"
              className="p-2 rounded-xl hover:bg-green-100 transition-all"
            >
              <Image src="/Images/login.png" alt="Login" width={28} height={28} className="opacity-80 hover:opacity-100 transition" />
            </Link>

            {/* Logout Icon */}
            <button
              onClick={() => console.log("Logout clicked")}
              className="p-2 rounded-xl hover:bg-red-100 transition-all"
            >
              <Image src="/Images/logout.png" alt="Logout" width={28} height={28} className="opacity-80 hover:opacity-100 transition" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-7xl mx-auto px-6 py-12">
        {/* Switch to Professional Profile */}
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={() => router.push("/perfilprofissional")}
          className="mb-12 px-8 py-3 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-all duration-300"
        >
          Ver Perfil Profissional
        </motion.button>

        {/* Perfil do Cliente */}
        <motion.div variants={cardVariants} className="bg-white rounded-3xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Perfil do Cliente</h2>
            <motion.button
              onClick={() => setEditMode(!editMode)}
              whileHover={{ scale: 1.1 }}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </motion.button>
          </div>
          <p className="text-gray-600 mb-8">Gerencie suas informações pessoais e configurações.</p>

          {editMode ? (
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="flex justify-center mb-4">
                <div className="relative h-32 w-32 rounded-full overflow-hidden shadow-lg border-4 border-green-100">
                  <Image src={formData.profileImage} alt="Foto de Perfil" fill className="object-cover" />
                </div>
              </div>
              <div className="text-center mb-4">
                <label htmlFor="profileImage" className="cursor-pointer text-green-600 hover:text-green-700 font-medium">
                  Alterar Foto
                </label>
                <input id="profileImage" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <input name="name" value={formData.name} onChange={handleInputChange} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition bg-gray-50 ${errors.name ? "border-red-500" : "border-gray-300"}`} required />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <input name="email" type="email" value={formData.email} onChange={handleInputChange} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition bg-gray-50 ${errors.email ? "border-red-500" : "border-gray-300"}`} required />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
                  <input name="password" type="password" value={formData.password} onChange={handleInputChange} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition bg-gray-50 ${errors.password ? "border-red-500" : "border-gray-300"}`} />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Senha</label>
                  <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition bg-gray-50 ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`} />
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>
              {errors.submit && <p className="text-red-500 text-sm text-center">{errors.submit}</p>}
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-medium text-lg shadow-sm disabled:opacity-50 transition"
              >
                {isSubmitting ? "Salvando..." : "Salvar Alterações"}
              </motion.button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="relative h-32 w-32 mx-auto rounded-full overflow-hidden shadow-lg border-4 border-green-100">
                <Image src={formData.profileImage} alt="Foto de Perfil" fill className="object-cover" />
              </div>
              <p className="text-xl font-semibold text-gray-900">{formData.name}</p>
              <p className="text-gray-600">{formData.email}</p>
            </div>
          )}
        </motion.div>

        {/* Histórico de Pedidos */}
        <motion.div variants={cardVariants} className="bg-white rounded-3xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Histórico de Pedidos
          </h3>
          <div className="space-y-4">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                variants={cardVariants}
                whileHover={{ scale: 1.02, boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}
                className="p-6 bg-gray-50 rounded-2xl shadow-sm border border-gray-200 transition"
              >
                <h4 className="font-semibold text-gray-900 mb-1">{order.title}</h4>
                <p className="text-sm text-gray-600 mb-2">Prestador: {order.provider}</p>
                <div className="flex justify-between items-center">
                  {statusBadge(order.status)}
                  <span className="text-sm text-gray-500">{order.date}</span>
                </div>
              </motion.div>
            ))}
            {orders.length === 0 && <p className="text-center text-gray-500">Nenhum pedido encontrado.</p>}
          </div>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <footer className="bg-black text-gray-300 py-12 mt-auto">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <Image src="/Images/FazFastLogo_Inv.png" alt="FazFast Logo" width={160} height={40} className="h-12 mb-4" />
            <p className="text-sm leading-relaxed">
              Plataforma de serviços sob demanda, conectando clientes e profissionais em todo o Brasil com qualidade e confiança.
            </p>
          </div>
          <nav>
            <h4 className="font-semibold mb-4 text-white">Assistência ao Cliente</h4>
            <ul className="space-y-2 text-sm">
              {["Buscar", "Recomendado", "Categorias", "Perguntas Frequentes", "Termos de Uso"].map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-green-400 transition-colors duration-300">
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
                  <Image
                    src={social.img}
                    alt={social.alt}
                    width={32}
                    height={32}
                    className="h-8 w-8 object-contain"
                  />
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

export default PerfilUsuario;