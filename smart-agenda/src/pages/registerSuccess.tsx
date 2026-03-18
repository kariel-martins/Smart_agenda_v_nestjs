import { Link, useLocation } from "react-router";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Mail, LogIn, RefreshCw } from "lucide-react";
import { useState } from "react";

export function RegisterSuccess() {
  const location = useLocation();
  const email = location.state?.email ?? "seu@email.com";
  const [resent, setResent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  function handleResend() {
    setResent(true);
    setCountdown(30);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setResent(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  const steps = [
    {
      icon: <CheckCircle2 className="h-5 w-5" />,
      title: "Conta criada",
      description: "Seus dados foram registrados com sucesso.",
      status: "done" as const,
    },
    {
      icon: <Mail className="h-5 w-5" />,
      title: "Verificar e-mail",
      description: (
        <>
          Enviamos um link de confirmação para{" "}
          <span className="font-semibold text-gray-700">{email}</span>.
          Verifique também a caixa de spam.
        </>
      ),
      status: "active" as const,
    },
    {
      icon: <LogIn className="h-5 w-5" />,
      title: "Acessar sua conta",
      description: "Após confirmar o e-mail, faça login e comece a agendar.",
      status: "pending" as const,
    },
  ];

  const statusStyles = {
    done: {
      icon: "bg-blue-50 text-blue-600",
      title: "text-gray-900",
      badge: "bg-blue-50 text-blue-600",
      badgeText: "Concluído",
    },
    active: {
      icon: "bg-amber-50 text-amber-500",
      title: "text-gray-900",
      badge: "bg-amber-50 text-amber-600",
      badgeText: "Pendente",
    },
    pending: {
      icon: "bg-gray-100 text-gray-400",
      title: "text-gray-400",
      badge: "bg-gray-100 text-gray-400",
      badgeText: "Em breve",
    },
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <div className="w-4 h-4 bg-white rounded-sm" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-gray-900">
            Smart<span className="text-blue-600">Agenda</span>
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-blue-50 rounded-full p-2">
              <CheckCircle2 className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              Conta criada!
            </h1>
          </div>
          <p className="text-gray-500 text-sm mb-8 ml-1">
            Siga os próximos passos para começar a usar o SmartAgenda.
          </p>

          {/* Steps */}
          <div className="space-y-0 mb-8">
            {steps.map((step, i) => {
              const s = statusStyles[step.status];
              return (
                <div key={i}>
                  <div className="flex items-start gap-4 py-4">
                    {/* Icon */}
                    <div className={`rounded-xl p-2 mt-0.5 flex-shrink-0 ${s.icon}`}>
                      {step.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className={`text-sm font-semibold ${s.title}`}>
                          {step.title}
                        </span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${s.badge}`}>
                          {s.badgeText}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Connector line */}
                  {i < steps.length - 1 && (
                    <div className="ml-5 w-px h-3 bg-gray-100" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              asChild
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-100 gap-2"
            >
              <Link to="/login">
                <LogIn className="h-4 w-4" />
                Ir para o login
              </Link>
            </Button>

            <Button
              variant="outline"
              className="w-full h-11 rounded-xl gap-2 text-gray-600"
              onClick={handleResend}
              disabled={resent}
            >
              <RefreshCw className={`h-4 w-4 ${resent ? "animate-spin" : ""}`} />
              {resent
                ? `Reenviar novamente em ${countdown}s`
                : "Reenviar e-mail de verificação"}
            </Button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            E-mail incorreto?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-semibold hover:underline"
            >
              Corrigir cadastro
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}