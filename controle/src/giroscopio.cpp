#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Wire.h>
#include "giroscopio.h"
#include <Arduino.h>
#include "config.h"
#include "giroscopio-bias_deadband.h"

Adafruit_MPU6050 mpu;

float anguloAtual = 0.0f;
double omega_filtrado = 0.0f; // Variável para o valor filtrado do giroscópio
unsigned long prevMillisLoop = 0;

float bias_z = 0.0f;
float deadband = 0.0f;

void zerarGiroscopio(){
  anguloAtual = 0.0f;
}

void setupGiroscopio() {

  Serial.println("Iniciando Giroscópio MPU-6050");
  Wire.begin(SDA_PIN, SCL_PIN); //pinos SDA e SCL do ESP32
  if (!mpu.begin()) {
    Serial.println("Falha ao encontrar o MPU-6050. Verifique a conexão.");
    while (1) {
      delay(10);
    }
  }
  Serial.println("MPU-6050 Encontrado");

  mpu.setGyroRange(MPU6050_RANGE_500_DEG);

  // Calibrar Giroscópio para obter bias_z e deadband
  calibracaoGiroscopio();
  omega_filtrado = lerGiroscopio() - bias_z;
}

void calibracaoGiroscopio() {
    GyroCalib calib = calibrarGiro();
    bias_z = calib.bias;
    deadband = calib.deadband;
}

float lerGiroscopio() {
  float dadoBrutoZ;
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);
  dadoBrutoZ = g.gyro.z * SENSORS_RADS_TO_DPS;

  return dadoBrutoZ;
}

dados getAnguloAtual() {
    unsigned long now = millis();
    if (prevMillisLoop == 0) prevMillisLoop = now;
    float dt = (now - prevMillisLoop) / 1000.0f; 
    prevMillisLoop = now;

    // Elimina parte do ruído do giroscópio com bias, deadband e K_RATE
    float omega_bruto = lerGiroscopio();
    double omega_corrigido = (omega_bruto - bias_z) * K_RATE;
    //omega_filtrado = (ALPHA_OMEGA * omega_corrigido) + (1.0f - ALPHA_OMEGA) * omega_filtrado;
    omega_filtrado = omega_corrigido; // Sem filtro para resposta mais rápida
    
    double omega_usado = omega_filtrado;
    if (abs(omega_filtrado) < deadband) {
        omega_usado = 0.0f; // Elimina ruído dentro da zona morta
    }

    // Suaviza o drift
    float anguloPrev = anguloAtual + omega_usado * dt;
    //anguloAtual = ALPHA_THETA * anguloPrev + (1.0f - ALPHA_THETA) * anguloAtual;
    anguloAtual = anguloPrev; // Sem filtro para resposta mais rápida
    return {anguloAtual, dt};
}

void enviarDadosGiroscopio(float dados) {
 Serial.print("Giroscópio Z: ");
 Serial.print(dados);
 Serial.println(" deg/s");

 Serial.print("Angulo Atual: ");
 Serial.print(anguloAtual);
 Serial.println(" deg");
}