import { NextResponse } from "next/server";
import mqtt from "mqtt";
import { supabase } from "../../lib/supabaseClient"

let client: mqtt.MqttClient | null = null;

let subscribers: ((msg: any) => void)[] = [];

function startMQTT() {
  if (client) return;

  client = mqtt.connect("mqtt://seu-broker-aqui");

  client.on("connect", () => {
    console.log("MQTT conectado no backend!");
    client!.subscribe("carrodoovo/telemetria");
  });

  client.on("message", async (topic, payload) => {
    if (topic !== "carrodoovo/telemetria") return;

    try {
      const msg = JSON.parse(payload.toString());

      // 👉 Salvar no Supabase
      await supabase.from("telemetria").insert({
        x: msg.x,
        y: msg.y,
        created_at: new Date(),
      });

      // 👉 Notificar todos os SSE subscribers
      subscribers.forEach(fn => fn(msg));

    } catch (e) {
      console.error("Erro processando MQTT:", e);
    }
  });
}

export function GET() {
  startMQTT();

  const stream = new ReadableStream({
    start(controller) {
      const send = (msg: any) => {
        controller.enqueue(
          `data: ${JSON.stringify(msg)}\n\n`
        );
      };

      subscribers.push(send);

      return () => {
        subscribers = subscribers.filter(fn => fn !== send);
      };
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
