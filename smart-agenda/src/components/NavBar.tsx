import {
  Bell,
  User,
  Building2,
  ShieldAlert,
  CalendarCheck,
  CalendarDays,
  Menu,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { Link, useLocation } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { UseAuth } from "@/contexts/AuthContext";
import { useGoogleCalendarConnect, useGoogleCalendarStatus } from "@/hooks/google-calendar/google-calendar.mutate";
import { useState } from "react";

const NAV_LINKS = [
  { to: "/appointment", label: "Agendamentos", exact: true },
  { to: "/clientes", label: "Clientes" },
  { to: "/profissionais", label: "Profissionais" },
];

export function NavBar() {
  const { user, logout } = UseAuth();
  const { pathname } = useLocation();
  const { data: calendarStatus } = useGoogleCalendarStatus();
  const { mutateAsync: connect } = useGoogleCalendarConnect();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleConnectGoogle() {
    await connect()
  }

  function isActive(to: string, exact?: boolean) {
    return exact ? pathname === to : pathname.startsWith(to);
  }

  function closeMobile() {
    setMobileOpen(false);
  }

  return (
    <header className="fixed top-0 left-0 w-full border-b bg-white/90 backdrop-blur-md z-50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <div className="w-4 h-4 bg-white rounded-sm" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">
            Smart<span className="text-blue-600">Agenda</span>
          </span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-gray-600">
          {NAV_LINKS.map(({ to, label, exact }) => (
            <Link
              key={to}
              to={to}
              className={`py-5 transition-colors ${
                isActive(to, exact)
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "hover:text-blue-600 border-b-2 border-transparent"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Ações desktop */}
        <div className="hidden lg:flex items-center gap-3">
          {user?.name ? (
            <p className="text-sm font-medium text-gray-700">{user.name}</p>
          ) : (
            <Link to="/login">
              <Button variant="ghost" className="text-blue-800 hover:text-blue-600 hover:bg-blue-50">
                Entrar
              </Button>
            </Link>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleConnectGoogle}
            disabled={calendarStatus?.connected}
            className={`flex items-center gap-2 rounded-full text-xs px-3 transition-colors ${
              calendarStatus?.connected
                ? "border-green-200 text-green-700 bg-green-50 cursor-default"
                : "text-gray-600 hover:text-blue-600 hover:border-blue-300"
            }`}
          >
            {calendarStatus?.connected ? (
              <CalendarCheck className="h-4 w-4" />
            ) : (
              <CalendarDays className="h-4 w-4" />
            )}
            {calendarStatus?.connected ? "Calendar conectado" : "Conectar Calendar"}
          </Button>

          <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-blue-600 hover:bg-blue-50">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`transition-colors ${
                  isActive("/business-profile") || isActive("/no-show-rules")
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem asChild>
                <Link to="/business-profile" className={`flex items-center gap-2 cursor-pointer ${isActive("/business-profile") ? "text-blue-600 bg-blue-50" : ""}`}>
                  <Building2 className="h-4 w-4" /> Perfil do Negócio
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/no-show-rules" className={`flex items-center gap-2 cursor-pointer ${isActive("/no-show-rules") ? "text-blue-600 bg-blue-50" : ""}`}>
                  <ShieldAlert className="h-4 w-4" /> Regras de No-Show
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()} className="text-red-600 gap-2 cursor-pointer">
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Ações mobile (direita) */}
        <div className="flex lg:hidden items-center gap-2">
          <Button variant="ghost" size="icon" className="relative text-gray-600">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-gray-600"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Menu mobile expandido */}
      {mobileOpen && (
        <div className="lg:hidden border-t bg-white px-4 pb-4 shadow-md">
          {/* Nome do usuário */}
          {user?.name && (
            <p className="text-sm font-medium text-gray-700 pt-4 pb-2 border-b border-gray-100">
              {user.name}
            </p>
          )}

          {/* Links de navegação */}
          <nav className="flex flex-col gap-1 pt-2">
            {NAV_LINKS.map(({ to, label, exact }) => (
              <Link
                key={to}
                to={to}
                onClick={closeMobile}
                className={`px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  isActive(to, exact)
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-gray-100 mt-3 pt-3 flex flex-col gap-1">
            {/* Google Calendar */}
            <button
              onClick={() => { closeMobile(); handleConnectGoogle(); }}
              disabled={calendarStatus?.connected}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full text-left ${
                calendarStatus?.connected
                  ? "text-green-700 bg-green-50 cursor-default"
                  : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
              }`}
            >
              {calendarStatus?.connected ? (
                <CalendarCheck className="h-4 w-4 shrink-0" />
              ) : (
                <CalendarDays className="h-4 w-4 shrink-0" />
              )}
              {calendarStatus?.connected ? "Calendar conectado" : "Conectar Calendar"}
            </button>

            {/* Perfil do Negócio */}
            <Link
              to="/business-profile"
              onClick={closeMobile}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive("/business-profile") ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Building2 className="h-4 w-4 shrink-0" /> Perfil do Negócio
            </Link>

            {/* No-Show */}
            <Link
              to="/no-show-rules"
              onClick={closeMobile}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive("/no-show-rules") ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <ShieldAlert className="h-4 w-4 shrink-0" /> Regras de No-Show
            </Link>

            {/* Sair */}
            <button
              onClick={() => { closeMobile(); logout(); }}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full text-left"
            >
              Sair
            </button>
          </div>
        </div>
      )}
    </header>
  );
}