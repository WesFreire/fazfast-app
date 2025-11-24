"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation"; // useParams para pegar o ID da URL
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface Category {
  id: number;
  nome: string;
}

const EditarServico: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.id; // Pega o ID da URL ex: /editarservico/15

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    tipo_preco: "fixo",
    deliveryTime: "",
    modality: "online",
  });

  // --- 1. Carregar Dados do Serviço e Categorias ---
  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        // A) Buscar Categorias
        const catRes = await fetch("http://localhost:8000/api/categorias/", { headers: { Authorization: `Bearer ${token}` } });
        if (catRes.ok) setCategories(await catRes.json());

        // B) Buscar Dados do Serviço Atual
        const serviceRes = await fetch(`http://localhost:8000/api/servicos/${serviceId}/`, {
            headers: { Authorization: `Bearer ${token}` } 
        });

        if (serviceRes.ok) {
            const data = await serviceRes.json();
            
            // Preenche o formulário com os dados vindos do Backend
            setFormData({
                title: data.nome,
                description: data.descricao,
                category: data.categoria || "",
                price: data.preco,
                tipo_preco: data.tipo_preco,
                // Converte minutos de volta para dias (aproximado) ou mantém a lógica que preferir
                deliveryTime: data.prazo_estimado_minutos ? Math.ceil(data.prazo_estimado_minutos / 1440).toString() : "1",
                modality: data.area_atendimento,
            });
        } else {
            alert("Serviço não encontrado.");
            router.push("/perfilprofissional");
        }

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (serviceId) {
        loadData();
    }
  }, [serviceId, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- 2. Salvar Alterações (PATCH) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const token = localStorage.getItem("accessToken");

      const payload = {
        nome: formData.title,
        descricao: formData.description,
        categoria: formData.category ? parseInt(formData.category) : null,
        preco: parseFloat(formData.price),
        tipo_preco: formData.tipo_preco,
        prazo_estimado_minutos: parseInt(formData.deliveryTime) * 1440, // Dias -> Minutos
        area_atendimento: formData.modality,
      };

      const response = await fetch(`http://localhost:8000/api/servicos/${serviceId}/`, {
        method: "PATCH", // Importante: PATCH atualiza parcialmente
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Serviço atualizado com sucesso!");
        router.push("/perfilprofissional");
      } else {
        const errorData = await response.json();
        console.error(errorData);
        alert("Erro ao atualizar serviço. Verifique os dados.");
      }
    } catch (error) {
      console.error("Erro de conexão:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col">
      {/* Header Simples */}
      <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <Link href="/perfilprofissional"><Image src="/Images/FazFastLogo.png" alt="Logo" width={120} height={30} /></Link>
        <Link href="/perfilprofissional" className="text-sm text-gray-500 hover:text-green-600">Cancel e Voltar</Link>
      </header>

      <div className="flex-grow flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white w-full max-w-2xl rounded-3xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Editar Serviço</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input name="title" value={formData.title} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea name="description" rows={4} value={formData.description} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                    <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white" required>
                        <option value="">Selecione</option>
                        {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.nome}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Preço</label>
                    <select name="tipo_preco" value={formData.tipo_preco} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white">
                        <option value="fixo">Fixo</option>
                        <option value="por_hora">Por Hora</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
                    <input name="price" type="number" step="0.01" value={formData.price} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prazo (dias)</label>
                    <input name="deliveryTime" type="number" value={formData.deliveryTime} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Modalidade</label>
                <div className="flex gap-4">
                    {['online', 'presencial', 'hibrido'].map((mod) => (
                        <label key={mod} className="flex items-center capitalize">
                            <input type="radio" name="modality" value={mod} checked={formData.modality === mod} onChange={handleInputChange} className="mr-2 accent-green-600" />
                            {mod}
                        </label>
                    ))}
                </div>
            </div>

            <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => router.push("/perfilprofissional")} className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition">Cancelar</button>
                <button type="submit" disabled={isSaving} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-70">
                    {isSaving ? "Salvando..." : "Salvar Alterações"}
                </button>
            </div>

          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EditarServico;