"use client";

import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const PagamentoPage: React.FC = () => {
  const [metodoPagamento, setMetodoPagamento] = useState("credito");
  const [nome, setNome] = useState("");
  const [numero, setNumero] = useState("");
  const [validade, setValidade] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardType, setCardType] = useState<"visa" | "mastercard" | "elo" | "unknown">("unknown");
  const [pagamentoConcluido, setPagamentoConcluido] = useState(false);

  const router = useRouter();
  const revealRefs = useRef<HTMLDivElement[]>([]);

  // Scroll reveal
  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-8");
          }
        }),
      { threshold: 0.1 }
    );

    revealRefs.current.forEach((el) => {
      el.classList.add("opacity-0", "translate-y-8", "transition-all", "duration-700", "ease-out");
      observer.observe(el);
    });

    return () => revealRefs.current.forEach((el) => observer.unobserve(el));
  }, []);

  // Detecta tipo do cartão
  const detectCardType = (number: string): "visa" | "mastercard" | "elo" | "unknown" => {
    if (number.length < 4) return "unknown";
    if (number.startsWith("4")) return "visa";
    if (/^5[1-5]/.test(number) || /^(222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)/.test(number))
      return "mastercard";
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
    if (eloRanges.some((r) => bin >= r.start && bin <= r.end)) return "elo";
    return "unknown";
  };

  // Handlers
  const handleNomeChange = (e: ChangeEvent<HTMLInputElement>) =>
    setNome(e.target.value.replace(/[^A-Za-zÀ-ÿ\s]/g, "").toUpperCase());
  const handleNumeroChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
    setNumero(formatted);
    setCardType(detectCardType(raw));
  };
  const handleValidadeChange = (e: ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2);
    setValidade(v);
  };
  const handleCvvChange = (e: ChangeEvent<HTMLInputElement>) =>
    setCvv(e.target.value.replace(/\D/g, "").slice(0, 3));

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

  const handlePagamento = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !numero || !validade || !cvv) {
      alert("Preencha todas as informações do cartão antes de continuar!");
      return;
    }

    setPagamentoConcluido(true);
    setTimeout(() => router.push("/"), 5000);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 overflow-x-hidden relative">
      {/* POP-UP DE PAGAMENTO CONCLUÍDO */}
      <AnimatePresence>
        {pagamentoConcluido && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl shadow-2xl text-center px-10 py-8 max-w-sm"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 15 }}
            >
              <motion.div
                className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="white"
                  className="w-10 h-10"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Pagamento Concluído!</h2>
              <p className="text-gray-600 mb-4">Seu pagamento foi processado com sucesso.</p>
              <p className="text-sm text-gray-400">Redirecionando para a Home em 5 segundos...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

            {/* Login Icon */}
            <Link
              href="/login"
              className="p-2 rounded-xl hover:bg-green-100 transition-all"
            >
              <Image src="/Images/login.png" alt="Login" width={28} height={28} className="opacity-80 hover:opacity-100 transition" />
            </Link>

            {/* Logout Icon */}
            <button
              onClick={() => console.log("Logout clicked")}
              className="p-2 rounded-xl hover:bg-red-100 transition-all"
            >
              <Image src="/Images/logout.png" alt="Logout" width={28} height={28} className="opacity-80 hover:opacity-100 transition" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* PASSOS */}
      <div className="bg-white border-b py-4">
        <div className="container mx-auto flex justify-center space-x-10 text-sm font-medium">
          {[
            { num: 1, texto: "Contato" },
            { num: 2, texto: "Definir valores" },
            { num: 3, texto: "Endereço" },
            { num: 4, texto: "Pagamento" },
          ].map((etapa) => (
            <div
              key={etapa.num}
              className={`flex items-center space-x-2 ${
                etapa.num === 4 ? "text-green-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  etapa.num === 4
                    ? "bg-green-600 text-white"
                    : "border border-gray-300"
                }`}
              >
                {etapa.num}
              </div>
              <span>{etapa.texto}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CONTEÚDO */}
      <main className="flex-1 container mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Summary */}
        <div ref={addToRefs} className="bg-white shadow-md rounded-lg p-6 h-fit">
          <h2 className="text-lg text-gray-900 font-semibold mb-4">Resumo</h2>

          <div className="flex items-center justify-between border rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-3">
              <Image src="/Images/DwightProfile.png" alt="Profissional" width={40} height={40} className="rounded-full" />
              <span className="font-medium text-gray-800">Marcelo Von Richtofen</span>
            </div>
            <span className="font-semibold text-gray-900">R$ 170</span>
          </div>

          <div className="text-sm text-gray-700 space-y-2 mb-4">
            <p><strong>Endereço:</strong> Rua Savanna Oliveira, 183, Bairro Lua Amena</p>
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
            <div className="flex justify-between"><span>Subtotal</span><span>R$ 170</span></div>
            <div className="flex justify-between"><span>Taxa de Serviço FazFast</span><span>R$ 10</span></div>
            <div className="flex justify-between font-semibold text-base pt-2"><span>Total</span><span>R$ 180</span></div>
          </div>
        </div>

        {/* Payment */}
        <div ref={addToRefs}>
          <h2 className="text-lg text-gray-900 font-semibold mb-4">Pagamento</h2>

          {/* Tabs */}
          <div className="flex space-x-4 mb-6 border-b">
            {["credito", "paypal", "debito"].map((metodo) => (
              <button
                key={metodo}
                onClick={() => setMetodoPagamento(metodo)}
                className={`pb-2 ${
                  metodoPagamento === metodo
                    ? "border-b-2 border-gray-900 font-medium text-gray-900"
                    : "text-gray-500"
                }`}
              >
                {metodo === "credito"
                  ? "Cartão de Crédito"
                  : metodo === "paypal"
                  ? "PayPal"
                  : "Cartão de Débito"}
              </button>
            ))}
          </div>

          {metodoPagamento === "credito" && (
            <div className="space-y-6">
              {/* Cartão visual */}
              <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 text-white shadow-xl">
                <div className="flex justify-between items-center mb-8">
                  <div className="w-10 h-6 bg-yellow-400 rounded-md"></div>
                  {cardLogoSrc && <Image src={cardLogoSrc} alt="Logo" width={50} height={30} />}
                </div>
                <div className="tracking-widest text-lg font-semibold mb-4">{numero || "•••• •••• •••• ••••"}</div>
                <div className="text-sm flex justify-between">
                  <span>{nome || "CARDHOLDER"}</span>
                  <span>{validade || "MM/AA"}</span>
                </div>
              </div>

              {/* Formulário */}
              <form className="space-y-4" onSubmit={handlePagamento}>
                <input
                  type="text"
                  placeholder="Nome do titular do cartão"
                  value={nome}
                  onChange={handleNomeChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-900"
                />
                <input
                  type="text"
                  placeholder="Número do cartão"
                  value={numero}
                  onChange={handleNumeroChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-900"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Data de Validade (MM/AA)"
                    value={validade}
                    onChange={handleValidadeChange}
                    className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-900"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    value={cvv}
                    onChange={handleCvvChange}
                    className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gray-900 text-white rounded-lg py-3 font-medium hover:bg-gray-800 transition"
                >
                  Pagar
                </button>
              </form>
            </div>
          )}
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
                  <a href="#" className="hover:text-green-600 transition-colors duration-300">{link}</a>
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
                <a key={social.alt} href="#" aria-label={social.alt} className="hover:scale-110 transition-transform duration-300">
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

export default PagamentoPage;
