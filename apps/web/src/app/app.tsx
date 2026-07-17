import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/features/auth/providers/auth-provider';
import { ThemeProvider } from '@/providers/theme/theme-provider';
import { AppRouter } from '@/routes/app-router';

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
