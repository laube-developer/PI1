#include <Arduino.h>
#include "config.h"
#include "motors.h"
#include "giroscopio.h"

// --- Ganhos de Controle ---
const float Kp = 8.0f;     // Ganho Proporcional (Ajuste Rápido)
const float Ki = 0.05f;     // Ganho Integral (Elimina Erro Estático)
const int VELOCIDADE_BASE = 100;

// --- Variáveis de Estado ---
float gyroZOffset = 0.0f;
float anguloAtual = 0.0f;      // Posição angular integrada (em graus)
float erroAcumulado = 0.0f;    // Termo Integral acumulado (para o Termo I)
unsigned long prevMillisLoop = 0;

unsigned long startTime = 0;

void setup() {
  Serial.begin(115200);
  delay(500);

  Serial.println("Iniciando controle PI no Ângulo (por giroscopio) - versao 3.0");

  motors::initialize();
  setupGiroscopio();

  // Calibração do giroscópio (offset em Z).
  Serial.println("Calibrando giroscopio (Z) - por favor mantenha o robo parado...");
  float soma = 0.0f;
  const int n = 200;
  for (int i = 0; i < n; ++i) {
    DadosGiroscopio dados = lerGiroscopio();
    soma += dados.z;
    delay(5);
  }
  gyroZOffset = soma / (float)n;
  Serial.print("Offset Z: "); Serial.println(gyroZOffset);

  startTime = millis();
}

void pra_frente() {
  unsigned long now = millis();
  if (prevMillisLoop == 0) prevMillisLoop = now;
  float dt = (now - prevMillisLoop) / 1000.0f; 
  prevMillisLoop = now;

  DadosGiroscopio dados = lerGiroscopio();
  float erro_taxa = dados.z - gyroZOffset;

  const float DEAD_BAND = 0.5f;
  if (abs(erro_taxa) > DEAD_BAND) {
      anguloAtual += erro_taxa * dt;
  }

  // Setpoint de 0.0f (ir para frente reto)
  float erro_posicao = 0.0f - anguloAtual; 

  // --- CÁLCULO DO CONTROLE PI ---

  float termoP = Kp * erro_posicao; 

  if (abs(erro_posicao) > 0.1f) { // Acumula I apenas se o erro de posição for significativo
    erroAcumulado += erro_posicao * dt;
  }

  // Limita o acúmulo integral para que o termo I não fique muito grande
  const float LIMITE_INTEGRAL = 5.0f; 
  erroAcumulado = constrain(erroAcumulado, -LIMITE_INTEGRAL, LIMITE_INTEGRAL);

  float termoI = Ki * erroAcumulado;

  // Ajuste Total: Soma dos termos P e I
  // O sinal do ajuste: negativo corrige p/ direita; positivo corrige p/ esquerda.
  float ajusteF = termoP + termoI; 
  
  // Limita o ajuste total para não saturar demais o motor
  const float LIMITE_AJUSTE = 100.0f;
  ajusteF = constrain(ajusteF, -LIMITE_AJUSTE, LIMITE_AJUSTE);

  int ajuste = (int)round(ajusteF);

  // --- APLICAÇÃO NAS RODAS ---
  
  const int MAX_VEL = 255;
  const int MIN_VEL = 0;

  int velE = constrain(VELOCIDADE_BASE - ajuste, MIN_VEL, MAX_VEL);
  int velD = constrain(VELOCIDADE_BASE + ajuste, MIN_VEL, MAX_VEL);

  motors::andarDoisMotoresFrente(velE, velD);

  // --- Debug Serial ---
  Serial.print("Ang: "); Serial.print(anguloAtual, 2);
  Serial.print(" | e_Pos: "); Serial.print(erro_posicao, 2);
  Serial.print(" | P: "); Serial.print(termoP, 1);
  Serial.print(" | I: "); Serial.print(termoI, 1);
  Serial.print(" | Ajuste: "); Serial.print(ajuste);
  Serial.print(" | V_E: "); Serial.print(velE);
  Serial.print(" | V_D: "); Serial.println(velD);
  
  delay(50); // control loop ~20Hz
}

void pra_direita() {
  motors::andarDoisMotoresFrente(100, 200);
  delay(500);
}

void loop() {
  unsigned long currentTime = millis();
  if (currentTime - startTime < 5000) {
    pra_frente();
  } else {
    motors::pararDoisMotores();
  }
}