"use client";

import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import Image from "next/image";

const PagamentoPage: React.FC = () => {
  const [metodoPagamento, setMetodoPagamento] = useState("credito");

  // Estados do cartão
  const [nome, setNome] = useState("");
  const [numero, setNumero] = useState("");
  const [validade, setValidade] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardType, setCardType] = useState<"visa" | "mastercard" | "elo" | "unknown">("unknown");

  const revealRefs = useRef<HTMLDivElement[]>([]);

  // Scroll reveal
  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-8");
          }
        });
      },
      { threshold: 0.1 }
    );

    revealRefs.current.forEach((el) => {
      el.classList.add(
        "opacity-0",
        "translate-y-8",
        "transition-all",
        "duration-700",
        "ease-out"
      );
      observer.observe(el);
    });

    return () => {
      revealRefs.current.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Função para detectar o tipo de cartão
  const detectCardType = (number: string): "visa" | "mastercard" | "elo" | "unknown" => {
    if (number.length < 4) return "unknown";

    // Visa: começa com 4
    if (number.startsWith("4")) return "visa";

    // Mastercard: 51-55 ou 2221-2720
    if (
      /^5[1-5]/.test(number) ||
      /^(222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)/.test(number)
    ) {
      return "mastercard";
    }

    // Elo: prefixos comuns e ranges
    const eloPrefixes = [
      "401178",
      "401179",
      "431274",
      "438935",
      "451416",
      "457631",
      "457632",
      "504175",
      "627780",
      "636297",
      "636368",
    ];

    const eloRanges = [
      { start: 506699, end: 506778 },
      { start: 509000, end: 509999 },
      { start: 650033, end: 650552 },
      { start: 650978, end: 651659 },
      { start: 655000, end: 655021 },
    ];

    if (eloPrefixes.some((prefix) => number.startsWith(prefix))) return "elo";

    const bin = parseInt(number.slice(0, 6), 10);
    if (eloRanges.some((range) => bin >= range.start && bin <= range.end)) return "elo";

    return "unknown";
  };

  // Handlers para formatação
  const handleNomeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^A-Za-zÀ-ÿ\s]/g, "").toUpperCase();
    setNome(value);
  };

  const handleNumeroChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = rawValue.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
    setNumero(formatted);
    setCardType(detectCardType(rawValue));
  };

  const handleValidadeChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (value.length >= 3) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }
    setValidade(value);
  };

  const handleCvvChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 3);
    setCvv(value);
  };

  const getCardLogo = () => {
    switch (cardType) {
      case "visa":
        return "/Images/Visa_Logo.png";
      case "mastercard":
        return "/Images/Mastercard_Logo.png";
      case "elo":
        return "/Images/Elo_Logo.png";
      default:
        return null;
    }
  };

  const cardLogoSrc = getCardLogo();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Image
            src="/Images/FazFastLogo.png"
            alt="FazFast Logo"
            width={120}
            height={40}
            className="h-10 w-auto"
          />
          <nav className="hidden md:flex space-x-8 font-medium text-gray-700">
            <a href="#" className="hover:text-green-600 transition">
              Home
            </a>
            <a href="#" className="hover:text-green-600 transition">
              Sobre
            </a>
            <a href="#" className="hover:text-green-600 transition">
              Contato
            </a>
            <a href="#" className="hover:text-green-600 transition">
              Blog
            </a>
          </nav>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Buscar..."
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
            />
            <button className="text-gray-600 hover:text-green-600 transition">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-2.3 2.3c-.6.6-.2 1.7.7 1.7H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Steps */}
      <div className="bg-white border-b py-4">
        <div className="container mx-auto flex justify-center space-x-10 text-sm font-medium text-gray-700">
          <div className="flex items-center space-x-2 text-gray-400">
            <div className="w-6 h-6 rounded-full flex items-center justify-center border border-gray-300 text-xs">
              1
            </div>
            <span>Address</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <div className="w-6 h-6 rounded-full flex items-center justify-center border border-gray-300 text-xs">
              2
            </div>
            <span>Shipping</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-900">
            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-900 text-white text-xs">
              3
            </div>
            <span>Payment</span>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <main className="flex-1 container mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Summary */}
        <div ref={addToRefs} className="bg-white shadow-md rounded-lg p-6 h-fit">
          <h2 className="text-lg text-gray-900 font-semibold mb-4">Summary</h2>

          <div className="flex items-center justify-between border rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-3">
              <Image
                src="/Images/DwightProfile.png"
                alt="Profissional"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="font-medium text-gray-800">Marcelo Von Richtofen</span>
            </div>
            <span className="font-semibold text-gray-900">R$ 170</span>
          </div>

          <div className="text-sm text-gray-700 space-y-2 mb-4">
            <p>
              <strong>Endereço:</strong> Rua Savanna Oliveira, 183, Bairro Lua Amena
            </p>
            <p>
              <strong>Método de pagamento:</strong>{" "}
              {metodoPagamento === "credito"
                ? "Cartão de Crédito"
                : metodoPagamento === "debito"
                ? "Cartão de Débito"
                : "PayPal"}
            </p>
          </div>

          <div className="border-t pt-4 text-sm space-y-2">
            <div className="flex text-gray-900 justify-between">
              <span>Subtotal</span>
              <span>R$ 170</span>
            </div>
            <div className="flex text-gray-900 justify-between">
              <span>Taxa de Serviço FazFast</span>
              <span>R$ 10</span>
            </div>
            <div className="flex text-gray-900 justify-between font-semibold text-base pt-2">
              <span>Total</span>
              <span>R$ 180</span>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div ref={addToRefs}>
          <h2 className="text-lg text-gray-900 font-semibold mb-4">Payment</h2>

          {/* Tabs */}
          <div className="flex space-x-4 mb-6 border-b">
            <button
              onClick={() => setMetodoPagamento("credito")}
              className={`pb-2 ${
                metodoPagamento === "credito"
                  ? "border-b-2 border-gray-900 font-medium text-gray-900"
                  : "text-gray-500"
              }`}
            >
              Cartão de Crédito
            </button>
            <button
              onClick={() => setMetodoPagamento("paypal")}
              className={`pb-2 ${
                metodoPagamento === "paypal"
                  ? "border-b-2 border-gray-900 font-medium text-gray-900"
                  : "text-gray-500"
              }`}
            >
              PayPal
            </button>
            <button
              onClick={() => setMetodoPagamento("debito")}
              className={`pb-2 ${
                metodoPagamento === "debito"
                  ? "border-b-2 border-gray-900 font-medium text-gray-900"
                  : "text-gray-500"
              }`}
            >
              Cartão de Débito
            </button>
          </div>

          {metodoPagamento === "credito" && (
            <div className="space-y-6">
              {/* Cartão visual */}
              <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 text-white shadow-xl">
                <div className="flex justify-between items-center mb-8">
                  <div className="w-10 h-6 bg-yellow-400 rounded-md flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="black"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 8.25h19.5M4.5 12h15m-13.5 3.75h12"
                      />
                    </svg>
                  </div>
                  {cardLogoSrc && (
                    <Image
                      src={cardLogoSrc}
                      alt={`${cardType} Logo`}
                      width={50}
                      height={30}
                      className="object-contain"
                    />
                  )}
                </div>
                <div className="tracking-widest text-lg font-semibold mb-4">
                  {numero || "•••• •••• •••• ••••"}
                </div>
                <div className="text-sm flex justify-between">
                  <span>{nome || "CARDHOLDER"}</span>
                  <span>{validade || "MM/AA"}</span>
                </div>
              </div>

              {/* Formulário */}
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Nome do titular do cartão"
                  value={nome}
                  onChange={handleNomeChange}
                  className="w-full px-4 py-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
                <input
                  type="text"
                  placeholder="Número do cartão"
                  value={numero}
                  onChange={handleNumeroChange}
                  className="w-full px-4 py-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Data de Validade (MM/AA)"
                    value={validade}
                    onChange={handleValidadeChange}
                    className="px-4 py-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    value={cvv}
                    onChange={handleCvvChange}
                    className="px-4 py-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>

                <div className="flex items-center space-x-2 text-sm">
                  <input type="checkbox" id="save-card" className="h-4 w-4 accent-gray-900" />
                  <label htmlFor="save-card" className="text-gray-700">
                    Salvar informações do Cartão
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <button
                    type="button"
                    className="border rounded-lg py-3 font-medium hover:bg-gray-100 transition text-gray-900"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="bg-gray-900 text-white rounded-lg py-3 font-medium hover:bg-gray-800 transition"
                  >
                    Pagar
                  </button>
                </div>
              </form>
            </div>
          )}

          {metodoPagamento === "debito" && (
            <div className="space-y-6">
              {/* Implementação similar ao crédito, mas para débito */}
              <p className="text-gray-700">Formulário de Cartão de Débito em desenvolvimento.</p>
            </div>
          )}

          {metodoPagamento === "paypal" && (
            <div className="space-y-6">
              {/* Implementação para PayPal */}
              <p className="text-gray-700">Integração com PayPal em desenvolvimento.</p>
            </div>
          )}
        </div>
      </main>

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
              {["Buscar", "Recomendado", "Categorias", "Perguntas Frequentes", "Termos de Uso"].map((link) => (
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

export default PagamentoPage;