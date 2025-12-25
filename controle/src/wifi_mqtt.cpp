// wifi_mqtt.cpp
#include "wifi_mqtt.h"
#include <WiFi.h>
#include <PubSubClient.h>
#include <string>
#include <cstdio>
#include <iostream>

const char* ssid = "iPhone de Rafael"; 
const char* password = "laube2024";
const char* mqtt_server = "172.20.10.3";

WiFiClient espClient;
PubSubClient client(espClient);
unsigned long lastMsg = 0;
bool flag = 0;

void setup_wifi_internal();
void reconnect_mqtt();
// A função callback é declarada em wifi_mqtt.h (extern "C").

void setup_wifi_internal() {
  delay(10);
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  randomSeed(micros());
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

// ❌ CORREÇÃO: A DEFINIÇÃO COMPLETA DE callback FOI REMOVIDA DAQUI
// A declaração extern "C" no .h garante que o linker ache a definição em mqtt_parser.cpp

void reconnect_mqtt() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientId = "ESP32";
    clientId += String(random(0xffff), HEX);
    
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
      
      client.subscribe("carrodoovo/comandos");
      
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void inicializarWifi() {
  setup_wifi_internal();
  
  client.setServer(mqtt_server, 1883);
  // Usa a função callback definida em mqtt_parser.cpp
  client.setCallback(callback); 
}

void mqtt_tick() {
  if (!client.connected()) {
    reconnect_mqtt();
  }
  
  client.loop(); 
}

void enviarDadosMQTT(long pulsosE, long pulsosD) {
  unsigned long now = millis();
  if (now - lastMsg > 100) {
    lastMsg = now;

    char buffer[50];
    snprintf(buffer, sizeof(buffer), "%ld, %ld", pulsosE, pulsosD);

    client.publish("outTopic", buffer);
    
    Serial.print("Publicando no outTopic: ");
    Serial.println(buffer);

    flag = !flag;
  }
}