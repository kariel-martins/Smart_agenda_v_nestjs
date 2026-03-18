import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  UserPlus, Search, Shield, MoreHorizontal, Pencil, Trash2,
  X, Save, AlertTriangle, Eye, EyeOff, Mail,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ─── Types ────────────────────────────────────────────────────────────────────
type UserRole = "admin" | "user";

type AppUser = {
  id: string;
  name: string;
  email: string;
  UserRole: UserRole;
};

type CreateUserForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  UserRole: UserRole;
};

type UpdateUserForm = {
  name: string;
  email: string;
  UserRole: UserRole;
};

const ROLE_CFG: Record<UserRole, { label: string; bg: string }> = {
  admin: { label: "Admin",    bg: "bg-purple-50 text-purple-700 border-purple-200" },
  user:  { label: "Usuário",  bg: "bg-gray-50 text-gray-600 border-gray-200" },
};

const INITIAL: AppUser[] = [
  { id: "u1", name: "João Proprietário", email: "joao@barbearia.com", UserRole: "admin" },
  { id: "u2", name: "Maria Recepção",    email: "maria@barbearia.com", UserRole: "user" },
  { id: "u3", name: "Lucas Caixa",       email: "lucas@barbearia.com", UserRole: "user" },
];

// ─── Row ───────────────────────────────────────────────────────────────────────
function UserRow({ data, onEdit, onDelete }: {
  data: AppUser;
  onEdit: (u: AppUser) => void;
  onDelete: (u: AppUser) => void;
}) {
  const cfg = ROLE_CFG[data.UserRole] ?? ROLE_CFG.user;
  return (
    <tr className="group hover:bg-blue-50/30 transition-colors border-b border-gray-100 last:border-none">
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center text-purple-700 font-bold border border-purple-100 shrink-0">
            {data.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-gray-900 leading-none">{data.name}</p>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <Mail className="h-3 w-3" />{data.email}
            </p>
          </div>
        </div>
      </td>
      <td className="py-4 px-4">
        <Badge variant="outline" className={cfg.bg}>
          <Shield className="h-3 w-3 mr-1" />{cfg.label}
        </Badge>
      </td>
      <td className="py-4 px-4 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem className="gap-2" onClick={() => onEdit(data)}>
              <Pencil className="h-4 w-4" />Editar
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 text-red-600" onClick={() => onDelete(data)}>
              <Trash2 className="h-4 w-4" />Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}

// ─── Modal Criar Usuário ───────────────────────────────────────────────────────
function CreateUserModal({ onClose, onSave }: {
  onClose: () => void;
  onSave: (form: CreateUserForm) => Promise<void>;
}) {
  const [form, setForm] = useState<CreateUserForm>({ name: "", email: "", password: "", confirmPassword: "", UserRole: "user" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError("As senhas não coincidem."); return; }
    setError("");
    setLoading(true);
    await onSave(form);
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-extrabold text-gray-900">Novo Usuário</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-gray-700">Nome <span className="text-red-500">*</span></Label>
            <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="Nome completo" className="h-11 bg-gray-50 border-gray-200" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-gray-700">E-mail <span className="text-red-500">*</span></Label>
            <Input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              placeholder="usuario@empresa.com" className="h-11 bg-gray-50 border-gray-200" required />
          </div>
          {/* UserRole → POST body */}
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-gray-700">Permissão <span className="text-red-500">*</span></Label>
            <select value={form.UserRole} onChange={e => setForm(p => ({ ...p, UserRole: e.target.value as UserRole }))}
              className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
              <option value="user">Usuário</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {/* password */}
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-gray-700">Senha <span className="text-red-500">*</span></Label>
            <div className="relative">
              <Input type={showPwd ? "text" : "password"} value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                placeholder="••••••••" className="h-11 bg-gray-50 border-gray-200 pr-10" required />
              <button type="button" onClick={() => setShowPwd(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          {/* confirmPassword */}
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-gray-700">Confirmar senha <span className="text-red-500">*</span></Label>
            <Input type="password" value={form.confirmPassword}
              onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
              placeholder="••••••••" className="h-11 bg-gray-50 border-gray-200" required />
          </div>
          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={loading} className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 rounded-xl gap-2">
              <Save className="h-4 w-4" />{loading ? "Criando..." : "Criar usuário"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="h-11 rounded-xl px-5">Cancelar</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Modal Editar Usuário ──────────────────────────────────────────────────────
function EditUserModal({ user, onClose, onSave }: {
  user: AppUser;
  onClose: () => void;
  onSave: (form: UpdateUserForm, id: string) => Promise<void>;
}) {
  const [form, setForm] = useState<UpdateUserForm>({ name: user.name, email: user.email, UserRole: user.UserRole });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await onSave(form, user.id);
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-extrabold text-gray-900">Editar Usuário</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-gray-700">Nome <span className="text-red-500">*</span></Label>
            <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="h-11 bg-gray-50 border-gray-200" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-gray-700">E-mail <span className="text-red-500">*</span></Label>
            <Input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              className="h-11 bg-gray-50 border-gray-200" required />
          </div>
          {/* UserRole → PUT body */}
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-gray-700">Permissão</Label>
            <select value={form.UserRole} onChange={e => setForm(p => ({ ...p, UserRole: e.target.value as UserRole }))}
              className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
              <option value="user">Usuário</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={loading} className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 rounded-xl gap-2">
              <Save className="h-4 w-4" />{loading ? "Salvando..." : "Salvar alterações"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="h-11 rounded-xl px-5">Cancelar</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Confirm Delete ────────────────────────────────────────────────────────────
function ConfirmDelete({ name, onClose, onConfirm }: {
  name: string; onClose: () => void; onConfirm: () => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 z-10 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-4 rounded-full"><AlertTriangle className="h-8 w-8 text-red-600" /></div>
        </div>
        <h2 className="text-xl font-extrabold text-gray-900 mb-2">Excluir usuário?</h2>
        <p className="text-gray-500 text-sm mb-6">
          Tem certeza que deseja excluir <strong>"{name}"</strong>? O acesso será revogado imediatamente.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1 h-11 rounded-xl">Cancelar</Button>
          <Button disabled={loading} onClick={async () => { setLoading(true); await onConfirm(); }}
            className="flex-1 h-11 bg-red-600 hover:bg-red-700 rounded-xl">
            {loading ? "Excluindo..." : "Sim, excluir"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export function Users() {
  const [users, setUsers] = useState<AppUser[]>(INITIAL);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<AppUser | null>(null);
  const [delTarget, setDelTarget] = useState<AppUser | null>(null);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  async function handleCreate(form: CreateUserForm) {
    // POST /v1/usuários  →  { name, email, password, confirmPassword, UserRole }
    const res = await fetch("/v1/usuários", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const created: AppUser = res.ok ? await res.json() : { name: form.name, email: form.email, UserRole: form.UserRole, id: String(Date.now()) };
    setUsers(prev => [...prev, created]);
    setShowCreate(false);
  }

  async function handleUpdate(form: UpdateUserForm, id: string) {
    // PUT /v1/users/:id  →  { name, email, UserRole }
    await fetch(`/v1/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...form } : u));
    setEditTarget(null);
  }

  async function handleDelete() {
    if (!delTarget) return;
    // DELETE /v1/users/:id
    await fetch(`/v1/users/${delTarget.id}`, { method: "DELETE" });
    setUsers(prev => prev.filter(u => u.id !== delTarget.id));
    setDelTarget(null);
  }

  const admins = users.filter(u => u.UserRole === "admin").length;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <NavBar />
      <main className="max-w-4xl mx-auto pt-24 pb-12 px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Usuários</h1>
            <p className="text-gray-500">{users.length} usuários · {admins} admin{admins !== 1 ? "s" : ""}</p>
          </div>
          <Button onClick={() => setShowCreate(true)} className="bg-blue-600 hover:bg-blue-700 rounded-xl px-6 gap-2">
            <UserPlus className="h-4 w-4" />Novo Usuário
          </Button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nome ou e-mail..."
              className="pl-10 bg-gray-50/50 border-none h-11" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-gray-400">Usuário</th>
                  <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-gray-400">Permissão</th>
                  <th className="py-4 px-4 text-right" />
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <UserRow key={u.id} data={u} onEdit={setEditTarget} onDelete={setDelTarget} />
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-16 text-center text-gray-400">
                      {search ? `Nenhum resultado para "${search}"` : "Nenhum usuário cadastrado."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {showCreate  && <CreateUserModal onClose={() => setShowCreate(false)} onSave={handleCreate} />}
      {editTarget  && <EditUserModal user={editTarget} onClose={() => setEditTarget(null)} onSave={handleUpdate} />}
      {delTarget   && <ConfirmDelete name={delTarget.name} onClose={() => setDelTarget(null)} onConfirm={handleDelete} />}
    </div>
  );
}