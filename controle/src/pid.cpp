#include <Arduino.h>
#include "config.h"
#include "pid.h"

float erroAcumulado = 0.0f;
float erroAnterior = 0.0f;

float pid_control(float anguloAtual, float anguloDesejado, unsigned long dt) {
  float erro_posicao = anguloDesejado - anguloAtual;
  
  float termoP = Kp * erro_posicao;
  erroAcumulado += erro_posicao * (dt / 1000.0f);
  float termoI = Ki * erroAcumulado;

  if (dt == 0) dt = 1; // Prevenir divisão por zero
  float termoD = Kd * (erro_posicao - erroAnterior) / (dt / 1000.0f);
  erroAnterior = erro_posicao;

  // Ajuste Total: Soma dos termos P, I e D
  float ajusteF = termoP + termoI + termoD; 


  return ajusteF;
}