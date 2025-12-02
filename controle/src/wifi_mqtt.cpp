// wifi_mqtt.cpp
#include "wifi_mqtt.h"
#include <WiFi.h>
#include <PubSubClient.h>
#include <string>
#include <cstdio>
#include <iostream>
#include "commands.h"
#include "command_queue.h"
#include "executor.h"

const char *ssid = "rede"; //Nome da rede
const char *password = "senha";
const char *mqtt_server = "192.168.0.197"; //ip da máquina que vai rodar

WiFiClient espClient;
PubSubClient client(espClient);
unsigned long lastMsg = 0;
bool flag = 0;

void setup_wifi_internal();
void reconnect_mqtt();
// A função callback é declarada em wifi_mqtt.h (extern "C").

void setup_wifi_internal()
{
  delay(10);
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }

  randomSeed(micros());
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnect_mqtt()
{
  while (!client.connected())
  {
    Serial.print("Attempting MQTT connection...");
    String clientId = "ESP32";
    clientId += String(random(0xffff), HEX);

    if (client.connect(clientId.c_str()))
    {
      Serial.println("connected");

      if (client.subscribe("carrodoovo/#"))
      {
        Serial.println("Inscrito em carrodoovo/#");
      }
      else
      {
        Serial.println("Falha ao inscrever");
      }
    }
    else
    {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void enviarDadosMQTT(long pulsosE, long pulsosD)
{
  unsigned long now = millis();
  if (now - lastMsg > 100)
  {
    lastMsg = now;

    char buffer[50];
    snprintf(buffer, sizeof(buffer), "%ld, %ld", pulsosE, pulsosD);

    client.publish("outTopic", buffer);

    Serial.print("Publicando no outTopic: ");
    Serial.println(buffer);

    flag = !flag;
  }
}

void ouvirComandosRecebidos(char *topic, byte *payload, unsigned int length)
{
  

  Serial.print("\nNova mensagem em:");
  Serial.println(topic);

  if (strcmp(topic, "carrodoovo/comandos") == 0){
    parseListaDeComandos(payload, length);
  }

  if (strcmp(topic, "carrodoovo/paradaDeEmergencia") == 0){
    executor::emergencyStop();
  }
}

void parseListaDeComandos(byte *payload, unsigned int length)
{
  Serial.println("\n=== NOVA SEQUÊNCIA DE COMANDOS (Otimizada) ===");

    char payload_copy[length + 1];
    memcpy(payload_copy, payload, length); 
    payload_copy[length] = '\0'; 

    char *token = strtok(payload_copy, ",");

    while (token != NULL)
    {
        if (strlen(token) == 0) {
            token = strtok(NULL, ",");
            continue;
        }
        
        Command c = {}; 
        char commandType = token[0]; 
        int distance = 0;
        
        switch (commandType)
        {
            case 'F':
                c.type = CmdType::FORWARD;

                if (strlen(token) > 1) {
                    const char* distanceStr = (token[1] == ':') ? token + 2 : token + 1;
                    
                    distance = atoi(distanceStr);
                }
                c.distancia = distance;
                break;
                
            case 'L':
                c.type = CmdType::TURN_LEFT;
                break;
                
            case 'R':
                c.type = CmdType::TURN_RIGHT;
                break;
                
            case 'D':
                c.type = CmdType::DEPOSIT_EGG;
                break;
                
            default:
                Serial.print("Comando desconhecido ou malformado: ");
                Serial.println(token);
                token = strtok(NULL, ",");
                continue; 
        }

        cmdq::push(c);
        Serial.print("Adicionado: ");
        Serial.print(token);
        Serial.print(" (Distancia: ");
        Serial.print(c.distancia);
        Serial.println(")");

        token = strtok(NULL, ",");
    }
}

void inicializarMqttWifi()
{
  setup_wifi_internal();

  client.setServer(mqtt_server, 1883);
  client.setCallback(ouvirComandosRecebidos);
}

void mqtt_tick()
{
  if (!client.connected())
  {
    reconnect_mqtt();
  }

  client.loop();
}
