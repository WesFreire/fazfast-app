"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

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
      const meuCliente = cliList.find((c: any) => c.usuario === meData.id || c.usuario.id === meData.id);
      
      if (!meuCliente) {
         alert("Você precisa completar seu perfil de Cliente primeiro.");
         router.push("/perfilusuario");
         return;
      }

      // 3. Monta o payload final (CORRIGIDO: usa _id)
      const payload = {
          cliente_id: meuCliente.id,          // <--- Mudou de 'cliente' para 'cliente_id'
          servico: service.id,
          profissional_id: service.profissional.id, // <--- Mudou de 'profissional' para 'profissional_id'
          data_agendada: dataAgendamento,
          hora_inicio: horaInicio,
          hora_fim: horaFim || null,
          local_atendimento: localAtendimento,
          observacoes: observacoes,
          status: "pendente",
          preco: parseFloat(service.preco)
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
        alert("Erro ao criar contrato: " + JSON.stringify(errData));
      }

    } catch (error) {
      console.error(error);
      alert("Erro de conexão ou ao buscar dados do cliente.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="bg-green-600 px-8 py-6 flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-white">Contratar Serviço</h2>
                <p className="text-green-100 text-sm">Preencha os detalhes do agendamento</p>
            </div>
            <Link href="/catalogo" className="text-white hover:text-green-200 text-sm">Cancelar</Link>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Coluna Esquerda: Detalhes */}
            <div className="border-r border-gray-100 pr-0 md:pr-8">
                <div className="flex items-center space-x-4 mb-6">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-green-100">
                        <Image src={profFoto} alt="Prof" fill className="object-cover" unoptimized />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-bold">Profissional</p>
                        <p className="font-medium text-gray-900 text-lg">{profName}</p>
                    </div>
                </div>

                <div className="bg-gray-50 p-5 rounded-xl mb-6 border border-gray-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-bold mb-1">Serviço Selecionado</p>
                    <h3 className="font-bold text-gray-800 text-xl mb-2">{service.nome}</h3>
                    <p className="text-gray-600 text-sm">{service.descricao}</p>
                </div>

                <div className="flex justify-between items-center py-4 border-t border-gray-200">
                    <span className="font-medium text-gray-600">Valor Estimado</span>
                    <span className="text-3xl font-bold text-green-600">R$ {service.preco}</span>
                </div>
            </div>

            {/* Coluna Direita: Formulário */}
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                        <input 
                            type="date" 
                            required
                            value={dataAgendamento}
                            onChange={(e) => setDataAgendamento(e.target.value)}
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5 border"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hora Início</label>
                        <input 
                            type="time" 
                            required
                            value={horaInicio}
                            onChange={(e) => setHoraInicio(e.target.value)}
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5 border"
                        />
                    </div>
                </div>

                <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Hora Término (Opcional)</label>
                     <input 
                        type="time" 
                        value={horaFim}
                        onChange={(e) => setHoraFim(e.target.value)}
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5 border"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Local de Atendimento</label>
                    <select 
                        value={localAtendimento}
                        onChange={(e) => setLocalAtendimento(e.target.value)}
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5 border bg-white"
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
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5 border"
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition shadow-md disabled:opacity-50 mt-4"
                >
                    {submitting ? "Enviando Pedido..." : "Confirmar Pedido"}
                </button>
            </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ContratarServico;