#include <Arduino.h>
#include "config.h"
#include "motors.h"
#include "giroscopio.h"
#include "giroscopio-scale_factor.h"
#include "pid.h"
#include "encoder.h"

bool concluido = false;
int DISTANCIA_ALVO_CM = 50;
int DISTANCIA_COMANDO = DISTANCIA_ALVO_CM;
float omega = 0.0f;

void setup() {
  Serial.begin(115200);
  delay(500);

  Serial.println("--- Robô Diferencial: Teste de Navegação: Giroscópio - versão 1.2 ---");

  motors::initialize();
  setupGiroscopio();
  inicializarEncoders();
}

void andarPraFrente() {
  dados estadoGiro = getAnguloAtual();
  float anguloAtual = estadoGiro.angulo;
  unsigned long deltaT = estadoGiro.deltaTempo;

  float ajusteF = pid_control(anguloAtual, 0.0f, deltaT);
  int ajuste = (int)round(ajusteF);

  // O ajuste positivo diminui a roda esquerda e aumenta a direita (vira à direita)
  // O ajuste negativo aumenta a roda esquerda e diminui a direita (vira à esquerda)
  int velE = constrain(VELOCIDADE_BASE - ajuste, 0, 180);
  int velD = constrain(VELOCIDADE_BASE + ajuste, 0, 180);

  motors::andarDoisMotoresFrente(velE, velD);

  // --- Debug Serial ---
  Serial.print("Ang: "); Serial.print(anguloAtual, 2);
  Serial.print(" | Ajuste: "); Serial.print(ajuste);
  Serial.print(" | V_E: "); Serial.print(velE);
  Serial.print(" | V_D: "); Serial.println(velD);
}

dados virar_direita(dados estadoGiro) {
  //dados estadoGiro = getAnguloAtual();

  float ajusteF = pid_control(estadoGiro.angulo, -90.0, estadoGiro.deltaTempo);
  int ajuste = (int)round(ajusteF);

  // O ajuste positivo diminui a roda esquerda e aumenta a direita (vira à direita)
  // O ajuste negativo aumenta a roda esquerda e diminui a direita (vira à esquerda)

  int velE = constrain(VELOCIDADE_BASE + ajuste, 0, 150);
  int velD = constrain(VELOCIDADE_BASE - ajuste, 0, 0);

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
  //dados estadoGiro = virar_esquerda(a);
  dados estadoGiro = virar_direita(a);
  omega = estadoGiro.angulo;
  
  if(abs(omega) >= 80.0f) {
    motors::pararDoisMotores();
    concluido = true;
  }

  // motors::andarDoisMotoresFrente(255, 255);

  // Serial.println("Andando pra frente...");

  //// ANDAR PARA FRENTE COM PID, ENCONDER E GIROSCÓPIO
  // andarPraFrente();
  // DadosEncoders dadosEnc = lerDadosEncoders();
  // enviarDadosEncoders();

  // if ((float)dadosEnc.distanciaEsquerdaCm >= DISTANCIA_COMANDO) {
  //   concluido = true;
  // }
}