"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const DocumentoPage: React.FC = () => {
  const router = useRouter();
  const docRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = () => {
    const content = docRef.current;
    if (!content) return;
  };

  const handleProceed = () => {
    router.push("/pagamento");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* HEADER */}
      <header className="bg-white shadow-md sticky top-0 z-50 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <img src="/Images/FazFastLogo.png" alt="FazFast Logo" className="h-10" />
          <nav className="hidden md:flex space-x-8 font-medium">
            {["Catálogo", "Home", "Perfil"].map((item) => (
              <a
                key={item}
                href="#"
                className="hover:text-green-600 transition-colors duration-300"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* CONTEÚDO */}
      <main className="container mx-auto px-6 py-12">
        <motion.h1
          className="text-3xl font-bold text-gray-900 mb-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Termo de Prestação de Serviços
        </motion.h1>

        <motion.div
          ref={docRef}
          className="bg-white shadow-xl rounded-2xl p-8 leading-relaxed text-justify max-w-4xl mx-auto border border-gray-100"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="mb-4">
            Eu, <span className="font-semibold text-gray-900">[Nome do Contratante]</span>, portador(a) do CPF
            <span className="font-semibold text-gray-900"> [XXX.XXX.XXX-XX]</span>, declaro estar ciente e de acordo com todos
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
            <p className="font-medium text-gray-800 mb-6">______________________, ____ / ____ / ______</p>
            <p className="font-semibold text-gray-900 mb-2">Assinatura do Contratante:</p>
            <div className="border-b border-gray-400 w-64 mx-auto"></div>
          </div>
        </motion.div>

        {/* BOTÕES */}
        <div className="flex justify-center mt-10 space-x-6">
          <button
            onClick={handleDownloadPDF}
            className="bg-white border border-gray-900 text-gray-900 px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition"
          >
            Baixar em PDF
          </button>
          <button
            onClick={handleProceed}
            className="bg-gray-900 text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition"
          >
            Prosseguir
          </button>
        </div>
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
