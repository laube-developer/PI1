#pragma once
#include <Arduino.h> 

void inicializarWifi();
void mqtt_tick();
void enviarDadosMQTT(long pulsosE, long pulsosD);

// ⭐️ CORREÇÃO: Força a ligação C (necessária para a maioria dos callbacks MQTT)
extern "C" {
    void callback(char* topic, byte* payload, unsigned int length);
}