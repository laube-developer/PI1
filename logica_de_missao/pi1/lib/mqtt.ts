import mqtt from "mqtt";
// let client = mqtt.connect("mqtt://localhost:1883");

export class MQTTService {
  private client: mqtt.MqttClient;

  constructor(url: string) {
    this.client = mqtt.connect(url);
  }

  getClient() {
    return this.client;
  }
}