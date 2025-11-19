#include <Arduino.h>
#include "config.h"
#include "motors.h"
#include "encoder.h"
#include "giroscopio.h"

// Configurações e constantes
const int CALIB_SAMPLES = 200;
const int CALIB_DELAY_MS = 5;
const float KP_ENCODER = 12.0; // ganho P para correção diferencial (ajuste conforme necessário)
const float K_GYRO = 1.2;      // ganho sobre a taxa do giroscópio (deg/s) -> PWM
const float K_ANGLE = 0.8;     // ganho sobre o ângulo integrado (deg) -> PWM

int meta = 20; // a meta é andar 20cm
int velocidadeEsq = 154; int velocidadeDir = 154;

// Variáveis para calibração e controle
float gyroZOffset = 0.0;
long startDistEsq = 0;
long startDistDir = 0;
float gyroAngle = 0.0; // ângulo integrado (deg)
unsigned long prevMillisLoop = 0;

void setup() {
  Serial.begin(115200);
  delay(500);
  
  motors::initialize();
  inicializarEncoders();
  setupGiroscopio();

  // Calibração do giroscópio: média de várias amostras com o robô parado
  Serial.println("Iniciando calibração do giroscópio (Z)... por favor não mova o robo");
  float soma = 0.0;
  for (int i = 0; i < CALIB_SAMPLES; ++i) {
    DadosGiroscopio g = lerGiroscopio();
    soma += g.z;
    delay(CALIB_DELAY_MS);
  }
  gyroZOffset = soma / (float)CALIB_SAMPLES;
  Serial.print("Offset Z calculado: ");
  Serial.print(gyroZOffset);
  Serial.println(" deg/s");

  // Captura distâncias iniciais dos encoders (deve estar parado durante calibração)
  DadosEncoder dstart = lerDadosEncoders();
  startDistEsq = dstart.distanciaTotalEsquerdo;
  startDistDir = dstart.distanciaTotalDireito;
  Serial.print("Start Dist Esq: "); Serial.print(startDistEsq);
  Serial.print(" cm | Start Dist Dir: "); Serial.println(startDistDir);
}

void loop() {
  // Leitura de sensores
  unsigned long now = millis();
  float dt = 0.0;
  if (prevMillisLoop == 0) prevMillisLoop = now;
  dt = (now - prevMillisLoop) / 1000.0; // segundos
  prevMillisLoop = now;

  DadosGiroscopio dadosG = lerGiroscopio();
  float leituraZ = dadosG.z - gyroZOffset; // giroscopio corrigido (deg/s)
  // Integra para obter ângulo aproximado (deg)
  gyroAngle += leituraZ * dt;

  DadosEncoder dados = lerDadosEncoders();
  // Distância percorrida desde o início (cm)
  float percorridoEsq = (float)(dados.distanciaTotalEsquerdo - startDistEsq);
  float percorridoDir = (float)(dados.distanciaTotalDireito - startDistDir);
  float percorridoMedio = (percorridoEsq + percorridoDir) / 2.0;

  // Checa meta
  if (percorridoMedio >= (float)meta) {
    motors::pararDoisMotores();
    Serial.println("Meta alcançada. Motores parados.");
    // permanece aqui
    while (true) {
      delay(1000);
    }
  }

  // Controle combinado: encoders (posição) + giroscópio (taxa e ângulo)
  float erro = percorridoEsq - percorridoDir; // positivo -> esquerda adiantada (cm)
  float ajuste_enc = KP_ENCODER * erro; // ajuste a partir dos encoders (PWM)
  if (fabs(erro) < 0.02) { // histerese pequena para evitar oscilações
    ajuste_enc = 0.0;
  }

  // Correção a partir do giroscópio: taxa (deg/s) e ângulo integrado (deg)
  float ajuste_gyro_rate = K_GYRO * leituraZ;   // se está girando, compensa proporcionalmente
  float ajuste_gyro_angle = K_ANGLE * gyroAngle; // corrige deriva acumulada

  // Soma das contribuições (pode ser positiva ou negativa)
  float ajusteF = ajuste_enc + ajuste_gyro_rate + ajuste_gyro_angle;
  int ajuste = (int)round(ajusteF);
  int velE = constrain(velocidadeEsq - ajuste, 0, 255);
  int velD = constrain(velocidadeDir + ajuste, 0, 255);

  // Comando aos motores
  motors::andarDoisMotoresFrente(velE, velD);

  // Debug (imprime algumas info a cada loop)
  static unsigned long lastDebug = 0;
  if (millis() - lastDebug > 300) {
    Serial.print("Percorrido (E,D): "); Serial.print(percorridoEsq); Serial.print(" cm, "); Serial.print(percorridoDir); Serial.print(" cm | ");
    Serial.print("Erro: "); Serial.print(erro); Serial.print(" cm | Vel (E,D): "); Serial.print(velE); Serial.print(","); Serial.print(velD);
    Serial.print(" | GyroZ corrigido: "); Serial.print(leituraZ); Serial.print(" deg/s");
    Serial.print(" | GyroAngle: "); Serial.print(gyroAngle); Serial.print(" deg");
    Serial.print(" | Ajustes (enc,rate,angle): "); Serial.print(ajuste_enc); Serial.print(","); Serial.print(ajuste_gyro_rate); Serial.print(","); Serial.println(ajuste_gyro_angle);
    lastDebug = millis();
  }

  delay(100);
}