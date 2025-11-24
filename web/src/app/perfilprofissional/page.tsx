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

// --- Interfaces de Tipagem ---
interface ServiceData {
  id: number;
  nome: string;
  categoria: number | null;
  preco: string;
  tipo_preco: string;
  is_ativo: boolean;
  prazo_estimado_minutos?: number;
  profissional: {
    usuario: {
      id: number;
    };
  };
}

interface ReviewData {
  id: number;
  nota: number;
  comentario: string;
  criado_em: string;
  avaliador: number | null;
  avaliado: number | null;
}

const PerfilProfissional: React.FC = () => {
  const router = useRouter();
  
  // --- Estados ---
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // IDs para referência
  const [userId, setUserId] = useState<number | null>(null);
  const [professionalId, setProfessionalId] = useState<number | null>(null);

  // Dados do Usuário/Perfil
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    category: "", // Apenas visualização (especialidades)
    password: "",
    confirmPassword: "",
    profileImageUrl: "/Images/DwightProfile.png",
    profileImageFile: null as File | null,
  });

  // Listas de dados
  const [services, setServices] = useState<ServiceData[]>([]);
  const [reviews, setReviews] = useState<ReviewData[]>([]);

  // --- 1. BUSCA DE DADOS (GET) ---
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const headers = { Authorization: `Bearer ${token}` };

        // A) Usuário
        const userResponse = await fetch("http://localhost:8000/api/me/", { headers });
        if (!userResponse.ok) throw new Error("Falha ao carregar usuário");
        const userData = await userResponse.json();
        setUserId(userData.id);

        // B) Profissional (encontra o perfil vinculado ao usuário)
        const profResponse = await fetch("http://localhost:8000/api/profissionais/", { headers });
        const allProfs = await profResponse.json();
        const myProf = allProfs.find((p: any) => p.usuario.id === userData.id);

        if (myProf) {
          setProfessionalId(myProf.id);
        }

        // C) Serviços (filtra apenas os meus)
        const servicesResponse = await fetch("http://localhost:8000/api/servicos/", { headers });
        const allServices = await servicesResponse.json();
        // Filtro seguro verificando se a estrutura existe
        const myServices = allServices.filter((s: any) => s.profissional?.usuario?.id === userData.id);
        setServices(myServices);

        // D) Avaliações (filtra onde sou o avaliado)
        const reviewsResponse = await fetch("http://localhost:8000/api/avaliacoes/", { headers });
        const allReviews = await reviewsResponse.json();
        const myReviews = allReviews.filter((r: any) => r.avaliado === userData.id);
        setReviews(myReviews);

        // Preenche formulário
        const fullName = userData.first_name ? `${userData.first_name} ${userData.last_name || ""}`.trim() : userData.username;
        
        setFormData((prev) => ({
          ...prev,
          name: fullName,
          email: userData.email,
          profileImageUrl: userData.foto_perfil ? `http://localhost:8000${userData.foto_perfil}` : "/Images/DwightProfile.png",
          bio: myProf?.biografia || "",
          category: myProf?.especialidades?.join(", ") || "Geral",
        }));

      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // --- 2. AÇÕES DO USUÁRIO ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profileImageFile: file,
        profileImageUrl: URL.createObjectURL(file),
      }));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.push("/login");
  };

  // --- 3. EXCLUSÃO DE SERVIÇO (DELETE) ---
  const handleDeleteService = async (serviceId: number) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este serviço? Essa ação não pode ser desfeita.");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`http://localhost:8000/api/servicos/${serviceId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Atualiza o estado local removendo o item deletado (sem precisar recarregar a página)
        setServices((prevServices) => prevServices.filter((s) => s.id !== serviceId));
        // Opcional: Mostrar um toast/alerta mais bonito
      } else {
        alert("Erro ao excluir o serviço. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao excluir:", error);
      alert("Erro de conexão.");
    }
  };

  // --- 4. ATUALIZAÇÃO DO PERFIL (PATCH) ---
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    if (formData.password && formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: "As senhas não coincidem." });
      setIsSubmitting(false);
      return;
    }

    const token = localStorage.getItem("accessToken");

    try {
      // Passo A: Atualizar Usuário (Django User)
      const userPayload = new FormData();
      const nameParts = formData.name.trim().split(" ");
      userPayload.append("first_name", nameParts[0]);
      userPayload.append("last_name", nameParts.slice(1).join(" "));
      userPayload.append("email", formData.email);
      
      if (formData.password) userPayload.append("password", formData.password);
      if (formData.profileImageFile) userPayload.append("foto_perfil", formData.profileImageFile);

      const userRes = await fetch("http://localhost:8000/api/me/", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: userPayload,
      });

      if (!userRes.ok) throw new Error("Erro ao atualizar dados de usuário");

      // Passo B: Atualizar Profissional (Biografia)
      if (professionalId) {
        const profPayload = { biografia: formData.bio };
        const profRes = await fetch(`http://localhost:8000/api/profissionais/${professionalId}/`, {
            method: "PATCH",
            headers: { 
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(profPayload),
        });
        if (!profRes.ok) console.warn("Aviso: Não foi possível atualizar a biografia.");
      }

      setEditMode(false);
      // Atualiza a imagem na tela caso tenha mudado via upload
      if (formData.profileImageFile) {
         // Idealmente pegariamos a URL retornada pelo backend, mas o objectURL serve temporariamente
      }

    } catch (error) {
      console.error(error);
      setErrors({ submit: "Erro ao salvar alterações." });
    } finally {
      setIsSubmitting(false);
    }
  };

  //Helpers UI
  const getStars = (nota: number) => {
    const n = Number(nota) || 0;
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`text-xl ${index < n ? "text-yellow-400" : "text-gray-300"}`}>
        {index < n ? "★" : "☆"}
      </span>
    ));
  };

  const statusBadge = (ativo: boolean) => {
    return ativo ? (
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Ativo</span>
    ) : (
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Inativo</span>
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-10 w-10 border-4 border-green-500 rounded-full border-t-transparent"></div></div>;
  }

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
            <Link href="/" className="text-gray-600 hover:text-green-600 transition-colors pb-1">Home</Link>
            <Link href="/catalogo" className="text-gray-600 hover:text-green-600 transition-colors pb-1">Catalogo</Link>
            <Link href="/perfilusuario" className="text-gray-600 hover:text-green-600 transition-colors pb-1">Perfil</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <button onClick={handleLogout} className="p-2 rounded-xl hover:bg-red-100 transition-all" title="Sair">
              <Image src="/Images/logout.png" alt="Logout" width={28} height={28} className="opacity-80 hover:opacity-100 transition" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Botão para Perfil de Cliente */}
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={() => router.push("/perfilusuario")}
          className="mb-12 px-8 py-3 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-all duration-300"
        >
          Ver Perfil de Cliente
        </motion.button>

        {/* --- CARTÃO DO PERFIL --- */}
        <motion.div variants={cardVariants} className="bg-white rounded-3xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Perfil Profissional</h2>
            <motion.button
              onClick={() => setEditMode(!editMode)}
              whileHover={{ scale: 1.1 }}
              className="p-2 rounded-full hover:bg-gray-100 transition"
              title={editMode ? "Cancelar Edição" : "Editar Perfil"}
            >
              {editMode ? (
                 <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                 <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              )}
            </motion.button>
          </div>
          
          <p className="text-gray-600 mb-8">Gerencie seu perfil profissional e atraia mais clientes.</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Coluna da Foto */}
            <div className="md:col-span-1">
              <div className="relative h-48 w-48 mx-auto rounded-full overflow-hidden shadow-lg border-4 border-green-100">
                <Image 
                    src={formData.profileImageUrl} 
                    alt="Foto de Perfil" 
                    fill 
                    className="object-cover" 
                    unoptimized 
                />
              </div>
              {editMode && (
                <div className="mt-4 text-center">
                  <label htmlFor="profileImage" className="cursor-pointer text-green-600 hover:text-green-700 font-medium bg-green-50 px-4 py-2 rounded-full transition">
                    Alterar Foto
                  </label>
                  <input id="profileImage" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </div>
              )}
            </div>

            {/* Coluna dos Dados */}
            <div className="md:col-span-2">
              {editMode ? (
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                    <input name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" required />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                    <input name="email" type="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" required />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Biografia</label>
                    <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
                      <input name="password" type="password" placeholder="******" value={formData.password} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Senha</label>
                      <input name="confirmPassword" type="password" placeholder="******" value={formData.confirmPassword} onChange={handleInputChange} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`} />
                    </div>
                  </div>

                  {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
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
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold text-gray-900">{formData.name}</h3>
                  <div className="flex space-x-1 items-center">
                    {getStars(5)}
                    <span className="text-sm text-gray-500 ml-2">({reviews.length} avaliações)</span>
                  </div>
                  <p className="text-green-700 font-medium">{formData.category || "Sem especialidade definida"}</p>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{formData.bio || "Adicione uma biografia para atrair clientes."}</p>
                  
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => router.push("/criarservico")}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium shadow-sm transition mt-4"
                  >
                    Criar Novo Serviço
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* --- SEUS SERVIÇOS --- */}
        <motion.div variants={cardVariants} className="bg-white rounded-3xl shadow-xl p-8 mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 16c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Seus Serviços
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {services.length > 0 ? (
              services.map((service) => (
                <motion.div
                  key={service.id}
                  variants={cardVariants}
                  whileHover={{ scale: 1.01, boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}
                  className="p-6 bg-gray-50 rounded-2xl shadow-sm border border-gray-200 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900 pr-4">{service.nome}</h4>
                        
                        {/* BOTÕES DE AÇÃO (Editar / Excluir) */}
                        <div className="flex space-x-2 shrink-0">
                            <button 
                                onClick={() => router.push(`/editarservico/${service.id}`)}
                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition"
                                title="Editar Serviço"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </button>
                            <button 
                                onClick={() => handleDeleteService(service.id)}
                                className="p-2 text-red-600 hover:bg-red-100 rounded-full transition"
                                title="Excluir Serviço"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </div>
                    </div>

                    <p className="text-lg font-bold text-green-600 mb-2">
                      R$ {service.preco} <span className="text-xs text-gray-500 font-normal">/{service.tipo_preco === 'por_hora' ? 'h' : 'fixo'}</span>
                    </p>
                  </div>
                  <div className="flex justify-between items-end mt-2">
                    {statusBadge(service.is_ativo)}
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-2 py-4">Nenhum serviço cadastrado ainda.</p>
            )}
          </div>
        </motion.div>

        {/* --- AVALIAÇÕES --- */}
        <motion.div variants={cardVariants} className="bg-white rounded-3xl shadow-xl p-8 mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Avaliações Recentes
          </h3>
          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <motion.div
                  key={review.id}
                  variants={cardVariants}
                  whileHover={{ scale: 1.01 }}
                  className="p-6 bg-gray-50 rounded-2xl shadow-sm border border-gray-200 transition"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-900">Cliente (ID: {review.avaliador})</span>
                    <div className="flex space-x-1">{getStars(review.nota)}</div>
                  </div>
                  <p className="text-gray-700 italic">"{review.comentario}"</p>
                  <p className="text-xs text-gray-500 mt-2">{formatDate(review.criado_em)}</p>
                </motion.div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">Nenhuma avaliação recebida.</p>
            )}
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
              {[{ alt: "X", img: "/Images/X_Logo.png" }, { alt: "TikTok", img: "/Images/TikTok_Logo.png" }, { alt: "Instagram", img: "/Images/Instagram_Logo.png" }].map((social) => (
                <a key={social.alt} href="#" className="transition-transform duration-300 hover:scale-110">
                  <Image src={social.img} alt={social.alt} width={32} height={32} className="h-8 w-8 object-contain" />
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

export default PerfilProfissional;