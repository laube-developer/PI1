import mqtt from "mqtt"

const client = mqtt.connect("mqtt://192.168.0.197:1883");

client.on("connect", () => {
    console.log("MQTT conectado!")
    client.subscribe("carrodoovo/#");
});

client.on("message", (topic, payload) => {
    console.log("MQTT RECEBIDO:", topic, payload.toString());
})


export default client;