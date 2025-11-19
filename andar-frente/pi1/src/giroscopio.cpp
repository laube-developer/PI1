#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Wire.h>
#include "giroscopio.h"
#include <Arduino.h>

Adafruit_MPU6050 mpu;

void setupGiroscopio() {

  Serial.println("Iniciando Giroscópio MPU-6050");
  Wire.begin(21, 22); //pinos SDA e SCL do ESP32
  if (!mpu.begin()) {
    Serial.println("Falha ao encontrar o MPU-6050. Verifique a conexão.");
    while (1) {
      delay(10);
    }
  }
  Serial.println("MPU-6050 Encontrado");

  mpu.setGyroRange(MPU6050_RANGE_500_DEG);
//faixas operáveis de sensibilidade do MPU6050
//Range 250 *mais sensível | melhor detecção de pequenos movimentos
//Range 500
//Range 1000
//Range 2000 *menos sensível

}

DadosGiroscopio lerGiroscopio() {
  DadosGiroscopio dadosLidos;
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);
  dadosLidos.x = g.gyro.x * SENSORS_RADS_TO_DPS;
  dadosLidos.y = g.gyro.y * SENSORS_RADS_TO_DPS;
  dadosLidos.z = g.gyro.z * SENSORS_RADS_TO_DPS;

  return dadosLidos;
}

void enviarDadosGiroscopio(DadosGiroscopio dados) {
 Serial.print("Giroscópio X: ");
 Serial.print(dados.x);
 Serial.print(" deg/s\t");

 Serial.print("Giroscópio Y: ");
 Serial.print(dados.y);
 Serial.print(" deg/s\t");

 Serial.print("Giroscópio Z: ");
 Serial.print(dados.z);
 Serial.println(" deg/s");
}