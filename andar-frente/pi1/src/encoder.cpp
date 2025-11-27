// src/encoder.cpp

#include "encoder.h"

Enconders encEsq;;
Enconders encDir;
DadosEncoders dados;

IRAM_ATTR void isrEsq() {
  int estado = digitalRead(pinoD0Esq);
  if (estado == HIGH && encEsq.ultimoEstado == LOW) {
    encEsq.pulsos++;
  }
  encEsq.ultimoEstado = estado;
}

IRAM_ATTR void isrDir() {
  int estado = digitalRead(pinoD0Dir);
  if (estado == HIGH && encDir.ultimoEstado == LOW) {
    encDir.pulsos++;
  }
  encDir.ultimoEstado = estado;
}

void reiniciarEncoders() {
  noInterrupts();
    encEsq.pulsos = 0;
    encEsq.ultimoEstado = LOW;
    encDir.pulsos = 0;
    encDir.ultimoEstado = LOW;
  interrupts();
}

void inicializarEncoders() {
  pinMode(pinoD0Esq, INPUT_PULLDOWN);
  pinMode(pinoD0Dir, INPUT_PULLDOWN);
  attachInterrupt(digitalPinToInterrupt(pinoD0Esq), isrEsq, RISING);
  attachInterrupt(digitalPinToInterrupt(pinoD0Dir), isrDir, RISING);
  reiniciarEncoders();
}

DadosEncoders lerDadosEncoders() {
  noInterrupts();
    int pulsosE = encEsq.pulsos; encEsq.pulsos = 0;
    int pulsosD = encDir.pulsos; encDir.pulsos = 0;
  interrupts();

  // Converte para distância (cm)
  dados.distanciaEsquerdaCm += (float)pulsosE * CM_POR_PULSO;
  dados.distanciaDireitaCm += (float)pulsosD * CM_POR_PULSO;
  dados.distanciaTotalCm  = (dados.distanciaEsquerdaCm + dados.distanciaDireitaCm) / 2.0f;

  return dados;
}

void enviarDadosEncoders() {
  Serial.print("Distância Total: ");
  Serial.print(dados.distanciaTotalCm);
  Serial.println(" cm");
  
  Serial.print("Distância Esquerda: ");
  Serial.print(dados.distanciaEsquerdaCm);
  Serial.println(" cm");

  Serial.print("Distância Direita: ");
  Serial.print(dados.distanciaDireitaCm);
  Serial.println(" cm");
}