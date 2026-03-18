import { Bell, User, Building2, ShieldAlert } from "lucide-react";
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

const NAV_LINKS = [
  { to: "/", label: "Agendamentos", exact: true },
  { to: "/clientes", label: "Clientes" },
  { to: "/profissionais", label: "Profissionais" },
];

export function NavBar() {
  const { user, logout } = UseAuth();
  const { pathname } = useLocation();

  function isActive(to: string, exact?: boolean) {
    return exact ? pathname === to : pathname.startsWith(to);
  }

  return (
    <header className="fixed top-0 left-0 w-full border-b bg-white/90 backdrop-blur-md z-50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <div className="w-4 h-4 bg-white rounded-sm" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">
            Smart<span className="text-blue-600">Agenda</span>
          </span>
        </Link>

        {/* Menu Centralizado */}
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

        {/* Ações */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center relative mr-2">
            {user?.name ? (
              <p className="text-sm font-medium text-gray-700">{user.name}</p>
            ) : (
              <Link to="/login">
                <Button variant="ghost" className="text-blue-800 hover:text-blue-600 hover:bg-blue-50">
                  Entrar
                </Button>
              </Link>
            )}
          </div>

          <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-blue-600 hover:bg-blue-50">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </Button>

          {/* Menu do Usuário */}
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
                <Link
                  to="/business-profile"
                  className={`flex items-center gap-2 cursor-pointer ${
                    isActive("/business-profile") ? "text-blue-600 bg-blue-50" : ""
                  }`}
                >
                  <Building2 className="h-4 w-4" /> Perfil do Negócio
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  to="/no-show-rules"
                  className={`flex items-center gap-2 cursor-pointer ${
                    isActive("/no-show-rules") ? "text-blue-600 bg-blue-50" : ""
                  }`}
                >
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

      </div>
    </header>
  );
}