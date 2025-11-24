"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

// Interface para categorias vindas da API
interface Category {
  id: number;
  nome: string;
}

const CriarServico: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [professionalId, setProfessionalId] = useState<number | null>(null);

  // Estado do formulário mapeado para o Backend
  const [formData, setFormData] = useState({
    title: "", // Backend: nome
    description: "", // Backend: descricao
    category: "", // Backend: categoria (ID)
    price: "", // Backend: preco
    tipo_preco: "fixo", // Novo campo necessário
    deliveryTime: "", // Backend: prazo_estimado_minutos
    modality: "online", // Backend: area_atendimento
    images: [] as File[], // Backend: PortfolioItem
  });

  // --- 1. Busca Dados Iniciais (Categorias e ID Profissional) ---
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        // Busca Categorias
        const catRes = await fetch("http://localhost:8000/api/categorias/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (catRes.ok) setCategories(await catRes.json());

        // Busca ID do Usuário -> Profissional
        const meRes = await fetch("http://localhost:8000/api/me/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const meData = await meRes.json();

        const profRes = await fetch("http://localhost:8000/api/profissionais/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const allProfs = await profRes.json();
        const myProf = allProfs.find((p: any) => p.usuario.id === meData.id);

        if (myProf) {
          setProfessionalId(myProf.id);
        } else {
          alert("Você precisa ser um profissional para criar serviços.");
          router.push("/perfilusuario");
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    fetchData();
  }, [router]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        images: Array.from(e.target.files || []),
      }));
    }
  };

  // --- 2. Envio do Formulário ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!professionalId) return;
    setIsLoading(true);

    try {
      const token = localStorage.getItem("accessToken");

      // A) Cria o Serviço
      const servicePayload = {
        profissional_id: professionalId,
        nome: formData.title,
        descricao: formData.description,
        categoria: formData.category ? parseInt(formData.category) : null,
        preco: parseFloat(formData.price),
        tipo_preco: formData.tipo_preco,
        // Converte dias (input) para minutos (backend) ou envia direto se mudar a label
        prazo_estimado_minutos: parseInt(formData.deliveryTime) * 60 * 24, // Ex: 1 dia = 1440 min
        area_atendimento: formData.modality, 
        is_ativo: true,
      };

      const response = await fetch("http://localhost:8000/api/servicos/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(servicePayload),
      });

      if (!response.ok) throw new Error("Erro ao criar serviço base.");
      
      const createdService = await response.json();
      console.log("Serviço criado com ID:", createdService.id);

      // B) Envia as Imagens (se houver) para PortfolioItem
      if (formData.images.length > 0) {
        for (const file of formData.images) {
          const imageFormData = new FormData();
          imageFormData.append("servico", createdService.id);
          imageFormData.append("arquivo_midia", file);
          imageFormData.append("legenda", "Imagem do serviço");

          await fetch("http://localhost:8000/api/portfolio-items/", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` }, // FormData não precisa de Content-Type
            body: imageFormData,
          });
        }
      }

      alert("Serviço publicado com sucesso!");
      router.push("/perfilprofissional");

    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro ao publicar o serviço.");
    } finally {
      setIsLoading(false);
    }
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
             <Link href="/perfilprofissional" className="text-sm text-gray-500 hover:text-green-600">
                ← Voltar
             </Link>
          </div>
        </div>
      </motion.header>

      {/* Main Section */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
        className="max-w-4xl mx-auto px-6 py-12"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Criar Novo Serviço
        </h1>
        <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
          Crie seu serviço para alcançar milhares de clientes! Descreva o que você
          oferece, escolha a categoria e defina o preço.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Título do Serviço
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Ex: Vou ensinar química ao seu filho(a)"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              required
            />
          </div>

          {/* Descrição */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Descrição do Serviço
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Descreva o que você oferece..."
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition h-32"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Categoria Dinâmica */}
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
                </label>
                <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition bg-white"
                required
                >
                <option value="" disabled>Selecione uma categoria</option>
                {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                    {cat.nome}
                    </option>
                ))}
                </select>
            </div>

            {/* Tipo de Preço */}
             <div>
                <label htmlFor="tipo_preco" className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Cobrança
                </label>
                <select
                id="tipo_preco"
                name="tipo_preco"
                value={formData.tipo_preco}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition bg-white"
                >
                <option value="fixo">Valor Fixo</option>
                <option value="por_hora">Por Hora</option>
                </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Preço */}
            <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Valor (R$)
                </label>
                <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Ex: 50.00"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                min="1"
                step="0.01"
                required
                />
            </div>

            {/* Prazo */}
            <div>
                <label htmlFor="deliveryTime" className="block text-sm font-medium text-gray-700 mb-2">
                Prazo Estimado (dias)
                </label>
                <input
                type="number"
                id="deliveryTime"
                name="deliveryTime"
                value={formData.deliveryTime}
                onChange={handleInputChange}
                placeholder="Ex: 3"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                min="1"
                required
                />
            </div>
          </div>

          {/* Modalidade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Modalidade (Local de Atendimento)
            </label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="modality"
                  value="online"
                  checked={formData.modality === "online"}
                  onChange={handleInputChange}
                  className="mr-2 accent-green-600"
                />
                Online
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="modality"
                  value="presencial"
                  checked={formData.modality === "presencial"}
                  onChange={handleInputChange}
                  className="mr-2 accent-green-600"
                />
                Presencial
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="modality"
                  value="hibrido"
                  checked={formData.modality === "hibrido"}
                  onChange={handleInputChange}
                  className="mr-2 accent-green-600"
                />
                Híbrido
              </label>
            </div>
          </div>

          {/* Upload de Imagens */}
          <div>
            <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-2">
              Imagens do Serviço (máximo 3)
            </label>
            <input
              type="file"
              id="images"
              name="images"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition bg-white"
            />
            <p className="text-xs text-gray-500 mt-1">
              Imagens serão salvas no portfólio do serviço.
            </p>
            {formData.images.length > 0 && (
              <div className="mt-4 flex gap-4">
                {formData.images.map((file, index) => (
                  <div key={index} className="relative w-24 h-24 shadow-md rounded-md overflow-hidden">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-4 justify-end pt-4">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/perfilprofissional")}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Cancelar
            </motion.button>
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium shadow-md disabled:opacity-70"
            >
              {isLoading ? "Publicando..." : "Publicar Serviço"}
            </motion.button>
          </div>
        </form>
      </motion.section>

      {/* Footer */}
      <footer className="bg-black text-gray-300 py-12 mt-12">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <Image src="/Images/FazFastLogo_Inv.png" alt="FazFast Logo" width={160} height={40} className="h-12 mb-4" />
            <p className="text-sm leading-relaxed">
              Plataforma de serviços sob demanda, conectando clientes e
              profissionais em todo o Brasil com qualidade e confiança.
            </p>
          </div>
          <nav>
            <h4 className="font-semibold mb-4 text-white">Assistência ao Cliente</h4>
            <ul className="space-y-2 text-sm">
              {["Buscar", "Recomendado", "Categorias", "Perguntas Frequentes", "Termos de Uso"].map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-green-600 transition-colors duration-300">
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

export default CriarServico;