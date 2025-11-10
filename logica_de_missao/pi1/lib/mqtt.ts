import mqtt, { MqttClient } from "mqtt";
// let client = mqtt.connect("mqtt://localhost:1883");

let mqttClientInstance: MqttClient | null = null;

export class MQTTService {
  private client: mqtt.MqttClient;

  constructor(url = `mqtt://mosquitto:1883}`) {
    if (mqttClientInstance) {
      this.client = mqttClientInstance;
      return;
    }

    this.client = mqtt.connect(url);
    mqttClientInstance = this.client;
  
    this.client.on("connect", ()=>{
      console.log("MQTT connected");
    })

    this.client.subscribe("carrodoovo/#", (err)=>{
      if(err){
        console.error("Erro ao se inscrever:", err);
      } else {
        console.log("Inscrição sucedida em carrodoovo/#");
      }
    })

    this.client.on("error", (error)=>{
      console.error("MQTT connection error:", error, url);
    })
  }

  getClient() {
    return this.client;
  }

  disconnect() {
    this.client.end();
    mqttClientInstance = null;
  }

}

export function getMQTTClient(): MqttClient {
  return new MQTTService().getClient();
}

export function disconnectMQTTClient(): void {
  const service = new MQTTService();
  service.disconnect();
}