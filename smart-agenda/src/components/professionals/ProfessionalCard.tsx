import type { Professional } from "@/hooks/professionals/dtos/professional.types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { BadgeCheck, BriefcaseMedical, CalendarDays, Mail, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Badge } from "../ui/badge";
import { Link } from "react-router";

export function ProfessionalCard({
  data,
  onEdit,
  onDelete,
  onAvailability,
}: {
  data: Professional;
  onEdit: (p: Professional) => void;
  onDelete: (p: Professional) => void;
  onAvailability: (p: Professional) => void;
}) {
  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700 text-2xl font-bold">
            {data.name.charAt(0)}
          </div>
          <div
            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${data.isActive ? "bg-green-500" : "bg-gray-300"}`}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-blue-600 h-8 w-8"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="gap-2" onClick={() => onEdit(data)}>
              <Pencil className="h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2"
              onClick={() => onAvailability(data)}
            >
              <CalendarDays className="h-4 w-4" />
              Disponibilidade
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 text-red-600"
              onClick={() => onDelete(data)}
            >
              <Trash2 className="h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-1 mb-1">
          <h3 className="text-lg font-bold text-gray-900">{data.name}</h3>
          {data.isActive && (
            <BadgeCheck className="h-4 w-4 text-blue-500 shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-1.5 text-sm text-blue-600 font-medium">
          <BriefcaseMedical className="h-3.5 w-3.5" />
          {data.specialty}
        </div>
      </div>

      <div className="py-3 border-y border-gray-50 my-3 flex justify-center">
        <Badge
          variant ="outline"
          className={
            data.isActive
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-gray-50 text-gray-500 border-gray-200"
          }
        >
          {data.isActive ? "Ativo" : "Inativo"}
        </Badge>
      </div>

      <div className="text-xs text-gray-400 mb-4 flex items-center gap-1.5">
        <Mail className="h-3.5 w-3.5" />
        Desde {new Date(data.createdAt).toLocaleDateString("pt-BR")}
      </div>

      <div className="flex gap-2">
      <Link to={`/profile-professional/${data.id}`}>
        <Button        
          variant="outline"
          className="flex-1 text-xs h-9 border-gray-200"
        >
          Escala
        </Button>
        </Link>
        <Button
          onClick={() => onEdit(data)}
          className="flex-1 text-xs h-9 bg-blue-600 hover:bg-blue-700"
        >
          Editar
        </Button>
      </div>
    </div>
  );
}