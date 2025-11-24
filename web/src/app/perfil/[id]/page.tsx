"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

interface ProfissionalPublico {
  id: number;
  biografia: string;
  especialidades: string[]; // assumindo array de nomes ou ids
  avaliacao_media: number;
  experiencia_anos: number;
  usuario: {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    foto_perfil: string | null;
  };
}

interface ServiceData {
  id: number;
  nome: string;
  preco: string;
  tipo_preco: string;
  descricao: string;
  is_ativo: boolean;
}

const PerfilPublico: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const professionalId = params.id; // ID do profissional vindo da URL

  const [prof, setProf] = useState<ProfissionalPublico | null>(null);
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Buscar detalhes do profissional
        const profRes = await fetch(`http://localhost:8000/api/profissionais/${professionalId}/`);
        if (!profRes.ok) throw new Error("Profissional não encontrado");
        const profData = await profRes.json();
        setProf(profData);

        // 2. Buscar serviços desse profissional
        // (Assumindo que a API lista tudo e filtramos, ou endpoint filtrado)
        const servRes = await fetch("http://localhost:8000/api/servicos/");
        const servData = await servRes.json();
        // Filtra os serviços que pertencem a este profissional
        // Nota: O backend retorna o objeto profissional completo dentro do serviço
        const myServices = servData.filter((s: any) => s.profissional.id === Number(professionalId) && s.is_ativo);
        setServices(myServices);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (professionalId) fetchData();
  }, [professionalId]);

  if (loading) return <div className="min-h-screen flex justify-center items-center">Carregando...</div>;
  if (!prof) return <div className="min-h-screen flex justify-center items-center">Profissional não encontrado.</div>;

  const fullName = prof.usuario.first_name 
    ? `${prof.usuario.first_name} ${prof.usuario.last_name}`
    : prof.usuario.username;

  const photoUrl = prof.usuario.foto_perfil 
    ? (prof.usuario.foto_perfil.startsWith("http") 
        ? prof.usuario.foto_perfil 
        : `http://localhost:8000${prof.usuario.foto_perfil}`)
    : "/Images/DwightProfile.png";

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
       {/* Header Simples */}
       <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/catalogo"><Image src="/Images/FazFastLogo.png" alt="Logo" width={140} height={35} /></Link>
          <Link href="/catalogo" className="text-green-600 font-medium hover:underline">Voltar ao Catálogo</Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 pt-10 pb-20">
        
        {/* Cartão Principal */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-3xl shadow-lg overflow-hidden p-8 mb-10"
        >
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* Foto */}
            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-green-100 shrink-0">
              <Image src={photoUrl} alt={fullName} fill className="object-cover" unoptimized />
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{fullName}</h1>
              
              <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                 <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {prof.especialidades?.length > 0 ? prof.especialidades[0] : "Profissional"}
                 </span>
                 <span className="flex items-center text-yellow-500 font-bold">
                    ★ {prof.avaliacao_media.toFixed(1)}
                 </span>
              </div>

              <p className="text-gray-600 leading-relaxed mb-6 max-w-2xl">
                {prof.biografia || "Este profissional ainda não adicionou uma biografia."}
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-500">
                <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                    <span className="block font-bold text-gray-900 text-lg">{prof.experiencia_anos} Anos</span>
                    de Experiência
                </div>
                <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                    <span className="block font-bold text-gray-900 text-lg">{services.length}</span>
                    Serviços Ativos
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Lista de Serviços */}
        <motion.div 
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
        >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pl-2 border-l-4 border-green-500">
                Serviços Disponíveis para Contratação
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.length > 0 ? services.map((service) => (
                    <div key={service.id} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition border border-gray-100 flex flex-col justify-between h-full">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg text-gray-900">{service.nome}</h3>
                                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                                    {service.tipo_preco === 'por_hora' ? '/hora' : 'Fixo'}
                                </span>
                            </div>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-3">{service.descricao}</p>
                        </div>
                        
                        <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                            <span className="text-2xl font-bold text-green-600">R$ {service.preco}</span>
                            <button 
                                onClick={() => router.push(`/contratar/${service.id}`)}
                                className="bg-black text-white px-6 py-2 rounded-xl font-medium hover:bg-green-600 transition shadow-lg hover:-translate-y-1"
                            >
                                Contratar
                            </button>
                        </div>
                    </div>
                )) : (
                    <p className="text-gray-500 col-span-3 text-center py-10 bg-white rounded-xl shadow-sm">
                        Este profissional não possui serviços ativos no momento.
                    </p>
                )}
            </div>
        </motion.div>

      </div>
    </div>
  );
};

export default PerfilPublico;