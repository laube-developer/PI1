#include <Arduino.h>
#include "config.h"
#include "pid.h"

float erroAcumulado = 0.0f;
float erroAnterior = 0.0f;

float pid_control(float anguloAtual, float anguloDesejado, unsigned long dt) {
  float erro_posicao = abs(anguloDesejado - anguloAtual);
  
  float termoP = Kp * erro_posicao;
  erroAcumulado += erro_posicao * (dt / 1000.0f);
  float termoI = Ki * erroAcumulado;

  if (dt == 0) dt = 1; // Prevenir divisão por zero
  float termoD = Kd * (erro_posicao - erroAnterior) / (dt / 1000.0f);
  erroAnterior = erro_posicao;

  // Ajuste Total: Soma dos termos P, I e D
  float ajusteF = termoP + termoI + termoD; 

  Serial.print("Erro: "); Serial.print(erro_posicao, 2);
  Serial.print(" | P: "); Serial.println(termoP, 2);

  Serial.print("erroAcumulado: "); Serial.print(erroAcumulado, 2);
  Serial.print(" | I: "); Serial.println(termoI, 2);

  Serial.print("Delta Erro: "); Serial.print(erro_posicao - erroAnterior, 2);
  Serial.print(" | D: "); Serial.println(termoD, 2);

  Serial.print("AjusteF: "); Serial.println(ajusteF, 2);

  return ajusteF;
}