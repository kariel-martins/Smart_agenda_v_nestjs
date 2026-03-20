import { Link } from "react-router";
import {
  CalendarDays,
  Users,
  ShieldCheck,
  Bell,
  BarChart3,
  Clock,
  Check,
  X,
  ChevronRight,
  Scissors,
  Stethoscope,
  Dumbbell,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

// ── Hook de reveal no scroll ──────────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ── Mockup do dashboard ───────────────────────────────────────────────────────
function DashboardMockup() {
  const rows = [
    { initials: "MA", name: "Maria Andrade", service: "Corte + Escova", time: "14h00", status: "Confirmado", statusClass: "bg-green-50 text-green-700" },
    { initials: "JS", name: "João Silva", service: "Barba", time: "15h30", status: "Agendado", statusClass: "bg-blue-50 text-blue-700" },
    { initials: "FC", name: "Fernanda Costa", service: "Manicure", time: "16h00", status: "Pendente", statusClass: "bg-amber-50 text-amber-700" },
  ];

  const avatarColors = ["bg-blue-500", "bg-amber-500", "bg-emerald-500"];

  return (
    <div className="w-full max-w-3xl mx-auto mt-14">
      <div className="rounded-2xl border border-gray-200 shadow-2xl shadow-blue-100/40 overflow-hidden bg-white">
        {/* Browser bar */}
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-2.5 flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 bg-white border border-gray-200 rounded-md px-3 py-1 text-xs text-gray-400 max-w-xs mx-auto text-center">
            smartagenda.com/dashboard
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-[140px_1fr] min-h-[300px]">
          {/* Sidebar */}
          <div className="bg-gray-50 border-r border-gray-100 p-3 flex flex-col gap-1">
            {["Agendamentos", "Clientes", "Profissionais", "Serviços"].map(
              (item, i) => (
                <div
                  key={item}
                  className={`px-3 py-2 rounded-lg text-xs flex items-center gap-2 ${
                    i === 0
                      ? "bg-blue-600 text-white font-medium"
                      : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${i === 0 ? "bg-white/60" : "bg-gray-300"}`}
                  />
                  {item}
                </div>
              ),
            )}
          </div>

          {/* Main */}
          <div className="p-4 flex flex-col gap-3">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Hoje", val: "24", color: "text-blue-600", bar: 72 },
                { label: "Confirmados", val: "8", color: "text-green-600", bar: 40 },
                { label: "Esta semana", val: "R$ 4.2k", color: "text-gray-800", bar: 85 },
              ].map((s) => (
                <div key={s.label} className="bg-gray-50 rounded-xl p-3">
                  <div className={`text-lg font-bold ${s.color}`}>{s.val}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{s.label}</div>
                  <div className="h-1 bg-gray-200 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${s.bar}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Rows */}
            <div className="flex flex-col gap-2">
              {rows.map((r, i) => (
                <div
                  key={r.name}
                  className="bg-gray-50 rounded-xl px-3 py-2.5 flex items-center gap-3"
                >
                  <div
                    className={`w-7 h-7 rounded-full ${avatarColors[i]} flex items-center justify-center text-white text-[10px] font-semibold shrink-0`}
                  >
                    {r.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-gray-800 truncate">
                      {r.name}
                    </div>
                    <div className="text-[10px] text-gray-400">
                      {r.service} · {r.time}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${r.statusClass}`}
                  >
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Dados ─────────────────────────────────────────────────────────────────────
const FOR_WHO = [
  { icon: Scissors, title: "Salões de beleza", desc: "Agenda por profissional, serviços e controle de fila digital." },
  { icon: Stethoscope, title: "Clínicas e consultórios", desc: "Histórico de pacientes, confirmações e atendimentos em um painel." },
  { icon: Dumbbell, title: "Personal trainers", desc: "Organize alunos, horários e sessões sem perder compromissos." },
  { icon: Sparkles, title: "Estúdios e ateliês", desc: "Agendamentos por modalidade, sala ou profissional com filtros inteligentes." },
];

const FEATURES = [
  {
    icon: CalendarDays,
    title: "Agenda por profissional",
    desc: "Cada profissional tem sua disponibilidade. O sistema bloqueia conflitos automaticamente.",
  },
  {
    icon: ShieldCheck,
    title: "Controle de no-show",
    desc: "Defina limites de faltas e bloqueie clientes problemáticos automaticamente.",
  },
  {
    icon: Users,
    title: "Gestão de clientes",
    desc: "Histórico completo de atendimentos, faltas e status de cada cliente.",
  },
  {
    icon: Bell,
    title: "Notificações automáticas",
    desc: "Confirme, cancele ou finalize agendamentos com um clique. Clientes são avisados.",
  },
  {
    icon: BarChart3,
    title: "Relatórios e métricas",
    desc: "Acompanhe receita, taxa de ocupação e performance da sua equipe em tempo real.",
  },
  {
    icon: Clock,
    title: "Disponibilidade flexível",
    desc: "Configure horários por dia da semana com precisão para cada profissional.",
  },
];

const PLANS = [
  {
    name: "Básico",
    price: "49",
    period: "por mês · 1 profissional",
    highlight: false,
    badge: null,
    features: [
      { text: "Agenda ilimitada", included: true },
      { text: "Até 100 clientes", included: true },
      { text: "Controle de no-show", included: true },
      { text: "Notificações por e-mail", included: true },
      { text: "Múltiplos profissionais", included: false },
      { text: "Relatórios avançados", included: false },
    ],
  },
  {
    name: "Profissional",
    price: "129",
    period: "por mês · até 5 profissionais",
    highlight: true,
    badge: "Mais popular",
    features: [
      { text: "Agenda ilimitada", included: true },
      { text: "Clientes ilimitados", included: true },
      { text: "Controle de no-show avançado", included: true },
      { text: "Notificações por e-mail e SMS", included: true },
      { text: "Múltiplos profissionais", included: true },
      { text: "Relatórios completos", included: true },
    ],
  },
  {
    name: "Enterprise",
    price: "299",
    period: "por mês · ilimitado",
    highlight: false,
    badge: null,
    features: [
      { text: "Tudo do plano Profissional", included: true },
      { text: "Profissionais ilimitados", included: true },
      { text: "API de integração", included: true },
      { text: "Múltiplas unidades", included: true },
      { text: "Dashboard personalizado", included: true },
      { text: "Suporte prioritário 24h", included: true },
    ],
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans antialiased">

      {/* ── NAVBAR ── */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-16 bg-white/85 backdrop-blur-md border-b border-gray-100">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <div className="w-4 h-4 bg-white rounded-sm" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">
            Smart<span className="text-blue-600">Agenda</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
          <a href="#para-quem" className="hover:text-blue-600 transition-colors">Para quem</a>
          <a href="#funcionalidades" className="hover:text-blue-600 transition-colors">Funcionalidades</a>
          <a href="#precos" className="hover:text-blue-600 transition-colors">Preços</a>
        </nav>

        <Link to="/login">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-5 h-9 text-sm shadow-md shadow-blue-200">
            Entrar
          </Button>
        </Link>
      </header>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20 pb-16 overflow-hidden">
        {/* Glow de fundo */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-100/60 rounded-full blur-3xl" />
        </div>

        <div
          style={{ animation: "fadeUp 0.6s ease both" }}
          className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-xs font-medium px-4 py-1.5 rounded-full border border-blue-100 mb-7"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          Plataforma de agendamento inteligente
        </div>

        <h1
          style={{ animation: "fadeUp 0.6s 0.1s ease both", opacity: 0 }}
          className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.08] max-w-3xl mb-6"
        >
          Sua agenda{" "}
          <span className="text-blue-600">organizada.</span>
          <br />
          Seu negócio{" "}
          <span className="relative">
            crescendo.
            <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-200 rounded-full" />
          </span>
        </h1>

        <p
          style={{ animation: "fadeUp 0.6s 0.2s ease both", opacity: 0 }}
          className="text-lg md:text-xl text-gray-500 max-w-xl mb-10 leading-relaxed font-light"
        >
          Gerencie agendamentos, profissionais e clientes em um só lugar. Simples para quem agenda, poderoso para quem gerencia.
        </p>

        <div
          style={{ animation: "fadeUp 0.6s 0.3s ease both", opacity: 0 }}
          className="flex flex-wrap gap-3 justify-center mb-16"
        >
          <Link to="/register">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 h-12 text-base shadow-xl shadow-blue-200 hover:scale-105 transition-transform">
              Começar grátis
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
          <a href="#funcionalidades">
            <Button variant="outline" className="rounded-full px-8 h-12 text-base border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600">
              Ver como funciona
            </Button>
          </a>
        </div>

        {/* Stats */}
        <div
          style={{ animation: "fadeUp 0.6s 0.4s ease both", opacity: 0 }}
          className="flex flex-wrap items-center justify-center gap-8 mb-14"
        >
          {[
            { num: "3.200+", label: "Negócios ativos" },
            { num: "48 mil", label: "Agendamentos/mês" },
            { num: "4.9 ★", label: "Avaliação média" },
          ].map((s, i) => (
            <div key={s.label} className="flex items-center gap-8">
              {i > 0 && <div className="w-px h-8 bg-gray-200" />}
              <div className="text-center">
                <div className="text-2xl font-extrabold text-gray-900">{s.num}</div>
                <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Mockup */}
        <div style={{ animation: "fadeUp 0.7s 0.5s ease both", opacity: 0 }} className="w-full">
          <DashboardMockup />
        </div>
      </section>

      {/* ── PARA QUEM ── */}
      <section id="para-quem" className="bg-gray-50 py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3">Para quem é</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4 max-w-lg leading-tight">
              Feito para negócios que{" "}
              <span className="text-blue-600">não param</span>
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="text-gray-500 text-lg font-light max-w-lg mb-14">
              Seja um salão de beleza, clínica ou academia — o SmartAgenda se adapta ao seu ritmo.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FOR_WHO.map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <div className="bg-white border border-gray-100 rounded-2xl p-6 h-full hover:-translate-y-1 hover:shadow-lg hover:border-blue-100 transition-all duration-200">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                    <item.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FUNCIONALIDADES ── */}
      <section id="funcionalidades" className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3">O que ele faz</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
                Tudo que você precisa,{" "}
                <span className="text-blue-600">nada que não precisa</span>
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="text-gray-500 text-lg font-light max-w-xl mx-auto">
                Ferramentas pensadas para o dia a dia de quem vive de atendimento.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 60}>
                <div className="border border-gray-100 rounded-2xl p-6 hover:border-blue-100 hover:bg-blue-50/30 transition-all duration-200 group h-full">
                  <div className="w-10 h-10 bg-gray-50 group-hover:bg-blue-50 rounded-xl flex items-center justify-center mb-4 transition-colors">
                    <f.icon className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Preview de no-show */}
          <Reveal delay={200}>
            <div className="mt-12 bg-gray-50 border border-gray-100 rounded-2xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">Exemplo real</p>
                  <h3 className="text-xl font-extrabold text-gray-900 mb-2">Regras de no-show em ação</h3>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
                    Quando um cliente atinge o limite de faltas, o sistema age automaticamente — sem precisar de intervenção manual.
                  </p>
                </div>
                <div className="flex-1 flex flex-col gap-3 w-full">
                  {[
                    { initials: "MF", name: "Marcos Ferreira", service: "Coloração · 14h00", status: "No-show", statusClass: "bg-red-50 text-red-600", avatarClass: "bg-red-400" },
                    { initials: "JS", name: "João Silva", service: "Barba · 15h30", status: "Agendado", statusClass: "bg-blue-50 text-blue-600", avatarClass: "bg-blue-500" },
                  ].map((r) => (
                    <div key={r.name} className="bg-white border border-gray-100 rounded-xl px-4 py-3 flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${r.avatarClass} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                        {r.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-800">{r.name}</div>
                        <div className="text-xs text-gray-400">{r.service}</div>
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${r.statusClass}`}>
                        {r.status}
                      </span>
                    </div>
                  ))}
                  <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                    <p className="text-xs font-semibold text-blue-700 mb-0.5">Regra automática ativada</p>
                    <p className="text-xs text-blue-600/70">Marcos atingiu 2 faltas. Novos agendamentos bloqueados.</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── PREÇOS ── */}
      <section id="precos" className="bg-gray-50 py-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3">Planos e preços</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              Simples e <span className="text-blue-600">transparente</span>
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="text-gray-500 text-lg font-light mb-14">
              Sem surpresas na fatura. Cancele quando quiser.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
            {PLANS.map((plan, i) => (
              <Reveal key={plan.name} delay={i * 80}>
                <div
                  className={`relative bg-white rounded-2xl p-7 text-left flex flex-col h-full transition-all duration-200 hover:-translate-y-1 ${
                    plan.highlight
                      ? "border-2 border-blue-600 shadow-xl shadow-blue-100"
                      : "border border-gray-100 hover:shadow-lg"
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-4 py-1 rounded-full whitespace-nowrap">
                      {plan.badge}
                    </div>
                  )}

                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                    {plan.name}
                  </p>

                  <div className="flex items-start gap-1 mb-1">
                    <span className="text-xl font-bold text-gray-500 mt-2">R$</span>
                    <span className="text-5xl font-extrabold text-gray-900 tracking-tight">
                      {plan.price}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-6">{plan.period}</p>

                  <div className="h-px bg-gray-100 mb-6" />

                  <ul className="flex flex-col gap-3 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li key={f.text} className="flex items-center gap-2.5">
                        {f.included ? (
                          <div className="w-4 h-4 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                            <Check className="h-2.5 w-2.5 text-blue-600" />
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                            <X className="h-2.5 w-2.5 text-gray-300" />
                          </div>
                        )}
                        <span className={`text-sm ${f.included ? "text-gray-700" : "text-gray-300"}`}>
                          {f.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link to="/register">
                    <Button
                      className={`w-full rounded-xl h-11 text-sm font-semibold ${
                        plan.highlight
                          ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200"
                          : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"
                      }`}
                    >
                      {plan.name === "Enterprise" ? "Falar com vendas" : "Começar grátis por 14 dias"}
                    </Button>
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="bg-blue-600 py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-500/40 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-2xl mx-auto">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-200 mb-4">
              Pronto para começar?
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-5 leading-tight">
              Menos confusão.<br />Mais atendimentos.
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="text-blue-100/80 text-lg font-light mb-10">
              Crie sua conta em menos de 2 minutos e experimente grátis por 14 dias.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/register">
                <Button className="bg-white text-blue-600 hover:bg-blue-50 rounded-full px-8 h-12 text-base font-semibold shadow-xl">
                  Criar conta grátis
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 rounded-full px-8 h-12 text-base border border-white/20">
                  Já tenho uma conta
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-900 py-8 px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-gray-400 font-bold text-lg">
          Smart<span className="text-blue-400">Agenda</span>
        </span>
        <p className="text-gray-600 text-sm">© 2026 SmartAgenda. Todos os direitos reservados.</p>
      </footer>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}