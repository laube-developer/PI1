import { useEffect, useState, useRef, useCallback } from 'react';
import mqtt, { MqttClient, IClientOptions } from 'mqtt';

const MQTT_BROKER_URL = 'mqtt://localhost:9001/mqtt'; 
const MQTT_TOPIC_SUBSCRIPTION = 'carrodoovo/#';

export const useMQTTClient = (): {
  client: MqttClient | null;
  isConnected: boolean;
  publish: (topic: string, message: string) => void;
  reconnect: () => void; 
  disconnect: () => void;
} => {
  const [state, setState] = useState<{ client: MqttClient | null; isConnected: boolean; error: Error | null }>({
    client: null,
    isConnected: false,
    error: null,
  });

  const clientRef = useRef<MqttClient | null>(null);

  const cleanup = useCallback(() => {
    if (clientRef.current) {
        clientRef.current.end(true, () => {});
        clientRef.current = null;
        setState(s => ({ ...s, client: null, isConnected: false }));
    }
  }, []);

  const disconnect = useCallback(() => {
    cleanup();
  }, [cleanup]);

  const connect = useCallback(() => {
    cleanup();

    try {
      const options: IClientOptions = {
        clean: true,
        reconnectPeriod: 1000, 
      };

      const client = mqtt.connect(MQTT_BROKER_URL, options);
      clientRef.current = client;
      
      client.on('connect', () => {
        setState(s => ({ ...s, isConnected: true, error: null }));
        
        client.subscribe(MQTT_TOPIC_SUBSCRIPTION, (err) => {});
      });

      client.on('error', (err) => {
        setState(s => ({ ...s, isConnected: false, error: err }));
      });

      client.on('close', () => {
        setState(s => ({ ...s, isConnected: false }));
      });
      
      client.on('reconnect', () => {});
      
      setState(s => ({ ...s, client: client }));

    } catch (error) {
      setState(s => ({ ...s, isConnected: false, error: error as Error }));
    }
  }, [cleanup]);

  const reconnect = useCallback(() => {
    if (typeof window !== 'undefined') {
        connect();
    }
  }, [connect]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    connect();

    return () => {
      cleanup();
    };
  }, [connect, cleanup]);

  const publish = useCallback((topic: string, message: string) => {
    if (state.client && state.isConnected) {
      state.client.publish(topic, message, (err) => {});
    } else {}
  }, [state.client, state.isConnected]);


  return { 
    client: state.client, 
    isConnected: state.isConnected, 
    publish,
    reconnect,
    disconnect
  };
};