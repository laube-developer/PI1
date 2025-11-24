#include <Arduino.h>
#include "config.h"
#include "motors.h"
#include "giroscopio.h"
#include "giroscopio-scale_factor.h"
#include "pid.h"

unsigned long startTime = 0;
float omega = 0.0;
bool concluido = false;

void setup() {
  Serial.begin(115200);
  delay(500);

  Serial.println("--- Robô Diferencial: Teste de Navegação - versão 2.8---");

  motors::initialize();
  setupGiroscopio();
  //k_rate_calibrado(90.0f);
  startTime = millis();
}

// float moverRobo(float anguloDesejado) {
//   dados estadoGiro = getAnguloAtual();
//   float anguloAtual = estadoGiro.angulo;
//   unsigned long deltaT = estadoGiro.deltaTempo;

//   float ajusteF = pid_control(anguloAtual, anguloDesejado, deltaT);
//   int ajuste = (int)round(ajusteF);

//   // O ajuste positivo diminui a roda esquerda e aumenta a direita (vira à direita)
//   // O ajuste negativo aumenta a roda esquerda e diminui a direita (vira à esquerda)
//   int velE = constrain(VELOCIDADE_BASE - ajuste, 0, 100);
//   int velD = constrain(VELOCIDADE_BASE + ajuste, 0, 100);

//   motors::andarDoisMotoresFrente(velE, velD);

//   // --- Debug Serial ---
//   Serial.print("Ang: "); Serial.print(anguloAtual, 2);
//   Serial.print(" | Ajuste: "); Serial.print(ajuste);
//   Serial.print(" | V_E: "); Serial.print(velE);
//   Serial.print(" | V_D: "); Serial.println(velD);

//   return anguloAtual;
// }

dados virar_esquerda(dados estadoGiro) {
  //dados estadoGiro = getAnguloAtual();

  float ajusteF = pid_control(estadoGiro.angulo, -90.0, estadoGiro.deltaTempo);
  int ajuste = (int)round(ajusteF);

  // O ajuste positivo diminui a roda esquerda e aumenta a direita (vira à direita)
  // O ajuste negativo aumenta a roda esquerda e diminui a direita (vira à esquerda)

  int velE = constrain(VELOCIDADE_BASE - ajuste, 0, 0);
  int velD = constrain(VELOCIDADE_BASE + ajuste, 0, 150);

  if (estadoGiro.angulo > 90.0) {
    motors::andarDoisMotoresTras(velE, velD);
  }
  else {
    motors::andarDoisMotoresFrente(velE, velD);
  }

  // --- Debug Serial ---
  Serial.print("Ang: "); Serial.print(estadoGiro.angulo, 2);
  Serial.print(" | Ajuste: "); Serial.print(ajuste);
  Serial.print(" | V_E: "); Serial.print(velE);
  Serial.print(" | V_D: "); Serial.println(velD);

  return estadoGiro;
}

void loop() {
  if (concluido) {
    motors::pararDoisMotores();
    return;
  }

  dados a = getAnguloAtual();
  dados estadoGiro = virar_esquerda(a);
  omega = estadoGiro.angulo;
  
  if (abs(omega - 87.44) < 7.0) concluido = true;
}