#include <ArduinoJson.h>
#include <Arduino.h>
#include "command_queue.h"
#include "wifi_mqtt.h"

using namespace cmdq;

const size_t JSON_DOC_SIZE = 2048; 

CmdType mapCommandType(const char* typeStr) {
    if (strcmp(typeStr, "Andar") == 0) return CmdType::FORWARD;
    if (strcmp(typeStr, "Virar") == 0) return CmdType::TURN;
    if (strcmp(typeStr, "Largar") == 0) return CmdType::DEPOSIT_EGG;
    return CmdType::NONE;
}

void callback(char* topic, byte* payload, unsigned int length) {
  if (strcmp(topic, "carrodoovo/comandos") != 0) {
    Serial.print("Message arrived [");
    Serial.print(topic);
    Serial.print("] ");
    for (int i = 0; i < length; i++) {
        Serial.print((char)payload[i]);
    }
    Serial.println();
    return; 
  }
    
  JsonDocument doc; 
  
  if (deserializeJson(doc, payload, length) != DeserializationError::Ok) {
    Serial.println(F("ERRO ao desserializar JSON (ArduinoJson v7)."));
    return;
  }

  JsonArray comandos = doc.as<JsonArray>();

  if (comandos) {
    cmdq::clear();
    
    Serial.println(F("\n--- COMANDOS RECEBIDOS VIA MQTT ---")); 
    
    for (JsonObject comandoObj : comandos) {
      const char* tipoStr = comandoObj["tipo"];
      
      CmdType tipo = mapCommandType(tipoStr);

      if (tipo != CmdType::NONE) {
        Command novoComando;
        novoComando.type = tipo;
        
        if (tipo == CmdType::FORWARD) {
          int distancia_cm = comandoObj["distancia"] | 0;
          
          novoComando.left = (uint8_t)distancia_cm;
          novoComando.right = (uint8_t)distancia_cm;
          
          Serial.print(F("-> Comando: ANDAR | Distancia: "));
          Serial.print(distancia_cm);
          Serial.println(F(" cm"));
          
        } else if (tipo == CmdType::TURN) {
          const char* direcaoStr = comandoObj["direcao"];
          
          if (direcaoStr && strcmp(direcaoStr, "Direita") == 0) {
            novoComando.right = 1; 
            Serial.println(F("-> Comando: VIRAR | Direcao: Direita"));
          } else {
            novoComando.right = 0;
            Serial.println(F("-> Comando: VIRAR | Direcao: Esquerda"));
          }
          novoComando.left = 0; 
          
        } else if (tipo == CmdType::DEPOSIT_EGG) {
          novoComando.left = 0;
          novoComando.right = 0;

          Serial.println(F("-> Comando: LARGAR"));
        }

        cmdq::push(novoComando);
      }
    }
    
    Serial.print(F("--- FIM do Log. Comandos enfileirados: "));
    Serial.print(cmdq::size());
    Serial.println(F(" ---\n"));

  } else {
    Serial.println(F("AVISO: Payload não é um array JSON de comandos."));
  }
}