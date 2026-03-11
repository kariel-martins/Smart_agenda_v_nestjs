import { BrowserRouter, Route, Routes } from "react-router";
import { Appointment } from "./pages/appointment";
import { Customers } from "./pages/Customers";
import { Professionals } from "./pages/Professionals";
import { NoShowRules } from "./pages/NoShowRules";
import { ProfessionalAvailability } from "./pages/Professionalavailability";
import { Register } from "./pages/register";
import { Login } from "./pages/login";
import { BusinessProfile } from "./pages/BusinessProfile";
import { Users } from "./pages/Users";
import { Services } from "./pages/Services";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { ProfessionalProfile } from "./pages/perfil";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Appointment />} />
            <Route path="/servicos" element={<Services />} />
            <Route path="/clientes" element={<Customers />} />
            <Route path="/profissionais" element={<Professionals />} />
            <Route path="/no-show-rules" element={<NoShowRules />} />
            <Route path="/profile-professional/:id" element={<ProfessionalProfile />} />
            <Route
              path="/availability"
              element={<ProfessionalAvailability />}
            />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/business-profile" element={<BusinessProfile />} />
            <Route path="/users" element={<Users />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
