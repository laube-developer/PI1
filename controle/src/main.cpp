#include <Arduino.h>
#include "config.h"
#include "motors.h"
#include "encoder.h"
#include "giroscopio.h"
#include "wifi_mqtt.h"
#include "command_queue.h"
#include "executor.h"

void setup() {
  Serial.begin(115200);
  delay(500);

  inicializarMqttWifi();
  executor::setup();
  Serial.print("\n\n\n======Iniciando teste de excução dos comandos enviados 3\n\n\n");
}

void loop() {
  mqtt_tick();
  delay(100);
  executor::tick();
}