"use server"

import { supabase } from "../lib/supabaseClient";
import client from "../lib/mqttServer"
import { Comando } from "@/entidades/comandos";
import { Ponto } from "@/entidades/ponto";
import { Historico } from "@/entidades/historico";
import { AppState } from "@/entidades/appstate";

export async function conectar(): Promise<{ isConnected: boolean }> {
    return { isConnected: client.connected }
}

export async function enviarMensagem(topico: string, mensagem: string): Promise<void> {
    client.publish(topico, mensagem)
}

export async function salvarHistorico(comandos: Comando[], deslocamento_comandado: Ponto[], deslocamento_real: Ponto[], user_id: string): Promise<void> {
    console.log("Salvando comandos:", JSON.stringify(comandos, null, 2));
    const { error } = await supabase
        .from('historico')
        .insert([
            { comandos, deslocamento_comandado, deslocamento_real, user_id },
        ]);

    if (error) {
        console.error('Erro ao salvar histórico:', error);
        throw new Error('Não foi possível salvar o histórico.');
    }
}

export async function getHistorico(user_id: string): Promise<Historico[]> {
    const { data, error } = await supabase
        .from('historico')
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Erro ao buscar histórico:', error);
        throw new Error('Não foi possível buscar o histórico.');
    }

    if (data) {
        return data.map(h => ({
            ...h,
            comandos: h.comandos.map((c: any) => AppState.reidratarComando(c)).filter(Boolean) as Comando[]
        }));
    }

    return [];
}

export async function getHistoricoById(id: string): Promise<Historico | null> {
    const { data, error } = await supabase
        .from('historico')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Erro ao buscar histórico por ID:', error);
        throw new Error('Não foi possível buscar o histórico.');
    }

    console.log("Dados do histórico recebidos:", JSON.stringify(data, null, 2));
    if (data) {
        data.comandos = data.comandos.map((c: any) => AppState.reidratarComando(c)).filter(Boolean) as Comando[];
    }

    return data as Historico | null;
}