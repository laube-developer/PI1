#include <Arduino.h>
#include "config.h"
#include "motors.h"
#include "encoder.h"
#include "giroscopio.h"
#include "wifi_mqtt.h"
#include "command_queue.h"
#include "executor.h"
#include "egg.h"

void setup() {
  Serial.begin(115200);
  delay(500);

  inicializarMqttWifi();
  executor::setup();
  setupEggMotor();
  motors::initialize();
  setupGiroscopio();
  inicializarEncoders();
  Serial.print("\n\n\n======Teste motor andar reto\n\n\n");
}

void loop() {
  mqtt_tick();
  delay(100);
  executor::tick();

  DadosEncoders encoders = lerDadosEncoders();
  dados giro = getAnguloAtual();

}