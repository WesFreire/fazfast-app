"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const DocumentoPage: React.FC = () => {
  const router = useRouter();
  const docRef = useRef<HTMLDivElement>(null);
  const [userName, setUserName] = useState("Seu Nome Completo");
  const [cpf, setCpf] = useState("XXX.XXX.XXX-XX");
  const [city, setCity] = useState("Sua Cidade");
  const [date] = useState(new Date().toLocaleDateString("pt-BR"));
  const [isFormFilled, setIsFormFilled] = useState(false);

  const handleDownloadPDF = () => {
    const content = docRef.current;
    if (!content) return;

    html2canvas(content, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save("termo_prestacao_servicos.pdf");
    });
  };

  const handleProceed = () => {
    if (userName === "Seu Nome Completo" || cpf === "XXX.XXX.XXX-XX" || city === "Sua Cidade") {
      alert("Por favor, preencha seus dados pessoais antes de prosseguir.");
      return;
    }
    setIsFormFilled(true);
    router.push("/");
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
            <input
              type="text"
              placeholder="Buscar serviços..."
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 hidden md:block"
            />
          </div>
        </div>
      </motion.header>

      {/* CONTEÚDO */}
      <main className="container mx-auto px-6 py-12">
        <motion.h1
          className="text-4xl font-bold text-gray-900 mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Termo de Prestação de Serviços
        </motion.h1>

        {/* Formulário para Dados Pessoais */}
        <motion.div
          className="bg-white shadow-md rounded-2xl p-6 mb-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Preencha seus Dados</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
              <input
                type="text"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>
          </div>
        </motion.div>

        {/* Documento */}
        <motion.div
          ref={docRef}
          className="bg-white shadow-xl rounded-2xl p-8 leading-relaxed text-justify max-w-4xl mx-auto border border-gray-100"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <p className="mb-4">
            Eu, <span className="font-semibold text-gray-900">{userName}</span>, portador(a) do CPF
            <span className="font-semibold text-gray-900"> {cpf}</span>, declaro estar ciente e de acordo com todos
            os termos descritos neste documento, autorizando o profissional cadastrado na plataforma{" "}
            <span className="text-green-600 font-semibold">FazFast</span> a realizar os serviços solicitados.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">1. Objeto do Contrato</h2>
          <p className="mb-4">
            O presente contrato tem por objeto a prestação de serviços profissionais por meio da plataforma FazFast,
            intermediando a conexão entre o cliente contratante e o profissional autônomo.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">2. Obrigações do Profissional</h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Executar os serviços contratados com qualidade e responsabilidade.</li>
            <li>Respeitar os prazos e condições acordadas com o contratante.</li>
            <li>Manter conduta ética e profissional durante toda a execução do serviço.</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">3. Obrigações do Contratante</h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Fornecer todas as informações necessárias para a realização do serviço.</li>
            <li>Efetuar o pagamento acordado por meio da plataforma FazFast.</li>
            <li>Tratar o profissional com respeito e cordialidade durante o serviço.</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">4. Responsabilidades da Plataforma</h2>
          <p className="mb-4">
            A plataforma FazFast atua como intermediadora, não sendo responsável pela execução direta dos serviços, mas
            garantindo um ambiente seguro e transparente para ambas as partes.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">5. Pagamentos e Cancelamentos</h2>
          <p className="mb-4">
            Todos os pagamentos devem ser realizados exclusivamente por meio da plataforma, garantindo segurança
            financeira para ambas as partes. Em caso de cancelamento, seguirão as políticas de reembolso descritas nos
            Termos de Uso disponíveis no site oficial.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">6. Autorização de Serviços</h2>
          <p className="mb-4">
            Ao aceitar este documento, o contratante autoriza o profissional a realizar os serviços conforme descrito no
            pedido, bem como a utilizar as ferramentas e materiais necessários à execução.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">7. Declaração de Ciência</h2>
          <p className="mb-4">
            Declaro estar ciente de que a plataforma FazFast não se responsabiliza por danos resultantes de má execução
            de serviços, sendo o profissional o único responsável por sua atuação.
          </p>

          <p className="mt-6 mb-2">
            Ao prosseguir, confirmo que li e compreendi integralmente todos os termos deste contrato, e que aceito
            livremente as condições aqui descritas.
          </p>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 italic mb-2">Local e Data:</p>
            <p className="font-medium text-gray-800 mb-6">{city}, {date}</p>
            <p className="font-semibold text-gray-900 mb-2">Assinatura do Contratante:</p>
            <div className="border-b border-gray-400 w-64 mx-auto"></div>
          </div>
        </motion.div>

        {/* BOTÕES */}
        <motion.div
          className="flex justify-center mt-10 space-x-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <button
            onClick={handleDownloadPDF}
            className="bg-white border border-gray-900 text-gray-900 px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition shadow-md"
          >
            Baixar em PDF
          </button>
          <button
            onClick={handleProceed}
            className="bg-gray-900 text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition shadow-md"
          >
            Prosseguir para Pagamento
          </button>
        </motion.div>
      </main>

      {/* FOOTER */}
      <footer className="bg-black text-gray-300 py-12 mt-12">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <img src="/Images/FazFastLogo_Inv.png" alt="FazFast Logo" className="h-12 mb-4" />
            <p className="text-sm leading-relaxed">
              Plataforma de serviços sob demanda, conectando clientes e profissionais em todo o Brasil com qualidade e confiança.
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
                <a
                  key={social.alt}
                  href="#"
                  aria-label={social.alt}
                  className="hover:scale-110 transition-transform duration-300"
                >
                  <img src={social.img} alt={social.alt} className="h-8 w-8 object-contain" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()}{" "}
          <span className="text-white font-semibold">FazFast</span>. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default DocumentoPage;