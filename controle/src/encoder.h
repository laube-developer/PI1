// include/encoder.h

#pragma once

#include <Arduino.h>

const float PULSOS_POR_REVOLUCAO = 20.0f;
const float RAIO_RODA_CM = 3.4f;
const float DISTANCIA_ENTRE_RODAS_CM = 16.0f;
const float CM_POR_PULSO = (2.0f * 3.1415f * RAIO_RODA_CM) / PULSOS_POR_REVOLUCAO;

const int pinoD0Esq = 18;
const int pinoD0Dir = 19;

struct Enconders
{
    volatile long pulsos = 0;
    volatile int ultimoEstado = LOW;
    volatile unsigned long ultimoTempo = 0;
};

struct RobotPos
{
    float x = 0.0f;
    float y = 0.0f;
    float theta = 0.0f;
};

struct DadosEncoders
{
    float distanciaEsquerdaCm = 0.0f;
    float distanciaDireitaCm = 0.0f;
    float distanciaTotalCm = 0.0f;
    struct RobotPos pos;
};

void calcularOdometria(float delta_theta);

void reiniciarEncoders();

void inicializarEncoders();

DadosEncoders lerDadosEncoders();

void enviarDadosEncoders();
void resetEncoder();