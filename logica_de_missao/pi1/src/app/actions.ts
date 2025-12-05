"use server"

import mqtt from "mqtt";
import { MQTTService } from "./lib/mqtt";

export async function connectMqttBroker(){
    "use server"
    if (!process.env.MQTT_URL) return

    const client = new MQTTService(process.env.MQTT_URL).getClient();

    client.on('connect', (message) => {
      client.subscribe('conexao_status', err => {
        //faz algo
        
      })
      console.log(message);
    })

    return client
  }

export async function disconnectMqttBroker(client: mqtt.MqttClient){
    "use server"

    client.end();
}