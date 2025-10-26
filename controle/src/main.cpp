#include <Arduino.h>
#include "config.h"
#include "motors.h"
#include "commands.h"
#include "command_queue.h"
#include "serial_cmd.h"
#include "executor.h"
#include "net_mqtt.h"

void setup() {
  Serial.begin(115200);
  delay(200);
  Serial.println();
  Serial.println("=== Carro do Ovo — MQTT + State Machine ===");
  Serial.println("Digite HELP na Serial para exemplos. MQTT assina: " MQTT_SUB_TOPIC);

  motors::setup();
  cmdq::clear();
  executor::setup();
  netmqtt::setup();
}

void loop() {
  serial_poll_and_enqueue();
  netmqtt::tick();

  executor::tick();

  delay(2);
}
