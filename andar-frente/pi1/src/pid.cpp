#include <Arduino.h>
#include "config.h"
#include "pid.h"

float erroAcumulado = 0.0f;
float erroAnterior = 0.0f;
float pp = 0.5f;

float pid_control(float anguloAtual, float anguloDesejado, unsigned long dt) {
  float erro_posicao = abs(anguloDesejado - anguloAtual);
  
  float termoP = pp * erro_posicao;


  float termoI = Ki * erroAcumulado;

  //float termoD = Kd * (erro_posicao - erroAnterior) / (dt / 1000.0f);
  float termoD = 0.0;
  erroAnterior = erro_posicao;

  // Ajuste Total: Soma dos termos P, I e D
  float ajusteF = termoP + termoI + termoD; 

  Serial.print(" | Erro: "); Serial.print(erro_posicao, 2);
  Serial.print(" | P: "); Serial.print(termoP, 2);
  Serial.print(" | I: "); Serial.print(termoI, 2);
  Serial.print(" | D: "); Serial.print(termoD, 2);
  Serial.print(" | AjusteF: "); Serial.print(ajusteF, 2);
  Serial.println();

  return ajusteF;
}