"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion"; // Importamos Variants para as animações

// Interface do Serviço conforme API
interface ServiceData {
  id: number;
  nome: string;
  preco: string; // API retorna decimal como string
  descricao: string;
  profissional: {
    id: number;
    usuario: {
      first_name: string;
      last_name: string;
      username: string;
      foto_perfil: string | null;
    };
  };
}

// Animações
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};


const ContratarServico: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.serviceId;

  const [service, setService] = useState<ServiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [dataAgendamento, setDataAgendamento] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFim, setHoraFim] = useState(""); 
  const [localAtendimento, setLocalAtendimento] = useState("Online");
  const [observacoes, setObservacoes] = useState("");

  useEffect(() => {
    const fetchService = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          router.push("/login");
          return;
        }

        const res = await fetch(`http://localhost:8000/api/servicos/${serviceId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Serviço não encontrado");
        const data = await res.json();
        setService(data);
      } catch (error) {
        console.error(error);
        alert("Erro ao carregar detalhes do serviço.");
        router.push("/catalogo");
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) fetchService();
  }, [serviceId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const token = localStorage.getItem("accessToken");
    if (!token) {
        router.push("/login");
        return;
    }

    if (!service) return;

    try {
      // 1. Busca ID do cliente logado
      const meRes = await fetch("http://localhost:8000/api/me/", { headers: { Authorization: `Bearer ${token}` }});
      const meData = await meRes.json();
      
      // 2. Busca objeto cliente
      const cliRes = await fetch("http://localhost:8000/api/clientes/", { headers: { Authorization: `Bearer ${token}` }});
      const cliData = await cliRes.json();
      
      // Garante que cliData seja um array (drf pagination check)
      const cliList = Array.isArray(cliData) ? cliData : cliData.results || [];
      // Usando a lógica mais robusta para encontrar o cliente ID (compatível com os serializers)
      const meuCliente = cliList.find((c: any) => c.usuario === meData.id || (c.usuario && c.usuario.id === meData.id));
      
      if (!meuCliente) {
         alert("Você precisa completar seu perfil de Cliente primeiro.");
         router.push("/perfilusuario");
         return;
      }

      // 3. Monta o payload final (usando _id conforme o backend espera para POST)
      const payload = {
          cliente_id: meuCliente.id,          
          servico: service.id,
          profissional_id: service.profissional.id, 
          data_agendada: dataAgendamento,
          hora_inicio: horaInicio,
          hora_fim: horaFim || null,
          local_atendimento: localAtendimento,
          observacoes: observacoes,
          status: "pendente",
          preco: parseFloat(service.preco) // Garante que o preço seja float
      };
      
      // 4. Envia para a API de contratos
      const res = await fetch("http://localhost:8000/api/contratos/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Pedido enviado com sucesso! Aguarde a confirmação do profissional.");
        router.push("/perfilusuario");
      } else {
        const errData = await res.json();
        console.error(errData);
        let errorMessage = "Erro desconhecido ao criar contrato.";
        if (typeof errData === 'object' && errData !== null) {
            errorMessage = Object.values(errData).flat().join(". ") || errorMessage;
        }
        alert("Erro ao criar contrato: " + errorMessage);
      }

    } catch (error) {
      console.error(error);
      alert("Erro de conexão ou ao buscar dados do cliente.");
    } finally {
      setSubmitting(false);
    }
  };

  // Melhoria no feedback de carregamento
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-10 w-10 border-4 border-green-500 rounded-full border-t-transparent"></div></div>;
  if (!service) return null;

  const profName = service.profissional.usuario.first_name 
    ? `${service.profissional.usuario.first_name} ${service.profissional.usuario.last_name}` 
    : service.profissional.usuario.username;
  
  const profFoto = service.profissional.usuario.foto_perfil 
    ? (service.profissional.usuario.foto_perfil.startsWith("http")
        ? service.profissional.usuario.foto_perfil
        : `http://localhost:8000${service.profissional.usuario.foto_perfil}`) 
    : "/Images/DwightProfile.png";

  return (
    // 1. Aplica o fundo gradiente padrão
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 font-sans text-gray-800 overflow-x-hidden">
      
      {/* 2. Adiciona o Header de Navegação */}
      <motion.header 
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="bg-white/90 shadow-lg sticky top-0 z-50 backdrop-blur-md"
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/"><Image src="/Images/FazFastLogo.png" alt="Logo" width={140} height={35} /></Link>
            <nav className="hidden md:flex space-x-8 font-medium">
                <Link href="/" className="text-gray-600 hover:text-green-600">Home</Link>
                <Link href="/catalogo" className="text-green-600 font-bold">Catálogo</Link>
                <Link href="/perfilusuario" className="text-gray-600 hover:text-green-600">Perfil</Link>
            </nav>
            <div className="flex items-center gap-4">
                <Link href="/perfilusuario" className="text-green-600 font-medium hover:bg-green-50 px-4 py-2 rounded-lg transition">Meu Perfil</Link>
            </div>
        </div>
      </motion.header>

      {/* 3. Card Principal com animação e melhor sombra */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeInUp} 
        className="max-w-4xl mx-auto w-full py-12 px-6"
      >
        <div 
          className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
        >
          {/* Header do Card (Título) */}
          <div className="bg-green-600 px-8 py-6 flex justify-between items-center">
              <div>
                  <h2 className="text-3xl font-extrabold text-white">Contratar Serviço</h2>
                  <p className="text-green-100 text-base mt-1">Finalize o agendamento para {service.nome}</p>
              </div>
              <Link href="/catalogo" className="px-4 py-2 text-white bg-green-700 rounded-xl font-medium hover:bg-green-800 transition text-sm shadow-md">
                  Cancelar
              </Link>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Coluna Esquerda: Detalhes */}
              <div className="border-r border-gray-200 pr-0 md:pr-8">
                  {/* Detalhes do Profissional */}
                  <div className="flex items-center space-x-4 pb-6 border-b border-gray-100 mb-6">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-green-200 shadow-md">
                          <Image src={profFoto} alt="Prof" fill className="object-cover" unoptimized />
                      </div>
                      <div>
                          <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Profissional</p>
                          <p className="font-bold text-gray-900 text-xl">{profName}</p>
                      </div>
                  </div>

                  {/* Detalhes do Serviço */}
                  <div className="bg-green-50 p-6 rounded-xl mb-6 border border-green-100">
                      <p className="text-sm text-green-700 uppercase tracking-wider font-bold mb-2">Serviço Selecionado</p>
                      <h3 className="font-extrabold text-gray-900 text-2xl mb-2">{service.nome}</h3>
                      <p className="text-gray-700 text-base leading-relaxed">{service.descricao}</p>
                  </div>

                  {/* Valor */}
                  <div className="flex justify-between items-center py-4 pt-0">
                      <span className="font-semibold text-lg text-gray-700">Valor do Serviço</span>
                      <span className="text-4xl font-extrabold text-green-600">R$ {service.preco}</span>
                  </div>
              </div>

              {/* Coluna Direita: Formulário */}
              <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                          <input 
                              type="date" 
                              required
                              value={dataAgendamento}
                              onChange={(e) => setDataAgendamento(e.target.value)}
                              // 4. Inputs com melhor padding e foco
                              className="w-full border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 p-3 outline-none transition"
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Hora Início</label>
                          <input 
                              type="time" 
                              required
                              value={horaInicio}
                              onChange={(e) => setHoraInicio(e.target.value)}
                              className="w-full border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 p-3 outline-none transition"
                          />
                      </div>
                  </div>

                  <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Hora Término (Opcional)</label>
                       <input 
                          type="time" 
                          value={horaFim}
                          onChange={(e) => setHoraFim(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 p-3 outline-none transition"
                      />
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Local de Atendimento</label>
                      <select 
                          value={localAtendimento}
                          onChange={(e) => setLocalAtendimento(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 p-3 outline-none transition bg-white"
                      >
                          <option value="Online">Online</option>
                          <option value="Presencial">Presencial (Endereço do Cliente)</option>
                          <option value="Consultorio">No local do Profissional</option>
                      </select>
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                      <textarea 
                          rows={3}
                          value={observacoes}
                          onChange={(e) => setObservacoes(e.target.value)}
                          placeholder="Detalhes adicionais para o profissional..."
                          className="w-full border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 p-3 outline-none transition"
                      />
                  </div>

                  {/* 5. Botão principal com melhor destaque */}
                  <motion.button 
                      type="submit" 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={submitting}
                      className="w-full py-4 bg-green-600 text-white rounded-xl font-extrabold text-xl hover:bg-green-700 transition shadow-lg shadow-green-200 disabled:opacity-50 mt-4"
                  >
                      {submitting ? "Enviando Pedido..." : "Confirmar Pedido"}
                  </motion.button>
              </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContratarServico;