"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { useRouter } from "next/navigation";

// --- INTERFACES ---
interface UsuarioData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  foto_perfil: string | null;
  telefone: string | null;
  endereco: string | null;
  genero: string | null;
}

interface ClienteData {
  id: number;
  usuario: number;
  cpf: string | null;
  data_nascimento: string | null;
}
// --- FIM INTERFACES ---

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

// Dados mock de pedidos (Mantidos do seu código)
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

  // --- ESTADOS DE DADOS ---
  const [user, setUser] = useState<UsuarioData | null>(null);
  const [cliente, setCliente] = useState<ClienteData | null>(null);
  const [isClientProfileMissing, setIsClientProfileMissing] = useState(false);

  // Estado do formulário
  const [formData, setFormData] = useState({
    // Usuario
    name: "",
    email: "",
    username: "",
    telefone: "",
    endereco: "",
    genero: "",
    password: "",
    confirmPassword: "",
    profileImageUrl: "/Images/DwightProfile.png", 
    profileImageFile: null as File | null,
    // Cliente
    cpf: "",
    dataNascimento: "",
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
        // A. Buscar dados do USUARIO
        const userRes = await fetch("http://localhost:8000/api/me/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!userRes.ok) throw new Error("Falha user");
        const userData: UsuarioData = await userRes.json();
        
        // Monta visualização
        const fullName = `${userData.first_name || ""} ${userData.last_name || ""}`.trim();
        const profileImageUrl = userData.foto_perfil 
            ? (userData.foto_perfil.startsWith("http") ? userData.foto_perfil : `http://localhost:8000${userData.foto_perfil}`)
            : "/Images/DwightProfile.png";

        setUser(userData);

        // B. Buscar dados de CLIENTE (para saber se ativa ou não)
        let foundCliente: ClienteData | null = null;
        const cliRes = await fetch("http://localhost:8000/api/clientes/", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (cliRes.ok) {
          const cliResponse = await cliRes.json();
          // Tratamento para paginação do DRF
          const cliList: ClienteData[] = Array.isArray(cliResponse) ? cliResponse : cliResponse.results || [];
          foundCliente = cliList.find((c) => c.usuario === userData.id) || null;
          
          if (foundCliente) {
            setCliente(foundCliente);
            setIsClientProfileMissing(false);
          } else {
            setIsClientProfileMissing(true);
          }
        }

        // C. Preencher Form
        setFormData((prev) => ({
          ...prev,
          name: fullName || userData.username,
          username: userData.username,
          email: userData.email,
          telefone: userData.telefone || "",
          endereco: userData.endereco || "",
          genero: userData.genero || "",
          profileImageUrl: profileImageUrl,
          // Se tiver cliente, preenche:
          cpf: foundCliente?.cpf || "",
          dataNascimento: foundCliente?.data_nascimento || "",
          profileImageFile: null
        }));

      } catch (error) {
        console.error("Erro ao buscar perfil", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  // --- 2. ATIVAR PERFIL DE CLIENTE ---
  const handleCreateClienteProfile = async () => {
    if (!user) return;
    const token = localStorage.getItem("accessToken");
    setIsSubmitting(true);
    try {
      // CORREÇÃO: Usar 'usuario_id' em vez de 'usuario' no body
      const payload = { usuario_id: user.id };
      
      const res = await fetch("http://localhost:8000/api/clientes/", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const newClient = await res.json();
        setCliente(newClient);
        setIsClientProfileMissing(false);
        alert("Perfil ativado com sucesso! Agora você pode preencher seu CPF e Data de Nascimento.");
      } else {
        const errData = await res.json();
        console.error("Erro detalhado do backend:", errData);
        alert(`Erro ao ativar perfil: ${JSON.stringify(errData)}`);
      }
    } catch(e) { 
        console.error("Erro de conexão:", e); 
        alert("Erro de conexão ao tentar ativar o perfil.");
    }
    setIsSubmitting(false);
  };

  // --- 3. MANIPULAÇÃO DE INPUTS ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        profileImageUrl: URL.createObjectURL(file) 
      }));
    }
  };

  // --- 4. SALVAR DADOS (Dual Request: Usuario + Cliente) ---
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    if (formData.password && formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: "As senhas não coincidem." });
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      
      // Request 1: Dados do Usuario (Multipart para Imagem)
      const userDataToSend = new FormData();
      const nameParts = formData.name.trim().split(" ");
      userDataToSend.append("first_name", nameParts[0]);
      userDataToSend.append("last_name", nameParts.slice(1).join(" "));
      userDataToSend.append("email", formData.email);
      userDataToSend.append("telefone", formData.telefone);
      userDataToSend.append("endereco", formData.endereco);
      if (formData.genero) userDataToSend.append("genero", formData.genero);
      
      if (formData.password) userDataToSend.append("password", formData.password);
      if (formData.profileImageFile) userDataToSend.append("foto_perfil", formData.profileImageFile);

      const reqUser = fetch("http://localhost:8000/api/me/", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: userDataToSend,
      });

      // Request 2: Dados do Cliente (JSON) - Só se o cliente existir
      let reqClient = Promise.resolve(null as any);
      if (cliente) {
        reqClient = fetch(`http://localhost:8000/api/clientes/${cliente.id}/`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                cpf: formData.cpf,
                data_nascimento: formData.dataNascimento || null
            }),
        });
      }

      // Espera ambos terminarem
      const [resUser, resClient] = await Promise.all([reqUser, reqClient]);

      if (resUser.ok) {
        const updatedUser = await resUser.json();
        
        // Atualiza User Local
        if (updatedUser.foto_perfil) {
             const newUrl = updatedUser.foto_perfil.startsWith("http") ? updatedUser.foto_perfil : `http://localhost:8000${updatedUser.foto_perfil}`;
             setFormData(prev => ({ ...prev, profileImageUrl: newUrl }));
        }
        setUser(updatedUser);

        // Atualiza Cliente Local
        if (resClient && resClient.ok) {
            const updatedClient = await resClient.json();
            setCliente(updatedClient);
        }

        setEditMode(false);
      } else {
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

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-5xl mx-auto px-6 py-12">

        {/* --- ALERTA DE ATIVAÇÃO (Estilo Mantido) --- */}
        {isClientProfileMissing && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-8 rounded-xl shadow-md flex flex-col md:flex-row justify-between items-center"
          >
            <p className="font-semibold mb-2 md:mb-0">⚠️ Perfil incompleto. Ative para preencher CPF e Data de Nascimento.</p>
            <button 
              onClick={handleCreateClienteProfile}
              disabled={isSubmitting}
              className="w-full md:w-auto bg-yellow-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-yellow-700 transition disabled:opacity-70"
            >
              {isSubmitting ? "Ativando..." : "Ativar Perfil"}
            </button>
          </motion.div>
        )}

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

          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Perfil do Cliente {cliente && <span className="text-sm font-normal text-green-600 bg-green-100 px-2 py-1 rounded-full ml-2">Ativo</span>}
          </h2>

          {editMode ? (
            /* FORMULÁRIO DE EDIÇÃO */
            <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-2xl mx-auto">
              
              {/* Upload de Imagem */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-green-100 shadow-md">
                  <Image src={formData.profileImageUrl} alt="Profile" fill className="object-cover" unoptimized />
                </div>
                <label className="cursor-pointer px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium hover:bg-green-100 transition">
                  Alterar Foto
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>

              {/* GRID DE CAMPOS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                    <input name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" required />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                    <input name="email" type="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" required />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                    <input name="telefone" value={formData.telefone} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="(00) 00000-0000" />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                    <input name="endereco" value={formData.endereco} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Gênero</label>
                     <select name="genero" value={formData.genero} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white">
                        <option value="">Selecione...</option>
                        <option value="masculino">Masculino</option>
                        <option value="feminino">Feminino</option>
                        <option value="outro">Outro</option>
                     </select>
                  </div>
              </div>

              {/* DADOS ESPECÍFICOS DE CLIENTE (Só aparecem se tiver cliente ativo) */}
              {cliente && (
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <h4 className="text-sm font-bold text-gray-500 uppercase mb-3">Dados Pessoais (Cliente)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                            <input name="cpf" value={formData.cpf} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="000.000.000-00" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
                            <input name="dataNascimento" type="date" value={formData.dataNascimento} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
                        </div>
                      </div>
                  </div>
              )}

              {/* SENHAS */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
                  <input name="password" type="password" placeholder="******" value={formData.password} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Senha</label>
                  <input name="confirmPassword" type="password" placeholder="******" value={formData.confirmPassword} onChange={handleInputChange} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`} />
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
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="flex-shrink-0">
                    <div className="relative h-40 w-40 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                    <Image src={formData.profileImageUrl} alt="Profile" fill className="object-cover" unoptimized />
                    </div>
                </div>
                
                <div className="flex-grow w-full space-y-4 text-center md:text-left">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900">{formData.name}</h3>
                        <p className="text-green-600 font-medium">@{formData.username}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                        <div className="bg-gray-50 p-3 rounded-lg"><span className="text-xs text-gray-500 block">EMAIL</span>{formData.email}</div>
                        <div className="bg-gray-50 p-3 rounded-lg"><span className="text-xs text-gray-500 block">TELEFONE</span>{formData.telefone || "-"}</div>
                        <div className="bg-gray-50 p-3 rounded-lg"><span className="text-xs text-gray-500 block">ENDEREÇO</span>{formData.endereco || "-"}</div>
                        
                        {/* Dados de Cliente */}
                        {cliente && (
                            <>
                                <div className="bg-green-50 p-3 rounded-lg border border-green-100"><span className="text-xs text-green-700 block">CPF</span>{formData.cpf || "-"}</div>
                                <div className="bg-green-50 p-3 rounded-lg border border-green-100"><span className="text-xs text-green-700 block">NASCIMENTO</span>{formData.dataNascimento ? new Date(formData.dataNascimento).toLocaleDateString() : "-"}</div>
                            </>
                        )}
                    </div>
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