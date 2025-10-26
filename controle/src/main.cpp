#include <Arduino.h>
#include "config.h"
#include "motors.h"
#include "command_queue.h"
#include "executor.h"
#include "demo_feed.h"

void setup() {
  Serial.begin(115200);
  delay(200);
  Serial.println();
  Serial.println("=== Carro do Ovo — Simulacao: Velocidades por Roda (fila interna) ===");
  motors::setup();
  cmdq::clear();
  executor::setup();
  demo::setup();
}

void loop() {
  demo::tick();

  executor::tick();

  delay(2);
}
