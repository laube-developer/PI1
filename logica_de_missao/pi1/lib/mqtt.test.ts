import { getMQTTClient, disconnectMQTTClient } from './mqtt';
import mqtt, { MqttClient } from 'mqtt';

// Mock the 'mqtt' library
const mockMqttClient = {
  on: jest.fn(),
  subscribe: jest.fn(),
  end: jest.fn(),
};

jest.mock('mqtt', () => ({
  connect: jest.fn(() => mockMqttClient),
}));

describe('mqtt', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Also reset the internal state of our mock client for a clean slate
    mockMqttClient.on.mockClear();
    mockMqttClient.subscribe.mockClear();
    mockMqttClient.end.mockClear();
  });

  afterEach(() => {
    // Disconnect after each test to reset the singleton instance
    disconnectMQTTClient();
  });

  describe('Singleton Pattern', () => {
    it('should call mqtt.connect only on the first call to getMQTTClient', () => {
      getMQTTClient();
      getMQTTClient();
      getMQTTClient();
      
      expect(mqtt.connect).toHaveBeenCalledTimes(1);
    });

    it('should return the same client instance on multiple calls', () => {
      const client1 = getMQTTClient();
      const client2 = getMQTTClient();

      expect(client1).toBe(client2);
      expect(client1).toBe(mockMqttClient);
    });
  });

  describe('Client Initialization', () => {
    it('should set up event listeners and subscribe on new connection', () => {
      getMQTTClient();

      // It should register handlers for 'connect' and 'error'
      expect(mockMqttClient.on).toHaveBeenCalledWith('connect', expect.any(Function));
      expect(mockMqttClient.on).toHaveBeenCalledWith('error', expect.any(Function));
      
      // It should subscribe to the 'carrodoovo/#' topic
      expect(mockMqttClient.subscribe).toHaveBeenCalledWith('carrodoovo/#', expect.any(Function));
    });
  });

  describe('Disconnection Logic', () => {
    it('should call client.end() when disconnectMQTTClient is called', () => {
      // First, get a client to establish a connection
      getMQTTClient();
      
      // Now, disconnect it
      disconnectMQTTClient();

      expect(mockMqttClient.end).toHaveBeenCalledTimes(1);
    });

    it('should create a new client after being disconnected', () => {
      // Establish the first connection
      const client1 = getMQTTClient();
      expect(mqtt.connect).toHaveBeenCalledTimes(1);

      // Disconnect, which should reset the singleton instance
      disconnectMQTTClient();
      expect(mockMqttClient.end).toHaveBeenCalledTimes(1);

      // Getting a client again should create a new connection
      const client2 = getMQTTClient();
      expect(mqtt.connect).toHaveBeenCalledTimes(2);

      // In this mock setup, client1 and client2 will be the same object,
      // but we have verified that a new connection was attempted.
      expect(client1).toBe(client2);
    });
  });
});
