// src/encoder.cpp

#include "encoder.h"

Enconders encEsq;
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

void calcularOdometria(float delta_theta) {
  float new_theta = delta_theta/2;
  float delta_x = dados.distanciaTotalCm * cos (dados.pos.theta + new_theta);
  float delta_y = dados.distanciaTotalCm * sin (dados.pos.theta + new_theta);

  dados.pos.x += delta_x; dados.pos.y += delta_y;
  dados.pos.theta += delta_theta;
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

  float delta_theta = (dados.distanciaDireitaCm - dados.distanciaEsquerdaCm)/DISTANCIA_ENTRE_RODAS_CM;

  calcularOdometria(delta_theta);

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