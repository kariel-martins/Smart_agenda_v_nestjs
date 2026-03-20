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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { ProfessionalProfile } from "./pages/professional-profile";
import { ForgotPassword } from "./pages/forgotPassword";
import { useUnauthorized } from "./components/useUnauthorized";
import { UnauthorizedOverlay } from "./components/UnauthorizedOverlay";
import { RegisterSuccess } from "./pages/registerSuccess";
import { LandingPage } from "./pages/landingPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        const status = error?.response?.status ?? error?.status;
        if (status === 401 || status === 403) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});

function AppRoutes() {
  const isUnauthorized = useUnauthorized();

  return (
    <>
      {isUnauthorized && <UnauthorizedOverlay />}
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/appointment" element={<Appointment />} />
            <Route path="/clientes" element={<Customers />} />
            <Route path="/profissionais" element={<Professionals />} />
            <Route path="/no-show-rules" element={<NoShowRules />} />
            <Route
              path="/profile-professional/:id"
              element={<ProfessionalProfile />}
            />
            <Route
              path="/availability"
              element={<ProfessionalAvailability />}
            />
            <Route path="/register" element={<Register />} />
            <Route path="/cadastro-sucesso" element={<RegisterSuccess />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/login" element={<Login />} />
            <Route path="/business-profile" element={<BusinessProfile />} />
            <Route path="/users" element={<Users />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

function App() {
   return (
    <QueryClientProvider client={queryClient}>
      <AppRoutes />
    </QueryClientProvider>
  );
}

export default App;
