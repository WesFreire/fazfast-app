"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { useRouter } from "next/navigation";

// --- Animações ---
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

// Dados mock de pedidos
const orders = [
  { id: 1, title: "Aula de Química Orgânica", provider: "Marcelo Pereira", status: "Concluído", date: "10/10/2025" },
  { id: 2, title: "Consultoria de Física", provider: "Ana Souza", status: "Em Andamento", date: "15/10/2025" },
];

const PerfilUsuario: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Estado do formulário
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    // URL para exibição (preview)
    profileImageUrl: "/Images/DwightProfile.png", 
    // Arquivo real para upload (File object)
    profileImageFile: null as File | null, 
  });

  // --- 1. BUSCA DE DADOS ---
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/api/me/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          
          // Monta o nome completo baseado no first_name e last_name do Django
          const fullName = `${data.first_name || ""} ${data.last_name || ""}`.trim();

          setFormData((prev) => ({
            ...prev,
            name: fullName || data.username, // Fallback para username se não tiver nome
            username: data.username,
            email: data.email,
            // Se vier imagem do backend, usa ela. Se não, usa a padrão.
            // Nota: O Django geralmente retorna a URL relativa (ex: /media/perfil/foto.jpg) ou absoluta dependendo da config.
            profileImageUrl: data.foto_perfil ? `http://localhost:8000${data.foto_perfil}` : "/Images/DwightProfile.png",
            profileImageFile: null
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar perfil", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  // --- 2. MANIPULAÇÃO DE INPUTS ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpa erro ao digitar
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // --- 3. UPLOAD DE IMAGEM (PREVIEW) ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 1. Salva o arquivo real para enviar ao backend depois
      setFormData((prev) => ({ 
        ...prev, 
        profileImageFile: file,
        // 2. Cria URL temporária apenas para mostrar na tela agora
        profileImageUrl: URL.createObjectURL(file) 
      }));
    }
  };

  // --- 4. SALVAR DADOS (PATCH) ---
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Validação simples de senha
    if (formData.password && formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: "As senhas não coincidem." });
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      
      // IMPORTANTE: Usamos FormData para enviar arquivos + texto
      const dataToSend = new FormData();

      // Divide o nome novamente para enviar ao Django
      const nameParts = formData.name.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ");

      dataToSend.append("first_name", firstName);
      dataToSend.append("last_name", lastName);
      dataToSend.append("email", formData.email);

      // Só envia senha se o usuário digitou algo
      if (formData.password) {
        dataToSend.append("password", formData.password);
      }

      // Só envia imagem se o usuário selecionou uma nova
      if (formData.profileImageFile) {
        dataToSend.append("foto_perfil", formData.profileImageFile);
      }

      const response = await fetch("http://localhost:8000/api/me/", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          // NÃO defina "Content-Type": "application/json" aqui.
          // O navegador define automaticamente "multipart/form-data" quando vê FormData.
        },
        body: dataToSend,
      });

      if (response.ok) {
        const updatedData = await response.json();
        setEditMode(false);
        // Atualiza a imagem final com a resposta do servidor para garantir sincronia
        if (updatedData.foto_perfil) {
             setFormData(prev => ({ ...prev, profileImageUrl: `http://localhost:8000${updatedData.foto_perfil}` }));
        }
      } else {
        const errorData = await response.json();
        console.error("Erro no backend:", errorData);
        setErrors({ submit: "Erro ao atualizar. Verifique os dados." });
      }
    } catch (error) {
      setErrors({ submit: "Erro de conexão com o servidor." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    router.push("/login");
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      Concluído: "bg-green-100 text-green-800",
      "Em Andamento": "bg-yellow-100 text-yellow-800",
      "Cancelado": "bg-red-100 text-red-800",
    };
    return <span className={`px-3 py-1 text-xs font-medium rounded-full ${styles[status] || "bg-gray-100"}`}>{status}</span>;
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-10 w-10 border-4 border-green-500 rounded-full border-t-transparent"></div></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 font-sans text-gray-800 overflow-x-hidden">

      {/* Header Simplificado */}
      <motion.header initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} className="bg-white/90 shadow-lg sticky top-0 z-50 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/"><Image src="/Images/FazFastLogo.png" alt="Logo" width={140} height={35} /></Link>
          <div className="flex items-center gap-4">
            <button onClick={handleLogout} className="text-red-500 font-medium hover:bg-red-50 px-4 py-2 rounded-lg transition">Sair</button>
          </div>
        </div>
      </motion.header>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-5xl mx-auto px-6 py-12">

        {/* Botão Perfil Profissional */}
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={() => router.push("/perfilprofissional")}
          className="mb-12 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition"
        >
          Ver Perfil Profissional
        </motion.button>

        {/* Card Principal */}
        <motion.div variants={cardVariants} className="bg-white rounded-3xl shadow-xl p-8 relative">
          
          <div className="absolute top-8 right-8">
            <button 
                onClick={() => setEditMode(!editMode)} 
                className="p-2 text-green-600 hover:bg-green-50 rounded-full transition"
                title={editMode ? "Cancelar Edição" : "Editar Perfil"}
            >
                {editMode ? (
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                )}
            </button>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-8">Perfil do Cliente</h2>

          {editMode ? (
            /* FORMULÁRIO DE EDIÇÃO */
            <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-lg mx-auto">
              
              {/* Upload de Imagem */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-green-100 shadow-md">
                  <Image 
                    src={formData.profileImageUrl} 
                    alt="Profile" 
                    fill 
                    className="object-cover" 
                    unoptimized // Necessário se a imagem vier do localhost sem config no next.config.js
                  />
                </div>
                <label className="cursor-pointer px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium hover:bg-green-100 transition">
                  Alterar Foto
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>

              {/* Campos de Texto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
                  <input
                    name="password"
                    type="password"
                    placeholder="******"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Senha</label>
                  <input
                    name="confirmPassword"
                    type="password"
                    placeholder="******"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
                  />
                </div>
              </div>
              
              {errors.confirmPassword && <p className="text-red-500 text-sm text-center">{errors.confirmPassword}</p>}
              {errors.submit && <p className="text-red-500 text-sm text-center">{errors.submit}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-green-600 text-white rounded-lg font-bold shadow-md hover:bg-green-700 transition disabled:opacity-70"
              >
                {isSubmitting ? "Salvando..." : "Salvar Alterações"}
              </button>
            </form>
          ) : (
            /* VISUALIZAÇÃO (Leitura) */
            <div className="text-center space-y-6">
                <div className="relative h-40 w-40 mx-auto rounded-full overflow-hidden border-4 border-white shadow-2xl">
                  <Image 
                    src={formData.profileImageUrl} 
                    alt="Profile" 
                    fill 
                    className="object-cover" 
                    unoptimized 
                  />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-gray-900">{formData.name}</h3>
                    <p className="text-gray-500">@{formData.username}</p>
                    <p className="text-gray-600 mt-2">{formData.email}</p>
                </div>
            </div>
          )}
        </motion.div>

        {/* Histórico */}
        <motion.div variants={cardVariants} className="bg-white rounded-3xl shadow-xl p-8 mt-12">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Histórico de Pedidos</h3>
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="p-5 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center hover:shadow-md transition">
                <div>
                  <h4 className="font-semibold text-gray-900">{order.title}</h4>
                  <p className="text-sm text-gray-500">{order.provider} • {order.date}</p>
                </div>
                {statusBadge(order.status)}
              </div>
            ))}
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default PerfilUsuario;