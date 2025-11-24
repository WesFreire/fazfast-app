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
interface Usuario {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  foto_perfil: string | null;
}

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

interface Contrato {
  id: number;
  cliente: {
    usuario: Usuario;
  };
  servico: {
    nome: string;
  };
  data_agendada: string;
  hora_inicio: string;
  hora_fim: string | null;
  local_atendimento: string;
  observacoes: string;
  status: "pendente" | "confirmado" | "concluido" | "cancelado";
  preco: string;
  profissional: number | { id: number }; // Pode vir ID ou Objeto
}

const PerfilProfissional: React.FC = () => {
  const router = useRouter();
  
  // --- Estados Gerais ---
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [activeTab, setActiveTab] = useState<"pendentes" | "agendados">("pendentes");

  // IDs
  const [userId, setUserId] = useState<number | null>(null);
  const [professionalId, setProfessionalId] = useState<number | null>(null);

  // Dados do Formulário
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    category: "",
    password: "",
    confirmPassword: "",
    profileImageUrl: "/Images/DwightProfile.png",
    profileImageFile: null as File | null,
  });

  // Listas de dados
  const [services, setServices] = useState<ServiceData[]>([]);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [contratos, setContratos] = useState<Contrato[]>([]);

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

        // B) Profissional
        const profResponse = await fetch("http://localhost:8000/api/profissionais/", { headers });
        const allProfs = await profResponse.json();
        // O DRF pode retornar { results: [...] } ou [...]
        const profList = Array.isArray(allProfs) ? allProfs : allProfs.results || [];
        const myProf = profList.find((p: any) => p.usuario.id === userData.id || p.usuario === userData.id);

        if (myProf) {
          setProfessionalId(myProf.id);
        } else {
            // Se não tiver perfil profissional, redireciona ou avisa
            // router.push("/perfilusuario");
        }

        // C) Serviços
        const servicesResponse = await fetch("http://localhost:8000/api/servicos/", { headers });
        const allServices = await servicesResponse.json();
        const servList = Array.isArray(allServices) ? allServices : allServices.results || [];
        const myServices = servList.filter((s: any) => (s.profissional?.usuario?.id || s.profissional?.usuario) === userData.id);
        setServices(myServices);

        // D) Avaliações
        const reviewsResponse = await fetch("http://localhost:8000/api/avaliacoes/", { headers });
        const allReviews = await reviewsResponse.json();
        const revList = Array.isArray(allReviews) ? allReviews : allReviews.results || [];
        const myReviews = revList.filter((r: any) => r.avaliado === userData.id);
        setReviews(myReviews);

        // E) Contratos (Novidade da fusão)
        const contratosRes = await fetch("http://localhost:8000/api/contratos/", { headers });
        const contratosData = await contratosRes.json();
        const contList: Contrato[] = Array.isArray(contratosData) ? contratosData : contratosData.results || [];
        
        // Filtra contratos onde SOU o profissional
        if (myProf) {
            const meusContratos = contList.filter((c: any) => {
                const pId = typeof c.profissional === 'object' ? c.profissional.id : c.profissional;
                return pId === myProf.id;
            });
            setContratos(meusContratos.reverse());
        }

        // Preenche formulário
        const fullName = userData.first_name ? `${userData.first_name} ${userData.last_name || ""}`.trim() : userData.username;
        
        setFormData((prev) => ({
          ...prev,
          name: fullName,
          email: userData.email,
          profileImageUrl: userData.foto_perfil ? (userData.foto_perfil.startsWith("http") ? userData.foto_perfil : `http://localhost:8000${userData.foto_perfil}`) : "/Images/DwightProfile.png",
          bio: myProf?.biografia || "",
          category: Array.isArray(myProf?.especialidades) ? myProf.especialidades.join(", ") : (myProf?.especialidades || "Geral"),
        }));

      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // --- 2. MANIPULADORES (Inputs, Upload, Logout) ---
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
    router.push("/login");
  };

  // --- 3. AÇÕES DE SERVIÇO (Delete) ---
  const handleDeleteService = async (serviceId: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este serviço?")) return;
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`http://localhost:8000/api/servicos/${serviceId}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setServices((prev) => prev.filter((s) => s.id !== serviceId));
      } else {
        alert("Erro ao excluir serviço.");
      }
    } catch (error) { console.error(error); }
  };

  // --- 4. AÇÕES DE CONTRATO (Aceitar/Recusar) ---
  const handleStatusChange = async (contratoId: number, novoStatus: "confirmado" | "cancelado") => {
    const token = localStorage.getItem("accessToken");
    if (!confirm(`Deseja marcar como ${novoStatus}?`)) return;

    try {
        const res = await fetch(`http://localhost:8000/api/contratos/${contratoId}/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ status: novoStatus })
        });

        if (res.ok) {
            setContratos((prev) => 
                prev.map((c) => c.id === contratoId ? { ...c, status: novoStatus } : c)
            );
            alert(`Pedido ${novoStatus} com sucesso!`);
        } else {
            alert("Erro ao atualizar status.");
        }
    } catch (error) { console.error(error); alert("Erro de conexão."); }
  };

  // --- 5. ATUALIZAR PERFIL ---
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
      // A: User
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

      if (!userRes.ok) throw new Error("Erro usuário");

      // B: Profissional
      if (professionalId) {
        const profRes = await fetch(`http://localhost:8000/api/profissionais/${professionalId}/`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({ biografia: formData.bio }),
        });
      }

      setEditMode(false);
      alert("Perfil atualizado!");
    } catch (error) {
      setErrors({ submit: "Erro ao salvar alterações." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Helpers ---
  const getStars = (nota: number) => {
    const n = Number(nota) || 0;
    return Array.from({ length: 5 }, (_, i) => (<span key={i} className={`text-xl ${i < n ? "text-yellow-400" : "text-gray-300"}`}>{i < n ? "★" : "☆"}</span>));
  };
  const formatDate = (dateString: string) => dateString ? new Date(dateString).toLocaleDateString("pt-BR") : "";

  // Filtros de Contratos
  const pendentes = contratos.filter(c => c.status === "pendente");
  const agendados = contratos.filter(c => c.status === "confirmado");

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-10 w-10 border-4 border-green-500 rounded-full border-t-transparent"></div></div>;

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
    
    {/* Logo */}
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

    {/* Menu desktop */}
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
        Catálogo
      </Link>

      <Link
        href="/perfilusuario"
        className="text-gray-600 hover:text-green-600 transition-colors duration-300 border-b-2 border-transparent hover:border-green-600 pb-1"
      >
        Perfil
      </Link>
    </nav>

    {/* Busca + Login + Logout */}
    <div className="flex items-center space-x-4">
    

      {/* Login */}
      <Link href="/login" className="p-2 rounded-xl hover:bg-green-100 transition-all">
        <Image
          src="/Images/login.png"
          alt="Login"
          width={28}
          height={28}
          className="opacity-80 hover:opacity-100 transition"
        />
      </Link>

      {/* Logout */}
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

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Botão Voltar para Cliente */}
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={() => router.push("/perfilusuario")}
          className="mb-8 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          ← Voltar para Modo Cliente
        </motion.button>

        {/* 1. CARTÃO DO PERFIL (Edição) */}
        <motion.div variants={cardVariants} className="bg-white rounded-3xl shadow-xl p-8 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Perfil Profissional</h2>
            <motion.button
              onClick={() => setEditMode(!editMode)}
              whileHover={{ scale: 1.1 }}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              {editMode ? (
                 <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                 <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              )}
            </motion.button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="relative h-48 w-48 mx-auto rounded-full overflow-hidden shadow-lg border-4 border-green-100">
                <Image src={formData.profileImageUrl} alt="Foto" fill className="object-cover" unoptimized />
              </div>
              {editMode && (
                <div className="mt-4 text-center">
                  <label className="cursor-pointer text-green-600 font-medium bg-green-50 px-4 py-2 rounded-full hover:bg-green-100 transition">
                    Alterar Foto <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              {editMode ? (
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <input name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="Nome Completo" required />
                  <input name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="Email" required />
                  <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows={4} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="Sua biografia profissional..." />
                  <div className="grid grid-cols-2 gap-4">
                    <input name="password" type="password" placeholder="Nova Senha" value={formData.password} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg outline-none" />
                    <input name="confirmPassword" type="password" placeholder="Confirmar Senha" value={formData.confirmPassword} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg outline-none" />
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                  <button type="submit" disabled={isSubmitting} className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-bold shadow-sm disabled:opacity-50 hover:bg-green-700 transition">
                    {isSubmitting ? "Salvando..." : "Salvar Alterações"}
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold text-gray-900">{formData.name}</h3>
                  <div className="flex space-x-1 items-center">
                    {getStars(5)}
                    <span className="text-sm text-gray-500 ml-2">({reviews.length} avaliações)</span>
                  </div>
                  <p className="text-green-700 font-medium">{formData.category}</p>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{formData.bio || "Adicione uma biografia para atrair clientes."}</p>
                  <button onClick={() => router.push("/criarservico")} className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium shadow-sm hover:bg-green-700 transition mt-4">Criar Novo Serviço</button>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* 2. GERENCIAMENTO DE PEDIDOS (NOVO) */}
        <motion.div variants={cardVariants} className="bg-white rounded-3xl shadow-xl p-8 mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                Gerenciamento de Agenda
            </h3>

            {/* Abas */}
            <div className="flex gap-6 border-b border-gray-200 mb-8">
                <button onClick={() => setActiveTab("pendentes")} className={`pb-3 px-2 font-medium transition ${activeTab === "pendentes" ? "text-green-600 border-b-2 border-green-600" : "text-gray-500 hover:text-gray-700"}`}>
                    Solicitações <span className="ml-1 bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">{pendentes.length}</span>
                </button>
                <button onClick={() => setActiveTab("agendados")} className={`pb-3 px-2 font-medium transition ${activeTab === "agendados" ? "text-green-600 border-b-2 border-green-600" : "text-gray-500 hover:text-gray-700"}`}>
                    Agendados <span className="ml-1 bg-green-100 text-green-600 px-2 py-0.5 rounded-full text-xs">{agendados.length}</span>
                </button>
            </div>

            {/* Conteúdo das Abas */}
            {activeTab === "pendentes" && (
                <div className="space-y-4">
                    {pendentes.length === 0 ? <p className="text-gray-500 text-center py-4">Nenhuma solicitação pendente.</p> : pendentes.map(contrato => (
                        <motion.div key={contrato.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border border-yellow-200 bg-yellow-50 p-4 rounded-xl flex flex-col md:flex-row justify-between gap-4">
                            <div>
                                <h4 className="font-bold text-gray-800">{contrato.servico.nome}</h4>
                                <p className="text-sm text-gray-600">Cliente: {contrato.cliente.usuario.first_name} {contrato.cliente.usuario.last_name}</p>
                                <p className="text-sm text-gray-600">Data: {new Date(contrato.data_agendada).toLocaleDateString()} às {contrato.hora_inicio}</p>
                                <p className="text-sm font-bold text-green-700 mt-1">R$ {contrato.preco}</p>
                                {contrato.observacoes && <p className="text-xs text-gray-500 italic mt-1">Obs: "{contrato.observacoes}"</p>}
                            </div>
                            <div className="flex flex-col gap-2 justify-center">
                                <button onClick={() => handleStatusChange(contrato.id, "confirmado")} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm font-bold">Aceitar</button>
                                <button onClick={() => handleStatusChange(contrato.id, "cancelado")} className="bg-white border border-red-200 text-red-500 px-4 py-2 rounded hover:bg-red-50 text-sm">Recusar</button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {activeTab === "agendados" && (
                <div className="grid md:grid-cols-2 gap-4">
                    {agendados.length === 0 ? <p className="text-gray-500 text-center py-4 col-span-2">Nenhum serviço agendado.</p> : agendados.map(contrato => (
                        <div key={contrato.id} className="border border-green-100 bg-white p-4 rounded-xl shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] px-2 py-1 font-bold rounded-bl">CONFIRMADO</div>
                            <h4 className="font-bold text-gray-800">{contrato.servico.nome}</h4>
                            <p className="text-sm text-gray-500 mb-2">com {contrato.cliente.usuario.first_name}</p>
                            <div className="bg-gray-50 p-2 rounded text-sm space-y-1">
                                <div className="flex items-center gap-2 text-gray-700">📅 {new Date(contrato.data_agendada).toLocaleDateString()}</div>
                                <div className="flex items-center gap-2 text-gray-700">⏰ {contrato.hora_inicio}</div>
                                <div className="flex items-center gap-2 text-gray-700">📍 {contrato.local_atendimento}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>

        {/* 3. SEUS SERVIÇOS (Listagem) */}
        <motion.div variants={cardVariants} className="bg-white rounded-3xl shadow-xl p-8 mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 16c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Seus Serviços
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service) => (
                <motion.div key={service.id} whileHover={{ scale: 1.01 }} className="p-6 bg-gray-50 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900 pr-4">{service.nome}</h4>
                        <div className="flex space-x-2 shrink-0">
                            <button onClick={() => router.push(`/editarservico/${service.id}`)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                            <button onClick={() => handleDeleteService(service.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                        </div>
                  </div>
                  <p className="text-lg font-bold text-green-600">R$ {service.preco} <span className="text-xs text-gray-500 font-normal">/{service.tipo_preco === 'por_hora' ? 'h' : 'fixo'}</span></p>
                  <div className="mt-2">{service.is_ativo ? <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Ativo</span> : <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Inativo</span>}</div>
                </motion.div>
            ))}
            {services.length === 0 && <p className="text-gray-500 col-span-2 text-center">Nenhum serviço cadastrado.</p>}
          </div>
        </motion.div>

        {/* 4. AVALIAÇÕES */}
        <motion.div variants={cardVariants} className="bg-white rounded-3xl shadow-xl p-8 mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            Avaliações Recentes
          </h3>
          <div className="space-y-6">
            {reviews.map((review) => (
                <div key={review.id} className="p-6 bg-gray-50 rounded-2xl shadow-sm border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-900">Cliente (ID: {review.avaliador})</span>
                    <div className="flex space-x-1">{getStars(review.nota)}</div>
                  </div>
                  <p className="text-gray-700 italic">"{review.comentario}"</p>
                  <p className="text-xs text-gray-500 mt-2">{formatDate(review.criado_em)}</p>
                </div>
            ))}
            {reviews.length === 0 && <p className="text-gray-500 text-center">Nenhuma avaliação recebida.</p>}
          </div>
        </motion.div>
      
      </motion.div>
    </div>
  );
};

export default PerfilProfissional;