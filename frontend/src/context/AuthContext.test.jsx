import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { authService } from '../services/authService';

vi.mock('../services/authService', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    updateProfile: vi.fn(),
  },
}));

const TestComponent = () => {
  const { user, loading, isAuthenticated, login, register, logout } = useAuth();

  return (
    <div>
      <div data-testid="loading">{loading ? 'loading' : 'not-loading'}</div>
      <div data-testid="authenticated">{isAuthenticated ? 'authenticated' : 'not-authenticated'}</div>
      <div data-testid="user">{user ? JSON.stringify(user) : 'no-user'}</div>
      <button onClick={() => login('test@test.com', 'password')}>Login</button>
      <button onClick={() => register({ email: 'test@test.com', password: 'password', name: 'Test' })}>Register</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('inicializa sin usuario cuando no hay sesión guardada', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
    });
    expect(screen.getByTestId('authenticated')).toHaveTextContent('not-authenticated');
    expect(screen.getByTestId('user')).toHaveTextContent('no-user');
  });

  it('carga usuario desde localStorage al iniciar', async () => {
    const mockUser = { id: '1', email: 'test@test.com', name: 'Test User', role: 'CANDIDATE' };
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('token', 'mock-token');

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('authenticated');
      expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(mockUser));
    });
  });

  it('realiza login correctamente', async () => {
    const mockUser = { id: '1', email: 'test@test.com', name: 'Test User', role: 'CANDIDATE' };
    authService.login.mockResolvedValue({ user: mockUser, token: 'mock-token' });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByText('Login');
    loginButton.click();

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({ email: 'test@test.com', password: 'password' });
      expect(screen.getByTestId('authenticated')).toHaveTextContent('authenticated');
      expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(mockUser));
    });
  });

  it('maneja error de login', async () => {
    authService.login.mockRejectedValue(new Error('Credenciales inválidas'));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByText('Login');
    loginButton.click();

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({ email: 'test@test.com', password: 'password' });
      expect(screen.getByTestId('authenticated')).toHaveTextContent('not-authenticated');
    });
  });

  it('realiza registro correctamente', async () => {
    const mockUser = { id: '1', email: 'test@test.com', name: 'Test User', role: 'CANDIDATE' };
    authService.register.mockResolvedValue({ user: mockUser, token: 'mock-token' });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const registerButton = screen.getByText('Register');
    registerButton.click();

    await waitFor(() => {
      expect(authService.register).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password',
        name: 'Test'
      });
      expect(screen.getByTestId('authenticated')).toHaveTextContent('authenticated');
    });
  });

  it('realiza logout correctamente', async () => {
    const mockUser = { id: '1', email: 'test@test.com', name: 'Test User', role: 'CANDIDATE' };
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('token', 'mock-token');

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('authenticated');
    });

    const logoutButton = screen.getByText('Logout');
    logoutButton.click();

    await waitFor(() => {
      expect(authService.logout).toHaveBeenCalled();
      expect(screen.getByTestId('authenticated')).toHaveTextContent('not-authenticated');
      expect(screen.getByTestId('user')).toHaveTextContent('no-user');
    });
  });
});
