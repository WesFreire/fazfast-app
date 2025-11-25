// NOVO CÓDIGO COMPLETO PARA page.tsx
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

// CORRIGIDO: O campo 'usuario' agora é um objeto com a chave 'id'
interface ClienteData {
  id: number;
  usuario: {
    id: number;
  };
  cpf: string | null;
  data_nascimento: string | null;
}

// Interface de Contrato/Pedido
interface OrderData {
  id: number;
  status: string;
  data_agendada: string;
  hora_inicio: string;
  preco: string;
  servico: {
    nome: string;
  };
  profissional: {
    usuario: {
      first_name: string;
      last_name: string;
      username: string;
    };
  };
  // O cliente pode vir como objeto aninhado ou ID (se o serializer não for completo)
  cliente: number | { id: number };
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
  const [history, setHistory] = useState<OrderData[]>([]); // Estado para o histórico real

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
        
        const fullName = `${userData.first_name || ""} ${userData.last_name || ""}`.trim();
        const profileImageUrl = userData.foto_perfil 
            ? (userData.foto_perfil.startsWith("http") ? userData.foto_perfil : `http://localhost:8000${userData.foto_perfil}`)
            : "/Images/DwightProfile.png";

        setUser(userData);

        // B. Buscar dados de CLIENTE
        let foundClienteId: number | null = null;
        const cliRes = await fetch("http://localhost:8000/api/clientes/", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (cliRes.ok) {
          const cliResponse = await cliRes.json();
          const cliList: ClienteData[] = Array.isArray(cliResponse) ? cliResponse : cliResponse.results || [];
          
          // --- PONTO CORRIGIDO: Verifica o ID dentro do objeto 'usuario' aninhado ---
          const foundCliente = cliList.find((c) => c.usuario.id === userData.id) || null;
          // -------------------------------------------------------------------------
          
          if (foundCliente) {
            setCliente(foundCliente);
            foundClienteId = foundCliente.id;
            setIsClientProfileMissing(false);
          } else {
            setIsClientProfileMissing(true);
          }
          
          console.log(`[DIAGNÓSTICO] ID do Cliente encontrado: ${foundClienteId}`);
          
          // Preencher Form
          setFormData((prev) => ({
            ...prev,
            name: fullName || userData.username,
            username: userData.username,
            email: userData.email,
            telefone: userData.telefone || "",
            endereco: userData.endereco || "",
            genero: userData.genero || "",
            profileImageUrl: profileImageUrl,
            cpf: foundCliente?.cpf || "",
            dataNascimento: foundCliente?.data_nascimento || "",
            profileImageFile: null
          }));
        }


        // C. Buscar HISTÓRICO DE PEDIDOS (Contratos)
        if (foundClienteId) { // Só busca contratos se o ID do cliente foi encontrado
            const contractsRes = await fetch("http://localhost:8000/api/contratos/", {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (contractsRes.ok) {
                const contractsData = await contractsRes.json();
                const contractsList: OrderData[] = Array.isArray(contractsData) ? contractsData : contractsData.results || [];
                
                console.log("[DIAGNÓSTICO] Total de contratos carregados da API:", contractsList.length);
                
                // Filtra contratos onde sou o CLIENTE
                const myOrders = contractsList.filter((order: any) => {
                    const orderClientId = typeof order.cliente === 'object' ? order.cliente?.id : order.cliente;
                    
                    // Log detalhado para cada contrato
                    console.log(`[DIAGNÓSTICO] Contrato ${order.id}: Cliente no Contrato: ${orderClientId} | Nosso Cliente ID: ${foundClienteId}`);
                    
                    return orderClientId === foundClienteId;
                });

                console.log("[DIAGNÓSTICO] Total de contratos filtrados (Histórico):", myOrders.length);
                
                // Ordena por data (mais recente primeiro)
                myOrders.sort((a: any, b: any) => new Date(b.data_agendada).getTime() - new Date(a.data_agendada).getTime());
                setHistory(myOrders);
            } else {
                 console.error("[DIAGNÓSTICO] Falha ao carregar contratos:", contractsRes.status);
            }
        }

      } catch (error) {
        console.error("Erro geral ao buscar perfil:", error);
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
      const payload = { usuario_id: user.id };
      
      const res = await fetch("http://localhost:8000/api/clientes/", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        // Recarrega para que o useEffect refaça a busca e encontre o novo cliente ID
        window.location.reload(); 
      } else {
        const errData = await res.json();
        alert(`Erro ao ativar perfil: ${JSON.stringify(errData)}`);
      }
    } catch(e) { 
        alert("Erro de conexão ao tentar ativar o perfil.");
    }
    setIsSubmitting(false);
  };

  // --- 3. MANIPULAÇÃO DE INPUTS (Não alterada) ---
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

  // --- 4. SALVAR DADOS (Não alterada) ---
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
      
      // Request 1: Usuario
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

      // Request 2: Cliente (se existir)
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

      const [resUser, resClient] = await Promise.all([reqUser, reqClient]);

      if (resUser.ok) {
        const updatedUser = await resUser.json();
        if (updatedUser.foto_perfil) {
             const newUrl = updatedUser.foto_perfil.startsWith("http") ? updatedUser.foto_perfil : `http://localhost:8000${updatedUser.foto_perfil}`;
             setFormData(prev => ({ ...prev, profileImageUrl: newUrl }));
        }
        setUser(updatedUser);

        if (resClient && resClient.ok) {
            const updatedClient = await resClient.json();
            setCliente(updatedClient);
        }
        setEditMode(false);
        alert("Perfil atualizado com sucesso!");
      } else {
        setErrors({ submit: "Erro ao atualizar dados." });
      }
    } catch (error) {
      setErrors({ submit: "Erro de conexão." });
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
      concluido: "bg-green-100 text-green-800",
      confirmado: "bg-blue-100 text-blue-800",
      pendente: "bg-yellow-100 text-yellow-800",
      cancelado: "bg-red-100 text-red-800",
    };
    const label = status.charAt(0).toUpperCase() + status.slice(1);
    return <span className={`px-3 py-1 text-xs font-medium rounded-full ${styles[status.toLowerCase()] || "bg-gray-100 text-gray-700"}`}>{label}</span>;
  };

  const formatDate = (dateString: string) => dateString ? new Date(dateString).toLocaleDateString('pt-BR') : "";

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-10 w-10 border-4 border-green-500 rounded-full border-t-transparent"></div></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 font-sans text-gray-800 overflow-x-hidden">

      {/* Header (Não alterado) */}
      <motion.header initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} className="bg-white/90 shadow-lg sticky top-0 z-50 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/"><Image src="/Images/FazFastLogo.png" alt="Logo" width={140} height={35} /></Link>
            <nav className="hidden md:flex space-x-8 font-medium">
                <Link href="/" className="text-gray-600 hover:text-green-600">Home</Link>
                <Link href="/catalogo" className="text-gray-600 hover:text-green-600">Catálogo</Link>
                <Link href="/perfilusuario" className="text-gray-600 hover:text-green-600">Perfil</Link>
            </nav>
            <div className="flex items-center gap-4">
                <button onClick={handleLogout} className="text-red-500 font-medium hover:bg-red-50 px-4 py-2 rounded-lg transition">Logout</button>
            </div>
        </div>
      </motion.header>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-5xl mx-auto px-6 py-12">

        {/* ALERTA DE ATIVAÇÃO */}
        {isClientProfileMissing && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-8 rounded-xl shadow-md flex flex-col md:flex-row justify-between items-center"
          >
            <p className="font-semibold mb-2 md:mb-0">⚠️ Perfil incompleto. Ative para contratar serviços.</p>
            <button 
              onClick={handleCreateClienteProfile}
              disabled={isSubmitting}
              className="w-full md:w-auto bg-yellow-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-yellow-700 transition disabled:opacity-70"
            >
              {isSubmitting ? "Ativando..." : "Ativar Perfil"}
            </button>
          </motion.div>
        )}

        {/* Botão Profissional */}
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={() => router.push("/perfilprofissional")}
          className="mb-12 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition"
        >
          Ver Perfil Profissional
        </motion.button>

        {/* CARD DE PERFIL */}
        <motion.div variants={cardVariants} className="bg-white rounded-3xl shadow-xl p-8 relative">
          
          <div className="absolute top-8 right-8">
            <button onClick={() => setEditMode(!editMode)} className="p-2 text-green-600 hover:bg-green-50 rounded-full transition">
                {editMode ? "Cancelar" : "Editar"}
            </button>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Perfil do Cliente {cliente && <span className="text-sm font-normal text-green-600 bg-green-100 px-2 py-1 rounded-full ml-2">Ativo</span>}
          </h2>

          {/* ... Conteúdo do formulário de edição ou visualização ... */}
          {editMode ? (
            <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-2xl mx-auto">
              <div className="flex flex-col items-center gap-4">
                <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-green-100 shadow-md">
                  <Image src={formData.profileImageUrl} alt="Profile" fill className="object-cover" unoptimized />
                </div>
                <label className="cursor-pointer px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium hover:bg-green-100 transition">
                  Alterar Foto <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                    <input name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                    <input name="email" type="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                    <input name="telefone" value={formData.telefone} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none" placeholder="(00) 00000-0000" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                    <input name="endereco" value={formData.endereco} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none" />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Gênero</label>
                     <select name="genero" value={formData.genero} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none bg-white">
                        <option value="">Selecione...</option>
                        <option value="masculino">Masculino</option>
                        <option value="feminino">Feminino</option>
                        <option value="outro">Outro</option>
                     </select>
                  </div>
              </div>

              {cliente && (
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <h4 className="text-sm font-bold text-gray-500 uppercase mb-3">Dados Pessoais (Cliente)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                            <input name="cpf" value={formData.cpf} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none" placeholder="000.000.000-00" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
                            <input name="dataNascimento" type="date" value={formData.dataNascimento} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none" />
                        </div>
                      </div>
                  </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
                  <input name="password" type="password" placeholder="******" value={formData.password} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Senha</label>
                  <input name="confirmPassword" type="password" placeholder="******" value={formData.confirmPassword} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none" />
                </div>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm text-center">{errors.confirmPassword}</p>}
              
              <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-green-600 text-white rounded-lg font-bold shadow-md hover:bg-green-700 transition disabled:opacity-70">
                {isSubmitting ? "Salvando..." : "Salvar Alterações"}
              </button>
            </form>
          ) : (
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

        {/* HISTÓRICO DE PEDIDOS */}
        <motion.div variants={cardVariants} className="bg-white rounded-3xl shadow-xl p-8 mt-12">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            Histórico de Pedidos
          </h3>
          
          <div className="space-y-4">
            {history.length > 0 ? (
                history.map((order) => {
                    const profName = order.profissional?.usuario 
                        ? `${order.profissional.usuario.first_name} ${order.profissional.usuario.last_name}`.trim() || order.profissional.usuario.username
                        : "Profissional";

                    return (
                        <div key={order.id} className="p-5 bg-gray-50 rounded-xl border border-gray-100 flex flex-col md:flex-row justify-between items-center hover:shadow-md transition gap-4">
                            <div className="flex-grow">
                                <h4 className="font-bold text-gray-900 text-lg">{order.servico?.nome || "Serviço"}</h4>
                                <p className="text-sm text-gray-600">
                                    Prestado por: <span className="font-medium text-gray-800">{profName}</span>
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Agendado para: {formatDate(order.data_agendada)} às {order.hora_inicio}
                                </p>
                            </div>
                            <div className="text-right flex flex-col items-end gap-2">
                                {statusBadge(order.status)}
                                <span className="text-sm font-bold text-green-600">R$ {order.preco}</span>
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="text-center py-10 text-gray-500">
                    <p>Você ainda não fez nenhum pedido.</p>
                    <Link href="/catalogo" className="text-green-600 font-medium hover:underline mt-2 inline-block">
                        Explorar Catálogo de Serviços
                    </Link>
                </div>
            )}
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default PerfilUsuario;