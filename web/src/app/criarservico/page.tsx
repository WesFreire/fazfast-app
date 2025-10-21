"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const CriarServico: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    deliveryTime: "",
    modality: "online",
    images: [] as File[],
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica para enviar os dados ao backend
    console.log("Serviço criado:", formData);
    router.push("/catalogo"); // Redireciona para o perfil após criar o serviço
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 overflow-x-hidden">
      {/* Header */}
      <header className="backdrop-blur-md bg-white/80 shadow-sm sticky top-0 z-50 transition">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <img src="/Images/FazFastLogo.png" alt="FazFast Logo" className="h-10" />
          <nav className="hidden md:flex space-x-8 font-medium">
            {["Catalogo", "Home", "Perfil"].map((item) => (
              <a
                key={item}
                href="#"
                className="hover:text-green-600 transition-colors duration-300"
              >
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Buscar serviços..."
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </header>

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
          {/* Título do Serviço */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
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
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Descrição do Serviço
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Descreva o que você oferece, como você ensina, e o que o cliente pode esperar..."
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition h-32"
              required
            />
          </div>

          {/* Categoria */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Categoria
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              required
            >
              <option value="" disabled>
                Selecione uma categoria
              </option>
              {[
                "Culinária",
                "Automotivo",
                "Domésticos",
                "Gerais",
                "Digital",
                "Educação",
              ].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Preço */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Valor Médio (R$)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Ex: 50"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              min="1"
              required
            />
          </div>

          {/* Prazo de Entrega */}
          <div>
            <label
              htmlFor="deliveryTime"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Prazo de Entrega (dias)
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

          {/* Modalidade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Modalidade
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="modality"
                  value="online"
                  checked={formData.modality === "online"}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Online
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="modality"
                  value="presential"
                  checked={formData.modality === "presential"}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Presencial
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="modality"
                  value="hybrid"
                  checked={formData.modality === "hybrid"}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Híbrido
              </label>
            </div>
          </div>

          {/* Upload de Imagens */}
          <div>
            <label
              htmlFor="images"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Imagens do Serviço (máximo 3)
            </label>
            <input
              type="file"
              id="images"
              name="images"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
            <p className="text-sm text-gray-500 mt-1">
              Adicione até 3 imagens para mostrar seu trabalho.
            </p>
            {formData.images.length > 0 && (
              <div className="mt-2 flex gap-2">
                {formData.images.map((file, index) => (
                  <div key={index} className="relative w-24 h-24">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-4 justify-end">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/catalogo")}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
            >
              Cancelar
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Publicar Serviço
            </motion.button>
          </div>
        </form>
      </motion.section>

      {/* Footer */}
      <footer className="bg-black text-gray-300 py-12 mt-12">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <img
              src="/Images/FazFastLogo_Inv.png"
              alt="FazFast Logo"
              className="h-12 mb-4"
            />
            <p className="text-sm leading-relaxed">
              Plataforma de serviços sob demanda, conectando clientes e
              profissionais em todo o Brasil com qualidade e confiança.
            </p>
          </div>
          <nav>
            <h4 className="font-semibold mb-4 text-white">
              Assistência ao Cliente
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                "Buscar",
                "Recomendado",
                "Categorias",
                "Perguntas Frequentes",
                "Termos de Uso",
              ].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="hover:text-green-600 transition-colors duration-300"
                  >
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
                <a
                  key={social.alt}
                  href="#"
                  aria-label={social.alt}
                  className="transition-transform duration-300 hover:scale-110"
                >
                  <img
                    src={social.img}
                    alt={social.alt}
                    className="h-8 w-8 object-contain"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()}{" "}
          <span className="text-white font-semibold">FazFast</span>. Todos os
          direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default CriarServico;