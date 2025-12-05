import { useState, useCallback } from "react";

export const useMQTTClient = () => {
  const [isConnected, setIsConnected] = useState(true); // conexão é sempre "true" porque servidor sempre está conectado

  const publish = useCallback(async (topic: string, message: string) => {
    try {
      await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, message }),
      });

    } catch (err) {
      console.error("Erro ao enviar para MQTT:", err);
    }
  }, []);

  return {
    isConnected,
    publish,
    reconnect: () => {},
    disconnect: () => {},
  };
};
