"use server"

import { disconnectMQTTClient, getMQTTClient } from "../lib/mqtt"

export async function conectar(): Promise<{isConnected: boolean}> {
    const client = getMQTTClient()
    return {isConnected: client.connected}
}

export async function desconectar(): Promise<{isDisconnected: boolean}> {
    disconnectMQTTClient();
    return {isDisconnected: true}
}

export async function enviarMensagem(topico: string, mensagem: string): Promise<void> {
    const client = getMQTTClient()
    client.publish(topico, mensagem)
}