#pragma once
#include <Arduino.h>

void inicializarMqttWifi();
void mqtt_tick();
void enviarDadosMQTT(long pulsosE, long pulsosD);

void ouvirComandosRecebidos(char *topic, byte *payload, unsigned int length);
void parseListaDeComandos(byte *payload, unsigned int length);