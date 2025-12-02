// Mock the MQTT client
jest.mock('../lib/mqtt', () => ({
    getMQTTClient: jest.fn(),
    disconnectMQTTClient: jest.fn(),
}));

// Mock Supabase
jest.mock('../lib/supabaseClient', () => ({
    supabase: {
        from: jest.fn(() => ({
            insert: jest.fn(),
            select: jest.fn(() => ({
                eq: jest.fn(() => ({
                    order: jest.fn(),
                    single: jest.fn(),
                })),
            })),
        })),
    },
}));

import { conectar, desconectar, enviarMensagem, salvarHistorico, getHistorico, getHistoricoById } from './actions';
import { getMQTTClient, disconnectMQTTClient } from '../lib/mqtt';
import { supabase } from '../lib/supabaseClient';
import { Comando } from '@/entidades/comandos';
import { Ponto } from '@/entidades/ponto';
import { Historico } from '@/entidades/historico';
import { AppState } from '@/entidades/appstate';

describe('actions', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('conectar', () => {
        it('should return isConnected true if MQTT client is connected', async () => {
            (getMQTTClient as jest.Mock).mockReturnValue({ connected: true });
            const result = await conectar();
            expect(result).toEqual({ isConnected: true });
            expect(getMQTTClient).toHaveBeenCalledTimes(1);
        });

        it('should return isConnected false if MQTT client is not connected', async () => {
            (getMQTTClient as jest.Mock).mockReturnValue({ connected: false });
            const result = await conectar();
            expect(result).toEqual({ isConnected: false });
            expect(getMQTTClient).toHaveBeenCalledTimes(1);
        });
    });

    describe('desconectar', () => {
        it('should call disconnectMQTTClient and return isDisconnected true', async () => {
            const result = await desconectar();
            expect(result).toEqual({ isDisconnected: true });
            expect(disconnectMQTTClient).toHaveBeenCalledTimes(1);
        });
    });

    describe('enviarMensagem', () => {
        it('should call client.publish with the correct topic and message', async () => {
            const mockPublish = jest.fn();
            (getMQTTClient as jest.Mock).mockReturnValue({ publish: mockPublish });

            const topic = 'test/topic';
            const message = 'test message';
            await enviarMensagem(topic, message);

            expect(getMQTTClient).toHaveBeenCalledTimes(1);
            expect(mockPublish).toHaveBeenCalledTimes(1);
            expect(mockPublish).toHaveBeenCalledWith(topic, message);
        });
    });

    describe('salvarHistorico', () => {
        const mockComandos: Comando[] = [{ id: '1', nome: 'Frente', valor: 10 }];
        const mockDeslocamentoComandado: Ponto[] = [{ x: 0, y: 0, z: 0 }];
        const mockDeslocamentoReal: Ponto[] = [{ x: 1, y: 1, z: 1 }];
        const mockUserId = 'user-123';

        it('should call supabase.from.insert with the correct data', async () => {
            const mockInsert = jest.fn(() => ({ error: null }));
            (supabase.from as jest.Mock).mockReturnValue({
                insert: mockInsert,
            });

            await salvarHistorico(mockComandos, mockDeslocamentoComandado, mockDeslocamentoReal, mockUserId);

            expect(supabase.from).toHaveBeenCalledWith('historico');
            expect(mockInsert).toHaveBeenCalledWith([
                {
                    comandos: mockComandos,
                    deslocamento_comandado: mockDeslocamentoComandado,
                    deslocamento_real: mockDeslocamentoReal,
                    user_id: mockUserId,
                },
            ]);
        });

        it('should throw an error if supabase insertion fails', async () => {
            const mockError = new Error('Database error');
            const mockInsert = jest.fn(() => ({ error: mockError }));
            (supabase.from as jest.Mock).mockReturnValue({
                insert: mockInsert,
            });

            await expect(salvarHistorico(mockComandos, mockDeslocamentoComandado, mockDeslocamentoReal, mockUserId))
                .rejects
                .toThrow('Não foi possível salvar o histórico.');
        });
    });

    describe('getHistorico', () => {
        const mockHistoricoData = [
            { id: 'h1', user_id: 'user-123', comandos: [{ id: '1', nome: 'Frente', valor: 10 }], created_at: '2023-01-01T00:00:00Z' },
            { id: 'h2', user_id: 'user-123', comandos: [{ id: '2', nome: 'Trás', valor: 5 }], created_at: '2023-01-02T00:00:00Z' },
        ];
        const mockRehydratedComandos = [{ id: '1', nome: 'Frente', valor: 10, tipo: 'Movimento' as any }];
        const mockAppStateReidratarComando = jest.spyOn(AppState, 'reidratarComando').mockReturnValue(mockRehydratedComandos[0]);


        it('should call supabase.from.select with correct arguments and return mapped data', async () => {
            const mockOrder = jest.fn(() => ({ data: mockHistoricoData, error: null }));
            const mockEq = jest.fn(() => ({ order: mockOrder }));
            const mockSelect = jest.fn(() => ({ eq: mockEq }));
            (supabase.from as jest.Mock).mockReturnValue({
                select: mockSelect,
            });

            const result = await getHistorico('user-123');

            expect(supabase.from).toHaveBeenCalledWith('historico');
            expect(mockSelect).toHaveBeenCalledWith('*');
            expect(mockEq).toHaveBeenCalledWith('user_id', 'user-123');
            expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });
            expect(result).toHaveLength(2);
            expect(mockAppStateReidratarComando).toHaveBeenCalledTimes(2);
            expect(result[0].comandos[0]).toEqual(mockRehydratedComandos[0]);
        });

        it('should return empty array if no data is found', async () => {
            const mockOrder = jest.fn(() => ({ data: [], error: null }));
            const mockEq = jest.fn(() => ({ order: mockOrder }));
            const mockSelect = jest.fn(() => ({ eq: mockEq }));
            (supabase.from as jest.Mock).mockReturnValue({
                select: mockSelect,
            });

            const result = await getHistorico('user-nonexistent');
            expect(result).toEqual([]);
        });

        it('should throw an error if supabase fetch fails', async () => {
            const mockError = new Error('Database error');
            const mockOrder = jest.fn(() => ({ data: null, error: mockError }));
            const mockEq = jest.fn(() => ({ order: mockOrder }));
            const mockSelect = jest.fn(() => ({ eq: mockEq }));
            (supabase.from as jest.Mock).mockReturnValue({
                select: mockSelect,
            });

            await expect(getHistorico('user-123'))
                .rejects
                .toThrow('Não foi possível buscar o histórico.');
        });
    });

    describe('getHistoricoById', () => {
        const mockHistoricoSingleData = {
            id: 'h1',
            user_id: 'user-123',
            comandos: [{ id: '1', nome: 'Frente', valor: 10 }],
            created_at: '2023-01-01T00:00:00Z'
        };
        const mockRehydratedComandos = [{ id: '1', nome: 'Frente', valor: 10, tipo: 'Movimento' as any }];
        const mockAppStateReidratarComando = jest.spyOn(AppState, 'reidratarComando').mockReturnValue(mockRehydratedComandos[0]);


        it('should call supabase.from.select with correct arguments and return mapped data', async () => {
            const mockSingle = jest.fn(() => ({ data: mockHistoricoSingleData, error: null }));
            const mockEq = jest.fn(() => ({ single: mockSingle }));
            const mockSelect = jest.fn(() => ({ eq: mockEq }));
            (supabase.from as jest.Mock).mockReturnValue({
                select: mockSelect,
            });

            const result = await getHistoricoById('h1');

            expect(supabase.from).toHaveBeenCalledWith('historico');
            expect(mockSelect).toHaveBeenCalledWith('*');
            expect(mockEq).toHaveBeenCalledWith('id', 'h1');
            expect(mockSingle).toHaveBeenCalledTimes(1);
            expect(result).not.toBeNull();
            expect(mockAppStateReidratarComando).toHaveBeenCalledTimes(1);
            expect(result?.comandos[0]).toEqual(mockRehydratedComandos[0]);
        });

        it('should return null if no data is found', async () => {
            const mockSingle = jest.fn(() => ({ data: null, error: null }));
            const mockEq = jest.fn(() => ({ single: mockSingle }));
            const mockSelect = jest.fn(() => ({ eq: mockEq }));
            (supabase.from as jest.Mock).mockReturnValue({
                select: mockSelect,
            });

            const result = await getHistoricoById('h-nonexistent');
            expect(result).toBeNull();
        });

        it('should throw an error if supabase fetch fails', async () => {
            const mockError = new Error('Database error');
            const mockSingle = jest.fn(() => ({ data: null, error: mockError }));
            const mockEq = jest.fn(() => ({ single: mockSingle }));
            const mockSelect = jest.fn(() => ({ eq: mockEq }));
            (supabase.from as jest.Mock).mockReturnValue({
                select: mockSelect,
            });

            await expect(getHistoricoById('h1'))
                .rejects
                .toThrow('Não foi possível buscar o histórico.');
        });
    });
});
