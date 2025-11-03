#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Wire.h>
#include "giroscopio.h"

Adafruit_MPU6050 mpu;

void setupGiroscopio() {

  Serial.println("Iniciando Giroscópio MPU-6050");
  Wire.begin(18, 19);
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
  DadosGiroscopio dadosLidos
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);
  dadosLidos.x = g.gyro.x * SENSORS_RADS_TO_DEGS;
  dadosLidos.y = g.gyro.y * SENSORS_RADS_TO_DEGS;
  dadosLidos.z = g.gyro.z * SENSORS_RADS_TO_DEGS;

   return dadosLidos;
}