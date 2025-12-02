import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Sidebar from './index';

// next/link is not available in jest, so we mock it
jest.mock('next/link', () => {
    return ({ children, href }: { children: React.ReactNode, href: string }) => {
        return <a href={href}>{children}</a>
    }
});

describe('Sidebar', () => {
    const handleLogout = jest.fn();
    const setSideBarState = jest.fn();
    const handleEnviar = jest.fn();
    const handleSalvar = jest.fn();
    const mockComandos = [{ id: '1', nome: 'Frente', valor: 10 }];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render all elements correctly', () => {
        const initialState = { isConnected: false };
        render(
            <Sidebar 
                handleLogout={handleLogout}
                sidebarState={initialState}
                setSideBarState={setSideBarState}
                handleEnviar={handleEnviar}
                handleSalvar={handleSalvar}
                comandos={[]}
            />
        );

        expect(screen.getByAltText('Logo Carro do Ovo')).toBeInTheDocument();
        expect(screen.getByText('CARRO DO OVO')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Conectar' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Enviar' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Histórico' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
    });

    it('should call setSideBarState when "Conectar" button is clicked', () => {
        const initialState = { isConnected: false };
        render(
            <Sidebar 
                handleLogout={handleLogout}
                sidebarState={initialState}
                setSideBarState={setSideBarState}
                handleEnviar={handleEnviar}
                handleSalvar={handleSalvar}
                comandos={[]}
            />
        );

        const conectarButton = screen.getByRole('button', { name: 'Conectar' });
        fireEvent.click(conectarButton);

        expect(setSideBarState).toHaveBeenCalledTimes(1);
        expect(setSideBarState).toHaveBeenCalledWith({ isConnected: true });
    });

    it('should display "Conectado" when isConnected is true', () => {
        const connectedState = { isConnected: true };
        render(
            <Sidebar 
                handleLogout={handleLogout}
                sidebarState={connectedState}
                setSideBarState={setSideBarState}
                handleEnviar={handleEnviar}
                handleSalvar={handleSalvar}
                comandos={[]}
            />
        );
        expect(screen.getByRole('button', { name: 'Conectado' })).toBeInTheDocument();
    });

    it('should call handleEnviar, handleSalvar, and handleLogout on button clicks', () => {
        const initialState = { isConnected: false };
        render(
            <Sidebar 
                handleLogout={handleLogout}
                sidebarState={initialState}
                setSideBarState={setSideBarState}
                handleEnviar={handleEnviar}
                handleSalvar={handleSalvar}
                comandos={mockComandos}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: 'Enviar' }));
        expect(handleEnviar).toHaveBeenCalledTimes(1);

        fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));
        expect(handleSalvar).toHaveBeenCalledTimes(1);

        fireEvent.click(screen.getByRole('button', { name: 'Logout' }));
        expect(handleLogout).toHaveBeenCalledTimes(1);
    });

    it('should disable Enviar and Salvar buttons when there are no comandos', () => {
        const initialState = { isConnected: false };
        render(
            <Sidebar 
                handleLogout={handleLogout}
                sidebarState={initialState}
                setSideBarState={setSideBarState}
                handleEnviar={handleEnviar}
                handleSalvar={handleSalvar}
                comandos={[]}
            />
        );

        expect(screen.getByRole('button', { name: 'Enviar' })).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Salvar' })).toBeDisabled();
    });

    it('should enable Enviar and Salvar buttons when there are comandos', () => {
        const initialState = { isConnected: false };
        render(
            <Sidebar 
                handleLogout={handleLogout}
                sidebarState={initialState}
                setSideBarState={setSideBarState}
                handleEnviar={handleEnviar}
                handleSalvar={handleSalvar}
                comandos={mockComandos}
            />
        );

        expect(screen.getByRole('button', { name: 'Enviar' })).not.toBeDisabled();
        expect(screen.getByRole('button', { name: 'Salvar' })).not.toBeDisabled();
    });

    it('should have a link to /dashboard/historico', () => {
        const initialState = { isConnected: false };
        render(
            <Sidebar 
                handleLogout={handleLogout}
                sidebarState={initialState}
                setSideBarState={setSideBarState}
                handleEnviar={handleEnviar}
                handleSalvar={handleSalvar}
                comandos={[]}
            />
        );

        const historicoLink = screen.getByRole('link');
        expect(historicoLink).toHaveAttribute('href', '/dashboard/historico');
    });
});
