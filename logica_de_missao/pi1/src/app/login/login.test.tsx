// src/app/login/login.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './page';
import { supabase } from '../../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

// Mocking Supabase client
jest.mock('../../../lib/supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
    },
  },
}));

// Mocking Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('CT-16 – Login na Interface', () => {
  it('deve redirecionar para o dashboard após login com sucesso', async () => {
    // Arrange
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    const signInMock = supabase.auth.signInWithPassword as jest.Mock;
    signInMock.mockResolvedValue({ error: null });

    render(<LoginPage />);

    // Act
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Senha'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    // Assert
    await waitFor(() => {
      expect(signInMock).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });
});
