import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layouts
import { StudentLayout } from './layouts/StudentLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { SmoothScroll } from './components/SmoothScroll';

// Pages
import { Landing } from './pages/Landing';
import { StudentLogin, AdminLogin } from './features/auth';
import { StudentDashboard, Bills, History } from './features/student';
import { AdminDashboard, Students, Payments, Reports } from './features/admin';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <SmoothScroll />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login/student" element={<StudentLogin />} />
              <Route path="/login/admin" element={<AdminLogin />} />

              {/* Student Routes */}
              <Route path="/student" element={<StudentLayout />}>
                <Route index element={<StudentDashboard />} />
                <Route path="bills" element={<Bills />} />
                <Route path="history" element={<History />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="students" element={<Students />} />
                <Route path="payments" element={<Payments />} />
                <Route path="reports" element={<Reports />} />
              </Route>

              {/* Catch all - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>

          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--toast-bg, white)',
                color: 'var(--toast-color, #1e293b)',
                border: '1px solid var(--toast-border, #e2e8f0)',
              },
            }}
            richColors
            closeButton
          />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
