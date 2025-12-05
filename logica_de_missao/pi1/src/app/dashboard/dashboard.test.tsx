// src/app/dashboard/dashboard.test.tsx
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import DashboardPage from './page';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { User } from '../../../entidades/user';

// Mocking Supabase client
jest.mock('../../../lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
  },
}));

// Mocking Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the lib/mqtt.ts module
jest.mock('../../../lib/mqtt', () => ({
    getMQTTClient: jest.fn(() => ({
        connected: true, // Simulate connected state
        publish: jest.fn(),
        subscribe: jest.fn(),
        on: jest.fn(),
        off: jest.fn(), // Add the 'off' method
        end: jest.fn(),
    })),
    disconnectMQTTClient: jest.fn(),
}));

// Mock the action that sends MQTT messages
jest.mock('../../../actions/actions', () => ({
    enviarMensagem: jest.fn(),
    conectar: jest.fn().mockResolvedValue(undefined),
    desconectar: jest.fn().mockResolvedValue(undefined)
}));
jest.mock('../../../components/CodeView', () => {
    return jest.fn(() => <div>Code View Mock</div>);
});

// Mock the drag-and-drop library to simplify the DOM structure
jest.mock('@hello-pangea/dnd', () => ({
    DragDropContext: ({ children }) => <div>{children}</div>,
    Droppable: ({ children }) => children({
        draggableProps: {},
        innerRef: jest.fn(),
        placeholder: null,
    }, {}),
    Draggable: ({ children }) => children({
        draggableProps: {},
        dragHandleProps: {},
        innerRef: jest.fn(),
    }, {}),
}));


describe('Dashboard Page', () => {
    const mockPush = jest.fn();
    
    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        const mockSession = {
            data: { session: { user: { email: 'test@example.com' } as User } },
        };
        (supabase.auth.getSession as jest.Mock).mockResolvedValue(mockSession);
        const mockSubscription = { subscription: { unsubscribe: jest.fn() } };
        (supabase.auth.onAuthStateChange as jest.Mock).mockReturnValue({ data: mockSubscription });
    });

    describe('CT-17 – Logout e Encerramento da Sessão', () => {
        it('deve chamar signOut e redirecionar para /login ao clicar em Logout', async () => {
            const mockSignOut = supabase.auth.signOut as jest.Mock;
            mockSignOut.mockResolvedValue({ error: null });
            render(<DashboardPage />);
            const logoutButton = await screen.findByRole('button', { name: /logout/i });
            fireEvent.click(logoutButton);
            await waitFor(() => expect(mockSignOut).toHaveBeenCalledTimes(1));
            await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/login'));
        });
    });

    describe('CT-18 – Inserção de Comandos de Virar e Depositar', () => {
        it('deve adicionar comandos à lista na UI ao clicar nos botões', async () => {
            render(<DashboardPage />);
            await screen.findByText(/Bem-vindo, test@example.com/i); // Wait for initial render content

            // Click to connect (enables command buttons)
            fireEvent.click(screen.getByRole('button', { name: /conectar/i }));
            
            // Wait for "Conectado" to appear, indicating the connection state has updated
            await screen.findByText('Conectado');

            // Click command buttons
            fireEvent.click(screen.getByRole('button', { name: /virar/i }));
            fireEvent.click(screen.getByRole('button', { name: /largar/i }));

            // Now, commands should be in the list, so command-list should be rendered
            const commandList = await screen.findByTestId('command-list');

            // Ensure the specific command cards are found within the command list
            expect(within(commandList).getByTestId('command-card-0')).toHaveTextContent('Virar');
            expect(within(commandList).getByTestId('command-card-1')).toHaveTextContent('Largar');

            // Ensure there are exactly two command cards displayed within the command list
            expect(within(commandList).getAllByText(/Virar|Largar/)).toHaveLength(2);
        });
    });
});

